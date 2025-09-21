// 游戏状态
let gameBoard = [];
let revealedCells = 0;
let flaggedCells = 0;
let totalMines = 15;
let rows = 10;
let cols = 10;
let gameStarted = false;
let gameOver = false;
let timerInterval = null;
let seconds = 0;
let previousMinePositions = null; // 保存上一局的地雷位置
let previousGameBoard = null; // 保存上一局的游戏状态
let previousGameSettings = null; // 保存上一局的游戏设置（行数、列数、地雷数）
let isMobile = false; // 移动设备检测标志
let longPressTimer = null;
const LONG_PRESS_DURATION = 500; // 长按触发时间（毫秒）
const STORAGE_KEY = 'minesweeper_game_state'; // localStorage存储键名

// DOM 元素 - 将在DOMContentLoaded事件中初始化
let gameBoardElement;
let mineCounterElement;
let timeCounterElement;
let resetButton;
let customGameButton;
let rowsInput;
let colsInput;
let minesInput;
let helpButton;
let helpModal;
let closeHelpButton;
let restartSameGameButton;
let startNewGameButton;
let boardSettingsButton;
let boardSettingsScreen;
let applySettingsButton;
let cancelSettingsButton;
let feedbackMessage;

// 检测是否为移动设备
function detectMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // 简单的移动设备检测逻辑
    isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    console.log(`设备检测结果: ${isMobile ? '移动设备' : '桌面设备'}`);
}

// 初始化游戏
function initGame() {
    console.log('初始化游戏');

    // 清除任何可能存在的保存状态
    clearSavedGameState();
    
    // 检测设备类型
    detectMobile();

    // 重置游戏状态
    gameBoard = [];
    revealedCells = 0;
    flaggedCells = 0;
    gameStarted = false;
    gameOver = false;
    seconds = 0;

    // 更新计数器显示
    updateCounters();

    // 清除计时器
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // 重置表情按钮
    resetButton.textContent = '😊';

    // 创建游戏板
    createGameBoard();
    console.log(`游戏板创建完成: ${rows}行 x ${cols}列, ${totalMines}个地雷`);
}

// 创建游戏板
function createGameBoard() {
    // 清空游戏板元素
    gameBoardElement.innerHTML = '';
    
    // 设置游戏板的网格布局
    gameBoardElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    // 初始化游戏板数组
    for (let row = 0; row < rows; row++) {
        gameBoard[row] = [];
        for (let col = 0; col < cols; col++) {
            gameBoard[row][col] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            };
            
            // 创建单元格元素
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // 添加点击事件
            cell.addEventListener('click', () => handleCellClick(row, col));
            
            // 右键点击标记（桌面端）
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleCellRightClick(row, col);
            });
            
            // 移动设备长按标记
            if (isMobile) {
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    longPressTimer = setTimeout(() => {
                        handleCellRightClick(row, col);
                    }, LONG_PRESS_DURATION);
                });
                
                cell.addEventListener('touchend', () => {
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                });
                
                cell.addEventListener('touchmove', () => {
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                });
            }
            
            gameBoardElement.appendChild(cell);
        }
    }
}

// 生成地雷 - 使用更简单可靠的随机算法
function generateMines(firstRow, firstCol) {
    let minesPlaced = 0;
    
    // 创建一个集合来存储已放置地雷的位置，避免重复
    const minePositions = new Set();
    
    while (minesPlaced < totalMines) {
        // 使用Math.random()生成随机位置，确保第一次点击的格子及其周围8个格子不会有地雷
        let randRow, randCol;
        do {
            randRow = Math.floor(Math.random() * rows);
            randCol = Math.floor(Math.random() * cols);
        } while (
            (randRow === firstRow && randCol === firstCol) ||
            (Math.abs(randRow - firstRow) <= 1 && Math.abs(randCol - firstCol) <= 1) ||
            minePositions.has(`${randRow},${randCol}`)
        );
        
        // 标记地雷
        gameBoard[randRow][randCol].isMine = true;
        minePositions.add(`${randRow},${randCol}`);
        minesPlaced++;
    }
    
    // 计算每个格子周围的地雷数
    calculateAdjacentMines();
}

