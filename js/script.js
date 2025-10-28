// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLoadingScreen();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initSmoothScrolling();
    initMobileOptimizations();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time dengan progress bar
    let progress = 0;
    const progressFill = document.querySelector('.progress-fill');
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Hide loading screen after completion
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 300);
        }
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }, 200);
}

// Navigation dengan Hamburger Menu
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Mobile menu toggle dengan hamburger animation
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            navToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('show-menu') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show-menu') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('show-menu');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Active link highlighting dengan optimasi performa
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset + 100; // Offset untuk mobile
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttle scroll event untuk performa mobile
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                updateActiveLink();
            }, 100);
        }
    });
}

// Scroll Effects dengan optimasi mobile
function initScrollEffects() {
    const header = document.querySelector('.header');
    const scrollUp = document.getElementById('scroll-up');
    
    // Header background on scroll dengan throttle
    let headerScrollTimeout;
    function scrollHeader() {
        if (!headerScrollTimeout) {
            headerScrollTimeout = setTimeout(() => {
                headerScrollTimeout = null;
                if (window.scrollY >= 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, 10);
        }
    }
    
    window.addEventListener('scroll', scrollHeader);
    
    // Scroll up button
    function showScrollUp() {
        if (window.scrollY >= 200) {
            scrollUp.classList.add('show-scroll');
        } else {
            scrollUp.classList.remove('show-scroll');
        }
    }
    
    window.addEventListener('scroll', showScrollUp);
    
    // Scroll to top functionality
    scrollUp.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth Scrolling untuk navigasi dengan offset untuk mobile
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                // Offset lebih kecil untuk mobile
                const offset = window.innerWidth < 768 ? 80 : 100;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animations dengan optimasi untuk mobile
function initAnimations() {
    // Gunakan Intersection Observer hanya jika didukung
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.product__card, .mission__card, .contact__item');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Non-aktifkan hover effects pada perangkat touch
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// Optimasi khusus untuk perangkat mobile
function initMobileOptimizations() {
    // Deteksi perangkat mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Optimasi performa untuk mobile
        const styles = document.createElement('style');
        styles.textContent = `
            .mobile-device * {
                -webkit-tap-highlight-color: transparent;
            }
            .mobile-device .btn {
                -webkit-user-select: none;
                user-select: none;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Optimasi untuk layar kecil
    if (window.innerWidth < 768) {
        // Reduce animation intensity for mobile
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }
    }
}

// Performance optimization
// Lazy loading for images dengan fallback
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    // Gunakan data-src jika ada, jika tidak gunakan src biasa
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback untuk browser yang tidak mendukung IntersectionObserver
        lazyImages.forEach(function(lazyImage) {
            if (lazyImage.dataset.src) {
                lazyImage.src = lazyImage.dataset.src;
            }
        });
    }
});

// Handle resize events dengan throttle
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Update any layout changes on resize
        if (window.innerWidth >= 768) {
            document.body.classList.remove('mobile-device');
        } else {
            document.body.classList.add('mobile-device');
        }
    }, 250);
});