'use client';

import React, { useState } from 'react';

export default function ExperienceList() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const experiences = [
    {
      id: 1,
      category: 'Fitness Platform',
      name: 'Everfit',
      role: 'Creative UI & Interactive Architecture',
      timeline: '(22) — (Present)',
      // SVG from public/shapes/actualyshapes
      shape: '/shapes/actualyshapes/shape-pinwheel.svg',
      glowColor: 'rgba(0, 235, 143, 0.45)',
      accentColor: '#00eb8f',
      marqueeImages: ['/marquee/gym.png', '/marquee/gym.png'],
      badgePill1: {
        text: 'HIGH PERFORMANCE',
        style: 'bg-[#00eb8f] text-black font-bold tracking-wider',
      },
      badgePill2: {
        text: 'MOBILE ECOSYSTEM',
        style: 'bg-white/10 text-neutral-200 border border-white/20 backdrop-blur-md',
      },
    },
    {
      id: 2,
      category: 'Digital Agency',
      name: 'Sumenki',
      role: 'Design Systems & Motion Direction',
      timeline: '(23) — (24)',
      shape: '/shapes/actualyshapes/shape-gradient-flower.svg',
      glowColor: 'rgba(204, 129, 244, 0.45)',
      accentColor: '#CC81F4',
      marqueeImages: ['/marquee/map.png', '/marquee/map1.png'],
      badgePill1: {
        text: 'MOTION SYSTEMS',
        style: 'bg-gradient-to-r from-[#FEC5FB] via-[#CC81F4] to-[#A69EFF] text-black font-bold tracking-wider',
      },
      badgePill2: {
        text: 'EDITORIAL DESIGN',
        style: 'bg-white/10 text-neutral-200 border border-white/20 backdrop-blur-md',
      },
    },
    {
      id: 3,
      category: 'Blockchain Protocol',
      name: 'Flux Labs',
      role: 'Decentralized Apps & Visual Engineering',
      timeline: '(24) — (25)',
      shape: '/shapes/actualyshapes/shape-starburst.svg',
      glowColor: 'rgba(160, 236, 6, 0.45)',
      accentColor: '#a0ec06',
      marqueeImages: ['/marquee/blockchain.png', '/marquee/blockchain.png'],
      badgePill1: {
        text: 'WEB3 ARCHITECTURE',
        style: 'bg-[#a0ec06] text-black font-bold tracking-wider',
      },
      badgePill2: {
        text: 'DECENTRALIZED',
        style: 'bg-white/10 text-neutral-200 border border-white/20 backdrop-blur-md',
      },
    },
    {
      id: 4,
      category: 'E-Commerce Engine',
      name: 'Shopify',
      role: 'High-Conversion Funnels & Infrastructure',
      timeline: '(20) — (22)',
      shape: '/shapes/actualyshapes/shape-chevron.svg',
      glowColor: 'rgba(255, 135, 9, 0.45)',
      accentColor: '#FF8709',
      marqueeImages: ['/marquee/shopi.png', '/marquee/shopi.png'],
      badgePill1: {
        text: 'SCALE & CONVERSION',
        style: 'bg-gradient-to-r from-[#FF8709] to-[#F7BDF8] text-black font-bold tracking-wider',
      },
      badgePill2: {
        text: 'GLOBAL COMMERCE',
        style: 'bg-white/10 text-neutral-200 border border-white/20 backdrop-blur-md',
      },
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0a] text-white font-sans pt-28 pb-20 overflow-hidden select-none">
      {/* =========================================
          CUSTOM GSAP-STYLE KEYFRAME STYLES
          ========================================= */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marqueeLeft 22s linear infinite;
        }
        .group:hover .animate-marquee-left {
          animation-play-state: running;
        }
        .animate-spin-slow {
          animation: spinSlow 18s linear infinite;
        }
        .animate-spin-reverse {
          animation: spinReverse 22s linear infinite;
        }
      `}</style>

      {/* =========================================
          GSAP-STYLE HEADER SECTION
          ========================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12">
        {/* Authentic GSAP Bracket Tag */}
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-3.5 h-7 text-[#FFFCE1]"
            viewBox="0 0 27 78"
            fill="none"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
            />
          </svg>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFFCE1]">
            Work Experience
          </span>
          <svg
            className="w-3.5 h-7 text-[#FFFCE1] rotate-180"
            viewBox="0 0 27 78"
            fill="none"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
            />
          </svg>
        </div>

        {/* 3-Column Meta Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-[#222]">
          <div className="w-full sm:w-1/4 text-xs font-mono tracking-widest uppercase text-neutral-500">
            Discipline & Shape
          </div>
          <div className="w-full sm:w-2/4 text-neutral-400 text-xs sm:text-sm md:text-base leading-relaxed text-left sm:text-center max-w-md mx-auto">
            Every decision, every detail is a lever, each one working to make the whole run better than before
          </div>
          <div className="w-full sm:w-1/4 text-xs font-mono tracking-widest uppercase text-neutral-500 text-left sm:text-right">
            Timeline / Interaction
          </div>
        </div>
      </div>

      {/* =========================================
          EXPERIENCE ROWS (GSAP TOOLS ACCORDION STYLE)
          ========================================= */}
      <div className="flex flex-col w-full border-t border-[#1c1c1c]">
        {experiences.map((item) => {
          const isItemActive = activeId === item.id;

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveId(isItemActive ? null : item.id);
              }}
              className="group relative w-full border-b border-[#1c1c1c] transition-colors duration-500 hover:bg-[#121212] overflow-hidden flex items-center min-h-[180px] md:min-h-[230px] cursor-pointer"
            >
              {/* ============================================================
                  1. DEFAULT STATE (GSAP TOOLS ROW) - Fades on hover / active
                  ============================================================ */}
              <div
                className={`w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 flex items-center justify-between transition-all duration-500 z-10 ${
                  isItemActive ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 group-hover:opacity-0 group-hover:scale-95'
                }`}
              >
                {/* Left: Interactive Shape Pedestal */}
                <div className="flex items-center gap-4 md:gap-8 w-1/4 min-w-[120px]">
                  <div
                    className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 shrink-0"
                    style={{
                      boxShadow: `0 0 25px -5px ${item.glowColor}`,
                    }}
                  >
                    {/* Atmospheric Glow behind shape */}
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl opacity-30 group-hover:opacity-80 transition-opacity duration-500"
                      style={{ background: item.glowColor }}
                    />
                    {/* SVG Graphic */}
                    <img
                      src={item.shape}
                      alt={`${item.name} geometric shape`}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain animate-spin-slow relative z-10 transition-transform duration-500 group-hover:scale-115"
                    />
                  </div>

                  <div className="hidden lg:flex flex-col">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500">
                      Shape No. 0{item.id}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Center: Big Title & Subtitle */}
                <div className="w-2/4 text-center px-2">
                  <h3 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white group-hover:text-neutral-200 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-[11px] sm:text-xs md:text-sm font-mono tracking-wider text-neutral-400 uppercase">
                    {item.role}
                  </p>
                </div>

                {/* Right: Timeline & GSAP Arrow Pill */}
                <div className="flex items-center justify-end gap-3 md:gap-6 w-1/4">
                  <span className="text-xs sm:text-sm md:text-base font-mono text-neutral-400 whitespace-nowrap">
                    {item.timeline}
                  </span>
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/15 flex items-center justify-center text-white/70 group-hover:text-black group-hover:bg-white group-hover:border-white transition-all duration-300 shadow-sm shrink-0">
                    <span className="transform text-sm sm:text-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                      ↗
                    </span>
                  </div>
                </div>
              </div>

              {/* ============================================================
                  2. HOVER / ACTIVE STATE: GSAP KINETIC STREAM (MARQUEE)
                  ============================================================ */}
              <div
                className={`absolute inset-0 flex items-center transition-opacity duration-500 z-0 bg-[#0c0c0c] ${
                  isItemActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'
                }`}
              >
                <div className="animate-marquee-left">
                  {/* Two identical loops for seamless infinite scrolling */}
                  {[...Array(2)].map((_, loopIndex) => (
                    <div key={loopIndex} className="flex items-center gap-8 md:gap-14 px-4 sm:px-8 shrink-0">
                      {/* 1. Pill Image Capsule */}
                      <div className="w-[220px] sm:w-[280px] h-[100px] sm:h-[130px] rounded-full overflow-hidden border border-white/20 bg-neutral-900 shadow-2xl relative shrink-0 group-hover:border-white/40 transition-colors">
                        <img
                          src={item.marqueeImages[0]}
                          alt={`${item.name} showcase`}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                      </div>

                      {/* 2. Rotating Geometric SVG Shape from actualyshapes */}
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center shrink-0 backdrop-blur-sm"
                        style={{
                          boxShadow: `0 0 20px -2px ${item.glowColor}`,
                        }}
                      >
                        <img
                          src={item.shape}
                          alt="GSAP Shape"
                          className="w-8 h-8 sm:w-10 sm:h-10 object-contain animate-spin-slow"
                        />
                      </div>

                      {/* 3. Huge Kinetic Typography */}
                      <div className="text-5xl sm:text-7xl md:text-8xl tracking-tighter font-semibold text-white whitespace-nowrap flex items-center gap-4">
                        <span>{item.name}</span>
                        <span className="text-neutral-500 font-light text-4xl sm:text-6xl">/</span>
                      </div>

                      {/* 4. Vibrant GSAP Pill Badge 1 */}
                      <div className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm uppercase shadow-lg shrink-0 whitespace-nowrap ${item.badgePill1.style}`}>
                        {item.badgePill1.text}
                      </div>

                      {/* 5. Second Pill Image Capsule */}
                      <div className="w-[220px] sm:w-[280px] h-[100px] sm:h-[130px] rounded-full overflow-hidden border border-white/20 bg-neutral-900 shadow-2xl relative shrink-0 group-hover:border-white/40 transition-colors">
                        <img
                          src={item.marqueeImages[1]}
                          alt={`${item.name} preview`}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                      </div>

                      {/* 6. Asterisk Accent */}
                      <div className="text-3xl sm:text-5xl text-neutral-400 animate-spin-reverse shrink-0">
                        ✱
                      </div>

                      {/* 7. Vibrant GSAP Pill Badge 2 */}
                      <div className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium uppercase shadow-sm shrink-0 whitespace-nowrap ${item.badgePill2.style}`}>
                        {item.badgePill2.text}
                      </div>

                      {/* 8. Second Rotating SVG Instance */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 opacity-80">
                        <img
                          src={item.shape}
                          alt="GSAP Shape"
                          className="w-full h-full object-contain animate-spin-reverse"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Bottom Hint */}
      <div className="mt-12 text-center text-[11px] font-mono tracking-widest uppercase text-neutral-600">
        Hover row to launch kinetic stream • Click to toggle
      </div>
    </section>
  );
}