// 计算每个格子周围的地雷数
function calculateAdjacentMines() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!gameBoard[row][col].isMine) {
                let count = 0;
                
                // 检查周围8个格子
                for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
                    for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
                        if (gameBoard[r][c].isMine) {
                            count++;
                        }
                    }
                }
                
                gameBoard[row][col].adjacentMines = count;
            }
        }
    }
}

// 处理单元格左键点击
function handleCellClick(row, col) {
    console.log(`点击单元格: (${row}, ${col})`);
    
    // 如果游戏已结束或单元格已被揭示或已被标记，则不处理
    if (gameOver || gameBoard[row][col].isRevealed || gameBoard[row][col].isFlagged) {
        console.log('忽略点击: 游戏结束或单元格已被揭示/标记');
        return;
    }
    
    // 如果是第一次点击，生成地雷并开始计时
    if (!gameStarted) {
        console.log('第一次点击，生成地雷并开始计时');
        // 注意：这里不再设置gameStarted=true，而是让startTimer函数来设置
        generateMines(row, col);
        startTimer();
    }
    
    // 如果点击到地雷，游戏结束
    if (gameBoard[row][col].isMine) {
        console.log('点击到地雷！游戏结束');
        revealMine(row, col, true);
        gameOver = true;
        clearInterval(timerInterval);
        resetButton.textContent = '😵';
        revealAllMines();
        
        // 触发地雷轮流爆炸动画
        animateMinesExplosion();
        return;
    }
    
    // 揭示单元格
    console.log('揭示单元格');
    revealCell(row, col);
    
    // 检查游戏是否胜利
    checkWinCondition();
}

// 处理单元格右键点击（标记地雷）
function handleCellRightClick(row, col) {
    // 如果游戏已结束或单元格已被揭示，则不处理
    if (gameOver || gameBoard[row][col].isRevealed) {
        return;
    }
    
    // 如果是第一次点击，开始计时
    if (!gameStarted) {
        gameStarted = true;
        generateMines(row, col);
        startTimer();
        // 第一次右键点击也视为游戏开始，但不移除标记
        gameBoard[row][col].isFlagged = true;
        flaggedCells++;
        updateCellDisplay(row, col);
        updateCounters();
        return;
    }
    
    // 切换标记状态
    gameBoard[row][col].isFlagged = !gameBoard[row][col].isFlagged;
    flaggedCells += gameBoard[row][col].isFlagged ? 1 : -1;
    
    // 更新单元格显示
    updateCellDisplay(row, col);
    
    // 更新计数器
    updateCounters();
    
    // 检查游戏是否胜利
    checkWinCondition();
}

// 在revealCell函数末尾添加保存游戏状态
function revealCell(row, col) {
    // 如果单元格已被揭示或已被标记，则不处理
    if (gameBoard[row][col].isRevealed || gameBoard[row][col].isFlagged) {
        return;
    }
    
    // 揭示单元格
    gameBoard[row][col].isRevealed = true;
    revealedCells++;
    
    // 更新单元格显示
    updateCellDisplay(row, col);
    
    // 如果是空白格子（周围没有地雷），递归揭示周围的格子
    if (gameBoard[row][col].adjacentMines === 0) {
        for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
                if (!(r === row && c === col)) {
                    revealCell(r, c);
                }
            }
        }
    }
}

// 揭示地雷
function revealMine(row, col, isHit = false) {
    const cell = getCellElement(row, col);
    cell.classList.add('mine');
    
    if (isHit) {
        cell.classList.add('hit');
        cell.textContent = '💣';
    } else if (gameBoard[row][col].isFlagged) {
        cell.textContent = '🚩';
    } else {
        cell.textContent = '💣';
    }
}

