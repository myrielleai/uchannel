import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PhotoItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  location: string;
  isLarge: boolean;
}

const ABOUT_PHOTOS: PhotoItem[] = [
  // Row 1: [ large immersive display photo ] [ smaller photo ]
  {
    id: 1,
    src: '/assets/about_digital_led.webp',
    alt: 'Colossal ultra-HD curved digital LED display at night in Manila',
    title: 'Ultra-HD Curved LED Displays',
    category: 'Digital Display Tech',
    location: 'EDSA & Key Financial Districts',
    isLarge: true,
  },
  {
    id: 2,
    src: '/assets/about_billboard_install.webp',
    alt: 'Premium billboard installation by expert crew along major highway',
    title: 'Prime Highway Billboards',
    category: 'Static & Mega Structures',
    location: 'SLEX & NLEX Corridors',
    isLarge: false,
  },
  // Row 2: [ smaller photo ] [ large display photo ]
  {
    id: 3,
    src: '/assets/about_campaign_execution.webp',
    alt: 'Sequential high-end advertising street banners at twilight',
    title: 'Nationwide Campaign Execution',
    category: 'Transit & Street Network',
    location: 'Luzon, Visayas & Mindanao',
    isLarge: false,
  },
  {
    id: 4,
    src: '/assets/solutions_building_wrap.webp',
    alt: 'Colossal building wrap billboard dominating city skyline',
    title: 'High-Rise Building Wraps',
    category: 'Iconic Landmarks',
    location: 'BGC, Makati & Ortigas Center',
    isLarge: true,
  },
];

