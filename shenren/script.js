// 1. 页面加载后执行表格入场动画
window.addEventListener('load', () => {
    initTableAnimation();
});

// 2. 表格逐行渐入动画
function initTableAnimation() {
    const tableRows = document.querySelectorAll('#godTable tbody tr');
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100);
    });
}

// 3. 滚动时排名数字动态变色
window.addEventListener('scroll', () => {
    const rankCells = document.querySelectorAll('.rank-cell');
    rankCells.forEach(cell => {
        const rect = cell.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const hue = (Date.now() % 360) + (cell.dataset.rank.charCodeAt(1) * 10);
            cell.style.color = `hsl(${hue}, 100%, 50%)`;
            cell.style.textShadow = `0 0 8px hsl(${hue}, 100%, 50%)`;
        }
    });
});

// 4. 点击行展开/关闭详情
document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('#godTable tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            const hasDetail = row.nextElementSibling?.classList.contains('detail-row');
            if (hasDetail) {
                row.nextElementSibling.remove();
                return;
            }
            const playerName = row.cells[1].textContent;
            const detailContent = getPlayerDetail(playerName);
            const detailRow = document.createElement('tr');
            detailRow.className = 'detail-row';
            detailRow.style.transition = 'all 0.3s ease';
            const detailCell = document.createElement('td');
            detailCell.colSpan = 4;
            detailCell.style.padding = '1rem';
            detailCell.style.color = '#D0D0D0';
            detailCell.style.fontSize = '1rem';
            detailCell.innerHTML = `<span style="color:#00FF00">[详情]</span> ${detailContent}`;
            detailRow.appendChild(detailCell);
            row.after(detailRow);
        });
    });
});

// 5. 玩家详情数据
function getPlayerDetail(name) {
    const details = {
        '史蒂夫·建筑大师': '建筑作品坐标：X:1250, Y:64, Z:-800，服务器已设为「官方景点」，输入/tp 1250 64 -800可直接传送参观',
        '爱丽克斯·红石怪': '红石教程发布在服务器论坛：/forum/redstone-alex，交易所坐标：X:800, Y:72, Z:500，新手可免费使用所有功能',
        'Notch·生存狂': '每周六晚8点在服务器频道直播：/live/notch，生存物资兑换点：X:-300, Y:68, Z:-200，用腐肉可换钻石',
        '苦力怕·陷阱师': '陷阱地图入口：X:-500, Y:70, Z:1000，所有陷阱仅触发彩色粒子和鸡叫音效，无任何伤害，放心体验',
        '末影人·收藏家': '收藏展示室坐标：X:1000, Y:80, Z:-600，禁止触碰龙蛋（会触发3只末影人NPC追击，持续1分钟）'
    };
    return details[name] || '暂无该玩家详细信息，可联系管理员补充';
}
});

// 4. 点击表格行展开/关闭玩家详情（交互功能）
document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('#godTable tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            // 检查当前行下方是否已有详情行，有则删除（关闭详情）
            const hasDetail = row.nextElementSibling?.classList.contains('detail-row');
            if (hasDetail) {
                row.nextElementSibling.remove();
                return;
            }

            // 无详情行则创建：先获取当前行的玩家名称
            const playerName = row.cells[1].textContent;
            // 根据玩家名获取对应详情（调用下方函数）
            const detailContent = getPlayerDetail(playerName);
            
            // 创建详情行元素
            const detailRow = document.createElement('tr');
            detailRow.className = 'detail-row';
            detailRow.style.transition = 'all 0.3s ease'; // 详情行显示动画

            // 创建详情单元格（跨4列，占满表格宽度）
            const detailCell = document.createElement('td');
            detailCell.colSpan = 4;
            detailCell.style.padding = '1rem';
            detailCell.style.color = '#D0D0D0'; // 浅灰色文字
            detailCell.style.fontSize = '1rem';
            // 详情前缀用MC绿色，加"[详情]"标识，贴合风格
            detailCell.innerHTML = `<span style="color:#00FF00">[详情]</span> ${detailContent}`;

            // 把单元格加入行，再把行插入到当前行下方
            detailRow.appendChild(detailCell);
            row.after(detailRow);
        });
    });
});