// 地雷轮流爆炸动画
function animateMinesExplosion() {
    const minePositions = [];
    
    // 收集所有地雷位置
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (gameBoard[row][col].isMine) {
                minePositions.push({row, col});
            }
        }
    }
    
    // 逐个触发爆炸动画
    minePositions.forEach((pos, index) => {
        setTimeout(() => {
            const cell = getCellElement(pos.row, pos.col);
            cell.classList.add('exploding');
            setTimeout(() => {
                cell.classList.remove('exploding');
            }, 300);
        }, index * 100);
    });
    
    // 动画结束后显示游戏结束界面
    setTimeout(() => {
        showGameOverScreen(false);
    }, minePositions.length * 100 + 500);
}

// 揭示所有地雷
function revealAllMines() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (gameBoard[row][col].isMine) {
                revealMine(row, col, false);
            } else if (gameBoard[row][col].isFlagged) {
                // 如果标记了非地雷的格子，显示错误
                const cell = getCellElement(row, col);
                cell.textContent = '❌';
                cell.classList.add('revealed');
            }
        }
    }
}

// 扫描动画 - 横线扫描显示地雷
function animateMineScan() {
    let currentRow = 0;
    
    const scanInterval = setInterval(() => {
        // 揭示当前行的所有地雷
        for (let col = 0; col < cols; col++) {
            if (gameBoard[currentRow][col].isMine && !gameBoard[currentRow][col].isRevealed) {
                revealMine(currentRow, col);
            }
        }
        
        currentRow++;
        
        // 如果扫描完成，显示游戏胜利界面
        if (currentRow >= rows) {
            clearInterval(scanInterval);
            setTimeout(() => {
                showGameOverScreen(true);
            }, 500);
        }
    }, 200); // 每行扫描间隔200毫秒
}

