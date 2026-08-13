import React from 'react';

interface BrandItem {
  name: string;
  src: string;
}

export const BrandsSection: React.FC = () => {
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
      src: 'https://cdn.simpleicons.org/skechers/002b49',
    },
    {
      name: 'Yamaha',
      src: 'https://cdn.simpleicons.org/yamaha/e60012',
    },
    {
      name: 'Bingo Plus',
      src: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/BingoPlus_logo.png',
    },
  ];

  return (
    <section id="partners" className="clients-section" aria-label="Our Partners and Clients">
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


