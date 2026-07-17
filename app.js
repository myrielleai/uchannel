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

    const isScrollingDown = currentScrollY > lastScrollY;

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
  if (!HAS_GSAP || REDUCED) return null;

  // Headline (U Channel) - Animates as a single element matching the subtitle transition style
  const headline = document.querySelector('.step-1-title');
  if (headline) {
    gsap.set(headline, { opacity: 0, y: 15 });
  }

  const subtitle = document.querySelector('.step-1-subtitle');
  if (subtitle) {
    gsap.set(subtitle, { opacity: 0, y: 15 });
  }

  const runTimeline = () => {
    const tl = gsap.timeline();
    // Headline: fade & slide in
    if (headline) {
      tl.to(headline, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: SPRING_SOFT,
      }, 0.2);
    }
    // Subtitle: fade & slide in
    if (subtitle) {
      tl.to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: SPRING_SOFT,
      }, 0.55);
    }
  };

  if (playTimeline) {
    runTimeline();
  }

  // Scroll zoom & fade out for headline wrapper and background grid
  const wrapper = document.querySelector('.hero-content-wrapper');
  if (wrapper) {
    gsap.to(wrapper, {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      opacity: 0,
      scale: 1.35,
      y: -100,
      ease: 'none'
    });
  } else if (headline) {
    gsap.to(headline, {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      opacity: 0,
      scale: 1.35,
      y: -100,
      ease: 'none'
    });
  }

  const gridBg = document.querySelector('#hero .hero-grid-bg');
  if (gridBg) {
    gsap.to(gridBg, {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      opacity: 0,
      ease: 'none'
    });
  }

  return runTimeline;
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
   6.c Capabilities Stacking Scroll (Framer Card Stacking)
   ───────────────────────────────────────────────────────────── */
function initCapabilitiesStack() {
  const section = document.getElementById('hero-step-3');
  const stack = document.querySelector('.capabilities-stack');
  if (!section || !stack) return;

  const cards = stack.querySelectorAll('.capability-card');
  if (!cards.length) return;

  if (!HAS_GSAP || !HAS_ST || REDUCED) {
    return;
  }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    // We pin the section for 2.5 viewports worth of scroll to allow all cards to stack
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: "+=250%",
        invalidateOnRefresh: true
      }
    });

    // Configure initial positions for desktop absolute cards:
    // Card 0 (first card) is active by default.
    // Cards 1-5 are positioned below the stacking view.
    cards.forEach((card, index) => {
      if (index === 0) {
        gsap.set(card, { y: 0, scale: 1, opacity: 1, pointerEvents: "auto", zIndex: 10 });
      } else {
        gsap.set(card, { y: "120%", scale: 0.9, opacity: 0, pointerEvents: "none", zIndex: 10 + index });
      }
    });

    // Build the stacking timeline sequentially
    // With 6 cards, there are 5 card transitions.
    // Each transition:
    // - Slide up the incoming card (card index `i`) to `y: 0, scale: 1, opacity: 1`
    // - For the card immediately below (`i-1`), animate to `scale: 0.95, y: -22, opacity: 0.45`
    // - For the card under that (`i-2`), animate to `scale: 0.90, y: -44, opacity: 0` (fades out completely to show max 2 cards)
    for (let i = 1; i < cards.length; i++) {
      const incomingCard = cards[i];
      const prevCard = cards[i - 1];
      const prevPrevCard = i >= 2 ? cards[i - 2] : null;

      const stepLabel = `step-${i}`;
      tl.addLabel(stepLabel);

      // Slide in incoming card
      tl.to(incomingCard, {
        y: "0%",
        scale: 1,
        opacity: 1,
        pointerEvents: "auto",
        zIndex: 20,
        duration: 1,
        ease: "power1.inOut"
      }, stepLabel);

      // Shift back the previous card
      tl.to(prevCard, {
        scale: 0.95,
        y: -22,
        opacity: 0.45,
        pointerEvents: "none",
        zIndex: 15,
        duration: 1,
        ease: "power1.inOut"
      }, stepLabel);

      // Completely fade out the card before previous card
      if (prevPrevCard) {
        tl.to(prevPrevCard, {
          scale: 0.9,
          y: -44,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 10,
          duration: 1,
          ease: "power1.inOut"
        }, stepLabel);
      }

      // Animate progress bar fill width
      tl.to('.cap-progress-fill', {
        width: `${((i + 1) / cards.length) * 100}%`,
        duration: 1,
        ease: "power1.inOut"
      }, stepLabel);

      // Update current index string dynamically during scrub
      const capCounter = { val: i };
      tl.to(capCounter, {
        val: i + 1,
        duration: 1,
        ease: "power1.inOut",
        onUpdate: function() {
          const numEl = document.querySelector('.cap-current-num');
          if (numEl) {
            const currentVal = Math.round(this.targets()[0].val);
            numEl.textContent = String(currentVal).padStart(2, '0');
          }
        }
      }, stepLabel);
    }

    return () => {
      // Cleanup inline styles on destroy/resize
      cards.forEach(card => {
        gsap.set(card, { clearProps: "all" });
      });
      // Reset progress string
      const numEl = document.querySelector('.cap-current-num');
      if (numEl) numEl.textContent = '01';
      const fillEl = document.querySelector('.cap-progress-fill');
      if (fillEl) fillEl.style.width = '16.666%';
    };
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
   11. Footer CTA
   ───────────────────────────────────────────────────────────── */