// 显示游戏结束界面
function showGameOverScreen(isWin) {
    // 在显示游戏结束界面前，保存当前的完整游戏状态
    console.log('游戏结束，保存当前状态');
    previousGameBoard = JSON.parse(JSON.stringify(gameBoard));
    previousGameSettings = {
        rows: rows,
        cols: cols,
        totalMines: totalMines
    };
    
    // 创建游戏结束界面元素
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'gameOverScreen';
    gameOverScreen.classList.add('game-over-screen');
    
    // 设置界面内容
    const message = isWin ? `您赢了，用时${seconds}秒！` : `游戏结束，您输了，用时${seconds}秒！`;
    const emoji = isWin ? '🎉' : '😵';
    
    gameOverScreen.innerHTML = `
        <div class="game-over-content">
            <div class="emoji">${emoji}</div>
            <h2>${message}</h2>
            <div class="game-over-buttons">
                <button id="restartSameGameButton">重新开始这局游戏</button>
                <button id="restartButton">开始新游戏</button>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(gameOverScreen);
    
    // 为重新开始这局游戏按钮添加事件监听器
    // 修复按钮无响应的问题：直接在创建元素后立即绑定事件监听器
    const restartSameGameBtn = gameOverScreen.querySelector('#restartSameGameButton');
    if (restartSameGameBtn) {
        restartSameGameBtn.addEventListener('click', () => {
            console.log('restartSameGameButton被点击了！');
            // 移除游戏结束界面
            document.body.removeChild(gameOverScreen);
            // 重新开始这局游戏
            restartSameGame();
        });
    } else {
        console.error('未找到restartSameGameButton元素！');
    }
    
    // 为重新开始按钮添加事件监听器
    const restartBtn = gameOverScreen.querySelector('#restartButton');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            // 移除游戏结束界面
            document.body.removeChild(gameOverScreen);
            // 重新初始化游戏
            initGame();
            showFeedback('开始新游戏成功');
        });
    }
}

// 更新单元格显示
function updateCellDisplay(row, col) {
    const cell = getCellElement(row, col);
    
    // 如果单元格已被揭示
    if (gameBoard[row][col].isRevealed) {
        cell.classList.add('revealed');
        
        // 显示周围地雷数
        if (gameBoard[row][col].adjacentMines > 0) {
            cell.textContent = gameBoard[row][col].adjacentMines;
            cell.classList.add(`number-${gameBoard[row][col].adjacentMines}`);
        }
    } 
    // 如果单元格已被标记
    else if (gameBoard[row][col].isFlagged) {
        cell.classList.add('flagged');
        cell.textContent = '🚩';
    } 
    // 否则重置显示
    else {
        cell.textContent = '';
        cell.classList.remove('flagged', 'revealed');
        for (let i = 1; i <= 8; i++) {
            cell.classList.remove(`number-${i}`);
        }
    }
}

// 获取单元格元素
function getCellElement(row, col) {
    return gameBoardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

// 开始计时器 - 简化逻辑，确保计时器始终能启动
function startTimer() {
    // 无论何种情况，只要游戏未结束，就启动计时器
    if (!gameOver) {
        console.log('启动计时器');
        gameStarted = true;
        
        // 清除之前可能存在的计时器
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // 启动计时器
        timerInterval = setInterval(() => {
            seconds++;
            updateCounters();
        }, 1000);
        
        // 保存游戏状态和设置，但在重新开始游戏时不保存（避免覆盖恢复的状态）
        if (!(typeof isRestarting !== 'undefined' && isRestarting)) {
            console.log('保存当前游戏状态和设置');
            previousGameBoard = JSON.parse(JSON.stringify(gameBoard));
            previousGameSettings = {
                rows: rows,
                cols: cols,
                totalMines: totalMines
            };
        } else {
            console.log('正在重新开始游戏，不保存状态');
        }
        
        // 重置重新开始标记
        if (typeof isRestarting !== 'undefined' && isRestarting) {
            delete isRestarting;
        }
    }
}

// 更新计数器显示
function updateCounters() {
    // 显示剩余地雷数（总地雷数减去已标记的格子数）
    const remainingMines = Math.max(0, totalMines - flaggedCells);
    mineCounterElement.textContent = remainingMines.toString().padStart(3, '0');
    
    // 显示已用时间
    timeCounterElement.textContent = seconds.toString().padStart(3, '0');
}

// 检查游戏胜利条件
function checkWinCondition() {
    // 胜利条件：
    // 只要所有非地雷的格子都被揭示，就判定胜利，不管地雷是否被标记
    const totalSafeCells = rows * cols - totalMines;
    const allSafeCellsRevealed = revealedCells === totalSafeCells;
    
    if (allSafeCellsRevealed) {
        gameOver = true;
        clearInterval(timerInterval);
        resetButton.textContent = '😎';
        
        // 标记所有地雷
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (gameBoard[row][col].isMine && !gameBoard[row][col].isFlagged) {
                    gameBoard[row][col].isFlagged = true;
                    flaggedCells++;
                    updateCellDisplay(row, col);
                }
            }
        }
        
        updateCounters();
        
        // 触发扫描动画显示地雷
        animateMineScan();
    }
}

// 开始自定义游戏
function startCustomGame() {
    // 获取自定义参数
    const customRows = parseInt(rowsInput.value);
    const customCols = parseInt(colsInput.value);
    const customMines = parseInt(minesInput.value);
    
    // 验证参数
    if (isNaN(customRows) || isNaN(customCols) || isNaN(customMines)) {
        alert('请输入有效的数字！');
        return;
    }
    
    // 检查参数范围
    if (customRows < 5 || customRows > 30 || customCols < 5 || customCols > 30) {
        alert('行数和列数必须在5到30之间！');
        return;
    }
    
    // 检查地雷数是否合理
    const maxMines = Math.floor(customRows * customCols * 0.4); // 最多为格子总数的40%
    if (customMines < 1 || customMines > maxMines) {
        alert(`地雷数必须在1到${maxMines}之间！`);
        return;
    }
    
    // 更新游戏参数
    rows = customRows;
    cols = customCols;
    totalMines = customMines;
    
    // 重新初始化游戏
    initGame();
}

// 显示操作反馈
function showFeedback(message, isSuccess = true) {
    feedbackMessage.textContent = message;
    feedbackMessage.classList.remove('show', 'success', 'error');
    feedbackMessage.classList.add('show', isSuccess ? 'success' : 'error');
    
    // 1秒后自动隐藏
    setTimeout(() => {
        feedbackMessage.classList.remove('show');
    }, 1000);
}

// 显示彩蛋界面
function showEasterEgg() {
    // 检查彩蛋界面是否已存在
    if (document.getElementById('easterEggScreen')) {
        return;
    }
    
    // 创建彩蛋界面元素
    const easterEggScreen = document.createElement('div');
    easterEggScreen.id = 'easterEggScreen';
    easterEggScreen.classList.add('easter-egg-screen');
    
    // 设置界面内容
    easterEggScreen.innerHTML = `
        <div class="easter-egg-content">
            <div class="easter-emoji">😳</div>
            <h2>点我干啥</h2>
            <button id="closeEasterEgg">关闭</button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(easterEggScreen);
    
    // 为关闭按钮添加事件监听器
    document.getElementById('closeEasterEgg').addEventListener('click', () => {
        // 移除彩蛋界面
        document.body.removeChild(easterEggScreen);
    });
}