const STAT_CARDS = [
  {
    value: '28+',
    label: 'Years of Industry Experience',
    highlight: true,
  },
  {
    value: '2022',
    label: 'Year Founded',
    highlight: false,
  },
  {
    value: 'Nationwide',
    label: 'Reach Across the Philippines',
    highlight: true,
  },
  {
    value: 'End-to-End',
    label: 'Display & OOH Solutions',
    highlight: false,
  },
];

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Text reveal animation
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

      // Stat cards spring reveal
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
              trigger: statCards[0] || section,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Photo grid reveal animation
      const photoCards = section.querySelectorAll('.animate-about-photo');
      if (photoCards.length > 0) {
        gsap.fromTo(
          photoCards,
          {
            opacity: 0,
            y: 40,
            scale: 0.95,
            filter: 'blur(8px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: photoCards[0] || section,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

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
      className="relative z-10 w-full bg-[#020617] py-16 sm:py-24 lg:py-32 text-white overflow-hidden border-t border-b border-slate-800/60"
      aria-label="About U Channel"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="services-video-bg"
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

      {/* Background radial gradients */}
      <div className="services-video-overlay" aria-hidden="true" />
      <div className="absolute top-1/4 left-10 w-[550px] h-[350px] bg-[#30579C]/25 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[280px] bg-[#6C97D3]/20 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-4">
          {/* Animated glow keyframes */}
          <style>{`
            @keyframes seenGlow {
              0%, 100% { text-shadow: 0 0 20px rgba(251,155,81,0.4), 0 0 40px rgba(251,155,81,0.15); }
              50% { text-shadow: 0 0 30px rgba(251,155,81,0.7), 0 0 60px rgba(251,155,81,0.3), 0 0 90px rgba(251,155,81,0.1); }
            }
            @keyframes subtleFloat {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            @keyframes shimmerBorder {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }
          `}</style>
          <h2 className="animate-about-text font-display font-black text-center select-none leading-none tracking-tight">
            {/* Line 1: "Where" — small, light, ethereal */}
            <span className="block text-lg sm:text-xl lg:text-2xl font-medium tracking-[0.3em] uppercase text-slate-400 mb-3 sm:mb-4">
              Where
            </span>
            {/* Line 2: "GREAT BRANDS" — oversized, gradient, hero-weight */}
            <span
              className="block text-5xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-black tracking-tight leading-[0.95] bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500 ease-out cursor-pointer hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-200 hover:drop-shadow-[0_0_45px_rgba(59,130,246,0.7)] hover:scale-[1.03]"
              style={{ animation: 'subtleFloat 6s ease-in-out infinite' }}
            >
              GREAT BRANDS
            </span>
            {/* Line 3: "get SEEN." — medium weight with accent glow on SEEN */}
            <span className="block mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white/80 tracking-tight">
              get{' '}
              <span
                className="inline-block text-[#FB9B51] font-black transition-all duration-300 ease-out cursor-pointer hover:scale-110 hover:-translate-y-1 hover:tracking-wider"
                style={{ animation: 'seenGlow 3s ease-in-out infinite' }}
              >
                SEEN
              </span>
              <span className="text-white/40">.</span>
            </span>
          </h2>

          <p className="animate-about-text text-slate-300 font-body text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-3xl mx-auto text-center">
            Founded in 2022 by Rico Uy, U Channel combines 28+ years of industry experience with innovative digital display and OOH solutions.
          </p>
        </div>

        {/* Stat / Highlight Cards (Placed directly BELOW the paragraph) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2 pb-4">
          {STAT_CARDS.map((stat, idx) => (
            <div
              key={idx}
              className="animate-about-stat relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-[#FB9B51]/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FB9B51] hover:bg-slate-900/90 hover:shadow-xl hover:shadow-[#FB9B51]/20 group cursor-default"
            >
              {/* Top Glowing Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FB9B51] to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

              <span
                className={`text-3xl sm:text-4xl font-black font-display tracking-tight transition-all duration-300 ${
                  stat.highlight
                    ? 'text-[#FB9B51] drop-shadow-[0_0_15px_rgba(251,155,81,0.4)] group-hover:scale-105'
                    : 'text-white group-hover:text-[#FB9B51] group-hover:scale-105'
                }`}
              >
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-300 mt-3 leading-snug transition-colors duration-300 group-hover:text-white">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Photo Grid Section (AFTER the cards) */}
        {/* Layout:
            [ large immersive display photo ] [ smaller photo ]
            [ smaller photo ] [ large display photo ]
        */}
        <div className="space-y-6 pt-4">
          {/* Row 1: [ large immersive display photo ] (7 cols) [ smaller photo ] (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Top Left: Large Immersive Display Photo */}
            <div
              onClick={() => setSelectedPhoto(ABOUT_PHOTOS[0])}
              className="animate-about-photo lg:col-span-7 group relative h-[320px] sm:h-[400px] lg:h-[460px] rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl cursor-pointer transition-all duration-500 hover:border-[#FB9B51]/60 hover:shadow-[0_0_40px_rgba(251,155,81,0.18)]"
            >
              <img
                src={ABOUT_PHOTOS[0].src}
                alt={ABOUT_PHOTOS[0].alt}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Cinematic amber color grade overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FB9B51]/0 via-[#FB9B51]/0 to-[#c9621e]/0 group-hover:from-[#FB9B51]/20 group-hover:via-[#d97706]/10 group-hover:to-[#c9621e]/25 transition-all duration-700 ease-out mix-blend-color-dodge pointer-events-none z-[1]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 z-[2]" />

              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col items-start space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#FB9B51]/20 backdrop-blur-md border border-[#FB9B51]/40 text-[#FB9B51] text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-[#FB9B51]/30 group-hover:border-[#FB9B51]/70">
                  {ABOUT_PHOTOS[0].category}
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight group-hover:text-[#FB9B51] transition-colors duration-300">
                  {ABOUT_PHOTOS[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light flex items-center gap-1.5">
                  <span className="text-[#FB9B51] font-bold">📍</span> {ABOUT_PHOTOS[0].location}
                </p>
              </div>

              <div className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-[#FB9B51]/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:border-[#FB9B51] group-hover:text-[#FB9B51] transition-all duration-300 group-hover:scale-110">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>

            {/* Top Right: Smaller Photo */}
            <div
              onClick={() => setSelectedPhoto(ABOUT_PHOTOS[1])}
              className="animate-about-photo lg:col-span-5 group relative h-[320px] sm:h-[400px] lg:h-[460px] rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl cursor-pointer transition-all duration-500 hover:border-[#FB9B51]/60 hover:shadow-[0_0_40px_rgba(251,155,81,0.18)]"
            >
              <img
                src={ABOUT_PHOTOS[1].src}
                alt={ABOUT_PHOTOS[1].alt}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Cinematic amber color grade overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FB9B51]/0 via-[#FB9B51]/0 to-[#c9621e]/0 group-hover:from-[#FB9B51]/20 group-hover:via-[#d97706]/10 group-hover:to-[#c9621e]/25 transition-all duration-700 ease-out mix-blend-color-dodge pointer-events-none z-[1]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 z-[2]" />

              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col items-start space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#FB9B51]/20 backdrop-blur-md border border-[#FB9B51]/40 text-[#FB9B51] text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-[#FB9B51]/30 group-hover:border-[#FB9B51]/70">
                  {ABOUT_PHOTOS[1].category}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight group-hover:text-[#FB9B51] transition-colors duration-300">
                  {ABOUT_PHOTOS[1].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light flex items-center gap-1.5">
                  <span className="text-[#FB9B51] font-bold">📍</span> {ABOUT_PHOTOS[1].location}
                </p>
              </div>

              <div className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-[#FB9B51]/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:border-[#FB9B51] group-hover:text-[#FB9B51] transition-all duration-300 group-hover:scale-110">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2: [ smaller photo ] (5 cols) [ large display photo ] (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Bottom Left: Smaller Photo */}
            <div
              onClick={() => setSelectedPhoto(ABOUT_PHOTOS[2])}
              className="animate-about-photo lg:col-span-5 group relative h-[320px] sm:h-[400px] lg:h-[460px] rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl cursor-pointer transition-all duration-500 hover:border-[#FB9B51]/60 hover:shadow-[0_0_40px_rgba(251,155,81,0.18)]"
            >
              <img
                src={ABOUT_PHOTOS[2].src}
                alt={ABOUT_PHOTOS[2].alt}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Cinematic amber color grade overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FB9B51]/0 via-[#FB9B51]/0 to-[#c9621e]/0 group-hover:from-[#FB9B51]/20 group-hover:via-[#d97706]/10 group-hover:to-[#c9621e]/25 transition-all duration-700 ease-out mix-blend-color-dodge pointer-events-none z-[1]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 z-[2]" />

              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col items-start space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#FB9B51]/20 backdrop-blur-md border border-[#FB9B51]/40 text-[#FB9B51] text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-[#FB9B51]/30 group-hover:border-[#FB9B51]/70">
                  {ABOUT_PHOTOS[2].category}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight group-hover:text-[#FB9B51] transition-colors duration-300">
                  {ABOUT_PHOTOS[2].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light flex items-center gap-1.5">
                  <span className="text-[#FB9B51] font-bold">📍</span> {ABOUT_PHOTOS[2].location}
                </p>
              </div>

              <div className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-[#FB9B51]/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:border-[#FB9B51] group-hover:text-[#FB9B51] transition-all duration-300 group-hover:scale-110">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>

            {/* Bottom Right: Large Display Photo */}
            <div
              onClick={() => setSelectedPhoto(ABOUT_PHOTOS[3])}
              className="animate-about-photo lg:col-span-7 group relative h-[320px] sm:h-[400px] lg:h-[460px] rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl cursor-pointer transition-all duration-500 hover:border-[#FB9B51]/60 hover:shadow-[0_0_40px_rgba(251,155,81,0.18)]"
            >
              <img
                src={ABOUT_PHOTOS[3].src}
                alt={ABOUT_PHOTOS[3].alt}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Cinematic amber color grade overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FB9B51]/0 via-[#FB9B51]/0 to-[#c9621e]/0 group-hover:from-[#FB9B51]/20 group-hover:via-[#d97706]/10 group-hover:to-[#c9621e]/25 transition-all duration-700 ease-out mix-blend-color-dodge pointer-events-none z-[1]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 z-[2]" />

              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col items-start space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#FB9B51]/20 backdrop-blur-md border border-[#FB9B51]/40 text-[#FB9B51] text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-[#FB9B51]/30 group-hover:border-[#FB9B51]/70">
                  {ABOUT_PHOTOS[3].category}
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight group-hover:text-[#FB9B51] transition-colors duration-300">
                  {ABOUT_PHOTOS[3].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light flex items-center gap-1.5">
                  <span className="text-[#FB9B51] font-bold">📍</span> {ABOUT_PHOTOS[3].location}
                </p>
              </div>

              <div className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-[#FB9B51]/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:border-[#FB9B51] group-hover:text-[#FB9B51] transition-all duration-300 group-hover:scale-110">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl transition-all duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-950 transition-colors"
              aria-label="Close photo preview"
            >
              ✕
            </button>

            <div className="relative aspect-[16/10] w-full max-h-[70vh]">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wider uppercase inline-block">
                {selectedPhoto.category}
              </span>
              <h3 className="text-2xl font-bold text-white font-display">
                {selectedPhoto.title}
              </h3>
              <p className="text-slate-300 text-sm font-light">
                📍 {selectedPhoto.location} — {selectedPhoto.alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutSection;

