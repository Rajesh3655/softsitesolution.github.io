/* ---- main.js — SoftSiteSolutions shared scripts ---- */

/* ============ LOADER ============ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 1400);
});

/* ============ NAVBAR ============ */
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

function closeMobileMenu() {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  document.body.classList.remove('mobile-menu-open');
  document.body.style.overflow = '';
}

function openMobileMenu() {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  document.body.classList.add('mobile-menu-open');
  document.body.style.overflow = 'hidden';
}

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  // back-to-top
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    closeMobileMenu();
  }
});

/* Set active nav link */
(function setActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normHref = href.replace(/\/$/, '') || '/';
    if (normHref === path || (path === '' && normHref === '/index.html')) {
      link.classList.add('active');
    }
    // Handle exact match for pages
    const pageName = path.split('/').pop();
    const linkPage = normHref.split('/').pop();
    if (pageName && pageName === linkPage && pageName !== '') {
      link.classList.add('active');
    }
  });
})();

/* ============ SCROLL REVEAL ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ============ PARALLAX ============ */
const parallaxBgs = document.querySelectorAll('.parallax-bg');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  parallaxBgs.forEach(bg => {
    const rect = bg.closest('.parallax-section')?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (scrolled - (scrolled - rect.top + window.scrollY)) * 0.3;
      bg.style.transform = `translateY(${offset * 0.25}px)`;
    }
  });
}, { passive: true });

/* ============ BACK TO TOP ============ */
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============ TOAST SYSTEM ============ */
window.showToast = function(message, type = 'success', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, duration);
};

/* ============ THREE.JS HERO CANVAS ============ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // CSS-only particle fallback (no Three.js dependency issues)
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const particles = Array.from({length: 55}, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.4 + 0.1,
    hue: Math.floor(Math.random() * 60) + 220,
  }));

  function drawHex(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha * 0.15;
    ctx.strokeStyle = `hsl(250,80%,70%)`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  const hexes = Array.from({length: 12}, () => ({
    x: Math.random() * W, y: Math.random() * H,
    size: Math.random() * 50 + 20,
    vx: (Math.random()-0.5)*0.15, vy: (Math.random()-0.5)*0.15,
    alpha: Math.random()*0.5+0.2,
  }));

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Hexagons
    hexes.forEach(h => {
      h.x += h.vx; h.y += h.vy;
      if (h.x < -100) h.x = W + 100;
      if (h.x > W + 100) h.x = -100;
      if (h.y < -100) h.y = H + 100;
      if (h.y > H + 100) h.y = -100;
      drawHex(h.x, h.y, h.size, h.alpha);
    });

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},75%,65%,${p.alpha})`;
      ctx.fill();
    });

    // Lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${(1 - dist/100) * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}
document.addEventListener('DOMContentLoaded', initHeroCanvas);

/* ============ PROJECT FILTERS ============ */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      projectItems.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}
document.addEventListener('DOMContentLoaded', initFilters);

/* ============ COUNTER ANIMATION ============ */
function animateCounters(root = document) {
  root.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}
document.querySelectorAll('.hero-stats, [data-counter-group]').forEach(counterSection => {
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters(counterSection);
      obs.disconnect();
    }
  }, { threshold: 0.35 });
  obs.observe(counterSection);
});

/* ============ TESTIMONIAL CAROUSEL ============ */
function initCarousel() {
  const carousel = document.querySelector('.lux-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.lux-carousel-track');
  const cards = Array.from(track?.children || []);
  const prev = carousel.querySelector('.lux-carousel-btn.prev');
  const next = carousel.querySelector('.lux-carousel-btn.next');
  if (!track || !cards.length || !prev || !next) return;

  let index = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1180) return 2;
    return 3;
  }

  function updateCarousel() {
    const visible = getVisibleCount();
    const maxIndex = Math.max(cards.length - visible, 0);
    index = Math.min(index, maxIndex);
    const offset = cards[0].offsetWidth + 17.6;
    track.style.transform = `translateX(-${index * offset}px)`;
    prev.disabled = index === 0;
    next.disabled = index >= maxIndex;
  }

  prev.addEventListener('click', () => {
    index = Math.max(index - 1, 0);
    updateCarousel();
  });

  next.addEventListener('click', () => {
    index += 1;
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}
document.addEventListener('DOMContentLoaded', initCarousel);

/* ============ WHATSAPP FORM ============ */
function initWhatsAppForm() {
  const form = document.querySelector('[data-whatsapp-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = data.get('name');
    const phone = data.get('phone');
    const service = data.get('service');
    const budget = data.get('budget');
    const message = data.get('message');

    const text = [
      'Hi SoftSiteSolutions,',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      `Budget: ${budget}`,
      `Project Details: ${message}`,
    ].join('\n');

    const url = `https://wa.me/918217354109?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
    if (window.showToast) {
      window.showToast('Opening WhatsApp with your project details...');
    }
  });
}
document.addEventListener('DOMContentLoaded', initWhatsAppForm);