// 重新开始这局游戏（使用上一局的棋盘）
function restartSameGame() {
    try {
        console.log('尝试重新开始这局游戏');
        console.log('当前previousGameBoard状态:', previousGameBoard ? '有保存' : '无保存');
        console.log('当前previousGameSettings状态:', previousGameSettings ? '有保存' : '无保存');
        
        // 保存当前游戏状态
        if (previousGameBoard && previousGameSettings) {
            console.log('重新开始这局游戏：恢复上一局状态');
            
            // 重置游戏状态但保留地雷位置和游戏设置
            revealedCells = 0; // 重置为0
            flaggedCells = 0; // 重置为0
            gameStarted = false; // 暂时设置为未开始，让startTimer函数来管理
            gameOver = false;
            seconds = 0;
            
            // 恢复游戏设置
            rows = previousGameSettings.rows;
            cols = previousGameSettings.cols;
            totalMines = previousGameSettings.totalMines;
            
            console.log(`恢复的游戏设置: ${rows}行 x ${cols}列, ${totalMines}个地雷`);
            
            // 更新计数器显示
            updateCounters();
            
            // 清除计时器
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            
            // 重置表情按钮
            resetButton.textContent = '😊';
            
            // 恢复上一局的游戏状态
            gameBoard = JSON.parse(JSON.stringify(previousGameBoard));
            
            // 清除所有标记（旗子）和已揭示的单元格状态
            console.log('清除所有标记（旗子）和已揭示的单元格状态');
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    // 清除标记状态
                    gameBoard[row][col].isFlagged = false;
                    // 清除已揭示状态
                    gameBoard[row][col].isRevealed = false;
                }
            }
            
            console.log(`重置后：已揭示单元格=${revealedCells}，已标记单元格=${flaggedCells}`);
            
            // 重新创建游戏板但不生成新地雷
            recreateGameBoard(false);
            
            // 标记为重新开始游戏并延迟启动计时器，确保DOM已更新
            isRestarting = true;
            setTimeout(() => {
                console.log('延迟后启动计时器，确保DOM已更新');
                // 再次更新所有单元格的显示状态，确保正确应用
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        updateCellDisplay(row, col);
                    }
                }
                startTimer();
            }, 100);
            
            showFeedback('重新开始这局游戏成功');
        } else {
            // 如果是第一局游戏或没有保存的游戏状态，创建新游戏
            console.log('重新开始这局游戏：没有保存的状态，创建新游戏');
            initGame();
            showFeedback('重新开始这局游戏成功');
        }
    } catch (error) {
        console.error('重新开始游戏失败:', error);
        showFeedback('重新开始这局游戏失败，原因：' + error.message, false);
    }
}

