/* ============================================================
   LATENTE v3 — main.js
   Nav · Menu · Audio · Video · Timeline reveal · Lightbox · Contadores · Reveal
============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  // ── BARRA DE PROGRESO ────────────────────────────────────
  const bar = document.getElementById('reading-progress');
  window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = (p * 100) + '%';
  }, { passive: true });

  // ── NAV ──────────────────────────────────────────────────
  const nav    = document.getElementById('nav');
  const label  = document.getElementById('nav-section-label');
  const cue    = document.getElementById('scroll-cue');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 50);
    if (cue) cue.style.opacity = window.scrollY > 80 ? '0' : '';
    document.querySelectorAll('.panel[data-section]').forEach(p => {
      const r = p.getBoundingClientRect();
      if (r.top <= 80 && r.bottom > 80) label.textContent = p.dataset.section || '';
    });
  }, { passive: true });

  // ── MENU ─────────────────────────────────────────────────
  const menuBtn  = document.getElementById('menu-btn');
  const overlay  = document.getElementById('menu-overlay');
  const closeBtn = document.getElementById('menu-close');

  const openMenu = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelectorAll('.menu-item').forEach((el, i) => {
      el.style.cssText = 'opacity:0;transform:translateY(18px)';
      setTimeout(() => {
        el.style.cssText = 'opacity:1;transform:none;transition:opacity .4s ease,transform .4s ease';
      }, 60 + i * 50);
    });
  };
  const closeMenu = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };

  menuBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeLightbox(); closeAllVideos(); } });
  overlay?.querySelectorAll('.menu-item').forEach(a => a.addEventListener('click', closeMenu));

  // ── PARALLAX PORTADA + HEROES ────────────────────────────
  gsap.to('.portada-bg', {
    yPercent: 25, ease: 'none',
    scrollTrigger: { trigger: '#portada', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });
  document.querySelectorAll('.art-hero-img-wrap').forEach(el => {
    gsap.to(el, {
      yPercent: 15, ease: 'none',
      scrollTrigger: { trigger: el.closest('.art-hero'), start: 'top top', end: 'bottom top', scrub: 2 }
    });
  });

  // ── HERO CONTENT STAGGER ─────────────────────────────────
  document.querySelectorAll('.art-hero').forEach(hero => {
    const els = hero.querySelectorAll('.art-kicker,.art-titulo,.art-sub,.art-lugar');
    gsap.from(els, {
      opacity: 0, y: 28, stagger: 0.1, duration: 0.85, ease: 'power2.out',
      scrollTrigger: { trigger: hero, start: 'top 85%' }
    });
  });

  // ── REVEAL ON SCROLL ─────────────────────────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Marcar elementos de content-blk como reveal con delay escalonado
  document.querySelectorAll('.content-blk .inner > *:not(.reveal)').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min(i * 0.06, 0.35) + 's';
    io.observe(el);
  });

  // ── TIMELINE: reveal items al hacer scroll ───────────────
  const tlIO = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('tl-vis'), idx * 80);
        tlIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.tl-item').forEach(el => tlIO.observe(el));

  // ── CONTADORES ───────────────────────────────────────────
  const cntIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target);
        cntIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.dato-n[data-target]').forEach(el => cntIO.observe(el));

  function animCount(el) {
    const target = +el.dataset.target;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const t0 = performance.now();
    const run = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }

  // ── AUDIO ────────────────────────────────────────────────
  let currentAudio = null;

  window.toggleAudio = function(cardId) {
    const card = document.getElementById(cardId);
    const audio = document.getElementById(cardId + '-src');
    if (!card || !audio) return;

    const iPlay  = card.querySelector('.ico-play');
    const iPause = card.querySelector('.ico-pause');

    // Parar audio anterior
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      document.querySelectorAll('.apc.playing').forEach(c => {
        c.classList.remove('playing');
        const p = c.querySelector('.ico-play');  const pa = c.querySelector('.ico-pause');
        if (p) p.style.display = ''; if (pa) pa.style.display = 'none';
      });
    }

    if (audio.paused) {
      audio.play().catch(() => {
        // Archivo no encontrado aún — feedback visual
        card.style.borderColor = 'rgba(225,163,53,.8)';
        card.title = 'Archivo no encontrado: ' + (audio.querySelector('source')?.src || '');
        setTimeout(() => { card.style.borderColor = ''; card.title = ''; }, 2500);
      });
      card.classList.add('playing');
      if (iPlay) iPlay.style.display = 'none';
      if (iPause) iPause.style.display = '';
      currentAudio = audio;
    } else {
      audio.pause();
      card.classList.remove('playing');
      if (iPlay) iPlay.style.display = '';
      if (iPause) iPause.style.display = 'none';
      currentAudio = null;
    }
  };

  // ── VIDEO YOUTUBE ─────────────────────────────────────────
  window.openVideo = function(url, vecId) {
    const player = document.getElementById(vecId + '-player');
    const iframe = document.getElementById(vecId + '-iframe');
    if (!player || !iframe) return;
    iframe.src = url;
    player.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeVideo = function(vecId) {
    const player = document.getElementById(vecId + '-player');
    const iframe = document.getElementById(vecId + '-iframe');
    if (!player || !iframe) return;
    iframe.src = '';
    player.style.display = 'none';
    document.body.style.overflow = '';
  };

  function closeAllVideos() {
    document.querySelectorAll('.vec-player').forEach(p => {
      if (p.style.display !== 'none') {
        const iframe = p.querySelector('iframe');
        if (iframe) iframe.src = '';
        p.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // ── VIDEO PROPIO MP4 ──────────────────────────────────────
  window.toggleVideoPropio = function(cardId) {
    const card  = document.getElementById(cardId);
    const video = document.getElementById(cardId + '-src');
    const iPlay  = card?.querySelector('.ico-play');
    const iPause = card?.querySelector('.ico-pause');
    if (!card || !video) return;

    video.style.display = 'block';
    if (video.paused) {
      video.play().catch(() => {
        card.style.borderColor = 'rgba(225,163,53,.8)';
        setTimeout(() => card.style.borderColor = '', 2500);
      });
      card.classList.add('playing');
      if (iPlay) iPlay.style.display = 'none';
      if (iPause) iPause.style.display = '';
    } else {
      video.pause();
      card.classList.remove('playing');
      if (iPlay) iPlay.style.display = '';
      if (iPause) iPause.style.display = 'none';
    }
  };

  // ── TIMELINE HOTSPOT ─────────────────────────────────────
  window.togglePanel = function(id) {
    document.getElementById(id)?.classList.toggle('open');
  };

  // ── GLOSARIO FLIP ────────────────────────────────────────
  window.flipCard = function(el) { el.classList.toggle('flipped'); };

  // ── LIGHTBOX ─────────────────────────────────────────────
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbCap   = document.getElementById('lb-caption');
  let lbImages  = [];   // colección de imágenes de la timeline activa
  let lbIndex   = 0;

  window.openLightbox = function(src, caption) {
    // Recopilar todas las imágenes de la misma sección
    const allBtns = [...document.querySelectorAll('.tl-img-btn')];
    lbImages = allBtns.map(btn => {
      const match = btn.getAttribute('onclick').match(/openLightbox\('([^']+)',\s*'([^']+)'\)/);
      return match ? { src: match[1], cap: match[2] } : null;
    }).filter(Boolean);
    lbIndex  = lbImages.findIndex(i => i.src === src);

    setLbImage(lbImages[lbIndex] || { src, cap: caption });
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    lb?.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.lbNav = function(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    setLbImage(lbImages[lbIndex]);
  };

  function setLbImage({ src, cap }) {
    // Mostrar placeholder mientras carga
    lbImg.style.opacity = '0';
    lbImg.src = src;
    lbImg.alt = cap;
    lbCap.textContent = cap;
    lbImg.onload  = () => { lbImg.style.transition = 'opacity .3s'; lbImg.style.opacity = '1'; };
    lbImg.onerror = () => {
      // Si el archivo no existe aún, mostrar placeholder
      lbImg.style.opacity = '0';
      lbCap.textContent = cap + ' — (imagen no cargada aún: ' + src + ')';
    };
  }

  // Navegar con teclado en lightbox
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  });

  // ── SMOOTH SCROLL ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
    });
  });

  console.log('LATENTE v3 — Cargado ✓');
});

/* ── PERSONAS CAMINANDO (canvas) ───────────────────────────── */
(function() {
  const canvas = document.getElementById('personas-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let raf = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  || 700;
    canvas.height = rect.height || 260;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  const COLORS = [
    'rgba(163,0,15,.78)','rgba(140,0,12,.62)','rgba(90,70,110,.58)',
    'rgba(163,0,15,.68)','rgba(70,55,90,.52)','rgba(163,0,15,.72)',
    'rgba(110,80,130,.5)','rgba(163,0,15,.58)'
  ];

  const figures = Array.from({length: 9}, (_, i) => ({
    x: 90 + i * 115 + ((i * 37) % 55),
    scale: 0.72 + (i % 5) * 0.08,
    speed: 0.38 + (i % 4) * 0.07,
    color: COLORS[i % COLORS.length],
    phase: (i * 1.3) % (Math.PI * 2),
  }));

  function drawPerson(x, y, scale, color, t) {
    const bob  = Math.sin(t * 3.5) * 1.8;
    const leg1 = Math.sin(t * 5)   * 13;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(0, -80, 9, 0, 6.283); ctx.fill();
    ctx.fillRect(-5, -71, 10, 28);
    ctx.globalAlpha = 0.8; ctx.fillRect(-13, -64, 26, 6); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(-4, -43); ctx.rotate(leg1 * 0.01745);
    ctx.fillRect(-3, 0, 6, 38); ctx.restore();
    ctx.save(); ctx.translate(4,  -43); ctx.rotate(-leg1 * 0.01745);
    ctx.fillRect(-3, 0, 6, 38); ctx.restore();
    ctx.restore();
  }

  let t = 0;
  function animate() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#09090f'); sky.addColorStop(1, '#150f12');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

    const mg = ctx.createRadialGradient(w * 0.84, h * 0.2, 0, w * 0.84, h * 0.2, 60);
    mg.addColorStop(0, 'rgba(225,163,53,.16)'); mg.addColorStop(1, 'rgba(225,163,53,0)');
    ctx.fillStyle = mg; ctx.fillRect(0, 0, w, h);

    const gnd = h - 28;
    const bldgData = [
      [0,100],[48,82],[76,62],[98,92],[140,67],[156,48],[172,78],[210,104],
      [258,72],[274,52],[292,54],[316,82],[358,68],[406,42],[420,78],[454,98],
      [506,57],[526,82],[558,108],[614,62],[630,46],[642,72],[680,82],[728,57],
      [750,92],[794,70],[812,50],[826,72],[862,92]
    ];
    const scaleX = w / 900;
    bldgData.forEach(([bx, gap]) => {
      const bh = (gap / 200) * h + 18;
      const bw = (18 + (bx % 14)) * scaleX;
      ctx.fillStyle = '#181822';
      ctx.fillRect(bx * scaleX, gnd - bh, bw, bh);
      if ((bx * scaleX + bw) > w) {
        ctx.fillRect(0, gnd - bh, (bx * scaleX + bw) - w, bh);
      }
    });

    ctx.fillStyle = '#0e0e14'; ctx.fillRect(0, gnd, w, 28);
    ctx.fillStyle = 'rgba(60,40,70,.3)'; ctx.fillRect(0, gnd, w, 1);

    figures.forEach(fig => {
      drawPerson(fig.x, gnd, fig.scale, fig.color, t + fig.phase);
      fig.x -= fig.speed;
      if (fig.x < -60) fig.x = w + 60;
    });

    t += 0.016;
    raf = requestAnimationFrame(animate);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { if (!raf) animate(); }
      else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    });
  }, { threshold: 0.1 });
  obs.observe(canvas.parentElement);
})();

