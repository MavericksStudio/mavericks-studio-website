/**
 * Mavericks Studio - Landing Page Scripts
 * Handles animations, interactions, and smooth behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initNavBackground();
});

/**
 * Cursor Glow Effect
 * Creates a subtle glow that follows the cursor
 */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursorGlow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        const ease = 0.08;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;

        cursorGlow.style.left = `${currentX}px`;
        cursorGlow.style.top = `${currentY}px`;

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuLinks = mobileMenu?.querySelectorAll('a');

    if (!menuBtn || !mobileMenu) return;

    let isOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;
        mobileMenu.classList.toggle('active', isOpen);
        menuBtn.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', toggleMenu);

    menuLinks?.forEach(link => {
        link.addEventListener('click', () => {
            if (isOpen) toggleMenu();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) toggleMenu();
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(`
        .service-card,
        .work-card,
        .value-item,
        .section-header,
        .approach-content,
        .approach-visual,
        .testimonial-content,
        .cta-content
    `);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index % 3 * 0.1}s, transform 0.6s ease ${index % 3 * 0.1}s`;
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Navigation Background on Scroll
 */
function initNavBackground() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            nav.style.background = 'rgba(10, 12, 16, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
            nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(10, 12, 16, 1) 0%, transparent 100%)';
            nav.style.backdropFilter = 'none';
            nav.style.borderBottom = 'none';
        }

        if (scrollY > lastScroll && scrollY > 400) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    });

    nav.style.transition = 'transform 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease';
}

/**
 * Parallax Effect for Hero Elements
 */
function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initParallax();
}
