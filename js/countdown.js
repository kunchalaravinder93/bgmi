/* ═══════════════════════════════════════════
   COUNTDOWN TIMER
═══════════════════════════════════════════ */
(function() {
  // Target: June 14, 2025 at 10:00 AM IST
  const TARGET = new Date('2025-06-14T10:00:00+05:30').getTime();

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
      [days, hours, mins, secs].forEach(el => { if (el) el.textContent = '00'; });
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (days)  flip(days,  pad(d));
    if (hours) flip(hours, pad(h));
    if (mins)  flip(mins,  pad(m));
    if (secs)  flip(secs,  pad(s));
  }

  tick();
  setInterval(tick, 1000);
})();
