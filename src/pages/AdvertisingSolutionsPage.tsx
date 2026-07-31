import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ADVERTISING_SOLUTIONS,
  WHY_CHOOSE_FEATURES,
} from '../data/solutionsData';
import { Layout } from '../components/Layout';
import { HardwareCatalog } from '../components/HardwareCatalog';

gsap.registerPlugin(ScrollTrigger);

export const AdvertisingSolutionsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance animations
      const heroNodes = heroRef.current?.querySelectorAll('.adv-hero-anim');
      if (heroNodes && heroNodes.length > 0) {
        gsap.fromTo(
          heroNodes,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }
        );
      }

      // 2. Showcase Cards Stagger
      const cards = showcaseRef.current?.querySelectorAll('.adv-showcase-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: 'top 78%',
              once: true,
            },
          }
        );
      }

      // 3. Featured Solution ScrollTrigger (Separate Image and Text Animations)
      if (featuredRef.current) {
        const featImg = featuredRef.current.querySelector('.adv-featured-media-stage');
        const featText = featuredRef.current.querySelector('.adv-featured-text-box');

        if (featImg) {
          gsap.fromTo(
            featImg,
            { opacity: 0, x: -60, scale: 0.96 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: featuredRef.current,
                start: 'top 75%',
                once: true,
              },
            }
          );
        }

        if (featText) {
          gsap.fromTo(
            featText,
            { opacity: 0, x: 60 },
            {
              opacity: 1,
              x: 0,
              duration: 1.1,
              delay: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: featuredRef.current,
                start: 'top 75%',
                once: true,
              },
            }
          );
        }
      }

      // 4. Why Choose U Channel Staggered Cards
      const whyCards = whyRef.current?.querySelectorAll('.adv-why-card');
      if (whyCards && whyCards.length > 0) {
        gsap.fromTo(
          whyCards,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: whyRef.current,
              start: 'top 78%',
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const featuredSolution = ADVERTISING_SOLUTIONS.find((s) => s.id === 'digital-led') || ADVERTISING_SOLUTIONS[0];

  return (
    <Layout activePage="solutions" mainClassName="adv-page-main">
      {/* ─────────────────────────────────────────────────────────────
         1. HERO SECTION
         ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="adv-hero-section">
        <div className="adv-hero-media-wrapper">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/solutions_digital_led.png"
          >
            <source src="/assets/hero.mp4" type="video/mp4" />
          </video>
          <div className="adv-hero-gradient-overlay" />
        </div>

        <div className="container adv-hero-inner">
          <h1 className="adv-hero-h1 adv-hero-anim">
            Advertising Solutions
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

            <a href="#solutions-showcase" className="adv-btn-secondary">
              <span>Explore Solutions</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         2. OUR SOLUTIONS SHOWCASE
         ───────────────────────────────────────────────────────────── */}
      <section id="solutions-showcase" ref={showcaseRef} className="adv-showcase-section">
        <div className="container">
          <div className="adv-section-header" style={{ textAlign: 'center', maxWidth: '720px', marginInline: 'auto' }}>
            <h2 className="adv-section-h2">Our Solutions</h2>
            <p className="adv-section-desc" style={{ marginInline: 'auto' }}>
              From ultra-high-definition digital screens on EDSA to city-wide transit wraps, explore tailored formats built for maximum reach.
            </p>
          </div>
        </div>

        <div className="adv-showcase-carousel-wrapper">
          <div className="adv-showcase-carousel-track">
            {[...ADVERTISING_SOLUTIONS, ...ADVERTISING_SOLUTIONS].map((solution, index) => (
              <a
                key={`${solution.id}-${index}`}
                href={`/advertising-solutions/${solution.slug}/`}
                className="adv-showcase-card"
              >
                <div className="adv-card-media">
                  <img
                    src={solution.image}
                    alt={solution.alt}
                    loading="lazy"
                  />
                  <div className="adv-card-media-overlay" />
                </div>

                <div className="adv-card-body">
                  <div>
                    <h3 className="adv-card-title">{solution.title}</h3>
                    <p className="adv-card-desc">{solution.shortDescription}</p>
                  </div>

                  <div className="adv-card-footer">
                    <span className="adv-card-link-text">
                      <span>Learn More</span>
                      <svg className="adv-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         3. HARDWARE CATALOG (LED SOLUTIONS)
         ───────────────────────────────────────────────────────────── */}
      <section className="adv-hardware-section" style={{ paddingBlock: '80px', background: '#ffffff', borderTop: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <div className="container">
          <HardwareCatalog title="LED Solutions" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         3. FEATURED SOLUTION
         ───────────────────────────────────────────────────────────── */}
      <section ref={featuredRef} className="adv-featured-section">
        <div className="container">
          <div className="adv-featured-grid">
            <div className="adv-featured-media-stage">
              <img
                src={featuredSolution.image}
                alt={featuredSolution.alt}
              />
              <div className="adv-featured-badge-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Flagship Format</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>4K Ultra-HD Network</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  EDSA Corridors
                </span>
              </div>
            </div>

            <div className="adv-featured-text-box">
              <h2 className="adv-section-h2" style={{ marginBottom: '20px' }}>
                Digital LED Billboards
              </h2>
              <p className="adv-section-desc" style={{ marginBottom: '32px' }}>
                Showcase how dynamic LED displays capture attention with bright, high-resolution content that can be updated in real time.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '36px' }}>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(29, 92, 255, 0.06)', border: '1px solid rgba(29, 92, 255, 0.15)' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1d5cff', fontFamily: 'var(--font-mono)' }}>4K P8/P10</div>
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

          <div className="adv-why-grid">
            {WHY_CHOOSE_FEATURES.map((feat) => (
              <div
                key={feat.id}
                className="adv-why-card card"
                {...({ 'bg-color': feat.bgColor } as any)}
                style={
                  {
                    '--bg-color': feat.bgColor,
                    '--fallback-color': feat.fallbackColor,
                  } as React.CSSProperties
                }
              >
                <img className="card__image" src={feat.image} alt={feat.title} loading="lazy" decoding="async" />
                <p className="card__text">
                  <b>{feat.title}</b> — {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdvertisingSolutionsPage;