// 5. 玩家详情数据（根据玩家名返回对应详情，可自定义修改）
function getPlayerDetail(name) {
    const details = {
        '史蒂夫·建筑大师': '建筑作品坐标：X:1250, Y:64, Z:-800，服务器已设为「官方景点」，输入/tp 1250 64 -800可直接传送参观',
        '爱丽克斯·红石怪': '红石教程发布在服务器论坛：/forum/redstone-alex，交易所坐标：X:800, Y:72, Z:500，新手可免费使用所有功能',
        'Notch·生存狂': '每周六晚8点在服务器频道直播：/live/notch，生存物资兑换点：X:-300, Y:68, Z:-200，用腐肉可换钻石',
        '苦力怕·陷阱师': '陷阱地图入口：X:-500, Y:70, Z:1000，所有陷阱仅触发彩色粒子和鸡叫音效，无任何伤害，放心体验',
        '末影人·收藏家': '收藏展示室坐标：X:1000, Y:80, Z:-600，禁止触碰龙蛋（会触发3只末影人NPC追击，持续1分钟）'
    };
    // 若没有对应玩家的详情，返回默认文本
    return details[name] || '暂无该玩家详细信息，可联系管理员补充';
}
        // 仅当单元格进入视口时变色
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            // 基于时间和排名生成唯一色调，颜色不重复
            const hue = (Date.now() % 360) + (cell.dataset.rank.charCodeAt(1) * 10);
            cell.style.color = `hsl(${hue}, 100%, 50%)`;
            cell.style.textShadow = `0 0 8px hsl(${hue}, 100%, 50%)`;
        }
    });
});

// 4. 点击表格行展开/关闭玩家详情
document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('#godTable tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            // 检查是否已有详情行，有则删除
            const hasDetail = row.nextElementSibling?.classList.contains('detail-row');
            if (hasDetail) {
                row.nextElementSibling.remove();
                return;
            }

            // 无详情行则创建
            const playerName = row.cells[1].textContent;
            const detailContent = getPlayerDetail(playerName);
            
            const detailRow = document.createElement('tr');
            detailRow.className = 'detail-row';
            detailRow.style.transition = 'all 0.3s ease'; // 渐变显示

            const detailCell = document.createElement('td');
            detailCell.colSpan = 4; // 跨4列，占满表格宽度
            detailCell.style.padding = '1rem';
            detailCell.style.color = '#D0D0D0';
            detailCell.style.fontSize = '1rem';
            detailCell.innerHTML = `<span style="color:#00FF00">[详情]</span> ${detailContent}`;

            detailRow.appendChild(detailCell);
            row.after(detailRow); // 插入到当前行下方
        });
    });
});

// 
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const hue = (Date.now() % 360) + (cell.dataset.rank.charCodeAt(1) * 10);
            cell.style.color = `hsl(${hue}, 100%, 50%)`;
            cell.style.textShadow = `0 0 8px hsl(${hue}, 100%, 50%)`;
        }
    });
});

// 4. 点击表格行展开/关闭详情
document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('#godTable tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            // 检查是否已有详情行，有则删除
            const hasDetail = row.nextElementSibling?.classList.contains('detail-row');
            if (hasDetail) {
                row.nextElementSibling.remove();
                return;
            }

            // 无详情行则创建（按玩家名匹配详情）
            const playerName = row.cells[1].textContent;
            const detailContent = getPlayerDetail(playerName);
            
            const detailRow = document.createElement('tr');
            detailRow.className = 'detail-row';
            detailRow.style.backgroundColor = 'rgba(40,40,40,0.8)';
            detailRow.style.border = '3px solid #444';
            detailRow.style.borderTop = 'none';
            detailRow.style.transition = 'all 0.3s ease';
            
            // 详情单元格（跨4列）
            const detailCell = document.createElement('td');
            detailCell.colSpan = 4;
            detailCell.style.padding = '1rem';
            detailCell.style.color = '#D0D0D0';
            detailCell.style.fontSize = '1rem';
            detailCell.innerHTML = `<span style="color:#00FF00">[详情]</span> ${detailContent}`;
            
            detailRow.appendChild(detailCell);
            row.after(detailRow);
        });
    });
});

// 5. 玩家详情数据（可自定义修改）
function get
