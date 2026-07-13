import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/* ─── register GSAP plugins immediately ─────────────────────── */
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'expo.out', duration: 1.0 });

/* ─── capability flags (always true with bundle imports) ────── */
const HAS_GSAP  = true;
const HAS_ST    = true;
const HAS_THREE = true;
const HAS_LENIS = true;
const REDUCED   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  gsap.set('.hamburger',         { opacity: 0, scale: 0.8 });

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
  }, 0.28)
  .to('.hamburger', {
    opacity: 1, scale: 1,
    duration: 0.5, ease: SPRING,
  }, 0.2);

  initNavHoverPill();
}

/* ─────────────────────────────────────────────────────────────
   2.b NAV hover pill — sliding glass background on menu items
   ───────────────────────────────────────────────────────────── */
function initNavHoverPill() {
  const navWrapper = document.querySelector('.nav-wrapper');
  const navLinks   = document.querySelectorAll('.nav-link');
  const hoverPill  = document.querySelector('.nav-hover-pill');
  if (!navWrapper || !hoverPill || !navLinks.length) return;

  const updatePillToActive = (immediate = false) => {
    const activeLink = navWrapper.querySelector('.nav-link.active');
    if (activeLink) {
      const wrapperRect = navWrapper.getBoundingClientRect();
      const linkRect    = activeLink.getBoundingClientRect();
      const left        = linkRect.left - wrapperRect.left;
      const width       = linkRect.width;

      gsap.to(hoverPill, {
        left,
        width,
        opacity: 1,
        duration: immediate ? 0 : 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    } else {
      gsap.to(hoverPill, {
        opacity: 0,
        width: 0,
        duration: immediate ? 0 : 0.25,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const wrapperRect = navWrapper.getBoundingClientRect();
      const linkRect    = link.getBoundingClientRect();
      const left        = linkRect.left - wrapperRect.left;
      const width       = linkRect.width;

      gsap.to(hoverPill, {
        left,
        width,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    link.addEventListener('mouseleave', () => {
      setTimeout(() => {
        const hovered = navWrapper.querySelector('.nav-link:hover');
        if (!hovered) {
          updatePillToActive();
        }
      }, 50);
    });
  });

  window.addEventListener('scroll', () => {
    if (!navWrapper.matches(':hover')) {
      updatePillToActive();
    }
  }, { passive: true });

  // Initial setup delay to let layout stabilize and active highlights trigger
  setTimeout(() => updatePillToActive(true), 250);
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
   18.b THREE.JS 3D HERO MODEL — Glass U CHANNEL & Glowing Neon Curves
   ───────────────────────────────────────────────────────────── */
function initHeroModel() {
  if (!HAS_THREE || REDUCED) return;

  const canvas = document.getElementById('hero-canvas');
  const wrapper = document.querySelector('.hero-canvas-wrapper');
  if (!canvas || !wrapper) return;

  /* ── renderer ─────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  /* ── scene & camera ───────────────────────────────────── */
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 4.8);

  /* ── lights ───────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(5, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x5856d6, 1.5);
  fillLight.position.set(-5, -2, 2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
  rimLight.position.set(0, 4, -4);
  scene.add(rimLight);

  const pointLight = new THREE.PointLight(0x3d7eff, 4, 10);
  pointLight.position.set(0, 0, 1);
  scene.add(pointLight);

  /* ── group ────────────────────────────────────────────── */
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  /* ── extruded U shape ─────────────────────────────────── */
  const shape = new THREE.Shape();
  shape.moveTo(-0.7, 0.9);
  shape.lineTo(-0.7, 0.0);
  shape.quadraticCurveTo(-0.7, -1.0, 0.0, -1.0);
  shape.quadraticCurveTo(0.7, -1.0, 0.7, 0.0);
  shape.lineTo(0.7, 0.9);
  shape.lineTo(0.35, 0.9);
  shape.lineTo(0.35, 0.0);
  shape.quadraticCurveTo(0.35, -0.62, 0.0, -0.62);
  shape.quadraticCurveTo(-0.35, -0.62, -0.35, 0.0);
  shape.lineTo(-0.35, 0.9);
  shape.closePath();

  const extrudeSettings = {
    depth: 0.24,
    bevelEnabled: true,
    bevelSegments: 7,
    steps: 2,
    bevelSize: 0.03,
    bevelThickness: 0.03
  };

  const uGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  uGeom.center();

  // Glass Material for the logo "U"
  const uMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.95,
    thickness: 0.8,
    ior: 1.52,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    attenuationColor: 0x1d5cff,
    attenuationDistance: 0.5,
    transparent: true
  });

  const uMesh = new THREE.Mesh(uGeom, uMat);
  uMesh.scale.setScalar(0.85);
  uMesh.position.set(0, 0.45, 0);
  heroGroup.add(uMesh);

  /* ── Letter Shapes for "CHANNEL" ──────────────────────── */
  const cShape = new THREE.Shape();
  cShape.moveTo(0.4, 0.5);
  cShape.lineTo(-0.4, 0.5);
  cShape.lineTo(-0.5, 0.4);
  cShape.lineTo(-0.5, -0.4);
  cShape.lineTo(-0.4, -0.5);
  cShape.lineTo(0.4, -0.5);
  cShape.lineTo(0.4, -0.2);
  cShape.lineTo(0.15, -0.2);
  cShape.lineTo(0.15, -0.25);
  cShape.lineTo(-0.15, -0.25);
  cShape.lineTo(-0.25, -0.15);
  cShape.lineTo(-0.25, 0.15);
  cShape.lineTo(-0.15, 0.25);
  cShape.lineTo(0.15, 0.25);
  cShape.lineTo(0.15, 0.2);
  cShape.lineTo(0.4, 0.2);
  cShape.closePath();

  const hShape = new THREE.Shape();
  hShape.moveTo(-0.5, 0.5);
  hShape.lineTo(-0.2, 0.5);
  hShape.lineTo(-0.2, 0.15);
  hShape.lineTo(0.2, 0.15);
  hShape.lineTo(0.2, 0.5);
  hShape.lineTo(0.5, 0.5);
  hShape.lineTo(0.5, -0.5);
  hShape.lineTo(0.2, -0.5);
  hShape.lineTo(0.2, -0.15);
  hShape.lineTo(-0.2, -0.15);
  hShape.lineTo(-0.2, -0.5);
  hShape.lineTo(-0.5, -0.5);
  hShape.closePath();

  const aShape = new THREE.Shape();
  aShape.moveTo(0.15, 0.5);
  aShape.lineTo(0.5, -0.5);
  aShape.lineTo(0.22, -0.5);
  aShape.lineTo(0.12, -0.15);
  aShape.lineTo(-0.12, -0.15);
  aShape.lineTo(-0.22, -0.5);
  aShape.lineTo(-0.5, -0.5);
  aShape.lineTo(-0.15, 0.5);
  aShape.closePath();

  const aHole = new THREE.Path();
  aHole.moveTo(0, 0.25);
  aHole.lineTo(-0.08, 0.05);
  aHole.lineTo(0.08, 0.05);
  aHole.closePath();
  aShape.holes.push(aHole);

  const nShape = new THREE.Shape();
  nShape.moveTo(-0.5, 0.5);
  nShape.lineTo(-0.2, 0.5);
  nShape.lineTo(0.25, -0.22);
  nShape.lineTo(0.25, 0.5);
  nShape.lineTo(0.5, 0.5);
  nShape.lineTo(0.5, -0.5);
  nShape.lineTo(0.2, -0.5);
  nShape.lineTo(-0.25, 0.22);
  nShape.lineTo(-0.25, -0.5);
  nShape.lineTo(-0.5, -0.5);
  nShape.closePath();

  const eShape = new THREE.Shape();
  eShape.moveTo(-0.5, 0.5);
  eShape.lineTo(0.5, 0.5);
  eShape.lineTo(0.5, 0.25);
  eShape.lineTo(-0.2, 0.25);
  eShape.lineTo(-0.2, 0.12);
  eShape.lineTo(0.4, 0.12);
  eShape.lineTo(0.4, -0.12);
  eShape.lineTo(-0.2, -0.12);
  eShape.lineTo(-0.2, -0.25);
  eShape.lineTo(0.5, -0.25);
  eShape.lineTo(0.5, -0.5);
  eShape.lineTo(-0.5, -0.5);
  eShape.closePath();

  const lShape = new THREE.Shape();
  lShape.moveTo(-0.5, 0.5);
  lShape.lineTo(-0.2, 0.5);
  lShape.lineTo(-0.2, -0.22);
  lShape.lineTo(0.5, -0.22);
  lShape.lineTo(0.5, -0.5);
  lShape.lineTo(-0.5, -0.5);
  lShape.closePath();

  const letterShapes = [cShape, hShape, aShape, nShape, nShape, eShape, lShape];

  // Letter extrude settings: slightly shallower for sharper look
  const letterExtrudeSettings = {
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015
  };

  // Slightly frosted white glass for legibility
  const letterMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.25,
    transmission: 0.85,
    thickness: 0.4,
    ior: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.15,
    attenuationColor: 0x3d7eff,
    attenuationDistance: 0.5,
    transparent: true
  });

  const letterScale = 0.4;
  const letterSpacing = 0.08;
  const totalWidth = (7 * letterScale) + (6 * letterSpacing);
  const startX = -totalWidth / 2 + letterScale / 2;

  letterShapes.forEach((shapeVal, idx) => {
    const geom = new THREE.ExtrudeGeometry(shapeVal, letterExtrudeSettings);
    geom.center();
    const mesh = new THREE.Mesh(geom, letterMat);
    mesh.scale.setScalar(letterScale);
    mesh.position.set(startX + idx * (letterScale + letterSpacing), -1.0, 0.08);
    heroGroup.add(mesh);
  });

  /* ── glowing neon backlight curves ─────────────────────── */
  const curvePoints1 = [
    new THREE.Vector3(-2.2, 0.8, -0.5),
    new THREE.Vector3(-1.0, -0.4, 0.1),
    new THREE.Vector3(0.0, 0.6, 0.4),
    new THREE.Vector3(1.0, -0.5, -0.2),
    new THREE.Vector3(2.2, 0.8, -0.5)
  ];

  const curvePoints2 = [
    new THREE.Vector3(-2.2, -0.8, -0.5),
    new THREE.Vector3(-1.2, 0.5, -0.2),
    new THREE.Vector3(0.0, -0.4, 0.3),
    new THREE.Vector3(1.2, 0.6, -0.1),
    new THREE.Vector3(2.2, -0.8, -0.5)
  ];

  const neonColors = [
    0x1d5cff, // Electric Blue
    0x7856ff  // Indigo/Violet
  ];

  const tubes = [];
  const tubeMaterials = [];

  [curvePoints1, curvePoints2].forEach((points, i) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeom = new THREE.TubeGeometry(curve, 90, 0.035, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: neonColors[i],
      emissive: neonColors[i],
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.2
    });
    const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
    heroGroup.add(tubeMesh);
    tubes.push(tubeMesh);
    tubeMaterials.push(tubeMat);
  });

  /* ── floating dust particles ──────────────────────────── */
  const particleCount = 120;
  const pGeom = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  const pVel = [];

  for (let k = 0; k < particleCount; k++) {
    const idx = k * 3;
    pPos[idx] = (Math.random() - 0.5) * 5;
    pPos[idx + 1] = (Math.random() - 0.5) * 4;
    pPos[idx + 2] = (Math.random() - 0.5) * 3;
    pVel.push({
      x: (Math.random() - 0.5) * 0.003,
      y: (Math.random() - 0.5) * 0.003,
      z: (Math.random() - 0.5) * 0.003
    });
  }
  pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x1d5cff,
    size: 0.035,
    transparent: true,
    opacity: 0.65,
    blending: THREE.NormalBlending
  });
  const pPoints = new THREE.Points(pGeom, pMat);
  scene.add(pPoints);

  /* ── resize handler ───────────────────────────────────── */
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

  /* ── mouse interactivity ──────────────────────────────── */
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  /* ── scroll-linked animations via GSAP ScrollTrigger ──── */
  const scrollObj = { rotY: 0, scale: 1, posZ: 0 };
  if (HAS_GSAP && HAS_ST) {
    gsap.to(scrollObj, {
      rotY: Math.PI * 1.5,
      scale: 0.8,
      posZ: -1.0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      },
      onUpdate() {
        heroGroup.rotation.y = scrollObj.rotY;
        heroGroup.scale.setScalar(scrollObj.scale);
        heroGroup.position.z = scrollObj.posZ;
      }
    });
  }

  /* ── animation loop ───────────────────────────────────── */
  let ft = 0;
  function tick() {
    requestAnimationFrame(tick);
    ft += 0.012;

    // Gentle hover float
    heroGroup.position.y = Math.sin(ft) * 0.06;
    heroGroup.rotation.z = Math.sin(ft * 0.5) * 0.025;

    // Mouse parallax tilt lerp
    const targetX = mouseY * 0.22;
    const targetY = mouseX * 0.22;
    heroGroup.rotation.x += (targetX - heroGroup.rotation.x) * 0.05;
    heroGroup.rotation.y += (targetY - heroGroup.rotation.y) * 0.05;

    // Pulse neon intensity
    for (let i = 0; i < 2; i++) {
      if (tubeMaterials[i]) {
        tubeMaterials[i].emissiveIntensity = 2.0 + Math.sin(ft * 1.5 + i * 0.5) * 0.6;
      }
    }

    // Update floating particles
    const posAttr = pGeom.attributes.position;
    for (let k = 0; k < particleCount; k++) {
      const idx = k * 3;
      posAttr.array[idx] += pVel[k].x;
      posAttr.array[idx + 1] += pVel[k].y;
      posAttr.array[idx + 2] += pVel[k].z;

      // boundaries wrapping
      if (Math.abs(posAttr.array[idx]) > 2.5) posAttr.array[idx] = -posAttr.array[idx];
      if (Math.abs(posAttr.array[idx + 1]) > 2.0) posAttr.array[idx + 1] = -posAttr.array[idx + 1];
      if (Math.abs(posAttr.array[idx + 2]) > 1.5) posAttr.array[idx + 2] = -posAttr.array[idx + 2];
    }
    posAttr.needsUpdate = true;

    renderer.render(scene, camera);
  }
  tick();
}

