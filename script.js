// ===== Mobile Navigation Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
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
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Navbar Background on Scroll =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===== Scroll Reveal Animation =====
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

// Observe elements for animation
const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .leadership-card, .about-stats');

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Typing Effect for Hero Subtitle =====
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// ===== Parallax Effect for Hero Section ===== (Disabled to prevent overlap)
// const hero = document.querySelector('.hero');
//
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const parallaxSpeed = 0.5;
//
//     if (hero && scrolled < hero.offsetHeight) {
//         hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
//     }
// });

// ===== Add hover effect to timeline items =====
const timelineItems = document.querySelectorAll('.timeline-item');

timelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const dot = this.querySelector('.timeline-dot');
        if (dot) {
            dot.style.transform = 'scale(1.5)';
            dot.style.transition = 'transform 0.3s ease';
        }
    });
    
    item.addEventListener('mouseleave', function() {
        const dot = this.querySelector('.timeline-dot');
        if (dot) {
            dot.style.transform = 'scale(1)';
        }
    });
});

// ===== Counter Animation for Stats =====
const stats = document.querySelectorAll('.stat h3');
const statsSection = document.querySelector('.about-stats');

function animateCounter(element, target, suffix, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Observe stats section for counter animation
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    const text = stat.textContent;
                    let target;
                    let suffix;
                    let prefix = '';
                    
                    if (text.includes('$')) {
                        // Handle currency with K
                        prefix = '$';
                        target = parseFloat(text.replace(/[$K+]/g, ''));
                        suffix = 'K+';
                        stat.textContent = '$0K+';
                        setTimeout(() => {
                            const timer = setInterval(() => {
                                let current = parseFloat(stat.textContent.replace(/[$K+]/g, ''));
                                if (current >= target) {
                                    stat.textContent = prefix + target + suffix;
                                    clearInterval(timer);
                                } else {
                                    current += target / 125;
                                    stat.textContent = prefix + Math.floor(current) + suffix;
                                }
                            }, 16);
                        }, 200);
                    } else if (text.includes('K')) {
                        target = parseFloat(text.replace(/[K+]/g, ''));
                        suffix = 'K+';
                        stat.textContent = '0K+';
                        setTimeout(() => {
                            animateCounter(stat, target, suffix, 2000);
                        }, 200);
                    } else if (text.includes('.')) {
                        target = parseFloat(text);
                        suffix = '';
                        stat.textContent = '0.00';
                        setTimeout(() => {
                            let current = 0;
                            const increment = target / 100;
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    stat.textContent = target.toFixed(2);
                                    clearInterval(timer);
                                } else {
                                    stat.textContent = current.toFixed(2);
                                }
                            }, 20);
                        }, 200);
                    } else {
                        target = parseInt(text.replace(/\+/g, ''));
                        suffix = '+';
                        stat.textContent = '0+';
                        setTimeout(() => {
                            animateCounter(stat, target, suffix, 2000);
                        }, 200);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// ===== Add ripple effect to buttons =====
const buttons = document.querySelectorAll('.btn, .social-btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .btn, .social-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Lazy Loading for Images (if any are added later) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== Console Message =====
console.log('%c👋 Welcome to Dillan Haran\'s Portfolio!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the source!', 'color: #ec4899; font-size: 14px;');

// ===== Initialize on page load =====
window.addEventListener('load', () => {
    // Trigger initial highlight
    highlightNavigation();
    
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
});

// Made with Bob
