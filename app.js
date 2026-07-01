/* ═══════════════════════════════════════════════════════════════
   U CHANNEL — app.js
   Lenis · GSAP + ScrollTrigger · Three.js 3D Billboard
   Framer-like Motion Layer: spring physics · magnetic hover ·
   cursor tilt · scroll velocity skew · split-text · word reveals
   ═══════════════════════════════════════════════════════════════ */

/* ─── capability flags ──────────────────────────────────────── */
const HAS_GSAP  = typeof gsap !== 'undefined';
const HAS_ST    = typeof ScrollTrigger !== 'undefined';
const HAS_THREE = typeof THREE !== 'undefined';
const HAS_LENIS = typeof Lenis !== 'undefined';
const REDUCED   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ─── register GSAP plugins immediately ─────────────────────── */
if (HAS_GSAP && HAS_ST) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'expo.out', duration: 1.0 });
}

/* ─── Framer-like spring physics easing ─────────────────────── */
/* Replicates Framer Motion's spring() easing presets via cubic
   approximations. Used throughout for authentic spring feel.   */
const SPRING      = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // bouncy spring
const SPRING_SOFT = 'cubic-bezier(0.22, 1, 0.36, 1)';    // expo-like soft spring
const SPRING_SNAP = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // snappy back.out


/* ─────────────────────────────────────────────────────────────
   1. LENIS  ─  correct setup for native-document scroll
   Official pattern: https://lenis.darkroom.engineering

   DON'T use scrollerProxy for native scroll — that's only for
   scrollable *container* elements. Just wire lenis into GSAP's
   ticker and call ScrollTrigger.update on every scroll event.
   ───────────────────────────────────────────────────────────── */
let lenis = null;

function initLenis() {
  if (!HAS_LENIS || REDUCED) return;

  lenis = new Lenis({
    duration:        1.15,
    easing:          t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel:     true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8,
    infinite:        false,
  });

  /* wire Lenis into GSAP ticker — single RAF, perfect sync */
  if (HAS_GSAP) {
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* keep ScrollTrigger positions accurate */
  if (HAS_ST) {
    lenis.on('scroll', ScrollTrigger.update);
  }
}

/* helper: scrollTo target element or selector via Lenis / native */
function smoothScrollTo(target, offsetY = -80) {
  if (lenis) {
    lenis.scrollTo(target, { offset: offsetY, duration: 1.4 });
  } else if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offsetY, behavior: 'smooth' });
  } else if (target instanceof Element) {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offsetY, behavior: 'smooth' });
  }
}

/* ─────────────────────────────────────────────────────────────
   2. HEADER scroll state
   ───────────────────────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const update = () =>
    header.classList.toggle('scrolled', window.scrollY > 40);

  window.addEventListener('scroll', update, { passive: true });
  update();

  /* Framer-like header entrance — elements slide in from their edges */
  if (!HAS_GSAP || REDUCED) return;

  gsap.set('.logo-link',         { opacity: 0, x: -20 });
  gsap.set('.nav-list .nav-link',{ opacity: 0, y: -10 });
  gsap.set('.nav-cta',           { opacity: 0, x: 16, scale: 0.9 });

  const tl = gsap.timeline({ delay: 0.05 });
  tl.to('.logo-link', {
    opacity: 1, x: 0, duration: 0.65, ease: SPRING_SOFT,
  }, 0)
  .to('.nav-list .nav-link', {
    opacity: 1, y: 0,
    duration: 0.5, ease: SPRING,
    stagger: { amount: 0.2, from: 'start' },
  }, 0.12)
  .to('.nav-cta', {
    opacity: 1, x: 0, scale: 1,
    duration: 0.6, ease: SPRING,
  }, 0.28);
}

/* ─────────────────────────────────────────────────────────────
   3. HERO entrance animations — Framer-like split character reveal
   Each headline word slides up from a clipped overflow region
   with a spring overshoot, staggered per-character.
   ───────────────────────────────────────────────────────────── */
