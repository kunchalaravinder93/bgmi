/* ═══════════════════════════════════════════
   UI INTERACTIONS
═══════════════════════════════════════════ */

/* ── Nav scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile menu ── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.querySelector('span:nth-child(1)').style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  burger.querySelector('span:nth-child(2)').style.opacity  = open ? '0' : '1';
  burger.querySelector('span:nth-child(3)').style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
  });
});

/* ── Intersection Observer — reveal on scroll ── */
const revealEls = document.querySelectorAll('.glass-card, .section-header, .timeline__step, .prize-card, .prize-extra-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = entry.target.style.transform.replace('translateY(30px)', 'translateY(0)');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.6s ease ${(i % 6) * 0.08}s, transform 0.6s ease ${(i % 6) * 0.08}s, border-color 0.3s, background 0.3s, box-shadow 0.3s`;
  observer.observe(el);
});

/* ── Testimonial Slider ── */
let testIndex = 0;
const track = document.getElementById('testTrack');
const dotsContainer = document.getElementById('sliderDots');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
const totalSlides = window.innerWidth <= 768 ? cards.length : Math.ceil(cards.length / 2);

function buildDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i+1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function goTo(idx) {
  testIndex = (idx + totalSlides) % totalSlides;
  if (!track) return;
  const cardW = cards[0] ? cards[0].offsetWidth + 24 : 0;
  const perView = window.innerWidth <= 768 ? 1 : 2;
  track.style.transform = `translateX(-${testIndex * cardW * perView / totalSlides * (totalSlides / Math.ceil(cards.length / perView))}px)`;
  // Simpler: just offset by index * (50% + gap)
  const pct = window.innerWidth <= 768 ? 100 : 50;
  track.style.transform = `translateX(-${testIndex * pct}%)`;
  dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === testIndex);
  });
}

window.slideTest = function(dir) { goTo(testIndex + dir); };

// Auto-advance
let autoSlide = setInterval(() => window.slideTest(1), 5000);
const slider = document.getElementById('testSlider');
if (slider) {
  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => window.slideTest(1), 5000);
  });
  // Touch swipe
  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) window.slideTest(dx < 0 ? 1 : -1);
  });
}

buildDots();

/* ── Registration form ── */
window.handleRegister = function(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '⏳ Submitting...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('regModal').classList.remove('hidden');
    e.target.reset();
    btn.textContent = '⚡ Register Squad Now';
    btn.disabled = false;
  }, 1400);
};

window.closeModal = function() {
  document.getElementById('regModal').classList.add('hidden');
};

// Close modal on backdrop click
document.getElementById('regModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ── Stats counter animation ── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1600;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statVals = document.querySelectorAll('.stat-val');
      statVals.forEach(el => {
        const text = el.textContent;
        if (text.includes('₹')) animateCounter(el, 50, 'L');
        else if (text === '128') animateCounter(el, 128, '');
        else if (text === '7') animateCounter(el, 7, '');
        const prefix = text.startsWith('₹') ? '₹' : '';
        if (prefix) {
          const orig = animateCounter;
          // re-do with prefix
          let start = 0;
          const duration = 1600;
          const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = `₹${Math.round(eased * 50)}L`;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

/* ── Prize pool counter ── */
const prizeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.prize-amount').forEach(el => {
        const text = el.textContent;
        const num = parseInt(text.replace(/[^\d]/g, ''));
        if (!num) return;
        let start = 0;
        const duration = 1200;
        const suffix = text.includes(',00,000') ? ',00,000' : '';
        const step = ts => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const e = 1 - Math.pow(1 - p, 3);
          const val = Math.round(e * num);
          // Format in Indian style
          el.textContent = `₹${val.toLocaleString('en-IN')}`;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      prizeObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const prizeSec = document.querySelector('.prizes');
if (prizeSec) prizeObserver.observe(prizeSec);

/* ── Active nav link highlighting ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ── Neon cursor trail (desktop only) ── */
if (window.innerWidth > 768) {
  const trail = [];
  const TRAIL_LENGTH = 8;
  for (let i = 0; i < TRAIL_LENGTH; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: ${6 - i * 0.5}px; height: ${6 - i * 0.5}px;
      background: rgba(255,69,0,${0.8 - i * 0.1});
      border-radius: 50%;
      transform: translate(-50%,-50%);
      transition: left ${i * 0.04}s ease, top ${i * 0.04}s ease;
      box-shadow: 0 0 ${4 + i}px rgba(255,69,0,0.4);
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }

  document.addEventListener('mousemove', e => {
    trail.forEach(dot => {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    });
  });
}

/* ── Keyboard nav ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

console.log('%c⬡ BGMI INFERNO CUP 2025', 'color:#ff4500;font-size:20px;font-weight:bold;font-family:monospace');
console.log('%cBuilt for the Indian BGMI community', 'color:#888;font-size:12px');
