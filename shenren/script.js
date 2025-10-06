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
        '_Chinese_Player_': '传奇赤石王，不仅自己赤石还要带着服务端和玩家一起赤石👍',
        'kdjnb': '记性天下无敌，迟早忘关刷沙机然后服务器爆炸👍',
    };
    return details[name] || '暂无该玩家详细信息，可联系管理员补充';
}