function splitTextToChars(el) {
  const html = el.innerHTML;
  // Preserve <br> and <span> tags, split only text nodes
  const fragment = document.createDocumentFragment();
  const temp = document.createElement('div');
  temp.innerHTML = html;

  function processNode(node, target) {
    if (node.nodeType === Node.TEXT_NODE) {
      const chars = node.textContent.split('');
      chars.forEach(ch => {
        if (ch === ' ') {
          target.appendChild(document.createTextNode('\u00a0'));
          return;
        }
        const span = document.createElement('span');
        span.className = 'char';
        span.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:bottom;';
        const inner = document.createElement('span');
        inner.className = 'char-inner';
        inner.textContent = ch;
        inner.style.cssText = 'display:inline-block;';
        span.appendChild(inner);
        target.appendChild(span);
      });
    } else {
      const clone = node.cloneNode(false);
      node.childNodes.forEach(child => processNode(child, clone));
      target.appendChild(clone);
    }
  }

  temp.childNodes.forEach(node => processNode(node, fragment));
  el.innerHTML = '';
  el.appendChild(fragment);
  return el.querySelectorAll('.char-inner');
}

function initHeroAnimations() {
  if (!HAS_GSAP || REDUCED) return;

  // Split the headline into individual characters
  const headline = document.querySelector('.hero-headline');
  let charEls = [];
  if (headline) {
    charEls = splitTextToChars(headline);
    gsap.set(charEls, { y: '110%', opacity: 0 });
  }

  gsap.set('.hero-eyebrow', { opacity: 0, y: 24, filter: 'blur(8px)' });
  gsap.set('.hero-sub',     { opacity: 0, y: 32 });
  gsap.set('.hero-actions > *', { opacity: 0, y: 20, scale: 0.94 });
  gsap.set('.scroll-indicator', { opacity: 0, x: -16 });

  const tl = gsap.timeline({ delay: 0.15 });

  // Eyebrow fades in with blur clearing — Framer's animate({ filter }) pattern
  tl.to('.hero-eyebrow', {
    opacity: 1, y: 0, filter: 'blur(0px)',
    duration: 0.7, ease: SPRING_SOFT,
  }, 0.05);

  // Headline: spring character cascade — core Framer split-text pattern
  if (charEls.length) {
    tl.to(charEls, {
      y: '0%', opacity: 1,
      duration: 0.75,
      ease: SPRING,
      stagger: { amount: 0.55, from: 'start' },
    }, 0.22);
  }

  // Sub copies in with gentle spring upward
  tl.to('.hero-sub', {
    opacity: 1, y: 0,
    duration: 0.8, ease: SPRING_SOFT,
  }, 0.58);

  // CTA buttons spring in with scale — Framer's whileInView scale pattern
  tl.to('.hero-actions > *', {
    opacity: 1, y: 0, scale: 1,
    duration: 0.65, ease: SPRING,
    stagger: 0.09,
  }, 0.72);

  // Scroll indicator slides in from left
  tl.to('.scroll-indicator', {
    opacity: 1, x: 0,
    duration: 0.6, ease: SPRING_SOFT,
  }, 0.9);
}

/* ─────────────────────────────────────────────────────────────
   4. HERO parallax
   ───────────────────────────────────────────────────────────── */
function initHeroParallax() {
  const bg = document.querySelector('.hero-bg-img');
  if (!bg || REDUCED) return;

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy > window.innerHeight) return;
    bg.style.transform = `translateY(${sy * 0.22}px)`;
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   5. Scroll reveals — Framer-like spring entrance
   ───────────────────────────────────────────────────────────── */
function initScrollReveals() {
  const els = document.querySelectorAll('.reveal-on-scroll');

  if (!HAS_GSAP || !HAS_ST || REDUCED) {
    els.forEach(el => (el.style.opacity = 1));
    return;
  }

  gsap.set(els, { opacity: 0, y: 48, scale: 0.97 });

  ScrollTrigger.batch(els, {
    onEnter: batch =>
      gsap.to(batch, {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.07, duration: 0.85,
        ease: SPRING_SOFT, overwrite: true,
      }),
    start: 'top 88%',
    once:  true,
  });
}

/* ─────────────────────────────────────────────────────────────
   6. Service cards — spring scale-up with stagger
   ───────────────────────────────────────────────────────────── */
function initServiceCards() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;

  gsap.set('.service-card', { opacity: 0, y: 60, scale: 0.93, rotateX: 8 });
  gsap.to('.service-card', {
    scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true },
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    stagger: { amount: 0.45, from: 'start' },
    duration: 0.8,
    ease: SPRING,
  });
}

