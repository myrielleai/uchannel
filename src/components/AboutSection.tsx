import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  location: string;
}

const CAROUSEL_PHOTOS: ImageItem[] = [
  {
    id: 1,
    src: 'assets/about_digital_led.png',
    alt: 'Colossal ultra-HD curved digital LED display at night in Manila',
    title: 'Ultra-HD Curved LED Displays',
    category: 'Digital Display Tech',
    location: 'EDSA & Key Financial Districts',
  },
  {
    id: 2,
    src: 'assets/about_billboard_install.png',
    alt: 'Premium billboard installation by expert crew along major highway',
    title: 'Prime Highway Billboards',
    category: 'Static & Mega Structures',
    location: 'SLEX, NLEX & Radial Corridors',
  },
  {
    id: 3,
    src: 'assets/about_campaign_execution.png',
    alt: 'Sequential high-end advertising street banners at twilight',
    title: 'Nationwide Campaign Execution',
    category: 'Transit & Street Network',
    location: 'Luzon, Visayas & Mindanao',
  },
  {
    id: 4,
    src: 'assets/about_client_showcase.png',
    alt: 'Flagship luxury brand storefront with interactive digital screens',
    title: 'Market-Leading Brand Showcase',
    category: 'Commercial Activation',
    location: 'Premium Malls & Retail Hubs',
  },
  {
    id: 5,
    src: 'assets/solutions_building_wrap.png',
    alt: 'Colossal building wrap billboard dominating city skyline',
    title: 'High-Rise Building Wraps',
    category: 'Iconic Landmarks',
    location: 'BGC, Makati & Ortigas Center',
  },
  {
    id: 6,
    src: 'assets/about_team_at_work.png',
    alt: 'Creative marketing and technical team collaborating',
    title: 'Dedicated Media Strategists',
    category: 'Engineering & Operations',
    location: 'U Channel Headquarters',
  },
];

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const third1Ref = useRef<HTMLDivElement>(null);
  const third2Ref = useRef<HTMLDivElement>(null);
  const third3Ref = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  const dragStartYRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Smooth lerp progress towards target activeIndex + drag displacement
  useEffect(() => {
    const cardStep = 580; // step height per slide matching stage card height + gap
    const targetProgress = activeIndex - dragOffsetY / cardStep;

    const animate = () => {
      setCurrentProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.001) return targetProgress;
        return prev + diff * 0.14; // smooth dampening
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activeIndex, dragOffsetY]);

  // Handle slide selection infinitely
  const goToSlide = useCallback((targetIndex: number) => {
    const N = CAROUSEL_PHOTOS.length;
    setActiveIndex((prev) => {
      const currentNormalized = ((prev % N) + N) % N;
      let diff = targetIndex - currentNormalized;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      return prev + diff;
    });
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => prev - 1);
  }, []);

  // Infinite auto-advance when not dragged
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [isDragging, nextSlide]);

  // Drag Gesture Handlers (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    setDragOffsetY(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartYRef.current;
    setDragOffsetY(deltaY);
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap to next/prev depending on drag displacement
    if (dragOffsetY < -50) {
      nextSlide();
    } else if (dragOffsetY > 50) {
      prevSlide();
    }
    setDragOffsetY(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartYRef.current = e.touches[0].clientY;
    setDragOffsetY(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - dragStartYRef.current;
    setDragOffsetY(deltaY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffsetY < -50) {
      nextSlide();
    } else if (dragOffsetY > 50) {
      prevSlide();
    }
    setDragOffsetY(0);
  };

  // GSAP scroll entrance animation
  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryContainerRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      // Staggered text fade & slide up with blur reveal
      const textElements = section.querySelectorAll('.animate-about-text');
      if (textElements.length > 0) {
        gsap.fromTo(
          textElements,
          {
            opacity: 0,
            y: 32,
            filter: 'blur(8px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              once: true,
            },
          }
        );
      }

      // Staggered stat boxes spring reveal
      const statCards = section.querySelectorAll('.animate-about-stat');
      if (statCards.length > 0) {
        gsap.fromTo(
          statCards,
          {
            opacity: 0,
            y: 24,
            scale: 0.92,
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.75,
            stagger: 0.08,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: third3Ref.current || section,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      if (gallery) {
        gsap.fromTo(
          gallery,
          { opacity: 0, scale: 0.95, y: 40, filter: 'blur(10px)' },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    // Refresh ScrollTrigger after React component layout mounts and settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero-step-2"
      ref={sectionRef}
      className="relative z-10 w-full bg-[#030712] py-16 sm:py-24 lg:py-32 text-white overflow-hidden border-t border-b border-slate-800/60"
      aria-label="About U Channel"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-40 mix-blend-luminosity"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="assets/services.mp4" type="video/mp4" />
      </video>

      {/* Background radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.75),rgba(3,7,18,0.92))] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-10 w-[500px] h-[300px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* =========================================================================
              LEFT COLUMN: Split cleanly into 3rds
              ========================================================================= */}
          <div
            ref={leftColRef}
            className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:space-y-0 py-2"
          >
            {/* 1st THIRD: Title & Identity */}
            <div
              ref={third1Ref}
              className="flex flex-col justify-center space-y-4"
            >
              <h2 className="font-display font-black text-white tracking-tight leading-[1.1] flex flex-col gap-1">
                <span className="animate-about-text text-sm sm:text-base font-medium text-slate-400 uppercase tracking-[0.25em] font-body transition-colors duration-300 hover:text-blue-400 select-none">
                  This is
                </span>
                <span className="animate-about-text text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent transition-all duration-500 hover:tracking-wide select-none">
                  U Channel
                </span>
              </h2>

              <p className="animate-about-text text-slate-300 font-body text-sm sm:text-base font-light tracking-wide leading-relaxed transition-colors duration-300 hover:text-white">
                The Philippines' premier out-of-home (OOH) media ecosystem and digital LED network provider.
              </p>
            </div>

            {/* 2nd THIRD: U Channel Description */}
            <div
              ref={third2Ref}
              className="flex flex-col justify-center space-y-4"
            >
              <h3 className="animate-about-text font-display font-bold text-xl sm:text-2xl text-white tracking-tight transition-colors duration-300 hover:text-blue-300">
                Connecting Brands with Millions Daily
              </h3>

              <div className="space-y-3 text-slate-300 font-body text-sm sm:text-base leading-relaxed font-light">
                <p className="animate-about-text transition-colors duration-300 hover:text-slate-100">
                  U Channel transforms high-traffic urban thoroughfares into unmissable brand experiences. Through ultra-HD digital LED billboards, colossal highway structures, transit media, and interactive activations, we deliver unmatched visibility across Metro Manila and key economic hubs nationwide.
                </p>
                <p className="animate-about-text text-slate-400 text-xs sm:text-sm transition-colors duration-300 hover:text-slate-300">
                  From strategic planning to flawless execution, we empower top global and domestic brands to dominate prime corridors and drive lasting audience retention.
                </p>
              </div>
            </div>

            {/* 3rd THIRD: U Channel's Impact */}
            <div
              ref={third3Ref}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="animate-about-stat flex flex-col p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-blue-500/20 group cursor-default">
                  <span className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight transition-colors duration-300 group-hover:text-blue-300 inline-block">
                    380K+
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mt-1 transition-colors duration-300 group-hover:text-blue-200">
                    Daily Reach
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 transition-colors duration-300 group-hover:text-slate-300">High Impressions</span>
                </div>

                <div className="animate-about-stat flex flex-col p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-blue-500/20 group cursor-default">
                  <span className="text-2xl sm:text-3xl font-black font-display text-blue-400 tracking-tight transition-colors duration-300 group-hover:text-blue-300 inline-block">
                    100%
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mt-1 transition-colors duration-300 group-hover:text-blue-200">
                    Coverage
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 transition-colors duration-300 group-hover:text-slate-300">Luzon VisMind</span>
                </div>

                <div className="animate-about-stat flex flex-col p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-blue-500/20 group cursor-default">
                  <span className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight transition-colors duration-300 group-hover:text-blue-300 inline-block">
                    24/7
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mt-1 transition-colors duration-300 group-hover:text-blue-200">
                    Exposure
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 transition-colors duration-300 group-hover:text-slate-300">4K Dynamic LED</span>
                </div>

                <div className="animate-about-stat flex flex-col p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-blue-500/20 group cursor-default">
                  <span className="text-2xl sm:text-3xl font-black font-display text-blue-400 tracking-tight transition-colors duration-300 group-hover:text-blue-300 inline-block">
                    150+
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mt-1 transition-colors duration-300 group-hover:text-blue-200">
                    Locations
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 transition-colors duration-300 group-hover:text-slate-300">Prime Sites</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Non-Overlapping Editorial Vertical Carousel Gallery
              - Positioned on rightmost side
              - Clean single-stage view with smooth non-overlapping slide transitions
              ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col h-full relative pl-0 sm:pl-4 justify-center">
            <div
              ref={galleryContainerRef}
              onMouseLeave={handleMouseUpOrLeave}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full h-[520px] sm:h-[620px] lg:h-[680px] relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/80 shadow-2xl backdrop-blur-md select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Photo Slides Container (Strict 0-overlap vertical slide math) */}
              <div className="w-full h-full relative overflow-hidden">
                {CAROUSEL_PHOTOS.map((photo, index) => {
                  const N = CAROUSEL_PHOTOS.length;
                  const modProgress = ((currentProgress % N) + N) % N;
                  const rawD = index - modProgress;
                  let d = (rawD + N / 2) % N;
                  if (d < 0) d += N;
                  d -= N / 2;

                  const absD = Math.abs(d);

                  // NON-OVERLAPPING POSITIONING:
                  // Each slide is offset vertically by d * (100% + 28px gap).
                  // At d=0, photo fills the stage.
                  // At d=1, photo is 100% + 28px below.
                  // At d=-1, photo is -100% - 28px above.
                  const translateYPercent = d * 100;
                  const translateYGap = d * 28;
                  const opacity = Math.max(0, 1 - Math.min(1, absD * 0.9));
                  const isCenter = absD < 0.4;
                  const isVisible = absD < 1.4;

                  if (!isVisible) return null;

                  return (
                    <div
                      key={photo.id}
                      onClick={() => !isCenter && goToSlide(index)}
                      style={{
                        transform: `translateY(calc(${translateYPercent}% + ${translateYGap}px))`,
                        opacity,
                        pointerEvents: isCenter ? 'auto' : 'none',
                      }}
                      className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950"
                    >
                      {/* Image */}
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                          isCenter ? 'scale-100' : 'scale-105 brightness-75'
                        }`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />

                      {/* Dark Vignette Gradient for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/30 pointer-events-none" />

                      {/* Bottom-Left Title & Location Overlay with smooth text transitions */}
                      <div
                        className={`absolute bottom-8 left-6 right-20 z-20 flex flex-col items-start pointer-events-none transition-all duration-700 ease-out ${
                          isCenter ? 'opacity-100 translate-y-0 blur-0 scale-100' : 'opacity-0 translate-y-6 blur-sm scale-95'
                        }`}
                      >
                        <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-white leading-tight tracking-tight drop-shadow-md transition-transform duration-500">
                          {photo.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 font-light mt-2 flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 transition-all duration-500 delay-100">
                          <span className="text-blue-400 font-bold animate-pulse">📍</span> {photo.location}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vertical Indicator Dots (Right Edge) */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 bg-slate-900/60 border border-white/10 backdrop-blur-md px-2 py-3 rounded-full shadow-lg">
                {CAROUSEL_PHOTOS.map((_, idx) => {
                  const N = CAROUSEL_PHOTOS.length;
                  const normalizedActiveIndex = ((activeIndex % N) + N) % N;
                  const isActive = normalizedActiveIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        isActive
                          ? 'w-2.5 h-6 bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.6)]'
                          : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/70'
                      }`}
                      aria-label={`Jump to photo ${idx + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