function initFooterCTA() {
  if (!HAS_GSAP || !HAS_ST || REDUCED) return;

  gsap.timeline({
    scrollTrigger: { trigger: '.footer-cta-strip', start: 'top 82%', once: true },
  })
    .from('.footer-cta-headline', { opacity: 0, x: -36, duration: 1.0 }, 0)
    .from('.footer-cta-sub',      { opacity: 0, x: -28, duration: 0.9 }, 0.15)
    .from('.footer-contact-info .contact-item', { opacity: 0, y: 15, stagger: 0.08, duration: 0.8 }, 0.25)
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
  const frame       = document.querySelector('.billboard-frame');

  if (!container || !structure) return;

  let isZoomed = false;

  /* ─── Scroll-Linked Pin & Zoom Animation ─── */
  if (HAS_GSAP && HAS_ST && !REDUCED) {
    const getTargetScale = () => {
      const w = frame.offsetWidth || 620;
      const h = frame.offsetHeight || 348;
      const scaleX = window.innerWidth / w;
      const scaleY = window.innerHeight / h;
      return Math.max(scaleX, scaleY) * 1.15;
    };

    gsap.timeline({
      scrollTrigger: {
        trigger: showcaseSec,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          isZoomed = self.progress > 0.05;
          if (isZoomed && rotateXTo && rotateYTo) {
            // Reset mouse tilt when zoomed
            rotateXTo(0);
            rotateYTo(0);
          }
        }
      }
    })
    .to('.section-header-container', { opacity: 0, yPercent: -40, duration: 0.3 }, 0)
    .to('.model-caption', { opacity: 0, yPercent: 40, duration: 0.3 }, 0)
    .to('.model-badge', { opacity: 0, scale: 0.3, duration: 0.4, stagger: 0.05 }, 0)
    .to('.billboard-spotlights', { opacity: 0, duration: 0.3 }, 0)
    .to('.billboard-backlight', { opacity: 0, duration: 0.3 }, 0)
    .to('.billboard-neck, .billboard-column, .billboard-base', { 
      y: 240, 
      opacity: 0, 
      duration: 0.6,
      ease: 'power2.inOut' 
    }, 0)
    .to(frame, {
      scale: () => getTargetScale(),
      duration: 1.0,
      ease: 'power2.inOut'
    }, 0.1)
    .to('#billboard-trusted-overlay', {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.5,
      ease: 'power2.out'
    }, 0.3)
    .to('.led-grid-overlay', {
      opacity: 0.25,
      duration: 0.5
    }, 0.3);
  } else if (HAS_GSAP && HAS_ST && REDUCED) {
    // Reduced motion accessibility fallback: fade in the trusted overlay when in view
    gsap.to('#billboard-trusted-overlay', {
      scrollTrigger: {
        trigger: showcaseSec,
        start: 'top 50%',
        once: true
      },
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.8
    });
  }

  // Programmatic video autoplay initialization
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.play().catch(err => {
      console.warn("Video autoplay blocked, waiting for user interaction:", err);
    });
  });

  /* ─── Mouse-Tracking 3D Perspective Tilt ─── */
  if (REDUCED) return;

  const wrapper = document.querySelector('.billboard-structure-wrapper');
  if (!wrapper) return;
  const badges = wrapper.querySelectorAll('.model-badge');

  let wrapperRect = null;
  let enterScrollX = 0;
  let enterScrollY = 0;
  let isHovered = false;
  let rotateYTo = null;
  let rotateXTo = null;
  let badgeXTos = [];
  let badgeYTos = [];

  const handleMouseEnter = () => {
    if (isZoomed) return;
    isHovered = true;
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
    if (isZoomed) return;
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
    isHovered = false;
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

  // Entrance animation for the billboard structure
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
    initServiceCards();
    initServicesStickyScroll();
    initCapabilitiesStack();
    initWorkCards();
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
  initServiceCards();
  initServicesStickyScroll();
  initCapabilitiesStack();
  initWorkCards();
  initFooterCTA();
  initGlassBars();
  initBillboardShowcase();
  initMobileMenu();
  initSmoothAnchors();
  initActiveNav();
  initContactForm();

  // Final ScrollTrigger refresh after layout is stable.
  if (HAS_ST) {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }

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
    let r = null;
    let xTo = null;
    let yTo = null;

    function onEnter() {
      r = el.getBoundingClientRect();
      if (!xTo) {
        xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: SPRING_SOFT });
        yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: SPRING_SOFT });
      }
    }

    let ticking = false;
    let targetX = 0;
    let targetY = 0;
    function onMove(e) {
      if (!r) {
        r = el.getBoundingClientRect();
      }
      const cx   = r.left + r.width  / 2;
      const cy   = r.top  + r.height / 2;
      targetX = e.clientX - cx;
      targetY = e.clientY - cy;

      if (!ticking) {
        requestAnimationFrame(() => {
          if (xTo && yTo) {
            xTo(targetX * strength);
            yTo(targetY * strength);
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    function onLeave() {
      r = null;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: SPRING,
        overwrite: 'auto'
      });
    }

    el.addEventListener('mouseenter', onEnter, { passive: true });
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
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

  const cards = document.querySelectorAll('.service-card, .work-card, .glass-card, .capability-card');

  cards.forEach(card => {
    const maxTilt = 9; // max degrees
    const glowEl  = document.createElement('div');
    glowEl.className = 'card-cursor-glow';
    glowEl.setAttribute('aria-hidden', 'true');
    glowEl.style.cssText = [
      'position:absolute',
      'width:300px',
      'height:300px',
      'top:-150px',
      'left:-150px',
      'border-radius:50%',
      'opacity:0',
      'pointer-events:none',
      'transition:opacity 0.35s ease',
      'background:radial-gradient(circle, rgba(61,126,255,0.15) 0%, transparent 70%)',
      'z-index:1',
      'will-change:transform',
    ].join(';');
    if (window.getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }
    card.appendChild(glowEl);

    const setRotX = gsap.quickSetter(card, 'rotateX', 'deg');
    const setRotY = gsap.quickSetter(card, 'rotateY', 'deg');
    const setGlowX = gsap.quickSetter(glowEl, 'x', 'px');
    const setGlowY = gsap.quickSetter(glowEl, 'y', 'px');

    let rect = null;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'none';
      card.style.willChange = 'transform';
      glowEl.style.opacity = '1';
    });

    let tiltTicking = false;
    let cardMX = 0;
    let cardMY = 0;
    card.addEventListener('mousemove', e => {
      if (!rect) {
        rect = card.getBoundingClientRect();
      }
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
          setGlowX(cardMX);
          setGlowY(cardMY);
          tiltTicking = false;
        });
        tiltTicking = true;
      }
    });

    card.addEventListener('mouseleave', () => {
      rect = null;
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.6, ease: SPRING,
        overwrite: 'auto',
        onComplete() {
          card.style.willChange = 'auto';
          card.style.transformStyle = ''; // Reset 3D context to restore normal 2D z-indexing
        }
      });
      gsap.to(glowEl, {
        x: 0, y: 0,
        duration: 0.6, ease: SPRING,
        overwrite: 'auto'
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

