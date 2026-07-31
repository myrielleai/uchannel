import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface SolutionProduct {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  buttonLabel: string;
  link: string;
}

const PRODUCTS: SolutionProduct[] = [
  {
    id: 'digital-led',
    number: '01',
    title: 'Digital LED Billboards',
    description:
      'Ultra-HD dynamic 4K screens contextually scheduled across high-density commercial hubs to captivate audiences with unmatched visual brilliance.',
    image: 'assets/solutions_digital_led.png',
    alt: 'High-tech 3D ultra-HD curved digital LED billboard display in Manila at dusk',
    buttonLabel: 'Explore Digital LED',
    link: '/advertising-solutions/digital-led-billboards/',
  },
  {
    id: 'static-billboards',
    number: '02',
    title: 'Static Billboards',
    description:
      'Large-format static displays positioned along major transit arteries, delivering continuous, unmissable brand authority day and night.',
    image: 'assets/solutions_static_billboard.png',
    alt: 'Massive luxury static billboard display on modern highway overpass at golden hour',
    buttonLabel: 'Explore Static Billboards',
    link: '/advertising-solutions/static-billboards/',
  },
  {
    id: 'transit-advertising',
    number: '03',
    title: 'Transit Advertising',
    description:
      'Full-vehicle wraps and high-definition digital screens synced across high-frequency transport routes to move your message everywhere commuters travel.',
    image: 'assets/solutions_transit.png',
    alt: 'Sleek electric transit bus fully wrapped in luxury brand campaign',
    buttonLabel: 'Explore Transit Ads',
    link: '/advertising-solutions/transit-advertising/',
  },
  {
    id: 'building-wraps',
    number: '04',
    title: 'Building Wraps',
    description:
      'Mega-scale building facade graphics that transform landmark urban architecture into colossal, unmissable brand spectacles visible across entire cities.',
    image: 'assets/solutions_building_wrap.png',
    alt: 'Colossal full-facade building wrap advertisement on a skyscraper at sunset',
    buttonLabel: 'Explore Building Wraps',
    link: '/advertising-solutions/building-wraps/',
  },
  {
    id: 'pole-banners',
    number: '05',
    title: 'Pole Banners',
    description:
      'High-density double-sided street-level banner placements lining premier shopping and financial avenues to reinforce brand identity through high repetition.',
    image: 'assets/solutions_pole_banner.png',
    alt: 'Row of elegant double-sided street pole banners on sunlit boulevard',
    buttonLabel: 'Explore Pole Banners',
    link: '/advertising-solutions/pole-banners/',
  },
  {
    id: 'mall-advertising',
    number: '06',
    title: 'Mall Advertising',
    description:
      'High-impact indoor and outdoor digital displays positioned throughout premier commercial hubs to engage shoppers at key decision points.',
    image: 'assets/solutions_mall_advertising.png',
    alt: 'Vibrant digital LED displays in high-foot-traffic luxury shopping mall atrium',
    buttonLabel: 'Explore Mall Ads',
    link: '/advertising-solutions/mall-advertising/',
  },
  {
    id: 'custom-solutions',
    number: '07',
    title: 'Custom Solutions',
    description:
      'Bespoke 3D anamorphic displays, interactive sensory installations, and custom OOH activations engineered to create viral moments and lasting impact.',
    image: 'assets/solutions_custom_ooh.png',
    alt: 'Mind-bending 3D anamorphic corner LED screen display popping out of structure at night',
    buttonLabel: 'Explore Custom Solutions',
    link: '/advertising-solutions/custom-advertising/',
  },
];

// Extend PRODUCTS array to 3 full sets: [clones left] + [real items] + [clones right]
// This provides an ample buffer for rapid navigation and seamless looping.
const extendedProducts = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS];

