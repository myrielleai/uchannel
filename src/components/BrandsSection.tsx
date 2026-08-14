import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BrandItem {
  name: string;
  src: string;
}

export const BrandsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const BRANDS: BrandItem[] = [
    {
      name: 'San Miguel Corporation',
      src: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/San_Miguel_Corporation_logo.svg',
    },
    {
      name: 'Jollibee',
      src: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Jollibee_Foods_Corporation_logo.svg',
    },
    {
      name: 'Cebu Pacific',
      src: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Cebu_Pacific_logo.png',
    },
    {
      name: 'Samsung',
      src: 'https://cdn.simpleicons.org/samsung/1428a0',
    },
    {
      name: 'Grab',
      src: 'https://cdn.simpleicons.org/grab/00b14f',
    },
    {
      name: 'CDO FoodSphere',
      src: '/assets/cdo.webp',
    },
    {
      name: 'Emperador Inc',
      src: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Emperador_Inc_logo.png',
    },
    {
      name: 'Foodpanda',
      src: 'https://cdn.simpleicons.org/foodpanda/d60356',
    },
    {
      name: 'New Balance',
      src: 'https://cdn.simpleicons.org/newbalance/e21836',
    },
    {
      name: 'Skechers',
      src: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Skechers_wordmark.svg',
    },
    {
      name: 'Yamaha',
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Yamaha_logo_text.svg',
    },
    {
      name: 'Bingo Plus',
      src: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/BingoPlus_logo.png',
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Header reveal
      const header = section.querySelector('.clients-header');
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 2. Stats reveal
      const stats = section.querySelectorAll('.clients-stat');
      if (stats.length > 0) {
        gsap.fromTo(
          stats,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: section.querySelector('.clients-stats-row') || section,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 3. Logo items stagger reveal
      const logoItems = section.querySelectorAll('.flat-logo-item');
      if (logoItems.length > 0) {
        gsap.fromTo(
          logoItems,
          { opacity: 0, y: 25, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section.querySelector('.flat-logo-grid') || section,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="partners" className="clients-section" aria-label="Our Partners and Clients">
      {/* Subtle background pattern */}
      <div className="clients-bg-pattern" aria-hidden="true" />

      <div className="container clients-container">
        {/* Section Header */}
        <div className="adv-section-header clients-header">
          <h2 className="adv-section-h2 clients-headline">
            Brands that choose<br />
            <span style={{ color: '#FB9B51' }}>U Channel</span>
          </h2>
          <p className="adv-section-desc clients-subtext">
            From global conglomerates to homegrown champions — the Philippines' most iconic brands trust U Channel to put them in the spotlight.
          </p>
        </div>

        {/* Stats row */}
        <div className="clients-stats-row">
          <div className="clients-stat">
            <span className="clients-stat-number">
              50<span className="clients-stat-plus">+</span>
            </span>
            <span className="clients-stat-label">Brands Served</span>
          </div>
          <div className="clients-stat-divider" aria-hidden="true" />
          <div className="clients-stat">
            <span className="clients-stat-number">
              200<span className="clients-stat-plus">+</span>
            </span>
            <span className="clients-stat-label">Campaigns Launched</span>
          </div>
          <div className="clients-stat-divider" aria-hidden="true" />
          <div className="clients-stat">
            <span className="clients-stat-number">6</span>
            <span className="clients-stat-label">Cities Covered</span>
          </div>
          <div className="clients-stat-divider" aria-hidden="true" />
          <div className="clients-stat">
            <span className="clients-stat-number">
              10M<span className="clients-stat-plus">+</span>
            </span>
            <span className="clients-stat-label">Daily Impressions</span>
          </div>
        </div>

        {/* Flat Logo Grid */}
        <div className="clients-grid flat-logo-grid">
          {BRANDS.map((brand, idx) => (
            <div key={`brand-${idx}`} className="flat-logo-item" title={brand.name}>
              <img src={brand.src} alt={brand.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