/* ── TUNEL TOGGLE ───────────────────────────────────────────── */
window.toggleTunel = function() {
  const card = document.getElementById('apc-sub-video');
  const vis  = document.getElementById('tunel-vis');
  const iP   = card && card.querySelector('.ico-play');
  const iPa  = card && card.querySelector('.ico-pause');
  if (!vis) return;
  const show = vis.style.display !== 'block';
  vis.style.display = show ? 'block' : 'none';
  if (card) card.classList.toggle('playing', show);
  if (iP)  iP.style.display  = show ? 'none' : '';
  if (iPa) iPa.style.display = show ? '' : 'none';
};

/* ── TYPEWRITER — Señor barrios ─────────────────────────────── */
(function() {
  const anm = document.querySelector('.senor-anm');
  if (!anm) return;
  const tw  = anm.querySelector('.tw-text');
  const cur = anm.querySelector('.tw-cursor');
  if (!tw) return;
  const text = tw.dataset.text || '';
  let started = false;

  function type() {
    let i = 0;
    tw.textContent = '';
    function next() {
      if (i < text.length) {
        tw.textContent += text[i++];
        setTimeout(next, 28 + ((Math.random() * 18) | 0));
      } else if (cur) {
        setTimeout(() => { cur.style.animation = 'none'; cur.style.opacity = '0'; }, 1400);
      }
    }
    next();
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) { started = true; type(); io.disconnect(); }
    });
  }, { threshold: 0.45 });
  io.observe(anm);
})();

/* ── VIDEO AUTOPLAY ON SCROLL ───────────────────────────────── */
(function() {
  const videos = [
    { id: 'flauta-video', threshold: 0.3 },
    { id: 'rolo-video',   threshold: 0.25 }
  ];
  videos.forEach(function(cfg) {
    const vid = document.getElementById(cfg.id);
    if (!vid) return;
    const io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { vid.play(); } else { vid.pause(); }
      });
    }, { threshold: cfg.threshold });
    io.observe(vid);
  });
})();

/* ── BARRIOS SWIPER INIT ─────────────────────────────────────── */
(function() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.barrios-swiper', {
    loop: true,
    spaceBetween: 20,
    slidesPerView: 1,
    pagination: { el: '.barrios-pagination', clickable: true },
    navigation: { nextEl: '.barrios-next', prevEl: '.barrios-prev' },
    breakpoints: {
      640:  { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 24 }
    }
  });
})();

/* ── SERVICE WORKER (PWA) ──────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW registrado:', reg.scope))
      .catch(err => console.warn('SW error:', err));
  });
}