import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ADVERTISING_SOLUTIONS, AdvertisingSolution } from '../data/solutionsData';
import { Layout } from '../components/Layout';
import { HardwareCatalog } from '../components/HardwareCatalog';

gsap.registerPlugin(ScrollTrigger);

interface SolutionDetailPageProps {
  slug: string;
}

export const SolutionDetailPage: React.FC<SolutionDetailPageProps> = ({ slug }) => {
  const solution: AdvertisingSolution | undefined = ADVERTISING_SOLUTIONS.find(
    (s) => s.slug === slug || s.id === slug
  );

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!solution) return;

    const ctx = gsap.context(() => {
      const heroNodes = heroRef.current?.querySelectorAll('.adv-detail-anim');
      if (heroNodes && heroNodes.length > 0) {
        gsap.fromTo(
          heroNodes,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }
        );
      }
    });

    return () => ctx.revert();
  }, [solution]);

  if (!solution) {
    return (
      <Layout activePage="solutions">
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px', background: '#020617', color: '#ffffff' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Solution Format Not Found</h1>
          <p style={{ color: '#94a3b8', marginBottom: '32px' }}>The advertising solution format you requested does not exist or has been moved.</p>
          <a href="/advertising-solutions/" className="adv-btn-primary">
            Back to Advertising Solutions
          </a>
        </div>
      </Layout>
    );
  }

  const currentIndex = ADVERTISING_SOLUTIONS.findIndex((s) => s.slug === solution.slug);
  const nextSolution =
    ADVERTISING_SOLUTIONS[(currentIndex + 1) % ADVERTISING_SOLUTIONS.length];

  return (
    <Layout activePage="solutions" mainStyle={{ background: '#030712', color: '#ffffff', minHeight: '100vh', paddingTop: '80px' }}>
      {/* ── Breadcrumbs Bar ── */}
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBlock: '16px', background: 'rgba(2, 6, 23, 0.8)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
          <a href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</a>
          <span>/</span>
          <a href="/advertising-solutions/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Solutions</a>
          <span>/</span>
          <span style={{ color: '#60a5fa', fontWeight: '600' }}>{solution.title}</span>
        </div>
      </div>

      {/* ── Format Hero ── */}
      <section ref={heroRef} style={{ position: 'relative', paddingBlock: '80px', overflow: 'hidden' }}>
        <div
          style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none', background: solution.bgGradient }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="adv-featured-grid">
            {/* Left Header */}
            <div>
              <h1 className="adv-hero-anim" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: '1.05', marginBottom: '24px' }}>
                {solution.title}
              </h1>

              <p className="adv-hero-anim" style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.7', marginBottom: '32px' }}>
                {solution.fullDescription}
              </p>

              {/* Action Buttons */}
              <div className="adv-hero-anim" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                <a href="#contact" className="adv-btn-primary">
                  <span>Inquire for Availability</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a href="/locations/" className="adv-btn-secondary">
                  <span>Browse Strategic Locations</span>
                </a>
              </div>
            </div>

            {/* Right Image Stage */}
            <div>
              <div style={{ borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6)' }}>
                <img
                  src={solution.image}
                  alt={solution.alt}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Technical Specifications Grid ── */}
      <section style={{ paddingBlock: '80px', background: 'rgba(15, 23, 42, 0.6)', borderBlock: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="container">
          <div className="adv-section-header">
            <h2 className="adv-section-h2" style={{ marginTop: '8px' }}>Technical Overview</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {solution.specs.map((spec, i) => (
              <div
                key={i}
                style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  {spec.label}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#60a5fa', fontFamily: 'var(--font-display)' }}>
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Detailed Benefits & Ideal Use Cases ── */}
      <section style={{ paddingBlock: '100px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            {/* Key Advantages */}
            <div style={{ padding: '36px', borderRadius: '28px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
                Key Campaign Advantages
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: 0, listStyle: 'none' }}>
                {solution.keyBenefits.map((benefit, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ideal Use Cases */}
            <div style={{ padding: '36px', borderRadius: '28px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
                Recommended Applications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {solution.idealFor.map((app, i) => (
                  <div
                    key={i}
                    style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#e2e8f0', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span style={{ color: '#60a5fa' }}>❖</span>
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Equipment & Hardware Specs ── */}
      <section style={{ paddingBlock: '80px', background: '#ffffff', borderTop: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <div className="container">
          <HardwareCatalog
            title={`Equipment Specs for ${solution.title}`}
            subtitle={`View real-time hardware specifications, LED panel dimensions, and cabinet options available for ${solution.title.toLowerCase()}.`}
          />
        </div>
      </section>

      {/* ── Next Solution Footer Banner ── */}
      <section style={{ paddingBlock: '60px', background: 'linear-gradient(90deg, #09132d 0%, #020617 100%)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>NEXT SOLUTION FORMAT</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>{nextSolution.title}</h3>
          </div>
          <a
            href={`/advertising-solutions/${nextSolution.slug}/`}
            className="adv-btn-primary"
          >
            <span>Explore Format</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default SolutionDetailPage;