/* ─────────────────────────────────────────────────────────────
   7. Work cards — spring reveal with slight rotation
   ───────────────────────────────────────────────────────────── */
function initWorkCards() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;

  gsap.set('.work-card', { opacity: 0, y: 56, scale: 0.95, rotateY: -4 });
  gsap.to('.work-card', {
    scrollTrigger: { trigger: '.work-grid', start: 'top 82%', once: true },
    opacity: 1, y: 0, scale: 1, rotateY: 0,
    stagger: 0.12, duration: 0.9,
    ease: SPRING,
  });
}

/* ─────────────────────────────────────────────────────────────
   8. Legacy section
   ───────────────────────────────────────────────────────────── */
function initLegacySection() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;

  gsap.timeline({
    scrollTrigger: { trigger: '.section-legacy', start: 'top 78%', once: true },
  })
    .from('.legacy-text .label-tag',       { opacity: 0, y: 20, duration: 0.8 }, 0)
    .from('.legacy-text .section-headline', { opacity: 0, y: 30, duration: 0.9 }, 0.12)
    .from('.legacy-text .body-text',        { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, 0.22)
    .from('.legacy-text .btn-text-link',    { opacity: 0, y: 16, duration: 0.7 }, 0.42)
    .from('.legacy-card-back',  { opacity: 0, x: 40, rotate: 8,  duration: 1.0 }, 0.18)
    .from('.legacy-card-mid',   { opacity: 0, x: 30, rotate: -4, duration: 1.0 }, 0.30)
    .from('.legacy-card-front', { opacity: 0, x: 20, y: 20,      duration: 1.0 }, 0.42);
}

/* ─────────────────────────────────────────────────────────────
   9. Stat counters
   ───────────────────────────────────────────────────────────── */
