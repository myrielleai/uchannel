import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import React from 'react';
import { createRoot } from 'react-dom/client';
import AdvertisingSolutions from './src/components/AdvertisingSolutions';
import AboutSection from './src/components/AboutSection';


/* ─── register GSAP plugins immediately ─────────────────────── */
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'expo.out', duration: 1.0 });

/* ─── capability flags (always true with bundle imports) ────── */
const HAS_GSAP  = true;
const HAS_ST    = true;
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
    duration:        0.9,
    easing:          t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel:     true,
    wheelMultiplier: 1.1,
    touchMultiplier: 1.4,
    infinite:        false,
  });

  window.lenis = lenis;

  /* wire Lenis into GSAP ticker — single RAF, perfect sync */
  if (HAS_GSAP) {
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing to prevent scroll/animation desync and stuttering
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
function initHeader(playTimeline = true) {
  const header = document.getElementById('site-header');
  if (!header) return null;

  let lastScrollY = window.scrollY;
  let isHovered = false;
  let isHeaderHidden = false;

  // Create hover zone dynamically if it doesn't exist
  let hoverZone = document.getElementById('navbar-hover-zone');
  if (!hoverZone) {
    hoverZone = document.createElement('div');
    hoverZone.id = 'navbar-hover-zone';
    document.body.appendChild(hoverZone);
  }

  const showHeader = () => {
    if (isHeaderHidden) {
      header.classList.remove('nav-hidden');
      isHeaderHidden = false;
    }
  };

  const hideHeader = () => {
    const hamburger = document.getElementById('hamburger-btn');
    const isMobileMenuOpen = hamburger && hamburger.classList.contains('open');
    if (!isHeaderHidden && !isHovered && !isMobileMenuOpen) {
      header.classList.add('nav-hidden');
      isHeaderHidden = true;
    }
  };

  const update = () => {
    const currentScrollY = window.scrollY;
    header.classList.toggle('scrolled', currentScrollY > 40);

    const delta = currentScrollY - lastScrollY;
    if (Math.abs(delta) < 8) return;

    const isScrollingDown = delta > 0;

    if (currentScrollY < 50) {
      showHeader();
    } else if (isHovered) {
      showHeader();
    } else if (isScrollingDown) {
      if (currentScrollY > 120) {
        hideHeader();
      }
    } else {
      // Scrolling up
      showHeader();
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();

  const onMouseEnter = () => {
    isHovered = true;
    showHeader();
  };

  const onMouseLeave = () => {
    isHovered = false;
    if (window.scrollY > 120) {
      hideHeader();
    }
  };

  header.addEventListener('mouseenter', onMouseEnter);
  header.addEventListener('mouseleave', onMouseLeave);
  hoverZone.addEventListener('mouseenter', onMouseEnter);
  hoverZone.addEventListener('mouseleave', onMouseLeave);

  /* Framer-like header entrance — elements slide in from their edges */
  if (!HAS_GSAP || REDUCED) return null;

  gsap.set('.logo-link',         { opacity: 0, x: -20 });
  gsap.set('.nav-list .nav-link',{ opacity: 0, y: -10 });
  gsap.set('.nav-cta',           { opacity: 0, x: 16, scale: 0.9 });
  gsap.set('.hamburger',         { opacity: 0, scale: 0.8 });

  const runTimeline = () => {
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
  };

  if (playTimeline) {
    runTimeline();
  }

  initNavHoverPill();

  return runTimeline;
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

  // Create a MutationObserver to update the active nav pill position only when class attributes change
  // (e.g. when IntersectionObserver triggers a class change) instead of on every raw scroll tick.
  const activeClassObserver = new MutationObserver(() => {
    if (!navWrapper.matches(':hover')) {
      updatePillToActive();
    }
  });

  navLinks.forEach(link => {
    activeClassObserver.observe(link, { attributes: true, attributeFilter: ['class'] });
  });

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
      const parts = node.textContent.split(/(\s+)/);
      parts.forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          // It's whitespace, just append a space text node
          target.appendChild(document.createTextNode(' '));
        } else {
          // It's a word, wrap it in a word span to prevent wrapping inside the word
          const wordSpan = document.createElement('span');
          wordSpan.className = 'word';
          wordSpan.style.cssText = 'display:inline-block; white-space:nowrap;';
          
          const chars = part.split('');
          chars.forEach(ch => {
            const span = document.createElement('span');
            span.className = 'char';
            span.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:bottom;';
            const inner = document.createElement('span');
            inner.className = 'char-inner';
            inner.textContent = ch;
            inner.style.cssText = 'display:inline-block;';
            span.appendChild(inner);
            wordSpan.appendChild(span);
          });
          target.appendChild(wordSpan);
        }
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

function initHeroAnimations(playTimeline = true) {
  const headline = document.querySelector('.step-1-title');
  const tagline = document.querySelector('.hero-led-tagline');
  const body = document.querySelector('.hero-led-body');
  const ctaGroup = document.querySelector('.hero-cta-group');
  const wrapper = document.querySelector('.hero-content-wrapper');

  if (HAS_GSAP) {
    if (headline) gsap.set(headline, { opacity: 1, y: 0, scale: 1 });
    if (tagline) gsap.set(tagline, { opacity: 1, y: 0, scale: 1 });
    if (body) gsap.set(body, { opacity: 1, y: 0, scale: 1 });
    if (ctaGroup) gsap.set(ctaGroup, { opacity: 1, y: 0, scale: 1 });
    if (wrapper) gsap.set(wrapper, { opacity: 1, y: 0, scale: 1 });
  }

  return () => {};
}

/* ─────────────────────────────────────────────────────────────
   4. HERO sticky scroll transition
   ───────────────────────────────────────────────────────────── */
function initHeroStickyScroll() {
  // Native CSS sticky scroll is active. No JS scroll animation required.
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
        ease: SPRING_SOFT, overwrite: 'auto',
      }),
    onEnterBack: batch =>
      gsap.to(batch, {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.07, duration: 0.85,
        ease: SPRING_SOFT, overwrite: 'auto',
      }),
    start: 'top 92%',
    once: true,
  });

  // IntersectionObserver safety net: guarantees visibility if ScrollTrigger calculation is delayed by dynamic React layout mounts
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: SPRING_SOFT,
              overwrite: 'auto',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.05 }
    );

    els.forEach(el => observer.observe(el));
  }
}

/* ─────────────────────────────────────────────────────────────
   5.b About section mounting (React + GSAP ScrollTrigger)
   ───────────────────────────────────────────────────────────── */
function initAboutSection() {
  const container = document.getElementById('about-section-root');
  if (container) {
    const root = createRoot(container);
    root.render(React.createElement(AboutSection));
  }
}

