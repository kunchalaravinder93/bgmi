/* ═══════════════════════════════════════════
   PARTICLE SYSTEM — Hero Background
═══════════════════════════════════════════ */

(function() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };

  const CONFIG = {
    count: 120,
    maxRadius: 2.5,
    minRadius: 0.4,
    speed: 0.4,
    connectionDist: 120,
    mouseRadius: 140,
    colors: ['#ff4500', '#ff6a2f', '#ff2200', '#ffffff', '#ff9966', '#00e5ff'],
    bgColor: 'rgba(6,8,16,1)',
  };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.radius = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
      const speed = (CONFIG.speed * 0.3) + Math.random() * CONFIG.speed;
      const angle = (Math.random() * Math.PI * 0.5) - Math.PI * 0.25 - Math.PI / 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 0.15 + Math.random() * 0.7;
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.life = 0;
      this.maxLife = 200 + Math.random() * 400;
      this.twinkle = Math.random() * Math.PI * 2;
    }
    update() {
      this.life++;
      this.twinkle += 0.04;
      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        this.x += (dx / dist) * force * 2.5;
        this.y += (dy / dist) * force * 2.5;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.life > this.maxLife) {
        this.reset();
      }
    }
    draw() {
      const flicker = 0.85 + Math.sin(this.twinkle) * 0.15;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(this.color, this.alpha * flicker);
      ctx.fill();
      // Glow for orange particles
      if (this.color === '#ff4500' || this.color === '#ff2200') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(this.color, this.alpha * 0.08 * flicker);
        ctx.fill();
      }
    }
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CONFIG.connectionDist) {
          const opacity = (1 - dist / CONFIG.connectionDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,69,0,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
    loop();
  }

  function loop() {
    ctx.fillStyle = CONFIG.bgColor;
    ctx.fillRect(0, 0, W, H);

    // Ambient glow spots
    const grad1 = ctx.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, W * 0.35);
    grad1.addColorStop(0, 'rgba(255,69,0,0.04)');
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, W, H);

    const grad2 = ctx.createRadialGradient(W * 0.8, H * 0.6, 0, W * 0.8, H * 0.6, W * 0.3);
    grad2.addColorStop(0, 'rgba(0,100,255,0.03)');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, W, H);

    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset(true));
  });

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.addEventListener('mouseleave', () => {
    mouse.x = -999; mouse.y = -999;
  });

  // Touch support
  document.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('load', init);
})();
