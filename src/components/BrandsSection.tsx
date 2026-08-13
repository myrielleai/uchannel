import React from 'react';

export const BrandsSection: React.FC = () => {
  const row1Logos = [
    { name: 'San Miguel Corporation', src: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/San_Miguel_Corporation_logo.svg' },
    { name: 'Jollibee', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Jollibee_Foods_Corporation_logo.svg' },
    { name: 'Cebu Pacific', src: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Cebu_Pacific_logo.png' },
    { name: 'Samsung', src: 'https://cdn.simpleicons.org/samsung/1428a0' },
    { name: 'Grab', src: 'https://cdn.simpleicons.org/grab/00b14f' },
    { name: 'CDO FoodSphere', src: '/assets/cdo.webp' },
    { name: 'Bureau of Fisheries', src: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Bureau_of_Fisheries_and_Aquatic_Resources_%28BFAR%29.svg' },
    { name: 'Emperador Inc', src: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Emperador_Inc_logo.png' },
  ];

  const row2Logos = [
    { name: 'Foodpanda', src: 'https://cdn.simpleicons.org/foodpanda/d60356' },
    { name: 'New Balance', src: 'https://cdn.simpleicons.org/newbalance/e21836' },
    { name: 'Skechers', src: 'https://cdn.simpleicons.org/skechers/002b49' },
    { name: 'Yamaha', src: 'https://cdn.simpleicons.org/yamaha/e60012' },
    { name: 'Bingo Plus', src: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/BingoPlus_logo.png' },
    { name: 'San Miguel Corporation', src: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/San_Miguel_Corporation_logo.svg' },
    { name: 'Grab', src: 'https://cdn.simpleicons.org/grab/00b14f' },
    { name: 'Samsung', src: 'https://cdn.simpleicons.org/samsung/1428a0' },
  ];

  return (
    <section id="partners" className="clients-section" aria-label="Our Partners and Clients">
      {/* Subtle background pattern */}
      <div className="clients-bg-pattern" aria-hidden="true" />

      <div className="container clients-container">
        {/* Section Header */}
        <div className="clients-header">
          <span className="label-tag">Trusted Partners</span>
          <h2 className="clients-headline">
            Brands That Choose <span className="headline-accent">U Channel</span>
          </h2>
          <p className="clients-subtext">
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
      </div>

      {/* Scrolling logo marquee rows */}
      <div className="clients-marquee-wrap">
        {/* Row 1 — scrolls left */}
        <div className="clients-marquee-row" aria-hidden="true">
          <div className="clients-marquee-track clients-track-left">
            <div className="clients-marquee-group">
              {row1Logos.map((logo, idx) => (
                <div key={`r1-1-${idx}`} className="client-logo-card">
                  <img src={logo.src} alt={logo.name} loading="lazy" />
                </div>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="clients-marquee-group" aria-hidden="true">
              {row1Logos.map((logo, idx) => (
                <div key={`r1-2-${idx}`} className="client-logo-card">
                  <img src={logo.src} alt={logo.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="clients-marquee-row" aria-hidden="true">
          <div className="clients-marquee-track clients-track-right">
            <div className="clients-marquee-group">
              {row2Logos.map((logo, idx) => (
                <div key={`r2-1-${idx}`} className="client-logo-card">
                  <img src={logo.src} alt={logo.name} loading="lazy" />
                </div>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="clients-marquee-group" aria-hidden="true">
              {row2Logos.map((logo, idx) => (
                <div key={`r2-2-${idx}`} className="client-logo-card">
                  <img src={logo.src} alt={logo.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fade masks */}
        <div className="clients-fade-left" aria-hidden="true" />
        <div className="clients-fade-right" aria-hidden="true" />
      </div>

    </section>
  );
};