/* ─────────────────────────────────────────────────────────────
   6. Service cards — spring scale-up with stagger
   ───────────────────────────────────────────────────────────── */
function initServiceCards() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;
  if (!document.querySelector('.services-grid')) return;

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
   6.b Services Sticky Scroll
   ───────────────────────────────────────────────────────────── */
function initServicesStickyScroll() {
  const section = document.querySelector('.section-services');
  const track = document.querySelector('.services-stack-wrapper');
  if (!section || !track) return;

  const cards = document.querySelectorAll('.service-stack-card');
  if (!cards.length) return;

  if (!HAS_GSAP || !HAS_ST || REDUCED) {
    // If no GSAP or reduced motion is active, we just rely on standard scroll.
    // CSS handles layouts natively.
    return;
  }

  // Set up horizontal scroll using GSAP MatchMedia for responsiveness
  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    // Total translation amount is the scrollable horizontal track width minus window size
    const getScrollAmount = () => track.scrollWidth - window.innerWidth;

    const horizontalTween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        invalidateOnRefresh: true,
      }
    });

    // Animate card contents (fade & slide elements in from the right) as they enter view
    cards.forEach((card) => {
      const textElements = card.querySelectorAll('.card-text-content > *');
      const visualElement = card.querySelector('.card-visual');

      if (textElements.length) {
        gsap.from(textElements, {
          opacity: 0,
          x: 40,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: "left 85%",
            end: "left 50%",
            scrub: 1,
          }
        });
      }

      if (visualElement) {
        gsap.from(visualElement, {
          opacity: 0.3,
          scale: 0.95,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: "left 85%",
            end: "left 50%",
            scrub: 1,
          }
        });
      }
    });

    return () => {
      // Clean up inline styles on track when screen resized below 992px
      gsap.set(track, { clearProps: "all" });
    };
  });
}

/* ─────────────────────────────────────────────────────────────
   6.c Capabilities Pinned Horizontal Scroll on Vertical Page Scroll
   ───────────────────────────────────────────────────────────── */
function initCapabilitiesStack() {
  const section = document.getElementById('hero-step-3');
  const track = document.getElementById('services-carousel-track');
  if (!section || !track) return;

  if (!HAS_GSAP || !HAS_ST || REDUCED) return;

  const wrapper = track.parentElement;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    const getScrollAmount = () => {
      return Math.max(0, track.scrollWidth - wrapper.clientWidth);
    };

    gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${getScrollAmount() + 400}`,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      gsap.set(track, { clearProps: "all" });
    };
  });

  mm.add("(max-width: 767px)", () => {
    track.style.overflowX = 'auto';
    track.style.scrollBehavior = 'smooth';
    track.style.scrollSnapType = 'x mandatory';
  });
}

/* ─────────────────────────────────────────────────────────────
   7. Work cards — spring reveal with slight rotation
   ───────────────────────────────────────────────────────────── */
function initWorkCards() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;
  if (!document.querySelector('.work-card') || !document.querySelector('.work-grid')) return;

  gsap.set('.work-card', { opacity: 0, y: 56, scale: 0.95, rotateY: -4 });
  gsap.to('.work-card', {
    scrollTrigger: { trigger: '.work-grid', start: 'top 82%', once: true },
    opacity: 1, y: 0, scale: 1, rotateY: 0,
    stagger: 0.12, duration: 0.9,
    ease: SPRING,
  });
}

function initFooterCTA() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;
  if (!document.querySelector('.footer-cta-strip')) return;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.footer-cta-strip', start: 'top 82%', once: true },
  });
  if (document.querySelector('.footer-cta-headline')) {
    tl.from('.footer-cta-headline', { opacity: 0, x: -36, duration: 1.0 }, 0);
  }
  if (document.querySelector('.footer-cta-sub')) {
    tl.from('.footer-cta-sub', { opacity: 0, x: -28, duration: 0.9 }, 0.15);
  }
  if (document.querySelector('.footer-contact-info .contact-item')) {
    tl.from('.footer-contact-info .contact-item', { opacity: 0, y: 15, stagger: 0.08, duration: 0.8 }, 0.25);
  }
  if (document.querySelector('.contact-form > *')) {
    tl.from('.contact-form > *', { opacity: 0, y: 20, stagger: 0.08, duration: 0.8 }, 0.2);
  }
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

  if (!sections.length || !links.length) return;

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  } else {
    // Light fallback with animation frame throttling
    let scrollTimeout;
    const handleScroll = () => {
      sections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top <= 120 && r.bottom >= 120) {
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${s.id}`));
        }
      });
    };
    window.addEventListener('scroll', () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(handleScroll);
    }, { passive: true });
  }
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
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled    = false;
        if (HAS_GSAP) gsap.to(statusEl, { opacity: 0, duration: 0.4, onComplete() { statusEl.textContent = ''; gsap.set(statusEl, { opacity: 1 }); } });
        else statusEl.textContent = '';
      }, 9000);
    }, 1600);
  });
}

/* ─────────────────────────────────────────────────────────────
   18. Marquee reveal (Deprecated: Client list moved to zoomed monitor screen showcase)
   ───────────────────────────────────────────────────────────── */
function initMarquee() {
  // Client marquee is now integrated dynamically inside the zoomed monitor screen.
}


/* ─────────────────────────────────────────────────────────────
   19. INTERACTIVE BILLBOARD SHOWCASE (HTML/CSS & GSAP)
   ───────────────────────────────────────────────────────────── */