/* ─────────────────────────────────────────────────────────────
   19. INTERACTIVE BILLBOARD SHOWCASE (HTML/CSS & GSAP)
   ───────────────────────────────────────────────────────────── */
function initBillboardShowcase() {
  const showcaseSec = document.getElementById('model-showcase');
  const container   = document.querySelector('.billboard-container');
  const structure   = document.getElementById('billboard-structure');
  const frame       = document.querySelector('.billboard-frame');
  const slidesCont  = document.getElementById('slides-container');
  
  const btnDay      = document.getElementById('btn-day');
  const btnNight    = document.getElementById('btn-night');
  const tabs        = document.querySelectorAll('.campaign-tab');
  const slides      = document.querySelectorAll('.billboard-slide');

  if (!container || !structure) return;

  /* ─── Day/Night Switcher ─── */
  const setNightMode = (isNight) => {
    if (isNight) {
      if (btnDay) btnDay.classList.remove('active');
      if (btnNight) btnNight.classList.add('active');
      if (showcaseSec) showcaseSec.classList.add('night-mode-bg');
      container.classList.add('night-mode-active');
    } else {
      if (btnNight) btnNight.classList.remove('active');
      if (btnDay) btnDay.classList.add('active');
      if (showcaseSec) showcaseSec.classList.remove('night-mode-bg');
      container.classList.remove('night-mode-active');
    }
    // Refresh scrolltrigger since layout/background might shift slightly
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  };

  if (btnDay && btnNight) {
    btnDay.addEventListener('click', () => setNightMode(false));
    btnNight.addEventListener('click', () => setNightMode(true));
  }

  /* ─── Campaign Slider ─── */
  const selectCampaign = (index) => {
    tabs.forEach((t, idx) => t.classList.toggle('active', idx === index));
    
    // Animate slide translation
    if (HAS_GSAP && slidesCont) {
      gsap.to(slidesCont, {
        x: `-${index * 33.3333}%`,
        duration: 0.8,
        ease: 'power3.out'
      });
    } else if (slidesCont) {
      slidesCont.style.transform = `translateX(-${index * 33.3333}%)`;
    }

    // Update glowing backdrop color in night mode
    const activeSlide = slides[index];
    if (activeSlide && frame) {
      const glowColor = activeSlide.getAttribute('style').match(/--accent-glow:\s*([^;]+)/);
      if (glowColor && glowColor[1]) {
        frame.style.setProperty('--slide-glow', glowColor[1]);
      }
    }
  };

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => selectCampaign(idx));
  });

  // Set initial glow color based on the first slide
  if (slides[0] && frame) {
    const glowColor = slides[0].getAttribute('style').match(/--accent-glow:\s*([^;]+)/);
    if (glowColor && glowColor[1]) {
      frame.style.setProperty('--slide-glow', glowColor[1]);
    }
  }

  /* ─── Mouse-Tracking 3D Perspective Tilt ─── */
  if (REDUCED) return;

  const wrapper = document.querySelector('.billboard-structure-wrapper');
  if (!wrapper) return;

  const handleMouseMove = (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates from -1 to 1
    const nx = x / (rect.width / 2);
    const ny = y / (rect.height / 2);

    if (HAS_GSAP) {
      gsap.to(structure, {
        rotateY: nx * 14,  // sweep left/right
        rotateX: -ny * 10, // pitch up/down
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      
      // Subtly offset spec badges based on tilt to simulate parallax depth
      const badges = wrapper.querySelectorAll('.model-badge');
      badges.forEach((badge, i) => {
        const factor = (i % 2 === 0 ? 1 : -1) * 8;
        gsap.to(badge, {
          x: nx * factor,
          y: ny * factor,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    }
  };

  const handleMouseLeave = () => {
    if (HAS_GSAP) {
      gsap.to(structure, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      
      const badges = wrapper.querySelectorAll('.model-badge');
      badges.forEach((badge) => {
        gsap.to(badge, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    }
  };

  wrapper.addEventListener('mousemove', handleMouseMove, { passive: true });
  wrapper.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  // Optional: add a smooth entrance animation for the billboard structure
  if (HAS_GSAP && HAS_ST) {
    gsap.from(structure, {
      scrollTrigger: {
        trigger: showcaseSec,
        start: 'top 75%',
        once: true
      },
      opacity: 0,
      y: 40,
      rotateX: -10,
      duration: 1.2,
      ease: 'power3.out'
    });
  }
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

  /* — Three.js 3D models — */
  initHeroModel();

  /* — Interactive HTML/CSS Billboard — */
  initBillboardShowcase();

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
