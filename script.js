/* ============================================================
   NAVBAR — scroll state + active section detection
   ============================================================ */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const hamburgerIcon = document.getElementById('hamburger-icon');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

let mobileOpen = false;

hamburger.addEventListener('click', () => {
  mobileOpen = !mobileOpen;
  hamburger.setAttribute('aria-expanded', mobileOpen);
  mobileMenu.classList.toggle('open', mobileOpen);
  hamburgerIcon.className = mobileOpen ? 'fas fa-times' : 'fas fa-bars';
  document.body.style.overflow = mobileOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    mobileOpen = false;
    mobileMenu.classList.remove('open');
    hamburgerIcon.className = 'fas fa-bars';
    document.body.style.overflow = '';
  });
});

function onScroll() {
  // Navbar glassmorphism
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Active nav link detection
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    const isActive = link.dataset.section === current;
    link.classList.toggle('active', isActive);
  });

  // Timeline scroll progress
  updateTimelineProgress();
}

window.addEventListener('scroll', onScroll, { passive: true });

// ============================================================
//  SMOOTH SCROLLING
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ============================================================
//  PARTICLE SYSTEM (hero only)
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [], animId = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.35 + 0.05;
      const palettes = ['34,211,238','168,85,247','236,72,153'];
      this.color = palettes[Math.floor(Math.random() * palettes.length)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -5 || this.x > canvas.width + 5 || this.y < -5 || this.y > canvas.height + 5) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle   = `rgba(${this.color},1)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 70 }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { cancelAnimationFrame(animId); animId = null; init(); animate(); });

  const heroObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { if (!animId) animate(); }
      else { cancelAnimationFrame(animId); animId = null; }
    });
  }, { threshold: 0 });

  const heroSection = document.getElementById('home');
  if (heroSection) heroObs.observe(heroSection);

  init();
  animate();
})();

// ============================================================
//  SCROLL REVEAL — Intersection Observer
// ============================================================
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseFloat(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay * 1000);
    revealObs.unobserve(el);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

function registerReveal(selector, stagger = false) {
  document.querySelectorAll(selector).forEach((el, i) => {
    if (stagger) el.dataset.delay = (i * 0.1).toString();
    revealObs.observe(el);
  });
}

registerReveal('.reveal-section', false);
registerReveal('.reveal-tl', true);
registerReveal('.reveal-project', true);
registerReveal('.reveal-skill', true);
registerReveal('.reveal-card', true);

// ============================================================
//  ANIMATED COUNTER
// ============================================================
function animateCounter(el, from, to, duration, prefix, suffix, decimals) {
  const start = performance.now();
  const fmt = val => {
    const s = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toString();
    return `${prefix || ''}${s}${suffix || ''}`;
  };
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = fmt(to);
  }
  requestAnimationFrame(tick);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-value').forEach(el => {
      const from     = parseFloat(el.dataset.from || '0');
      const to       = parseFloat(el.dataset.to   || '0');
      const prefix   = el.dataset.prefix  || '';
      const suffix   = el.dataset.suffix  != null ? el.dataset.suffix : '';
      const decimals = el.dataset.decimals != null ? parseInt(el.dataset.decimals) : (to % 1 !== 0 ? 2 : 0);
      animateCounter(el, from, to, 2000, prefix, suffix, decimals);
    });
    statsObs.unobserve(entry.target);
  });
}, { threshold: 0.4 });

const statsShell = document.querySelector('.stats-shell');
if (statsShell) statsObs.observe(statsShell);

// ============================================================
//  TIMELINE PROGRESS LINE
// ============================================================
const timelineEl  = document.getElementById('timeline');
const progressBar = document.getElementById('timelineProgress');

function updateTimelineProgress() {
  if (!timelineEl || !progressBar) return;
  const rect   = timelineEl.getBoundingClientRect();
  const vh     = window.innerHeight;
  const total  = rect.height;
  const seen   = Math.max(0, Math.min(total, vh * 0.65 - rect.top));
  const pct    = Math.min(100, (seen / total) * 100);
  progressBar.style.height = pct + '%';
}

// ============================================================
//  RIPPLE EFFECT
// ============================================================
document.querySelectorAll('.btn-primary-hero, .btn-ghost-hero, .nav-cta, .mobile-cta').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `
      position:absolute;border-radius:50%;pointer-events:none;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,0.25);
      transform:scale(0);animation:ripple-anim 0.6s ease-out;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

if (!document.getElementById('ripple-style')) {
  const s = document.createElement('style');
  s.id = 'ripple-style';
  s.textContent = '@keyframes ripple-anim{to{transform:scale(4);opacity:0}}';
  document.head.appendChild(s);
}

// ============================================================
//  INIT
// ============================================================
window.addEventListener('load', () => {
  onScroll();
  updateTimelineProgress();
});

console.log('%c Dillan Haran — Portfolio', 'color:#22d3ee;font-size:18px;font-weight:bold;');
console.log('%c IBM Client Engineer · AI Builder · Founder', 'color:#a855f7;font-size:13px;');
