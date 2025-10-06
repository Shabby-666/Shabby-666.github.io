// 粒子效果
document.addEventListener('DOMContentLoaded', function() {
    // 创建粒子效果
    function createParticles() {
        const container = document.querySelector('.container');
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // 随机位置
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // 随机大小
            const size = Math.random() * 6 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // 随机动画延迟
            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;
            
            document.body.appendChild(particle);
            
            // 添加浮动动画
            animateParticle(particle);
        }
    }
    
    function animateParticle(particle) {
        const duration = Math.random() * 20 + 10;
        const xMovement = (Math.random() - 0.5) * 100;
        const yMovement = (Math.random() - 0.5) * 100;
        
        particle.style.transition = `all ${duration}s linear`;
        particle.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
        
        // 动画结束后重置位置并重新开始
        setTimeout(() => {
            particle.style.transition = 'none';
            particle.style.transform = 'translate(0, 0)';
            setTimeout(() => {
                animateParticle(particle);
            }, 100);
        }, duration * 1000);
    }
    
    // 初始化粒子效果
    createParticles();
    
    // 添加表格行点击效果
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // 添加点击效果
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // 显示详细信息
            const name = this.querySelector('.name').textContent;
            const achievement = this.querySelector('.achievement').textContent;
            const evaluation = this.querySelector('.evaluation').textContent;
            
            // 创建详细信息弹窗
            showPlayerDetail(name, achievement, evaluation);
        });
    });
    
    // 添加按钮点击效果
    const buttons = document.querySelectorAll('.minecraft-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 添加点击效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // 根据按钮文本执行不同操作
            const buttonText = this.textContent;
            handleButtonClick(buttonText);
        });
    });
    
    // 添加滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.container, header, .table-container, footer, .minecraft-btn, .update-info');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // 显示玩家详细信息
    function showPlayerDetail(name, achievement, evaluation) {
        // 创建弹窗
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        // 创建内容容器
        const content = document.createElement('div');
        content.style.backgroundColor = '#5c5c5c';
        content.style.border = '4px solid #373737';
        content.style.padding = '20px';
        content.style.maxWidth = '600px';
        content.style.width = '90%';
        content.style.fontFamily = "'Press Start 2P', cursive";
        content.style.color = '#fff';
        content.style.boxShadow = '0 0 0 4px #8b8b8b, 0 0 0 8px #373737';
        
        // 创建标题
        const title = document.createElement('h2');
        title.textContent = name;
        title.style.color = '#ffd900';
        title.style.marginBottom = '15px';
        title.style.textAlign = 'center';
        title.style.textShadow = '2px 2px 0 #373737';
        
        // 创建事迹内容
        const achievementTitle = document.createElement('h3');
        achievementTitle.textContent = '神人事迹:';
        achievementTitle.style.color = '#e0e0e0';
        achievementTitle.style.marginBottom = '10px';
        achievementTitle.style.fontSize = '0.8rem';
        
        const achievementText = document.createElement('p');
        achievementText.textContent = achievement;
        achievementText.style.color = '#e0e0e0';
        achievementText.style.marginBottom = '15px';
        achievementText.style.lineHeight = '1.5';
        achievementText.style.fontSize = '0.6rem';
        
        // 创建评价内容
        const evaluationTitle = document.createElement('h3');
        evaluationTitle.textContent = '作者评价:';
        evaluationTitle.style.color = '#b0b0b0';
        evaluationTitle.style.marginBottom = '10px';
        evaluationTitle.style.fontSize = '0.8rem';
        
        const evaluationText = document.createElement('p');
        evaluationText.textContent = evaluation;
        evaluationText.style.color = '#b0b0b0';
        evaluationText.style.marginBottom = '20px';
        evaluationText.style.lineHeight = '1.5';
        evaluationText.style.fontSize = '0.6rem';
        evaluationText.style.fontStyle = 'italic';
        
        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.backgroundColor = '#5c5c5c';
        closeBtn.style.border = '4px solid #373737';
        closeBtn.style.color = '#fff';
        closeBtn.style.padding = '10px 20px';
        closeBtn.style.fontFamily = "'Press Start 2P', cursive";
        closeBtn.style.fontSize = '0.7rem';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.display = 'block';
        closeBtn.style.margin = '0 auto';
        closeBtn.style.transition = 'all 0.1s';
        
        closeBtn.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#6b6b6b';
            this.style.transform = 'translateY(-2px)';
        });
        
        closeBtn.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#5c5c5c';
            this.style.transform = 'translateY(0)';
        });
        
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // 组装内容
        content.appendChild(title);
        content.appendChild(achievementTitle);
        content.appendChild(achievementText);
        content.appendChild(evaluationTitle);
        content.appendChild(evaluationText);
        content.appendChild(closeBtn);
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // 点击模态框外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // 处理按钮点击
    function handleButtonClick(buttonText) {
        switch(buttonText) {
            case '提名神人':
                alert('功能开发中，敬请期待！');
                break;
            case '查看详情':
                // 随机选择一个玩家显示详情
                const randomIndex = Math.floor(Math.random() * 7);
                const randomRow = tableRows[randomIndex];
                const name = randomRow.querySelector('.name').textContent;
                const achievement = randomRow.querySelector('.achievement').textContent;
                const evaluation = randomRow.querySelector('.evaluation').textContent;
                showPlayerDetail(name, achievement, evaluation);
                break;
            case '服务器规则':
                alert('服务器规则:\n1. 禁止破坏他人建筑\n2. 禁止使用作弊模组\n3. 尊重其他玩家\n4. 共同维护服务器环境');
                break;
        }
    }
});
