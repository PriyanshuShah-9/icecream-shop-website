/* ═══════════════════════════════════════════════════
   Satyanarayan Ice Cream — script.js
   ═══════════════════════════════════════════════════ */

/* ─── NAV: SCROLL GLASS EFFECT ──────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── NAV: MOBILE TOGGLE ────────────────────────── */
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* ─── SCROLL REVEAL ANIMATION ───────────────────── */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.style.getPropertyValue('--delay') || '0s';
      entry.target.style.transitionDelay = delay;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

/* ─── MENU CARDS: STAGGER DELAY ─────────────────── */
document.querySelectorAll('.menu-card').forEach((card, i) => {
  card.style.setProperty('--delay', `${i * 0.08}s`);
});

/* ─── GALLERY LIGHTBOX ──────────────────────────── */
function openLightbox(title, emoji) {
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxEmoji').textContent = emoji;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  const lightbox = document.getElementById('lightbox');
  // Close if clicking the backdrop or the close button
  if (!e || e.target === lightbox || e.target.classList.contains('lightbox-close')) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Allow closing lightbox with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Expose to global scope for inline onclick handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

/* ─── ORDER BUTTON: RIPPLE EFFECT ───────────────── */
// Inject ripple keyframe dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleOut { to { transform: scale(3); opacity: 0; } }';
document.head.appendChild(rippleStyle);

document.querySelectorAll('.btn-order').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      background: rgba(255,255,255,.35);
      width: 100px;
      height: 100px;
      left: ${e.offsetX - 50}px;
      top: ${e.offsetY - 50}px;
      animation: rippleOut .5s ease-out forwards;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

/* ─── MENU CARDS: 3D TILT ON HOVER ─────────────── */
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -5;
    const ry = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── FRANCHISE STATS: COUNTER ANIMATION ────────── */
function animateCounter(el, target, suffix) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 20);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.fstat-num');
      nums.forEach(n => {
        const txt = n.textContent.trim();
        if (txt.includes('+')) {
          animateCounter(n, parseInt(txt), '+');
        } else if (txt === '∞') {
          // Leave infinity symbol as-is, just pulse it
          n.style.animation = 'fadeUp .6s ease both';
        } else if (!isNaN(parseInt(txt))) {
          animateCounter(n, parseInt(txt), '');
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.franchise-stats');
if (statsSection) statsObserver.observe(statsSection);