import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ADVERTISING_SOLUTIONS,
  WHY_CHOOSE_FEATURES,
} from '../data/solutionsData';
import { Layout } from '../components/Layout';
import { HardwareCatalog } from '../components/HardwareCatalog';
import { BrandsSection } from '../components/BrandsSection';
import { AdvertisingSolutions } from '../components/AdvertisingSolutions';

gsap.registerPlugin(ScrollTrigger);

export const AdvertisingSolutionsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const [activeWhyId, setActiveWhyId] = useState<string>('feat-1');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance animations (Staggered blur-to-clear fade)
      const heroNodes = heroRef.current?.querySelectorAll('.adv-hero-anim');
      if (heroNodes && heroNodes.length > 0) {
        gsap.fromTo(
          heroNodes,
          { opacity: 0, y: 40, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, stagger: 0.15, ease: 'power3.out' }
        );
      }

      // 2. Hero Image ScrollTrigger parallax & fade
      if (heroRef.current) {
        const heroImg = heroRef.current.querySelector('.adv-hero-media-wrapper img');
        if (heroImg) {
          gsap.to(heroImg, {
            opacity: 0.2,
            y: 75,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }

      // 3. Our Solutions Section Header entrance animation
      if (solutionsRef.current) {
        const solHeader = solutionsRef.current.querySelector('.section-header-container');
        if (solHeader) {
          gsap.fromTo(
            solHeader,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: solutionsRef.current,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }
      }

      // 4. Why Choose U Channel Section (Header + Cards)
      if (whyRef.current) {
        const whyHeader = whyRef.current.querySelector('.adv-section-header');
        if (whyHeader) {
          gsap.fromTo(
            whyHeader,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: whyRef.current,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }

        const whyCards = whyRef.current.querySelectorAll('.adv-why-card');
        if (whyCards && whyCards.length > 0) {
          gsap.fromTo(
            whyCards,
            { opacity: 0, y: 50, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: whyRef.current.querySelector('.adv-why-container') || whyRef.current,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }
      }

      // 5. Featured Solution ScrollTrigger (Image stage + Text box + Stat cards)
      if (featuredRef.current) {
        const featImg = featuredRef.current.querySelector('.adv-featured-media-stage');
        const featText = featuredRef.current.querySelector('.adv-featured-text-box');
        const featStats = featuredRef.current.querySelectorAll('.adv-featured-text-box > div > div');

        if (featImg) {
          gsap.fromTo(
            featImg,
            { opacity: 0, x: -50, scale: 0.94 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: featuredRef.current,
                start: 'top 78%',
                once: true,
              },
            }
          );
        }

        if (featText) {
          gsap.fromTo(
            featText,
            { opacity: 0, x: 50 },
            {
              opacity: 1,
              x: 0,
              duration: 1.0,
              delay: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: featuredRef.current,
                start: 'top 78%',
                once: true,
              },
            }
          );
        }

        if (featStats && featStats.length > 0) {
          gsap.fromTo(
            featStats,
            { opacity: 0, y: 20, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.12,
              delay: 0.25,
              ease: 'back.out(1.4)',
              scrollTrigger: {
                trigger: featuredRef.current,
                start: 'top 78%',
                once: true,
              },
            }
          );
        }
      }
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  const featuredSolution = ADVERTISING_SOLUTIONS.find((s) => s.id === 'digital-led') || ADVERTISING_SOLUTIONS[0];

  return (
    <Layout activePage="solutions" mainClassName="adv-page-main">
      {/* ─────────────────────────────────────────────────────────────
         1. HERO SECTION
         ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="adv-hero-section">
        <div className="adv-hero-media-wrapper">
          <img
            src="/assets/solutions_hero_visual.webp"
            alt="Solutions that make brands seen - U Channel"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="container adv-hero-inner">
          <h1 className="adv-hero-h1 adv-hero-anim">
            Solutions that make brands <span style={{ color: '#FB9B51' }}>seen.</span>
          </h1>

          <p className="adv-hero-sub adv-hero-anim">
            Discover outdoor advertising solutions that connect your brand with millions across high-impact locations throughout the Philippines.
          </p>

          <div className="adv-hero-cta-group adv-hero-anim">
            <a href="#contact" className="adv-btn-primary">
              <span>Request a Quote</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            <a href="#advertising-solutions" className="adv-btn-secondary">
              <span>Explore Solutions</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         2. OUR SOLUTIONS SHOWCASE (3D Interactive Carousel)
         ───────────────────────────────────────────────────────────── */}
      <div ref={solutionsRef}>
        <AdvertisingSolutions variant="light" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
         3. HARDWARE CATALOG (LED SOLUTIONS)
         ───────────────────────────────────────────────────────────── */}
      <section className="adv-hardware-section" style={{ paddingBlock: '80px', background: '#ffffff', borderTop: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <div className="container">
          <HardwareCatalog title="LED Solutions" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         4. WHY CHOOSE U CHANNEL
         ───────────────────────────────────────────────────────────── */}
      <section ref={whyRef} className="adv-why-section">
        <div className="container">
          <div className="adv-section-header" style={{ textAlign: 'center', maxWidth: '720px', marginInline: 'auto' }}>
            <h2 className="adv-section-h2">Why Choose U Channel</h2>
            <p className="adv-section-desc" style={{ marginInline: 'auto' }}>
              We combine prime strategic placements with cutting-edge technology and end-to-end execution to ensure your brand stands out.
            </p>
          </div>
        </div>

        <div className="adv-why-container">
          <div className="adv-why-accordion">
            {WHY_CHOOSE_FEATURES.map((feat, idx) => {
              const isActive = activeWhyId === feat.id;
              return (
                <div
                  key={feat.id}
                  className={`adv-why-card card ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveWhyId(feat.id)}
                  onClick={() => setActiveWhyId(feat.id)}
                  style={
                    {
                      '--bg-color': feat.bgColor,
                      '--fallback-color': feat.fallbackColor,
                    } as React.CSSProperties
                  }
                >
                  <div className="adv-why-card-top">
                    <span className="adv-why-card-num">0{idx + 1}</span>
                    <span className="adv-why-card-badge">U Channel</span>
                  </div>

                  <div className="adv-why-card-content">
                    <h3 className="adv-why-card-title">{feat.title}</h3>
                    <p className="adv-why-card-desc">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         5. FEATURED DIGITAL LED BILLBOARDS SECTION
         ───────────────────────────────────────────────────────────── */}
      <section ref={featuredRef} className="adv-featured-section">
        <div className="container">
          <div className="adv-featured-grid">
            <div className="adv-featured-media-stage">
              <img
                src={featuredSolution.image}
                alt={featuredSolution.alt}
              />

            </div>

            <div className="adv-featured-text-box">
              <h2 className="adv-section-h2" style={{ marginBottom: '20px' }}>
                Digital LED Billboards
              </h2>
              <p className="adv-section-desc" style={{ marginBottom: '32px' }}>
                Showcase how dynamic LED displays capture attention with bright, high-resolution content that can be updated in real time.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '36px' }}>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(251, 155, 81, 0.08)', border: '1px solid rgba(251, 155, 81, 0.25)' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#FB9B51', fontFamily: 'var(--font-mono)' }}>4K P8/P10</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Resolution Specs</div>
                </div>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.15)' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#059669', fontFamily: 'var(--font-mono)' }}>380k+</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Daily Impressions</div>
                </div>
              </div>

              <a href={`/advertising-solutions/${featuredSolution.slug}/`} className="adv-btn-primary">
                <span>View Details →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         6. BRANDS THAT CHOOSE U CHANNEL
         ───────────────────────────────────────────────────────────── */}
      <BrandsSection />
    </Layout>
  );
};

export default AdvertisingSolutionsPage;


