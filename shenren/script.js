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
            
            // 显示点击提示
            const buttonText = this.textContent;
            alert(`您点击了: ${buttonText}`);
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
});