export const AdvertisingSolutions: React.FC = () => {
  // Real items sit at indices PRODUCTS.length .. PRODUCTS.length * 2 - 1 (indices 7..13)
  const [trackIndex, setTrackIndex] = useState<number>(PRODUCTS.length);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // The real index into PRODUCTS (0-based)
  const realIndex =
    ((trackIndex - PRODUCTS.length) % PRODUCTS.length + PRODUCTS.length) % PRODUCTS.length;

  const goToTrackIndex = useCallback((newIndex: number) => {
    if (trackRef.current) {
      trackRef.current.style.transition = '';
    }
    setTrackIndex(newIndex);
  }, []);

  const prevSlide = useCallback(() => {
    goToTrackIndex(trackIndex - 1);
  }, [trackIndex, goToTrackIndex]);

  const nextSlide = useCallback(() => {
    goToTrackIndex(trackIndex + 1);
  }, [trackIndex, goToTrackIndex]);

  // After the CSS transition ends, silently reset to the real position if we're in a clone zone.
  // Crucial: Filter events so ONLY the track's own transform transitionend triggers the silent jump.
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;

    const N = PRODUCTS.length;
    const track = trackRef.current;
    if (!track) return;

    if (trackIndex >= N * 2) {
      // Slid into the right clone set — jump back by N items silently
      const targetIndex = trackIndex - N;
      track.style.transition = 'none';
      setTrackIndex(targetIndex);
      void track.offsetHeight; // Synchronous reflow commit
      requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = '';
        }
      });
    } else if (trackIndex < N) {
      // Slid into the left clone set — jump forward by N items silently
      const targetIndex = trackIndex + N;
      track.style.transition = 'none';
      setTrackIndex(targetIndex);
      void track.offsetHeight; // Synchronous reflow commit
      requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = '';
        }
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (diffX > minSwipeDistance) {
      nextSlide();
    } else if (diffX < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Go to a specific real product index using the shortest path
  const goToRealIndex = useCallback(
    (realIdx: number) => {
      const N = PRODUCTS.length;
      const currentReal = ((trackIndex - N) % N + N) % N;
      let diff = realIdx - currentReal;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      goToTrackIndex(trackIndex + diff);
    },
    [trackIndex, goToTrackIndex]
  );

  return (
    <section
      id="advertising-solutions"
      className="adv-solutions-section"
      aria-label="Advertising Solutions Showcase"
    >
      {/* Background Video */}
      <video
        className="adv-solutions-bg-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="assets/showcase.mp4" type="video/mp4" />
      </video>
      <div className="adv-solutions-bg-overlay" aria-hidden="true" />
      <div className="absolute top-1/3 left-10 w-[500px] h-[300px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="adv-solutions-container">
        {/* Section Header */}
        <div className="container section-header-container">
          <div className="section-header reveal-on-scroll">
            <h2 className="section-headline">Our Solutions</h2>
          </div>
        </div>

        {/* Horizontal Card Carousel */}
        <div
          className="adv-carousel-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Track Viewport */}
          <div className="adv-carousel-viewport">
            <div
              ref={trackRef}
              className="adv-carousel-track"
              style={{
                transform: `translateX(calc(50vw - ${(trackIndex + 0.5)} * var(--card-eff-width, 440px)))`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedProducts.map((prod, index) => {
                const isActive = index === trackIndex;
                const distance = index - trackIndex;

                let cardClass = 'adv-card';
                if (isActive) {
                  cardClass += ' is-active';
                } else if (distance < 0) {
                  cardClass += ' is-prev';
                } else {
                  cardClass += ' is-next';
                }

                return (
                  <div
                    key={`${prod.id}-${index}`}
                    className={cardClass}
                    style={{
                      zIndex: 100 - Math.abs(distance) * 10,
                    }}
                    onClick={() => goToTrackIndex(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${prod.title} solution card`}
                  >
                    <div className="adv-card-inner">
                      {/* Background Image */}
                      <img
                        src={prod.image}
                        alt={prod.alt}
                        className="adv-card-img"
                        loading={Math.abs(distance) <= 2 ? 'eager' : 'lazy'}
                        decoding="async"
                      />

                      {/* Image Overlay */}
                      <div className="adv-card-overlay" aria-hidden="true" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Card Details Below Carousel */}
        {(() => {
          const activeProd = PRODUCTS[realIndex];
          return (
            <div className="adv-active-details container">
              <div className="adv-active-details-inner" key={activeProd.id}>
                <h3 className="adv-active-title">{activeProd.title}</h3>
                <p className="adv-active-desc">{activeProd.description}</p>
                <div className="adv-active-action">
                  <a
                    href={activeProd.link}
                    className="adv-active-btn"
                    aria-label={`Explore ${activeProd.title}`}
                  >
                    <span>{activeProd.buttonLabel}</span>
                    <svg
                      className="adv-card-arrow-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Pagination Indicators */}
        <div className="adv-pagination container">
          {PRODUCTS.map((prod, index) => (
            <button
              key={prod.id}
              type="button"
              className={`adv-pagination-dot ${index === realIndex ? 'is-active' : ''}`}
              onClick={() => goToRealIndex(index)}
              aria-label={`Go to slide ${index + 1}: ${prod.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvertisingSolutions;
