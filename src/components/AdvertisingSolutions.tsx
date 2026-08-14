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
    image: '/assets/solutions_digital_led.webp',
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
    image: '/assets/solutions_static_billboard.webp',
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
    image: '/assets/solutions_transit.webp',
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
    image: '/assets/solutions_building_wrap.webp',
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
    image: '/assets/solutions_pole_banner.webp',
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
    image: '/assets/solutions_mall_advertising.webp',
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
    image: '/assets/solutions_custom_ooh.webp',
    alt: 'Mind-bending 3D anamorphic corner LED screen display popping out of structure at night',
    buttonLabel: 'Explore Custom Solutions',
    link: '/advertising-solutions/custom-advertising/',
  },
];

// Extend PRODUCTS array to 5 sets so we have plenty of clones on both sides.
// Middle set sits at index range [N*2 .. N*3 - 1] (indices 14..20).
const extendedProducts = [
  ...PRODUCTS,
  ...PRODUCTS,
  ...PRODUCTS,
  ...PRODUCTS,
  ...PRODUCTS,
];

export interface AdvertisingSolutionsProps {
  variant?: 'dark' | 'light';
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const AdvertisingSolutions: React.FC<AdvertisingSolutionsProps> = ({
  variant = 'dark',
  autoPlay = true,
  autoPlayInterval = 4500,
}) => {
  const N = PRODUCTS.length;
  // Start at middle set (index N * 2 = 14)
  const [trackIndex, setTrackIndex] = useState<number>(N * 2);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.play().catch(() => {});
    }
  }, []);

  // The real 0-based index into PRODUCTS array
  const realIndex = ((trackIndex % N) + N) % N;

  const goToTrackIndex = useCallback(
    (targetIndex: number) => {
      if (trackIndex >= N * 3 || trackIndex < N * 2) {
        // If already outside middle set, normalize before moving
        const currentNorm = N * 2 + (((trackIndex % N) + N) % N);
        const diff = targetIndex - trackIndex;
        setIsTransitioning(false);
        setTrackIndex(currentNorm);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
            setTrackIndex(currentNorm + diff);
          });
        });
      } else {
        setIsTransitioning(true);
        setTrackIndex(targetIndex);
      }
    },
    [N, trackIndex]
  );

  const prevSlide = useCallback(() => {
    goToTrackIndex(trackIndex - 1);
  }, [trackIndex, goToTrackIndex]);

  const nextSlide = useCallback(() => {
    goToTrackIndex(trackIndex + 1);
  }, [trackIndex, goToTrackIndex]);

  // Clean, seamless loop boundary check on transition end
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;

    // If we moved outside the middle set (indices N*2..N*3-1), silently snap back into the middle set
    if (trackIndex >= N * 3 || trackIndex < N * 2) {
      const normalizedIndex = N * 2 + (((trackIndex % N) + N) % N);
      setIsTransitioning(false);
      setTrackIndex(normalizedIndex);

      // Re-enable transition on the next frame after DOM reflow
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  // AutoPlay timer effect
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isPaused, nextSlide]);

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
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
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
      const currentReal = ((trackIndex % N) + N) % N;
      let diff = realIdx - currentReal;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      goToTrackIndex(trackIndex + diff);
    },
    [N, trackIndex, goToTrackIndex]
  );

  const isLight = variant === 'light';

  return (
    <section
      id="advertising-solutions"
      className={`adv-solutions-section ${isLight ? 'adv-solutions-light' : 'adv-solutions-dark'}`}
      aria-label="Advertising Solutions Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Video (Dark Mode Only) */}
      {!isLight && (
        <>
          <video
            ref={bgVideoRef}
            className="adv-solutions-bg-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="assets/showcase_poster.jpg"
          >
            <source src="assets/showcase.mp4" type="video/mp4" />
            <source src="/assets/showcase.mp4" type="video/mp4" />
          </video>
          <div className="adv-solutions-bg-overlay" aria-hidden="true" />
        </>
      )}
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-10 w-[550px] h-[350px] bg-[#30579C]/25 blur-[140px] rounded-full pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[280px] bg-[#6C97D3]/20 blur-[130px] rounded-full pointer-events-none z-0" aria-hidden="true" />

      <div className="adv-solutions-container">
        {/* Section Header */}
        <div className="container section-header-container">
          <div className="section-header reveal-on-scroll">
            <h2 className="adv-section-h2">Our Solutions</h2>
          </div>
        </div>

        {/* Horizontal Card Carousel */}
        <div
          className="adv-carousel-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows */}
          <button
            type="button"
            className="adv-carousel-arrow adv-carousel-arrow--prev"
            onClick={prevSlide}
            aria-label="Previous solution"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            className="adv-carousel-arrow adv-carousel-arrow--next"
            onClick={nextSlide}
            aria-label="Next solution"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Track Viewport */}
          <div className={`adv-carousel-viewport ${!isTransitioning ? 'no-transition' : ''}`}>
            <div
              ref={trackRef}
              className={`adv-carousel-track ${!isTransitioning ? 'no-transition' : ''}`}
              style={{
                transform: `translateX(calc(50vw - ${(trackIndex + 0.5)} * var(--card-eff-width, 440px)))`,
                transition: isTransitioning
                  ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'none',
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
                        loading="eager"
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