// 重新创建游戏板但不生成新地雷
function recreateGameBoard(generateNewMines = true) {
    // 清空游戏板元素
    gameBoardElement.innerHTML = '';
    
    // 设置游戏板的网格布局
    gameBoardElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    // 如果需要生成新地雷
    if (generateNewMines) {
        // 保存当前的地雷位置
        previousMinePositions = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (gameBoard[row][col] && gameBoard[row][col].isMine) {
                    previousMinePositions.push({row, col});
                }
            }
        }
    }
    
    // 创建单元格元素
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // 创建单元格元素
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // 添加点击事件
            cell.addEventListener('click', () => handleCellClick(row, col));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleCellRightClick(row, col);
            });
            
            // 移动设备长按标记
            if (isMobile) {
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    longPressTimer = setTimeout(() => {
                        handleCellRightClick(row, col);
                    }, LONG_PRESS_DURATION);
                });
                
                cell.addEventListener('touchend', () => {
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                });
                
                cell.addEventListener('touchmove', () => {
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                });
            }
            
            gameBoardElement.appendChild(cell);
        }
    }
    
    // 更新所有单元格的显示状态（根据恢复的gameBoard数据）
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            updateCellDisplay(row, col);
        }
    }
}

// 显示棋盘设置界面
function showBoardSettings() {
    try {
        boardSettingsScreen.classList.add('active');
        // 移除设置成功提示
    } catch (error) {
        showFeedback('显示棋盘设置失败，原因：' + error.message, false);
    }
}

// 隐藏棋盘设置界面
function hideBoardSettings() {
    try {
        boardSettingsScreen.classList.remove('active');
    } catch (error) {
        showFeedback('关闭棋盘设置失败，原因：' + error.message, false);
    }
}

// 应用棋盘设置
function applyBoardSettings() {
    try {
        // 获取自定义参数
        const customRows = parseInt(rowsInput.value);
        const customCols = parseInt(colsInput.value);
        const customMines = parseInt(minesInput.value);
        
        // 验证参数
        if (isNaN(customRows) || isNaN(customCols) || isNaN(customMines)) {
            showFeedback('应用棋盘设置失败，原因：请输入有效的数字', false);
            return;
        }
        
        // 检查参数范围
        if (customRows < 5 || customRows > 30 || customCols < 5 || customCols > 30) {
            showFeedback('应用棋盘设置失败，原因：行数和列数必须在5到30之间', false);
            return;
        }
        
        // 检查地雷数是否合理
        const maxMines = Math.floor(customRows * customCols * 0.4); // 最多为格子总数的40%
        if (customMines < 1 || customMines > maxMines) {
            showFeedback(`应用棋盘设置失败，原因：地雷数必须在1到${maxMines}之间`, false);
            return;
        }
        
        // 更新游戏参数
        rows = customRows;
        cols = customCols;
        totalMines = customMines;
        
        // 清除上一局的游戏状态
        previousMinePositions = null;
        // 保留previousGameBoard，以便"重新开始这局游戏"功能仍能工作
        // previousGameBoard = null;
        
        // 重新初始化游戏
        initGame();
        
        // 隐藏设置界面
        hideBoardSettings();
        
        // 移除设置成功提示
    } catch (error) {
        showFeedback('应用棋盘设置失败，原因：' + error.message, false);
    }
}

// 保存游戏状态到localStorage
function saveGameState() {
    try {
        if (gameOver) return; // 游戏结束时不保存状态
        
        const gameState = {
            gameBoard: gameBoard,
            revealedCells: revealedCells,
            flaggedCells: flaggedCells,
            totalMines: totalMines,
            rows: rows,
            cols: cols,
            gameStarted: gameStarted,
            gameOver: gameOver,
            seconds: seconds,
            timestamp: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        console.log('游戏状态已保存到localStorage');
    } catch (error) {
        console.error('保存游戏状态失败:', error);
    }
}

// 从localStorage恢复游戏状态
function loadGameState() {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const gameState = JSON.parse(savedState);
            
            // 检查保存时间是否在24小时内
            const now = Date.now();
            const savedTime = gameState.timestamp;
            if (now - savedTime > 24 * 60 * 60 * 1000) {
                console.log('保存的游戏状态已过期，创建新游戏');
                localStorage.removeItem(STORAGE_KEY);
                return false;
            }
            
            // 恢复游戏状态
            gameBoard = gameState.gameBoard;
            revealedCells = gameState.revealedCells;
            flaggedCells = gameState.flaggedCells;
            totalMines = gameState.totalMines;
            rows = gameState.rows;
            cols = gameState.cols;
            gameStarted = gameState.gameStarted;
            gameOver = gameState.gameOver;
            seconds = gameState.seconds;
            
            // 保存到previousGameBoard和previousGameSettings
            previousGameBoard = JSON.parse(JSON.stringify(gameBoard));
            previousGameSettings = { rows, cols, totalMines };
            
            console.log('游戏状态已从localStorage恢复');
            return true;
        }
    } catch (error) {
        console.error('恢复游戏状态失败:', error);
        localStorage.removeItem(STORAGE_KEY);
    }
    return false;
}

