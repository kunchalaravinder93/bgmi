/* ═══════════════════════════════════════════
   COUNTDOWN TIMER
═══════════════════════════════════════════ */
(function() {
  // Target: Next Saturday, May 16, 2026 at 10:00 PM IST (Solo Match Start)
  const TARGET = new Date('2026-05-16T22:00:00+05:30').getTime();

  const days  = document.getElementById('cd-days');
  const hours = document.getElementById('cd-hours');
  const mins  = document.getElementById('cd-mins');
  const secs  = document.getElementById('cd-secs');

  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  function flip(el, newVal) {
    if (el.textContent === newVal) return;
    el.style.transform = 'rotateX(90deg)';
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = newVal;
      el.style.transition = 'none';
      el.style.transform = 'rotateX(-90deg)';
      el.style.opacity = '0';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          el.style.transform = 'rotateX(0deg)';
          el.style.opacity = '1';
        });
      });
    }, 150);
  }

  // Apply base transition style
  [days, hours, mins, secs].forEach(el => {
    if (el) {
      el.style.display = 'inline-block';
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }
  });

  function tick() {
    const now  = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
      if (days)  days.textContent = '00';
      if (hours) hours.textContent = '00';
      if (mins)  mins.textContent = '00';
      if (secs)  secs.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    // Initial update without flip for speed, then use flip
    if (!tick.initialized) {
      if (days)  days.textContent = pad(d);
      if (hours) hours.textContent = pad(h);
      if (mins)  mins.textContent = pad(m);
      if (secs)  secs.textContent = pad(s);
      tick.initialized = true;
    } else {
      if (days)  flip(days,  pad(d));
      if (hours) flip(hours, pad(h));
      if (mins)  flip(mins,  pad(m));
      if (secs)  flip(secs,  pad(s));
    }
  }

  // Ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      tick();
      setInterval(tick, 1000);
    });
  } else {
    tick();
    setInterval(tick, 1000);
  }
})();
