// 增强的页面交互功能

// DOM 元素加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initAllFeatures();
});

// 初始化所有功能
function initAllFeatures() {
    initParallaxEffect();
    initNavHighlight();
    initCounterAnimation();
    initImageHoverEffect();
    initTooltip();
    initThemeSwitch();
    initOfflineSupport();
    initKeyboardShortcuts();
    initScrollToTopButton();
    initLazyLoading();
}

// 视差滚动效果
function initParallaxEffect() {
    const heroSection = document.querySelector('section:first-of-type');
    if (!heroSection) return;
    
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        heroSection.style.backgroundPositionY = scrollY * 0.5 + 'px';
    });
}

// 导航栏当前位置高亮
function initNavHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id') || '';
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('font-bold', 'text-primary');
            link.classList.add('text-gray-700');
            
            if (link.getAttribute('href') === '#' + current) {
                link.classList.remove('text-gray-700');
                link.classList.add('font-bold', 'text-primary');
            }
        });
    });
}

// 数字计数动画
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2秒内完成动画
                const stepTime = 20;
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, stepTime);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// 图片悬停效果
function initImageHoverEffect() {
    const images = document.querySelectorAll('img:not([src=""])');
    
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// 简单的工具提示功能
function initTooltip() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            if (!tooltipText) return;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                transform: translateY(-10px);
                opacity: 0;
                transition: all 0.2s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            // 保存tooltip引用以便后续移除
            this._tooltip = tooltip;
            
            // 计算位置
            const rect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            tooltip.style.top = `${rect.top + window.pageYOffset - tooltipRect.height - 8}px`;
            tooltip.style.left = `${rect.left + window.pageXOffset + (rect.width - tooltipRect.width) / 2}px`;
            
            // 显示tooltip
            setTimeout(() => {
                if (this._tooltip) {
                    this._tooltip.style.opacity = '1';
                    this._tooltip.style.transform = 'translateY(0)';
                }
            }, 10);
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.style.opacity = '0';
                this._tooltip.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    if (this._tooltip && document.body.contains(this._tooltip)) {
                        document.body.removeChild(this._tooltip);
                    }
                    this._tooltip = null;
                }, 200);
            }
        });
    });
}

// 主题切换功能（预留）
function initThemeSwitch() {
    // 这里预留了主题切换功能的框架
    // 可以在未来扩展为支持明暗主题切换
}

// 离线支持检测
function initOfflineSupport() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
    
    // 检测网络连接状态
    window.addEventListener('online', function() {
        showNotification('已重新连接到网络', 'success');
    });
    
    window.addEventListener('offline', function() {
        showNotification('网络连接已断开', 'error');
    });
}

// 通知提示
function showNotification(message, type = 'info') {
    // 检查是否已有通知存在，如果有则移除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        document.body.removeChild(existingNotification);
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // 设置不同类型的通知样式
    let bgColor = '#93C5FD'; // 默认信息蓝（使用新的强调色）
        let icon = 'fa-info-circle';
        
        if (type === 'success') {
            bgColor = '#86EFAC'; // 成功绿（使用新的主色调）
            icon = 'fa-check-circle';
        } else if (type === 'error') {
            bgColor = '#EF4444'; // 错误红（保持不变，作为对比色）
            icon = 'fa-exclamation-circle';
        } else if (type === 'warning') {
            bgColor = '#F59E0B'; // 警告黄（保持不变，作为对比色）
            icon = 'fa-exclamation-triangle';
        }
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fa ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // 自动关闭通知
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 键盘快捷键支持
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // 如果焦点在输入框中，则不响应快捷键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // Alt+1 跳转到关于我
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            document.querySelector('a[href="#about"]')?.click();
        }
        
        // Alt+2 跳转到社交媒体
        if (e.altKey && e.key === '2') {
            e.preventDefault();
            document.querySelector('a[href="#links"]')?.click();
        }
        
        // Alt+3 跳转到项目
        if (e.altKey && e.key === '3') {
            e.preventDefault();
            document.querySelector('a[href="#projects"]')?.click();
        }
        
        // Escape键关闭移动端菜单
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            const menuBtn = document.getElementById('menuBtn');
            
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = menuBtn?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
}

// 平滑滚动到顶部按钮
function initScrollToTopButton() {
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.id = 'scrollToTop';
    scrollToTopButton.className = 'btn-primary';
    scrollToTopButton.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>';
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 99;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollToTopButton);
    
    // 监听滚动事件，显示或隐藏回到顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    });
    
    // 添加点击事件
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 延迟加载图片
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.setAttribute('src', src);
                        img.removeAttribute('data-src');
                        
                        // 添加淡入效果
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.5s ease';
                        
                        img.onload = function() {
                            this.style.opacity = '1';
                        };
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }
}

// 增强的表单验证
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    highlightError(field);
                } else {
                    removeHighlight(field);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('请填写所有必填字段', 'error');
            }
        });
        
        // 输入时移除错误提示
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                removeHighlight(this);
            });
        });
    });
}

function highlightError(element) {
    element.style.borderColor = '#EF4444'; // 保持错误红色，作为对比色
    element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
}

function removeHighlight(element) {
    element.style.borderColor = '';
    element.style.boxShadow = '';
}