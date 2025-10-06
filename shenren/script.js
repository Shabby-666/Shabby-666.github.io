// 1. 页面加载完成后执行
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    // 延迟1秒隐藏加载动画，再执行表格入场
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            initTableAnimation(); // 表格逐行渐入
        }, 800);
    }, 1000);
});

// 2. 表格入场动画（逐行透明→显示）
function initTableAnimation() {
    const tableRows = document.querySelectorAll('#godTable tbody tr');
    tableRows.forEach((row, index) => {
        // 初始状态：透明+下移
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
        
        // 延迟显示
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100);
    });
}

// 3. 滚动时排名数字动态变色（MC彩虹效果）
window.addEventListener('scroll', () => {
    const rankCells = document.querySelectorAll('.rank-cell');
    rankCells.forEach(cell => {
        const rect = cell.getBoundingClientRect();
        // 当排名单元格进入视口时触发变色
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