function initBillboardShowcase() {
  const showcaseSec = document.getElementById('model-showcase');
  const container   = document.querySelector('.billboard-container');
  const structure   = document.getElementById('billboard-structure');
  const flipper     = document.getElementById('billboard-flipper');

  if (!container || !structure) return;

  // Programmatic video autoplay initialization
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.play().catch(err => {
      console.warn("Video autoplay blocked, waiting for user interaction:", err);
    });
  });

  /* ─── Pinned Scroll-Driven 3D Screen Flip ─── */
  if (HAS_GSAP && HAS_ST && !REDUCED && flipper && showcaseSec) {
    const wrapper = document.querySelector('.billboard-structure-wrapper');
    const badges  = wrapper ? wrapper.querySelectorAll('.model-badge') : [];

    const flipTl = gsap.timeline({
      scrollTrigger: {
        trigger: showcaseSec,
        pin: true,
        start: 'top top',
        end: '+=1100',
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // 1. Initial 3D depth perspective & subtle scaling
    flipTl.fromTo(structure,
      { scale: 0.92, rotateX: 6 },
      { scale: 1, rotateX: 0, ease: 'power1.out', duration: 0.3 }
    );

    // 2. Smooth 180-degree LED screen flip
    flipTl.to(flipper, {
      rotateY: 180,
      ease: 'power2.inOut',
      duration: 1.4
    }, 0.2);

    // 3. Spec badges float & scale pulse during flip
    if (badges.length) {
      flipTl.to(badges, {
        scale: 1.08,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
      }, 0.5);
    }

    // 4. Final hold effect after flip completes
    flipTl.to(structure, {
      scale: 1.02,
      ease: 'power1.out',
      duration: 0.3
    }, 1.6);
  }

  /* ─── Mouse-Tracking 3D Perspective Tilt ─── */
  if (REDUCED) return;

  const wrapper = document.querySelector('.billboard-structure-wrapper');
  if (!wrapper) return;
  const badges = wrapper.querySelectorAll('.model-badge');

  let wrapperRect = null;
  let enterScrollX = 0;
  let enterScrollY = 0;
  let rotateYTo = null;
  let rotateXTo = null;
  let badgeXTos = [];
  let badgeYTos = [];

  const handleMouseEnter = () => {
    wrapperRect = wrapper.getBoundingClientRect();
    enterScrollX = window.scrollX;
    enterScrollY = window.scrollY;
    if (structure) {
      structure.style.willChange = 'transform';
      
      if (HAS_GSAP && !rotateYTo) {
        rotateYTo = gsap.quickTo(structure, 'rotateY', { duration: 0.5, ease: 'power2.out' });
        rotateXTo = gsap.quickTo(structure, 'rotateX', { duration: 0.5, ease: 'power2.out' });
        
        badges.forEach((badge) => {
          badgeXTos.push(gsap.quickTo(badge, 'x', { duration: 0.6, ease: 'power2.out' }));
          badgeYTos.push(gsap.quickTo(badge, 'y', { duration: 0.6, ease: 'power2.out' }));
        });
      }
    }
  };

  let billboardTicking = false;
  const handleMouseMove = (e) => {
    if (!wrapperRect) {
      wrapperRect = wrapper.getBoundingClientRect();
      enterScrollX = window.scrollX;
      enterScrollY = window.scrollY;
    }
    const dx = window.scrollX - enterScrollX;
    const dy = window.scrollY - enterScrollY;
    
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (!billboardTicking) {
      requestAnimationFrame(() => {
        if (!wrapperRect) { billboardTicking = false; return; }
        const x = clientX - (wrapperRect.left - dx) - wrapperRect.width / 2;
        const y = clientY - (wrapperRect.top - dy) - wrapperRect.height / 2;
        
        const nx = x / (wrapperRect.width / 2);
        const ny = y / (wrapperRect.height / 2);

        if (HAS_GSAP && rotateYTo && rotateXTo) {
          rotateYTo(nx * 14);  // sweep left/right
          rotateXTo(-ny * 10); // pitch up/down
          
          badges.forEach((badge, i) => {
            const factor = (i % 2 === 0 ? 1 : -1) * 8;
            if (badgeXTos[i] && badgeYTos[i]) {
              badgeXTos[i](nx * factor);
              badgeYTos[i](ny * factor);
            }
          });
        }
        billboardTicking = false;
      });
      billboardTicking = true;
    }
  };

  const handleMouseLeave = () => {
    wrapperRect = null;
    if (HAS_GSAP) {
      gsap.to(structure, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete() {
          if (structure) {
            structure.style.willChange = 'auto';
          }
        }
      });
      
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

  wrapper.addEventListener('mouseenter', handleMouseEnter, { passive: true });
  wrapper.addEventListener('mousemove', handleMouseMove, { passive: true });
  wrapper.addEventListener('mouseleave', handleMouseLeave, { passive: true });
}

function initAdvertisingSolutions() {
  const container = document.getElementById('advertising-solutions-root');
  if (container) {
    const root = createRoot(container);
    root.render(React.createElement(AdvertisingSolutions));
  }
}

/* ═══════════════════════════════════════════════════════════════
   INIT — order matters:
   1. Lenis (owns the RAF + scroll events)
   2. All GSAP ScrollTrigger setups (read Lenis scroll via closure)
   3. Three.js (own RAF, reads GSAP-mutated scrollData object)
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Mount React Advertising Solutions component
  initAdvertisingSolutions();

  // Initialize Lenis first – it will be idle while preloader is active.
  initLenis();


  // Prepare main page entrance animations but DO NOT play them yet.
  const headerRun = initHeader(false); // returns a function to run the header timeline
  const heroRun = initHeroAnimations(false); // returns a function to run the hero timeline

  // ---------- PRELOADER LOGIC ----------
  const preloaderEl = document.getElementById('preloader');
  if (!preloaderEl) {
    // Fallback: if preloader markup missing, just run main animations.
    if (headerRun) headerRun();
    if (heroRun) heroRun();
    // Continue with other init calls.
    initHeroStickyScroll();
    initScrollReveals();
    initAboutSection();
    initServiceCards();
    initServicesStickyScroll();
    initCapabilitiesStack();
    initWorkCards();
    initFocusGallery();
    initFooterCTA();
    initGlassBars();
    initBillboardShowcase();
    initMobileMenu();
    initSmoothAnchors();
    initActiveNav();
    initContactForm();
    if (HAS_ST) {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
    initSectionWordReveals();
    initMagneticHover();
    initCardTilt();
    initLabelTagReveals();
    initLocationsRibbon();
    initLocationModal();
    initCollapsibleSubcategories();
    return;
  }

  // Accessibility Check: REDUCED motion fallback
  if (REDUCED) {
    gsap.set('.preloader-tagline', { opacity: 1, y: 0 });
    gsap.set('.preloader-word-seen', { opacity: 1, y: 0, scale: 1 });
    
    gsap.timeline({
      onComplete: () => {
        // Simple fade reveal for accessibility
        gsap.to(preloaderEl, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            preloaderEl.style.display = 'none';
            if (headerRun) headerRun();
            if (heroRun) heroRun();
          }
        });
      }
    }).to({}, { duration: 1.0 });
    return;
  }

  // --- PREMIUM PRELOADER SEQUENCE ---
  // Set initial tagline and "seen." states
  gsap.set('.preloader-tagline', { opacity: 0, y: 20 });
  gsap.set('.preloader-word-seen', { opacity: 0, y: 15, scale: 0.85, filter: 'blur(4px)' });

  // Intro Timeline: Fade-in and slide-up tagline text, then reveal "seen." after a few milliseconds
  const introTL = gsap.timeline({ defaults: { ease: 'power2.out' } });
  introTL.to('.preloader-tagline', { opacity: 1, y: 0, duration: 0.8 });
  introTL.to('.preloader-word-seen', { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: 'blur(0px)', 
    duration: 0.6, 
    ease: 'back.out(1.8)' 
  }, '+=0.35'); // Delay of 350ms before "seen." animates in

  // Preloader Timer Timeline (keeps preloader visible)
  const progressTL = gsap.timeline({
    onComplete: () => {
      runExitTransition();
    }
  });

  // Hold loading view for 1.95 seconds to let the staggered animation settle
  progressTL.to({}, { duration: 1.95 });

  // Master timeline to coordinate initial draws and progress
  const masterTL = gsap.timeline();
  masterTL.add(introTL, 0).add(progressTL, 0);

  // Curtain parting exit transition
  function runExitTransition() {
    const exitTL = gsap.timeline({
      onComplete: () => {
        preloaderEl.style.display = 'none';
        if (headerRun) headerRun();
        if (heroRun) heroRun();
      }
    });

    exitTL
      // Fade and slide out tagline, ambient glow, and LED overlay
      .to('.preloader-wrapper, .preloader-ambient-glow, .preloader-grid-overlay', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power2.inOut'
      }, 0)
      // Slide the background panel up to reveal the site underneath
      .to('.preloader-bg', {
        yPercent: -100,
        duration: 0.85,
        ease: 'power3.inOut'
      }, 0.05)
      // Fade out the main preloader layer
      .to(preloaderEl, {
        opacity: 0,
        duration: 0.45
      }, '-=0.45');
  }

  // ---------- CONTINUE OTHER PAGE INIT ----------
  initHeroStickyScroll();
  initScrollReveals();
  initAboutSection();
  initServiceCards();
  initServicesStickyScroll();
  initCapabilitiesStack();
  initWorkCards();
  initFocusGallery();
  initFooterCTA();
  initGlassBars();
  initBillboardShowcase();
  initMobileMenu();
  initSmoothAnchors();
  initActiveNav();
  initContactForm();

  // Final ScrollTrigger refresh after layout is stable + staggered refreshes for async React components
  if (HAS_ST) {
    [50, 200, 600, 1500].forEach(delay => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, delay);
    });
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  initSectionWordReveals();
  initMagneticHover();
  initCardTilt();
  initLabelTagReveals();
  initLocationsRibbon();
  initLocationModal();
  initCollapsibleSubcategories();
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
    if (el.dataset.wordRevealsInitialized) return;
    el.dataset.wordRevealsInitialized = 'true';
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
  // Magnetic hover disabled to keep buttons stationary on hover
  return;
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
    const maxTilt = 8;
    const targetEl = card.querySelector('.glow-content') || card;

    const setRotX = gsap.quickSetter(targetEl, 'rotateX', 'deg');
    const setRotY = gsap.quickSetter(targetEl, 'rotateY', 'deg');

    let rect = null;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
      targetEl.style.willChange = 'transform';
    });

    let tiltTicking = false;
    let cardMX = 0;
    let cardMY = 0;
    card.addEventListener('mousemove', e => {
      if (!rect) rect = card.getBoundingClientRect();
      cardMX = e.clientX - rect.left;
      cardMY = e.clientY - rect.top;

      if (!tiltTicking) {
        requestAnimationFrame(() => {
          if (!rect) { tiltTicking = false; return; }
          const nx = cardMX / rect.width;
          const ny = cardMY / rect.height;
          const rx = (ny - 0.5) * -maxTilt * 2;
          const ry = (nx - 0.5) *  maxTilt * 2;
          
          setRotX(rx);
          setRotY(ry);
          tiltTicking = false;
        });
        tiltTicking = true;
      }
    });

    card.addEventListener('mouseleave', () => {
      rect = null;
      gsap.to(targetEl, {
        rotateX: 0, rotateY: 0,
        duration: 0.5, ease: 'power2.out',
        onComplete() {
          targetEl.style.willChange = 'auto';
        }
      });
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

  const tags = document.querySelectorAll('.hero-step .label-tag, .section-work .label-tag, .section-clients .label-tag');

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

/* ─────────────────────────────────────────────────────────────
   F. Focus Gallery Scroll & Active Category Tracker
   ───────────────────────────────────────────────────────────── */
function initFocusGallery() {
  const categoryBlocks = document.querySelectorAll('.focus-category-block');
  const navBtns = document.querySelectorAll('.focus-nav-btn');

  if (!categoryBlocks.length) return;

  // IntersectionObserver to highlight active category block and nav pill
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          categoryBlocks.forEach(b => b.classList.remove('is-focused'));
          entry.target.classList.add('is-focused');

          const region = entry.target.getAttribute('data-region');
          navBtns.forEach(btn => {
            const target = btn.getAttribute('data-target');
            btn.classList.toggle('active', target === `focus-${region}`);
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.2
    });

    categoryBlocks.forEach(block => observer.observe(block));
  }

  // Smooth click jump for focus nav buttons
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          smoothScrollTo(targetEl, -100);
        }
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   G. Infinite Locations Text Ribbon Loop
   Mathematically exact 0-jump seamless infinite scrolling ribbon
   Optimized for 60-120 FPS with pre-baked glyph caching, direct matrix transforms & layer slice blitting
   ───────────────────────────────────────────────────────────── */
function initLocationsRibbon() {
  const container = document.querySelector('.locations-ribbon-wrapper');
  if (!container) return;

  const canvas = document.getElementById('locations-ribbon-canvas') || container.querySelector('canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Front canvas for the middle ribbon band (renders ON TOP of the map)
  const canvasFront = document.getElementById('locations-ribbon-canvas-front');
  const ctxFront = canvasFront ? canvasFront.getContext('2d', { alpha: true }) : null;

  const pathD = "M-98 194C260 326 450 318 770 294 1010 262 1200 182 1430 150 1530 134 1631 129 1718 202.8 1810 289 1810 438 1540 510 1190 606 810 470 430 550 251 590 140 670 160 790 192 910 308 917 410 926 530 934 620 918 790 886 943 854 1100 806 1240 790 1500 750 1720 774 2120 945";

  let path2D = null;
  if (typeof Path2D !== 'undefined') {
    path2D = new Path2D(pathD);
  }

  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathEl.setAttribute('d', pathD);
  const totalLength = pathEl.getTotalLength ? pathEl.getTotalLength() : 3500;

  const STEP = 2; // sample point every 2px for smooth curve layout
  const numSamples = Math.ceil(totalLength / STEP);
  // Store x, y, cos(angle), sin(angle) in a typed Float32Array
  const samples = new Float32Array(numSamples * 4);

  for (let i = 0; i < numSamples; i++) {
    const len = i * STEP;
    const p1 = pathEl.getPointAtLength(len);
    const p2 = pathEl.getPointAtLength(Math.min(totalLength, len + 2));
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    samples[i * 4] = p1.x;
    samples[i * 4 + 1] = p1.y;
    samples[i * 4 + 2] = Math.cos(angle);
    samples[i * 4 + 3] = Math.sin(angle);
  }

  const unitText = "OUR LOCATIONS ACROSS THE PHILIPPINES — LUZON — VISAYAS — MINDANAO — ";

  let charOffsets = null;
  let unitLength = 0;
  let animId = null;
  let isRibbonVisible = true;
  let offset = 0;
  let lastTime = 0;
  let glyphCache = null;

  // Middle band Y range in viewBox coordinates (where ribbon crosses the map center)
  const MIDDLE_BAND_TOP = 340;
  const MIDDLE_BAND_BOTTOM = 660;

  // Build offscreen glyph cache atlas for ultra-fast GPU text rendering
  const buildGlyphCache = (dpr) => {
    const cache = {};
    const fontStr = '900 88px Satoshi, system-ui, -apple-system, sans-serif';

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = fontStr;

    const uniqueChars = Array.from(new Set(unitText));

    uniqueChars.forEach(ch => {
      const textMetrics = tempCtx.measureText(ch);
      const fontSize = 88;
      const pad = 30; // padding in viewBox units
      const viewBoxW = textMetrics.width + pad * 2;
      const viewBoxH = fontSize * 1.6 + pad * 2;

      const pxW = Math.ceil(viewBoxW * dpr);
      const pxH = Math.ceil(viewBoxH * dpr);

      const offCanvas = document.createElement('canvas');
      offCanvas.width = pxW;
      offCanvas.height = pxH;
      const oCtx = offCanvas.getContext('2d');

      oCtx.scale(dpr, dpr);
      oCtx.font = fontStr;
      oCtx.textAlign = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.lineWidth = 6;
      oCtx.strokeStyle = '#020617';
      oCtx.fillStyle = '#ffffff';

      const centerX = viewBoxW / 2;
      const centerY = viewBoxH / 2;

      oCtx.strokeText(ch, centerX, centerY);
      oCtx.fillText(ch, centerX, centerY);

      cache[ch] = {
        canvas: offCanvas,
        viewBoxW: viewBoxW,
        viewBoxH: viewBoxH,
        centerX: centerX,
        centerY: centerY,
        advanceWidth: textMetrics.width
      };
    });

    return cache;
  };

  const setupDimensionsAndMetrics = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const viewBoxWidth = 1920;
    const viewBoxHeight = 1080;

    const width = container.clientWidth || window.innerWidth;
    const height = Math.round(width * (viewBoxHeight / viewBoxWidth));

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Setup front canvas to match
    if (canvasFront) {
      canvasFront.width = width * dpr;
      canvasFront.height = height * dpr;
      canvasFront.style.width = width + 'px';
      canvasFront.style.height = height + 'px';
    }

    glyphCache = buildGlyphCache(dpr);

    charOffsets = new Float32Array(unitText.length + 1);
    let currentX = 0;
    const letterSpacing = 8;

    for (let i = 0; i < unitText.length; i++) {
      charOffsets[i] = currentX;
      const charWidth = glyphCache[unitText[i]] ? glyphCache[unitText[i]].advanceWidth : 40;
      currentX += charWidth + letterSpacing;
    }
    charOffsets[unitText.length] = currentX;
    unitLength = currentX;
  };

  const renderFrame = (now) => {
    if (!lastTime) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (!REDUCED && unitLength > 0) {
      offset = (offset + 85 * dt) % unitLength;
    }

    const viewBoxWidth = 1920;
    const viewBoxHeight = 1080;
    const scale = canvas.width / viewBoxWidth; // converts viewBox space (1920) to physical canvas pixels

    // 1. Clear Back Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Wavy Ribbon Base Path with Dynamic Rainbow Gradient
    const hueShift = (now * 0.04) % 360;
    const rainbowGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    rainbowGradient.addColorStop(0.00, `hsl(${hueShift % 360}, 100%, 55%)`);
    rainbowGradient.addColorStop(0.16, `hsl(${(hueShift + 60) % 360}, 100%, 55%)`);
    rainbowGradient.addColorStop(0.33, `hsl(${(hueShift + 120) % 360}, 100%, 55%)`);
    rainbowGradient.addColorStop(0.50, `hsl(${(hueShift + 180) % 360}, 100%, 55%)`);
    rainbowGradient.addColorStop(0.66, `hsl(${(hueShift + 240) % 360}, 100%, 55%)`);
    rainbowGradient.addColorStop(0.83, `hsl(${(hueShift + 300) % 360}, 100%, 55%)`);
    rainbowGradient.addColorStop(1.00, `hsl(${(hueShift + 360) % 360}, 100%, 55%)`);

    if (path2D) {
      ctx.save();
      ctx.scale(scale, scale);
      ctx.lineWidth = 180;
      ctx.strokeStyle = rainbowGradient;
      ctx.stroke(path2D);
      ctx.restore();
    }

    // 3. Draw Pre-rendered Text Glyphs along curve (Ultra-fast GPU textured blit)
    if (unitLength > 0 && glyphCache) {
      const numRepeats = Math.ceil((totalLength + unitLength) / unitLength) + 1;

      for (let r = 0; r < numRepeats; r++) {
        const baseDistance = r * unitLength - offset;

        for (let c = 0; c < unitText.length; c++) {
          const charDistance = baseDistance + charOffsets[c];
          if (charDistance < -60 || charDistance > totalLength + 60) continue;

          const sampleIdx = Math.floor(charDistance / STEP);
          if (sampleIdx < 0 || sampleIdx >= numSamples) continue;

          const idx = sampleIdx * 4;
          const x = samples[idx];
          const y = samples[idx + 1];
          const cos = samples[idx + 2];
          const sin = samples[idx + 3];

          const ch = unitText[c];
          const g = glyphCache[ch];
          if (!g) continue;

          // Direct 2D matrix transformation to map viewBox coordinates to canvas physical pixels
          ctx.setTransform(
            cos * scale,
            sin * scale,
            -sin * scale,
            cos * scale,
            x * scale,
            y * scale
          );

          ctx.drawImage(
            g.canvas,
            -g.centerX,
            -g.centerY,
            g.viewBoxW,
            g.viewBoxH
          );
        }
      }
      // Reset matrix transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // 4. Front Layer Slice Blit: Copy ONLY the middle band to the front canvas (Instant GPU copy)
    if (ctxFront) {
      ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);

      const clipYTopPx = Math.floor(MIDDLE_BAND_TOP * (canvas.height / viewBoxHeight));
      const clipHPx = Math.ceil((MIDDLE_BAND_BOTTOM - MIDDLE_BAND_TOP) * (canvas.height / viewBoxHeight));

      ctxFront.drawImage(
        canvas,
        0, clipYTopPx, canvas.width, clipHPx,
        0, clipYTopPx, canvas.width, clipHPx
      );
    }

    if (isRibbonVisible && !REDUCED) {
      animId = requestAnimationFrame(renderFrame);
    }
  };

  const startLoop = () => {
    if (animId) cancelAnimationFrame(animId);
    lastTime = 0;
    if (isRibbonVisible) {
      animId = requestAnimationFrame(renderFrame);
    }
  };

  const stopLoop = () => {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isRibbonVisible = entry.isIntersecting;
        if (isRibbonVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0 });
    observer.observe(container);
  }

  const initCanvas = () => {
    setupDimensionsAndMetrics();
    startLoop();
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initCanvas);
  } else {
    setTimeout(initCanvas, 100);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setupDimensionsAndMetrics();
      if (!animId && isRibbonVisible) startLoop();
    }, 150);
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   H. Location Photo & Details Modal
   ───────────────────────────────────────────────────────────── */