function initCounters() {
  const els = document.querySelectorAll('.stat-num[data-count]');
  if (!els.length) return;

  els.forEach(el => {
    const target  = parseFloat(el.dataset.count);
    const isFloat = target % 1 !== 0;
    let   done    = false;

    function run() {
      if (done) return; done = true;
      if (HAS_GSAP) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 2.0, ease: 'expo.out',
          onUpdate()  { el.textContent = isFloat ? obj.v.toFixed(1) : Math.floor(obj.v); },
          onComplete(){ el.textContent = isFloat ? target.toFixed(1) : String(target); },
        });
      } else {
        const t0 = performance.now();
        (function step(now) {
          const p = Math.min((now - t0) / 1800, 1);
          const e = 1 - Math.pow(2, -10 * p);
          el.textContent = isFloat ? (target * e).toFixed(1) : Math.floor(target * e);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = isFloat ? target.toFixed(1) : String(target);
        })(performance.now());
      }
    }

    if (HAS_GSAP && HAS_ST) {
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: run });
    } else {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { run(); obs.disconnect(); }
      }, { threshold: 0.4 });
      obs.observe(el);
    }
  });

  if (HAS_GSAP && HAS_ST && !REDUCED) {
    gsap.set('.stat-item', { opacity: 0, y: 28 });
    gsap.to('.stat-item', {
      scrollTrigger: { trigger: '.stats-bar', start: 'top 88%', once: true },
      opacity: 1, y: 0, stagger: 0.08, duration: 0.9,
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   10. Map section reveal
   ───────────────────────────────────────────────────────────── */
function initMapSection() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;

  gsap.set('.map-container', { opacity: 0, y: 36, scale: 0.98 });
  gsap.set('.map-pin',       { opacity: 0, scale: 0 });

  gsap.to('.map-container', {
    scrollTrigger: { trigger: '.map-container', start: 'top 82%', once: true },
    opacity: 1, y: 0, scale: 1, duration: 1.0,
  });
  gsap.to('.map-pin', {
    scrollTrigger: { trigger: '.map-container', start: 'top 74%', once: true },
    opacity: 1, scale: 1, stagger: 0.1, duration: 0.7,
    ease: 'back.out(1.7)', delay: 0.3,
  });
}

/* ─────────────────────────────────────────────────────────────
   11. Footer CTA
   ───────────────────────────────────────────────────────────── */
function initFooterCTA() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;

  gsap.timeline({
    scrollTrigger: { trigger: '.footer-cta-strip', start: 'top 82%', once: true },
  })
    .from('.footer-cta-headline', { opacity: 0, x: -36, duration: 1.0 }, 0)
    .from('.footer-cta-sub',      { opacity: 0, x: -28, duration: 0.9 }, 0.15)
    .from('.contact-form > *',    { opacity: 0, y: 20, stagger: 0.08, duration: 0.8 }, 0.2);
}

/* ─────────────────────────────────────────────────────────────
   12. Glass bars
   ───────────────────────────────────────────────────────────── */
function initGlassBars() {
  document.querySelectorAll('.glass-bar-fill').forEach(el => {
    const style = el.closest('[style]')?.getAttribute('style') || '';
    const match = style.match(/--fill:\s*([^;)"]+)/);
    const fill  = match ? match[1].trim() : '82%';

    if (HAS_GSAP) gsap.set(el, { width: 0 });
    else el.style.width = '0';

    if (HAS_GSAP && HAS_ST) {
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter() { gsap.to(el, { width: fill, duration: 1.6, ease: 'expo.out', delay: 0.3 }); },
      });
    } else {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { el.style.width = fill; obs.disconnect(); }
      }, { threshold: 0.4 });
      obs.observe(el);
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   13. Map pin interaction
   ───────────────────────────────────────────────────────────── */
function initMapInteraction() {
  const pins    = document.querySelectorAll('.map-pin');
  const tooltip = document.querySelector('.map-tooltip');
  if (!tooltip || !pins.length) return;

  const ttTitle    = tooltip.querySelector('.map-tooltip-title');
  const ttRes      = tooltip.querySelector('.val-resolution');
  const ttSlots    = tooltip.querySelector('.val-slots');
  const ttTraffic  = tooltip.querySelector('.val-traffic');
  const ttAudience = tooltip.querySelector('.val-audience');

  const db = {
    'edsa-ortigas': { title: 'EDSA — Ortigas Junction LED',     resolution: '4K Ultra-HD (P10 LED)',      slots: '8 Flexible Slots',             traffic: '380,000+ daily vehicles', audience: 'B2B Professionals & Commuters' },
    'bgc-lawton':   { title: 'BGC Lawton Ave Landmark LED',      resolution: 'Full HD Dual-Face (P8 LED)', slots: '10 Slots (Real-time trigger)',  traffic: '220,000+ daily vehicles', audience: 'Tech Employees & Premium Shoppers' },
    'makati-ave':   { title: 'Makati Ave Central Business LED',  resolution: 'Ultra-Bright P6 LED',        slots: '6 Slots (Custom intervals)',    traffic: '190,000+ daily',          audience: 'Corporate Decision-Makers & Executives' },
    'roxas-blvd':   { title: 'Roxas Blvd Coastal Highway LED',   resolution: 'Wide-Format HD (P10)',       slots: '8 Slots (Dynamic scheduling)', traffic: '290,000+ daily vehicles', audience: 'Tourists, Commuters & Travelers' },
    'cebu-it':      { title: 'Cebu IT Park Plaza Screen',        resolution: 'HD Portrait (P6)',           slots: '10 Slots (Instant scheduling)',traffic: '140,000+ daily foot',     audience: 'IT Professionals & Young Adults' },
    'davao-global': { title: 'Davao Global City Boulevard LED',  resolution: 'Ultra-HD Curved (P8)',       slots: '8 Slots (Programmable)',        traffic: '110,000+ daily vehicles', audience: 'Southern PH Hub Consumers' },
  };

  let first = true;

  function activatePin(pin) {
    pins.forEach(p => p.classList.remove('active'));
    pin.classList.add('active');
    const d = db[pin.dataset.id];
    if (!d) return;

    const populate = () => {
      ttTitle.textContent    = d.title;
      ttRes.textContent      = d.resolution;
      ttSlots.textContent    = d.slots;
      ttTraffic.textContent  = d.traffic;
      ttAudience.textContent = d.audience;
      tooltip.classList.add('active');
    };

    if (HAS_GSAP && !first) {
      gsap.to(tooltip, {
        opacity: 0, y: 6, duration: 0.15, ease: 'power2.in',
        onComplete() { populate(); gsap.to(tooltip, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' }); },
      });
    } else {
      populate();
    }
    first = false;
  }

  pins.forEach(pin => {
    pin.addEventListener('click', () => activatePin(pin));
    pin.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activatePin(pin); });
  });

  const def = document.querySelector('.map-pin[data-id="edsa-ortigas"]');
  if (def) setTimeout(() => activatePin(def), 600);
}

/* ─────────────────────────────────────────────────────────────
   14. Mobile menu
   ───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const drawer    = document.getElementById('mobile-drawer');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    drawer.setAttribute('aria-hidden', !isOpen);
    if (lenis) isOpen ? lenis.stop() : lenis.start();
    else document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      if (lenis) lenis.start();
      else document.body.style.overflow = '';
    })
  );
}

/* ─────────────────────────────────────────────────────────────
   15. Smooth anchor links
   ───────────────────────────────────────────────────────────── */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   16. Active nav highlight
   ───────────────────────────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const links    = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    sections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top <= 120 && r.bottom >= 120) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${s.id}`));
      }
    });
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   17. Contact form
   ───────────────────────────────────────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('quote-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const statusEl  = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;
    statusEl.textContent  = '';

    setTimeout(() => {
      submitBtn.textContent = 'Proposal Requested ✓';
      statusEl.textContent  = 'Thank you! A consultant will respond within 2 business hours.';
      if (HAS_GSAP) gsap.from(statusEl, { opacity: 0, y: 8, duration: 0.5 });
      form.reset();

      setTimeout(() => {
        submitBtn.textContent = 'Get My Custom Proposal';
        submitBtn.disabled    = false;
        if (HAS_GSAP) gsap.to(statusEl, { opacity: 0, duration: 0.4, onComplete() { statusEl.textContent = ''; gsap.set(statusEl, { opacity: 1 }); } });
        else statusEl.textContent = '';
      }, 9000);
    }, 1600);
  });
}

/* ─────────────────────────────────────────────────────────────
   18. Marquee reveal
   ───────────────────────────────────────────────────────────── */
function initMarquee() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;
  gsap.from('.clients-header', {
    scrollTrigger: { trigger: '.section-clients', start: 'top 85%', once: true },
    opacity: 0, y: 24, duration: 1.0,
  });
}

/* ─────────────────────────────────────────────────────────────
   19. THREE.JS 3D BILLBOARD — scroll-scrubbed via GSAP
   ───────────────────────────────────────────────────────────── */
function initBillboardModel() {
  if (!HAS_THREE || REDUCED) return;

  const canvas = document.getElementById('model-canvas');
  const stage  = document.getElementById('model-stage');
  if (!canvas || !stage) return;

  /* ── renderer ─────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace   = THREE.SRGBColorSpace;

  /* ── scene & camera ───────────────────────────────────── */
  const scene  = new THREE.Scene();
  scene.fog    = new THREE.FogExp2(0x05060f, 0.045);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0.3, 5.8);

  /* ── lights ───────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0x0e1025, 2.4));

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x2030c0, 0.7);
  fill.position.set(-5, 2, 3);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0x4050ff, 0.4);
  rim.position.set(0, -4, -5);
  scene.add(rim);

  const goldPt = new THREE.PointLight(0xc4a050, 5, 9);
  goldPt.position.set(0, 1.2, 2.5);
  scene.add(goldPt);

  /* ── procedural screen texture ────────────────────────── */
  const tc  = document.createElement('canvas');
  tc.width  = 1024;
  tc.height = 512;
  const cx  = tc.getContext('2d');

  // background
  const gbg = cx.createLinearGradient(0, 0, 0, 512);
  gbg.addColorStop(0, '#05060f');
  gbg.addColorStop(1, '#07081a');
  cx.fillStyle = gbg; cx.fillRect(0, 0, 1024, 512);

  // LED pixel grid
  cx.strokeStyle = 'rgba(196,160,80,0.07)'; cx.lineWidth = 0.7;
  for (let x = 0; x < 1024; x += 16) { cx.beginPath(); cx.moveTo(x,0); cx.lineTo(x,512); cx.stroke(); }
  for (let y = 0; y < 512;  y += 16) { cx.beginPath(); cx.moveTo(0,y); cx.lineTo(1024,y); cx.stroke(); }

  // centre radial glow
  const gg = cx.createRadialGradient(512,256,0, 512,256,390);
  gg.addColorStop(0,   'rgba(196,160,80,0.30)');
  gg.addColorStop(0.45,'rgba(70,40,200,0.14)');
  gg.addColorStop(1,   'rgba(0,0,0,0)');
  cx.fillStyle = gg; cx.fillRect(0,0,1024,512);

  // logotype
  cx.textAlign = 'center'; cx.textBaseline = 'middle';
  cx.font      = 'bold 96px sans-serif';
  cx.fillStyle = '#ffffff'; cx.globalAlpha = 0.94;
  cx.fillText('U CHANNEL', 512, 195);
  cx.font      = '34px sans-serif';
  cx.fillStyle = '#c4a050'; cx.globalAlpha = 0.88;
  cx.fillText('DIGITECH INNOVATION', 512, 300);
  cx.font      = '21px sans-serif';
  cx.fillStyle = 'rgba(255,255,255,0.42)'; cx.globalAlpha = 1;
  cx.fillText('EDSA ORTIGAS  ·  4K ULTRA-HD  ·  P10 LED', 512, 360);

  // scanlines
  for (let y = 0; y < 512; y += 4) { cx.fillStyle = 'rgba(0,0,0,0.055)'; cx.fillRect(0,y,1024,2); }

  const screenTex = new THREE.CanvasTexture(tc);

  /* ── materials ────────────────────────────────────────── */
  const matSteel = new THREE.MeshStandardMaterial({ color:0x181a2c, metalness:0.92, roughness:0.22 });
  const matFrame = new THREE.MeshStandardMaterial({ color:0x090a14, metalness:0.96, roughness:0.14 });
  const matScreen = new THREE.MeshStandardMaterial({
    map: screenTex, emissiveMap: screenTex,
    emissive: new THREE.Color(0x2818a0), emissiveIntensity: 0.6,
    metalness: 0.1, roughness: 0.55,
  });
  const matGold = new THREE.MeshStandardMaterial({
    color:0xc4a050, metalness:0.82, roughness:0.18,
    emissive: new THREE.Color(0xc4a050), emissiveIntensity: 0.45,
  });

  /* ── billboard group ──────────────────────────────────── */
  const board = new THREE.Group();
  scene.add(board);

  // screen panel — box with per-face materials [right,left,top,bottom,front,back]
  const PW=3.2, PH=1.72, PD=0.09;
  const panel = new THREE.Mesh(new THREE.BoxGeometry(PW,PH,PD),
    [matFrame,matFrame,matFrame,matFrame,matScreen,matFrame]);
  panel.position.y = 1.18;
  panel.castShadow = true;
  board.add(panel);

  // metallic outer frame bars
  const FT = 0.075;
  [
    {w:PW+FT*2, h:FT,   d:PD+0.025, x:0,          y: PH/2+FT/2,  z:0.01},
    {w:PW+FT*2, h:FT,   d:PD+0.025, x:0,          y:-PH/2-FT/2,  z:0.01},
    {w:FT,      h:PH,   d:PD+0.025, x:-PW/2-FT/2, y:0,           z:0.01},
    {w:FT,      h:PH,   d:PD+0.025, x: PW/2+FT/2, y:0,           z:0.01},
  ].forEach(({w,h,d,x,y,z}) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), matSteel);
    m.position.set(x, panel.position.y + y, z);
    board.add(m);
  });

  // gold emissive accent strip (bottom edge)
  const gs = new THREE.Mesh(new THREE.BoxGeometry(PW+FT*2, 0.028, PD+0.045), matGold);
  gs.position.set(0, panel.position.y - PH/2 - FT - 0.014, 0.018);
  board.add(gs);

  // support arm
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.11,0.55,0.11), matSteel);
  arm.position.set(0,0.52,-0.02); board.add(arm);

  // main column
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.065,0.1,2.1,20), matSteel);
  col.position.set(0,-0.82,-0.02); board.add(col);

  // base plate
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.55,0.065,0.44), matSteel);
  base.position.set(0,-1.96,-0.02); board.add(base);

  // ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(14,14),
    new THREE.MeshStandardMaterial({color:0x05060f,metalness:0.18,roughness:0.92})
  );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -2.0;
  ground.receiveShadow = true;
  scene.add(ground);

  // glow ring under base
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.14,1.1,56),
    new THREE.MeshStandardMaterial({
      color:0xc4a050, emissive: new THREE.Color(0xc4a050), emissiveIntensity:0.35,
      transparent:true, opacity:0.20, side:THREE.DoubleSide,
    })
  );
  ring.rotation.x = -Math.PI/2;
  ring.position.set(0,-1.98,-0.02);
  scene.add(ring);

  /* ── resize ───────────────────────────────────────────── */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── scroll-driven rotation via GSAP scrub ────────────── */
  // scrollData is mutated by GSAP and read every frame by the render loop
  const sd = { rotY: -0.7, lift: -0.18 };

  if (HAS_GSAP && HAS_ST) {
    gsap.to(sd, {
      rotY:  2.0,   // ~115° total sweep  (-40° → +75°)
      lift:  0.08,
      ease: 'none',
      scrollTrigger: {
        trigger:  stage,
        start:    'top top',
        end:      'bottom bottom',
        scrub:    1.5,          // lag factor — feels heavier/physical
      },
      onUpdate() {
        board.rotation.y = sd.rotY;
        board.position.y = sd.lift;
      },
    });
  }

  /* ── idle float animation ─────────────────────────────── */
  let ft = 0;

  /* ── render loop ──────────────────────────────────────── */
  function tick() {
    requestAnimationFrame(tick);
    ft += 0.011;

    // subtle breathe layered on top of scroll rotation
    board.position.y = sd.lift + Math.sin(ft) * 0.038;
    board.rotation.x = Math.sin(ft * 0.65) * 0.016;

    // pulsing gold glow
    goldPt.intensity = 4.2 + Math.sin(ft * 1.35) * 1.0;

    renderer.render(scene, camera);
  }
  tick();
}

/* ═══════════════════════════════════════════════════════════════
   INIT — order matters:
   1. Lenis (owns the RAF + scroll events)
   2. All GSAP ScrollTrigger setups (read Lenis scroll via closure)
   3. Three.js (own RAF, reads GSAP-mutated scrollData object)
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* — Lenis FIRST — everything else listens to its scroll events */
  initLenis();

  /* — GSAP animations — */
  initHeader();
  initHeroAnimations();
  initHeroParallax();
  initScrollReveals();
  initServiceCards();
  initWorkCards();
  initLegacySection();
  initCounters();
  initMapSection();
  initFooterCTA();
  initGlassBars();
  initMarquee();

  /* — Three.js 3D model — */
  initBillboardModel();

  /* — UI interactions — */
  initMapInteraction();
  initMobileMenu();
  initSmoothAnchors();
  initActiveNav();
  initContactForm();

  /* — Final ScrollTrigger refresh after layout is stable — */
  if (HAS_ST) {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }

  /* — Framer-like motion systems — */
  initSectionWordReveals();
  initMagneticHover();
  initCardTilt();

  initLabelTagReveals();
});

/* ═══════════════════════════════════════════════════════════════
   FRAMER-LIKE MOTION SYSTEMS
   ═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   A. Section headline word-split reveals
   Wraps each word in an overflow:hidden container and animates
   each word upward with spring stagger — Framer's "words" variant
   ───────────────────────────────────────────────────────────── */

function initSectionWordReveals() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;

  // Section headlines (excluding hero which has its own char animation)
  document.querySelectorAll('.section-headline').forEach(el => {
    // Split words
    const words = [];
    const temp = document.createElement('div');
    temp.innerHTML = el.innerHTML;
    const frag = document.createDocumentFragment();

    function wrapWords(node, target) {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach(part => {
          if (!part.trim()) { target.appendChild(document.createTextNode(part)); return; }
          const wrap = document.createElement('span');
          wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:0.08em;';
          const inner = document.createElement('span');
          inner.className = 'word-reveal';
          inner.textContent = part;
          inner.style.display = 'inline-block';
          wrap.appendChild(inner);
          target.appendChild(wrap);
          words.push(inner);
        });
      } else {
        const clone = node.cloneNode(false);
        node.childNodes.forEach(child => wrapWords(child, clone));
        target.appendChild(clone);
      }
    }

    temp.childNodes.forEach(n => wrapWords(n, frag));
    el.innerHTML = '';
    el.appendChild(frag);

    if (!words.length) return;

    gsap.set(words, { y: '105%', opacity: 0 });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(words, {
          y: '0%', opacity: 1,
          duration: 0.72,
          ease: SPRING,
          stagger: { amount: 0.35, from: 'start' },
        });
      },
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   B. Magnetic hover — nav CTA and primary/submit buttons
   Cursor proximity pulls the element toward the pointer.
   Matches Framer Motion's useMagneticHover pattern.
   ───────────────────────────────────────────────────────────── */
function initMagneticHover() {
  if (!HAS_GSAP || REDUCED) return;

  const magnetEls = document.querySelectorAll('.nav-cta, .btn-primary, .btn-submit, .btn-ghost');

  magnetEls.forEach(el => {
    const strength = 0.35; // pull strength (0 = none, 1 = follows fully)

    function onMove(e) {
      const r    = el.getBoundingClientRect();
      const cx   = r.left + r.width  / 2;
      const cy   = r.top  + r.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.4,
        ease: SPRING_SOFT,
        overwrite: 'auto',
      });
    }

    function onLeave() {
      gsap.to(el, {
        x: 0, y: 0,
        duration: 0.6,
        ease: SPRING,
        overwrite: 'auto',
      });
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
}

/* ─────────────────────────────────────────────────────────────
   C. Cursor-tracking 3D card tilt
   Service cards and work cards tilt in perspective to follow
   the cursor — Framer Motion's useMotionValue + rotateX/Y.
   Uses GSAP quickSetter for high-fps DOM mutations.
   ───────────────────────────────────────────────────────────── */
function initCardTilt() {
  if (!HAS_GSAP || REDUCED) return;

  const cards = document.querySelectorAll('.service-card, .work-card, .glass-card');

  cards.forEach(card => {
    const maxTilt = 9; // max degrees
    const glowEl  = document.createElement('div');
    glowEl.className = 'card-cursor-glow';
    glowEl.setAttribute('aria-hidden', 'true');
    glowEl.style.cssText = [
      'position:absolute',
      'inset:0',
      'border-radius:inherit',
      'opacity:0',
      'pointer-events:none',
      'transition:opacity 0.3s',
      'background:radial-gradient(200px circle at var(--mx,50%) var(--my,50%), rgba(61,126,255,0.12), transparent 70%)',
      'z-index:1',
    ].join(';');
    card.style.position = 'relative';
    card.appendChild(glowEl);

    const setRotX = gsap.quickSetter(card, 'rotateX', 'deg');
    const setRotY = gsap.quickSetter(card, 'rotateY', 'deg');

    card.addEventListener('mouseenter', () => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'none';
      glowEl.style.opacity = '1';
    });

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const nx = (e.clientX - r.left)  / r.width;   // 0–1
      const ny = (e.clientY - r.top)   / r.height;  // 0–1
      const rx = (ny - 0.5) * -maxTilt * 2;
      const ry = (nx - 0.5) *  maxTilt * 2;
      setRotX(rx);
      setRotY(ry);
      glowEl.style.setProperty('--mx', `${nx * 100}%`);
      glowEl.style.setProperty('--my', `${ny * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.6, ease: SPRING,
        overwrite: 'auto',
      });
      glowEl.style.opacity = '0';
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   E. Label tag staggered blur-clear reveals
   Each .label-tag fades in with a blur(8px)->blur(0) filter
   transition, replicating Framer's filter animation.
   ───────────────────────────────────────────────────────────── */
function initLabelTagReveals() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;

  const tags = document.querySelectorAll('.section-legacy .label-tag, .section-services .label-tag, .section-work .label-tag, .section-network .label-tag, .section-clients .label-tag');

  tags.forEach(tag => {
    gsap.set(tag, { opacity: 0, y: 12, filter: 'blur(6px)', scale: 0.92 });
    ScrollTrigger.create({
      trigger: tag,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.to(tag, {
          opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
          duration: 0.65, ease: SPRING,
        });
      },
    });
  });
}
