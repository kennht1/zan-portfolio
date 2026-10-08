/* =========================================================
   Fauzan Naufal Satria — Portfolio
   script.js
   ========================================================= */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. Navbar — scrolled state
     --------------------------------------------------------- */
  const nav = document.getElementById('nav');

  function updateNavState() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }

  updateNavState();
  window.addEventListener('scroll', updateNavState, { passive: true });

  /* ---------------------------------------------------------
     2. Mobile menu
     --------------------------------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!menuBtn || !navLinks) return;
    navLinks.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
      if (!navLinks.classList.contains('open')) return;
      if (navLinks.contains(event.target) || menuBtn.contains(event.target)) return;
      closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* ---------------------------------------------------------
     3. Active nav link (scroll spy)
     --------------------------------------------------------- */
  const allNavLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links .nav-link')
  );

  const sections = allNavLinks
    .map(function (link) {
      const id = link.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActiveLink(id) {
    allNavLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const spyObserver = new IntersectionObserver(
      function (entries) {
        let bestEntry = null;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        });
        if (bestEntry) setActiveLink(bestEntry.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.15, 0.4, 0.75, 1] }
    );
    sections.forEach(function (section) { spyObserver.observe(section); });
  }

  /* ---------------------------------------------------------
     4. Scroll reveal
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------
     5. Terminal typewriter
     --------------------------------------------------------- */
  const typedEl = document.getElementById('typed');

  if (typedEl) {
    const commands = [
      'node server.js',
      'git commit -m "add chat endpoint"',
      'python monitor.py --host 8.8.8.8'
    ];

    if (prefersReducedMotion) {
      typedEl.textContent = commands[0];
    } else {
      let cmdIndex = 0;
      let charIndex = 0;
      let deleting = false;

      function typeLoop() {
        const current = commands[cmdIndex];
        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(typeLoop, 1700);
            return;
          }
          setTimeout(typeLoop, 62);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            cmdIndex = (cmdIndex + 1) % commands.length;
            setTimeout(typeLoop, 380);
            return;
          }
          setTimeout(typeLoop, 28);
        }
      }
      setTimeout(typeLoop, 900);
    }
  }

  /* ---------------------------------------------------------
     6. Subtle background animation
     --------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationId = null;
    let isRunning = true;

    function initParticles() {
      const count = Math.min(52, Math.max(18, Math.floor(width / 26)));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.3 + 0.7
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.11;
            ctx.strokeStyle = 'rgba(56, 189, 248, ' + alpha + ')';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = 'rgba(120, 190, 240, 0.30)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      if (!isRunning) return;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }
      draw();
      animationId = requestAnimationFrame(step);
    }

    function start() {
      if (isRunning) return;
      isRunning = true;
      animationId = requestAnimationFrame(step);
    }

    function stop() {
      isRunning = false;
      if (animationId) cancelAnimationFrame(animationId);
      animationId = null;
    }

    let resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resize(); draw(); }, 180);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    resize();
    start();
  }

  /* ---------------------------------------------------------
     7. Footer year
     --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();