// 全局帮助功能函数
function showHelpModal() {
    const helpModal = document.getElementById('helpModal');
    if (helpModal) {
        // 清除内联样式，确保CSS类可以正常工作
        helpModal.style.display = '';
        helpModal.classList.add('active');
    }
}

function hideHelpModal() {
    const helpModal = document.getElementById('helpModal');
    if (helpModal) {
        helpModal.classList.remove('active');
        // 使用setTimeout确保动画效果正常显示
        setTimeout(() => {
            if (!helpModal.classList.contains('active')) {
                // 不再设置内联样式，而是通过CSS类控制
            }
        }, 300);
    }
}

// 页面加载完成后执行额外的初始化
// 帮助按钮和弹窗的事件监听器现在在DOMContentLoaded中统一处理

// 清除保存的游戏状态
function clearSavedGameState() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('保存的游戏状态已清除');
}

// 在DOM完全加载后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    gameBoardElement = document.getElementById('gameBoard');
    mineCounterElement = document.getElementById('mineCounter');
    timeCounterElement = document.getElementById('timeCounter');
    resetButton = document.getElementById('resetButton');
    customGameButton = document.getElementById('customGameButton');
    rowsInput = document.getElementById('rows');
    colsInput = document.getElementById('cols');
    minesInput = document.getElementById('mines');
    helpButton = document.getElementById('helpButton');
    helpModal = document.getElementById('helpModal');
    closeHelpButton = document.getElementById('closeHelpButton');
    restartSameGameButton = document.getElementById('restartSameGameButton');
    startNewGameButton = document.getElementById('startNewGameButton');
    boardSettingsButton = document.getElementById('boardSettingsButton');
    boardSettingsScreen = document.getElementById('boardSettingsScreen');
    applySettingsButton = document.getElementById('applySettingsButton');
    cancelSettingsButton = document.getElementById('cancelSettingsButton');
    feedbackMessage = document.getElementById('feedbackMessage');

    // 添加事件监听器
    resetButton.addEventListener('click', () => {
        try {
            // 将表情按钮点击改为显示彩蛋界面
            showEasterEgg();
        } catch (error) {
            showFeedback('重新开始游戏失败，原因：' + error.message, false);
        }
    });

    restartSameGameButton.addEventListener('click', restartSameGame);

    startNewGameButton.addEventListener('click', () => {
        try {
            initGame();
            showFeedback('开始新游戏成功');
        } catch (error) {
            showFeedback('开始新游戏失败，原因：' + error.message, false);
        }
    });

    boardSettingsButton.addEventListener('click', showBoardSettings);

    applySettingsButton.addEventListener('click', applyBoardSettings);

    cancelSettingsButton.addEventListener('click', () => {
        hideBoardSettings();
        // 移除取消设置成功提示
    });

    // 帮助按钮事件监听器
    if (helpButton) {
        helpButton.addEventListener('click', showHelpModal);
    }

    // 关闭按钮事件监听器
    closeHelpButton.addEventListener('click', hideHelpModal);

    // 点击弹窗外部区域关闭弹窗
    helpModal.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            hideHelpModal();
        }
    });

    // 初始化游戏
    initGame();
});