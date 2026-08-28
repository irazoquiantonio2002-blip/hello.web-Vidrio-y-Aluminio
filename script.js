(() => {
  'use strict';

  /* ===== Loader ===== */
  const loader = document.getElementById('loader');
  const ldFill = document.querySelector('.ld-fill');
  let progress = 0;
  const loadTimer = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadTimer);
      setTimeout(() => loader && loader.classList.add('done'), 250);
    }
    if (ldFill) ldFill.style.width = progress + '%';
  }, 140);

  /* ===== Nav scroll state ===== */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== Mobile menu ===== */
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  const toggleMenu = () => {
    const open = mob.classList.toggle('open');
    ham.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  ham && ham.addEventListener('click', toggleMenu);
  mob && mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mob.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
  }));

  /* ===== Scroll reveal ===== */
  const revEls = document.querySelectorAll('.rev');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revEls.forEach(el => io.observe(el));

  /* ===== Typewriter ===== */
  const twText = document.getElementById('twText');
  const twWords = ['Barandales de vidrio', 'Techos de vidrio y policarbonato', 'Ventanas y puertas de aluminio', 'Canceles de baño', 'Fachadas de vidrio'];
  if (twText) {
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = twWords[wi];
      if (!deleting) {
        ci++;
        twText.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        ci--;
        twText.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % twWords.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    };
    tick();
  }

  /* ===== Count-up stats ===== */
  const counters = document.querySelectorAll('[data-hero-count],[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.heroCount || el.dataset.count, 10);
    if (isNaN(target)) return;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countIo.observe(el));

  /* ===== Particle canvas ===== */
  function initParticles(canvas, opts = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const count = opts.count || 46;
    const color = opts.color || '95,168,245';

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    const makeParticles = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.5 + 0.15
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(() => { resize(); makeParticles(); });
    ro.observe(canvas);
    resize();
    makeParticles();
    draw();
  }
  initParticles(document.getElementById('pcanvas'), { count: 54 });
  initParticles(document.getElementById('pcanvasWhy'), { count: 34 });
  initParticles(document.getElementById('pcanvasGaleria'), { count: 34 });

  /* ===== Galería: ver más ===== */
  const verMasBtn = document.getElementById('galeriaVerMas');
  if (verMasBtn) {
    verMasBtn.addEventListener('click', () => {
      document.querySelectorAll('.brand-card--extra').forEach(card => {
        card.classList.remove('brand-card--extra');
        card.classList.add('in-view');
      });
      verMasBtn.remove();
    });
  }

  /* ===== Contact form -> WhatsApp ===== */
  const form = document.getElementById('cForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const nombre = form.nombre.value.trim();
      const telefono = form.telefono.value.trim();
      const tipo = form.tipo.value;
      const mensaje = form.mensaje.value.trim();

      let text = `Hola, me llamo ${nombre}. Quiero cotizar: ${tipo}.`;
      text += ` Mi teléfono es ${telefono}.`;
      if (mensaje) text += ` Detalles: ${mensaje}`;

      const url = `https://wa.me/526141691450?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();
