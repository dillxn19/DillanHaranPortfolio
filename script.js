// ===== Mobile Navigation =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({
                top: target.offsetTop - navHeight,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Navbar on Scroll =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (scrollY > sectionTop && scrollY <= sectionTop + section.offsetHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===== Particle System =====
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.05;
            const hues = ['129, 140, 248', '244, 114, 182', '45, 212, 191'];
            this.color = hues[Math.floor(Math.random() * hues.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < -5 || this.x > canvas.width + 5 ||
                this.y < -5 || this.y > canvas.height + 5) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `rgba(${this.color}, 1)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function init() {
        resize();
        particles = Array.from({ length: 60 }, () => new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        init();
        animate();
    });

    // Only run on the hero section, pause when scrolled away
    const heroSection = document.getElementById('home');
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0 });

    if (heroSection) visibilityObserver.observe(heroSection);

    init();
    animate();
})();

// ===== Scroll Reveal with Stagger =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

function setupReveal(selector, stagger = true) {
    const els = document.querySelectorAll(selector);
    els.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = `opacity 0.6s ease ${stagger ? i * 0.1 : 0}s, transform 0.6s ease ${stagger ? i * 0.1 : 0}s`;
        revealObserver.observe(el);
    });
}

setupReveal('.timeline-item', true);
setupReveal('.project-card', true);
setupReveal('.skill-category', true);
setupReveal('.leadership-card', true);
setupReveal('.about-stats', false);

// ===== Timeline Dot Hover =====
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const dot = item.querySelector('.timeline-dot');
        if (dot) {
            dot.style.transform = 'scale(1.5)';
            dot.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        }
    });
    item.addEventListener('mouseleave', () => {
        const dot = item.querySelector('.timeline-dot');
        if (dot) dot.style.transform = 'scale(1)';
    });
});

// ===== Typing Effect =====
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 42);
        }
    }

    setTimeout(typeWriter, 700);
}

// ===== Counter Animation for Stats =====
const statsSection = document.querySelector('.about-stats');

function animateValue(el, from, to, duration, prefix, suffix) {
    const start = performance.now();
    function tick(now) {
        const elapsed = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        const current = from + (to - from) * eased;
        el.textContent = prefix + (Number.isInteger(to) ? Math.floor(current) : current.toFixed(2)) + suffix;
        if (elapsed < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + to + suffix;
    }
    requestAnimationFrame(tick);
}

if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat h3').forEach(stat => {
                    const raw = stat.textContent.trim();
                    if (raw.startsWith('$') && raw.includes('M')) {
                        const val = parseFloat(raw.replace(/[$M+]/g, ''));
                        animateValue(stat, 0, val, 1800, '$', 'M+');
                    } else if (raw.startsWith('$') && raw.includes('K')) {
                        const val = parseFloat(raw.replace(/[$K+]/g, ''));
                        animateValue(stat, 0, val, 1800, '$', 'K+');
                    } else if (raw.includes('.')) {
                        animateValue(stat, 0, parseFloat(raw), 1800, '', '');
                    } else {
                        const val = parseInt(raw.replace(/\+/g, ''));
                        animateValue(stat, 0, val, 1800, '', '+');
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ===== Ripple Effect =====
document.querySelectorAll('.btn, .social-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== Init =====
window.addEventListener('load', () => {
    highlightNavigation();
    document.body.classList.add('loaded');
});

console.log('%c Dillan Haran — Portfolio', 'color: #818cf8; font-size: 18px; font-weight: bold;');
console.log('%c IBM Client Engineering Intern · AI Builder · Founder', 'color: #4589ff; font-size: 13px;');