function initLocationModal() {
  const cards = document.querySelectorAll('.locations-card');
  const modal = document.getElementById('location-modal');
  if (!modal || !cards.length) return;

  const closeBtn = document.getElementById('location-modal-close');
  const imgEl = document.getElementById('modal-location-img');
  const tagOverlayEl = document.getElementById('modal-location-tag-overlay');
  const tagEl = document.getElementById('modal-location-tag');
  const titleEl = document.getElementById('modal-location-title');
  const specTrafficEl = document.getElementById('modal-spec-traffic');
  const specDisplayEl = document.getElementById('modal-spec-display');
  const descEl = document.getElementById('modal-location-desc');
  const inquireBtn = document.getElementById('modal-inquire-btn');

  const locationDetailsMap = {
    'work-card-bg--edsa-malibay-eb': {
      image: '/assets/loc1.webp',
      tag: 'EDSA Corridor · Pasay',
      title: 'EDSA Pasay - Malibay Eastbound',
      traffic: '390,000+ daily vehicles',
      display: 'High-Impact Digital LED · Eastbound Corridor',
      desc: 'Prime digital LED location situated on the busy eastbound artery of EDSA Pasay-Malibay, capturing dense commuters heading toward SLEX and NAIA Express routes.'
    },
    'work-card-bg--edsa-malibay-wb': {
      image: '/assets/guadalupe.webp',
      tag: 'EDSA Corridor · Pasay',
      title: 'EDSA Pasay - Malibay Westbound',
      traffic: '395,000+ daily vehicles',
      display: 'High-Impact Digital LED · Westbound Corridor',
      desc: 'Commands high visibility for westbound motorists and transit flows heading toward Roxas Boulevard, Mall of Asia, and Pasay transportation terminals.'
    },
    'work-card-bg--edsa-harrison-a': {
      image: '/assets/loc2.webp',
      tag: 'EDSA Pasay · F.B. Harrison',
      title: 'EDSA Pasay F.B. Harrison (Frame A)',
      traffic: '320,000+ daily vehicles',
      display: 'Prime Junction LED · Frame A',
      desc: 'Premier digital display frame targeting heavy traffic at the F.B. Harrison and EDSA intersection, reaching entertainment, hospitality, and corporate transit traffic.'
    },
    'work-card-bg--edsa-harrison-b': {
      image: '/assets/solutions_digital_led.png',
      tag: 'EDSA Pasay · F.B. Harrison',
      title: 'EDSA Pasay F.B. Harrison (Frame B)',
      traffic: '320,000+ daily vehicles',
      display: 'Prime Junction LED · Frame B',
      desc: 'High-exposure digital billboard unit strategically positioned to capture multi-lane vehicular streams crossing the F.B. Harrison intersection.'
    },
    'work-card-bg--edsa-harrison-c': {
      image: '/assets/solutions_building_wrap.png',
      tag: 'EDSA Pasay · F.B. Harrison',
      title: 'EDSA Pasay F.B. Harrison (Frame C)',
      traffic: '320,000+ daily vehicles',
      display: 'Prime Junction LED · Frame C',
      desc: 'Wide-angle landscape digital frame delivering extended dwell times and crisp 24/7 visibility along Pasay City\'s major thoroughfare.'
    },
    'work-card-bg--espana-lacson': {
      image: '/assets/solutions_static_billboard.png',
      tag: 'University Belt · Manila',
      title: 'España Cor. Lacson Ave. Stoplight',
      traffic: '280,000+ daily vehicles & commuters',
      display: 'High-Dwell Signalized Junction LED',
      desc: 'Located directly at the signalized intersection of España Boulevard and Lacson Avenue, providing prolonged visual engagement to University Belt students, hospital commuters, and Manila transit.'
    },
    'work-card-bg--marisol-rotonda': {
      image: '/assets/clark.webp',
      tag: 'Angeles City · Pampanga',
      title: 'Marisol Rotonda, Angeles, Pampanga',
      traffic: '110,000+ daily commuters',
      display: 'Rotunda Commercial LED Corridor',
      desc: 'Dominant rotary digital billboard at Marisol Rotonda in Angeles City, capturing round-the-clock traffic moving between Clark Freeport, commercial districts, and residential zones.'
    },
    'work-card-bg--cebu-airport-arrival': {
      image: '/assets/loc3.webp',
      tag: 'Lapu-Lapu City · Mactan',
      title: 'Cebu Airport Arrival Rd.',
      traffic: '150,000+ daily airport travelers',
      display: 'Exclusive Airport Arrival Display',
      desc: 'Exclusive gateway digital screen capturing 100% of arriving domestic and international tourists, business executives, and airport visitors exiting Mactan-Cebu International Airport.'
    },
    'work-card-bg--cts-bacalso': {
      image: '/assets/solutions_transit.png',
      tag: 'Cebu City · N. Bacalso',
      title: 'CTS - N. Bacalso Ave. Cebu',
      traffic: '130,000+ daily commuters',
      display: 'South Transit Corridor LED',
      desc: 'High-density digital display along N. Bacalso Avenue, reaching daily bus terminal commuters, university students, and South Cebu transport traffic.'
    },
    'work-card-bg--cclex-srp-all': {
      image: '/assets/solutions_custom_ooh.png',
      tag: 'South Road Properties · CCLEX',
      title: 'CCLEX - Cebu City Point (SRP) - All Faces',
      traffic: '180,000+ daily vehicles',
      display: 'Multi-Face Landmark LED Network',
      desc: 'Panoramic multi-face digital display network at the Cebu City entry/exit of the landmark Cebu-Cordova Link Expressway (CCLEX) in South Road Properties.'
    },
    'work-card-bg--cclex-srp-frame-c': {
      image: '/assets/solutions_pole_banner.png',
      tag: 'South Road Properties · CCLEX',
      title: 'CCLEX - Cebu City Point (SRP) - Frame C',
      traffic: '180,000+ daily vehicles',
      display: 'Expressway Landmark LED · Frame C',
      desc: 'Dedicated digital billboard frame targeting vehicles traveling across the CCLEX bridge connection into Cebu City\'s premier coastal commercial district.'
    },
    'work-card-bg--archbishop-reyes-nb': {
      image: '/assets/about_digital_led.png',
      tag: 'Cebu Business Park · Northbound',
      title: 'Cebu - Archbishop Reyes Ave. NB',
      traffic: '135,000+ daily commuters',
      display: 'Financial District Northbound LED',
      desc: 'Prime northbound LED billboard along Archbishop Reyes Avenue, directly adjacent to Cebu Business Park and Ayala Center Cebu.'
    },
    'work-card-bg--archbishop-reyes-sb': {
      image: '/assets/about_billboard_install.png',
      tag: 'Cebu Business Park · Southbound',
      title: 'Cebu - Archbishop Reyes Ave. SB',
      traffic: '135,000+ daily commuters',
      display: 'Financial District Southbound LED',
      desc: 'High-visibility southbound digital display capturing executive commuters heading toward downtown Cebu and financial centers.'
    },
    'work-card-bg--cebu-osmena': {
      image: '/assets/about_campaign_execution.png',
      tag: 'Downtown Hub · Cebu City',
      title: 'Cebu Osmeña Blvd.',
      traffic: '160,000+ daily foot & vehicular traffic',
      display: 'Downtown Heritage Corridor Screen',
      desc: 'Commanding position along Osmeña Boulevard, Cebu City\'s iconic commercial and heritage spine, reaching high-volume pedestrian and vehicular flows.'
    },
    'work-card-bg--cebu-bacalso': {
      image: '/assets/about_client_showcase.png',
      tag: 'South Express Corridor · Cebu',
      title: 'Cebu - N. Bacalso Ave.',
      traffic: '125,000+ daily vehicles',
      display: 'Major Highway Arterial Billboard',
      desc: 'Strategic roadside display along N. Bacalso Avenue targeting provincial buses, commercial logistics, and South Cebu commuters.'
    },
    'work-card-bg--talisay-coastal-wb': {
      image: '/assets/solutions_mall_advertising.png',
      tag: 'Talisay City · Coastal Road',
      title: 'Talisay - Cebu South Coastal Rd (WB)',
      traffic: '140,000+ daily vehicles',
      display: 'Coastal Express Highway LED (WB)',
      desc: 'High-speed coastal highway billboard targeting westbound transit traffic connecting Talisay City to Metro Cebu.'
    },
    'work-card-bg--talisay-coastal-eb': {
      image: '/assets/about_team_at_work.png',
      tag: 'Talisay City · Coastal Road',
      title: 'Talisay - Cebu South Coastal Rd (EB)',
      traffic: '140,000+ daily vehicles',
      display: 'Coastal Express Highway LED (EB)',
      desc: 'Eastbound coastal expressway digital display offering long-range sightlines for motorists entering Southern Cebu resort and municipality routes.'
    },
    'work-card-bg--iloilo-airport-exit': {
      image: '/assets/iloilo.webp',
      tag: 'Cabatuan · Iloilo Airport',
      title: 'Iloilo Airport Access Road (Exit)',
      traffic: '85,000+ daily travelers',
      display: 'Airport Exit Corridor LED',
      desc: 'High-visibility billboard situated along the exit road of Iloilo International Airport, capturing all departing travelers and airport visitors.'
    },
    'work-card-bg--iloilo-airport-exit-large': {
      image: '/assets/iloilo.webp',
      tag: 'Cabatuan · Iloilo Airport',
      title: 'Iloilo Airport Access Rd. Exit (Larger Site)',
      traffic: '95,000+ daily travelers',
      display: 'Landmark Wide-Format Exit LED',
      desc: 'Large-format premium digital site on the airport exit road delivering maximum brand impact for corporate and luxury advertisers.'
    },
    'work-card-bg--iloilo-airport-entrance-large': {
      image: '/assets/solutions_pole_banner.png',
      tag: 'Cabatuan · Iloilo Airport',
      title: 'Iloilo Airport Access Rd. Entrance (Larger Site)',
      traffic: '95,000+ daily travelers',
      display: 'Landmark Wide-Format Entrance LED',
      desc: 'Dominant entrance corridor display catching 100% of airport-bound vehicular traffic from Iloilo City and neighboring Western Visayas provinces.'
    },
    'work-card-bg--mindanao-coming-soon': {
      image: '/assets/davao.webp',
      tag: 'Mindanao Region',
      title: 'Expansion Sites — Coming Soon!',
      traffic: 'Expansion in Progress',
      display: 'Strategic Digital Billboard Network',
      desc: 'U Channel is expanding its digital out-of-home footprint to prime high-impact corridors across Davao City, Cagayan de Oro, and key Mindanao commercial centers.'
    },
    'work-card-bg--1': {
      image: '/assets/loc1.webp',
      tag: 'Epifanio de los Santos Avenue',
      title: 'EDSA Locations',
      traffic: '390,000+ daily vehicles',
      display: 'High-Impact Digital LED & Static Billboard Corridors',
      desc: 'Flagship out-of-home advertising corridor spanning key Metro Manila junctions including EDSA Pasay-Malibay, F.B. Harrison, Guadalupe Bridge, and Ortigas Junction.'
    },
    'work-card-bg--guadalupe': {
      image: '/assets/guadalupe.webp',
      tag: 'EDSA Guadalupe · Metro Manila',
      title: 'EDSA Guadalupe Bridge LED',
      traffic: '410,000+ daily vehicles',
      display: 'High-Exposure Riverfront Display',
      desc: 'Dominating EDSA Guadalupe Bridge, one of Metro Manila\'s highest-density traffic bottlenecks. Reaches northbound and southbound vehicular streams, MRT-3 commuters, and Pasig River ferry passengers with 24/7 unmissable visual presence.'
    },
    'work-card-bg--2': {
      image: '/assets/loc2.webp',
      tag: 'Metro Manila & Surrounding Hubs',
      title: 'Manila Locations',
      traffic: '280,000+ daily vehicles & commuters',
      display: 'High-Density Urban & Transit Junction LED Sites',
      desc: 'Strategic high-impact billboard positions across Metro Manila hubs including España Cor. Lacson Ave, BGC Lawton Ave, and key commercial arteries.'
    },
    'work-card-bg--roxas': {
      image: '/assets/solutions_building_wrap.png',
      tag: 'Roxas Boulevard · Manila',
      title: 'Roxas Boulevard Bayfront LED',
      traffic: '200,000+ daily vehicles',
      display: 'Bayfront Panoramic Display',
      desc: 'Overlooking Manila Bay along historic Roxas Boulevard. Commands long-range visibility from commuters, tourists, and event attendees traveling toward the Cultural Center of the Philippines (CCP) complex, Mall of Asia, and Entertainment City.'
    },
    'work-card-bg--clark': {
      image: '/assets/clark.webp',
      tag: 'Clark Freeport & Special Economic Zone',
      title: 'Pampanga Locations',
      traffic: '110,000+ daily commuters & travelers',
      display: 'Economic Zone & Transit Corridor Digital LED',
      desc: 'Dominant billboard sites across Central Luzon, capturing executive and commercial traffic in Clark Freeport, Angeles City, and Marisol Rotonda.'
    },
    'work-card-bg--clark-gateway': {
      image: '/assets/solutions_custom_ooh.png',
      tag: 'Pampanga · Central Luzon',
      title: 'Clark Gateway Ave LED',
      traffic: '75,000+ daily commuters',
      display: 'Dual-Face Landscape LED',
      desc: 'Positioned right at the primary entry gate to Clark Freeport\'s central commercial sector, targeting tech executives, corporate locators, and affluent commercial traffic daily.'
    },
    'work-card-bg--3': {
      image: '/assets/loc3.webp',
      tag: 'Queen City of the South',
      title: 'Cebu Locations',
      traffic: '180,000+ daily reach across prime hubs',
      display: 'Metropolitan & Coastal Expressway Display Network',
      desc: '10+ premier advertising locations across Metro Cebu including Mactan Airport Arrival, CCLEX Expressway, Cebu Business Park, N. Bacalso, and Osmeña Boulevard.'
    },
    'work-card-bg--cebu-mactan': {
      image: '/assets/solutions_transit.png',
      tag: 'Lapu-Lapu City · Mactan',
      title: 'Mactan-Cebu Airport Expressway LED',
      traffic: '120,000+ daily travelers',
      display: 'High-Impact Roadside Display',
      desc: 'Located along the primary arterial highway connecting Mactan-Cebu International Airport to Cebu City and luxury beach resort corridors, reaching high-spending domestic and international tourists.'
    },
    'work-card-bg--iloilo': {
      image: '/assets/iloilo.webp',
      tag: 'City of Love · Western Visayas',
      title: 'Iloilo Locations',
      traffic: '95,000+ daily airport & urban commuters',
      display: 'Airport Access & Commercial District Displays',
      desc: 'High-visibility digital billboard network along the Iloilo International Airport Access Road and central commercial districts in Western Visayas.'
    },
    'work-card-bg--iloilo-diversion': {
      image: '/assets/solutions_pole_banner.png',
      tag: 'Iloilo City · Diversion Road',
      title: 'Iloilo Diversion Road Billboard',
      traffic: '70,000+ daily vehicles',
      display: 'Tri-face Rotary LED',
      desc: 'Spanning Sen. Benigno Aquino Jr. Avenue (Diversion Road), the key transit highway linking Iloilo International Airport with major shopping malls and business districts.'
    },
    'work-card-bg--davao': {
      image: '/assets/davao.webp',
      tag: 'Davao City · Southern Mindanao',
      title: 'Davao Locations',
      traffic: '110,000+ daily commuters',
      display: 'Metropolitan Commercial Landmark Display',
      desc: 'Commanding digital out-of-home placement at Davao City\'s landmark commercial plaza, reaching key business and consumer hubs across Southern Mindanao.'
    },
    'work-card-bg--cdo': {
      image: '/assets/cdo.webp',
      tag: 'Northern Mindanao Hub',
      title: 'Cagayan de Oro Locations',
      traffic: '100,000+ daily traffic',
      display: 'Wraparound Facade & Commercial Digital LED',
      desc: 'Premium digital display screen positioned at Ayala Centrio Mall facade in downtown Cagayan de Oro, capturing shoppers and commuters across Northern Mindanao.'
    }
  };

  let currentActiveTitle = '';

  const openModal = (card) => {
    const bgEl = card.querySelector('[class*="work-card-bg--"]');
    let key = '';
    if (bgEl) {
      const match = bgEl.className.match(/work-card-bg--[^\s]+/);
      if (match) key = match[0];
    }

    const titleFromCard = card.querySelector('.work-title')?.textContent?.trim() || '';
    const tagFromCard = card.querySelector('.work-tag')?.textContent?.trim() || '';
    const metaFromCard = card.querySelector('.work-meta')?.textContent?.trim() || '';

    const data = locationDetailsMap[key] || {
      image: '/assets/loc1.webp',
      tag: tagFromCard || 'Billboard Location',
      title: titleFromCard || 'U Channel Location',
      traffic: metaFromCard.split('·')[0]?.trim() || 'High daily traffic',
      display: metaFromCard.split('·').slice(1).join('·').trim() || 'Premium Digital LED',
      desc: 'Strategic out-of-home digital display capturing high-volume vehicular and pedestrian traffic with 24/7 high-brightness LED clarity.'
    };

    currentActiveTitle = data.title;

    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.title;
    }
    if (tagOverlayEl) tagOverlayEl.textContent = data.tag;
    if (tagEl) tagEl.textContent = data.tag;
    if (titleEl) titleEl.textContent = data.title;
    if (specTrafficEl) specTrafficEl.textContent = data.traffic;
    if (specDisplayEl) specDisplayEl.textContent = data.display;
    if (descEl) descEl.textContent = data.desc;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    if (window.lenis) {
      window.lenis.stop();
    } else {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    if (window.lenis) {
      window.lenis.start();
    } else {
      document.body.style.overflow = '';
    }
  };

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(card);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (inquireBtn) {
    inquireBtn.addEventListener('click', () => {
      closeModal();
      const messageInput = document.getElementById('f-message');
      if (messageInput) {
        messageInput.value = `Hi U Channel, I am interested in inquiring about the ${currentActiveTitle} location for an upcoming campaign.`;
        messageInput.focus();
      }
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        smoothScrollTo(contactSec, -80);
      }
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   I. Collapsible Subcategories on Locations Page
   ───────────────────────────────────────────────────────────── */
function initCollapsibleSubcategories() {
  const subcatHeaders = document.querySelectorAll('.subcategory-header');
  if (!subcatHeaders.length) return;

  subcatHeaders.forEach(header => {
    const parent = header.closest('.locations-subcategory');
    // Default state is uncollapsed (expanded)
    if (parent) {
      parent.classList.remove('is-collapsed');
    }
    header.setAttribute('aria-expanded', 'true');

    header.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = header.closest('.locations-subcategory');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      header.setAttribute('aria-expanded', !isExpanded);
      if (parent) {
        parent.classList.toggle('is-collapsed', isExpanded);
      }

      if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 400);
      }
    });
  });
}




