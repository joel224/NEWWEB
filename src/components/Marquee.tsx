'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShapeClover,
  ShapeGear,
  ShapeRings,
  ShapeStarburst,
  ShapePinwheel,
  ShapeChevron,
  ShapeGradientFlower,
} from './GSAPShapes';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  id: number;
  index: string;
  category: string;
  role: string;
  name: string;
  timeline: string;
  description: string;
  marqueeImages: string[];
  shape: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export default function ExperienceList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const experiences: ExperienceItem[] = [
    {
      id: 1,
      index: '01',
      category: 'Fitness Coaching',
      role: 'Core Systems & Motion',
      name: 'Everfit',
      timeline: '2022 — Present',
      description: 'End-to-end client training ecosystem & automated scaling architectures.',
      marqueeImages: ['/marquee/gym.png', '/marquee/gym.png'],
      shape: ShapeClover,
      accentColor: '#00eb8f',
    },
    {
      id: 2,
      index: '02',
      category: 'Digital Agency',
      role: 'Creative Engineering',
      name: 'Sumenki',
      timeline: '2023 — 2024',
      description: 'Bespoke high-performance digital experiences and interactive brand systems.',
      marqueeImages: ['/marquee/map.png', '/marquee/map1.png'],
      shape: ShapeStarburst,
      accentColor: '#a0ec06',
    },
    {
      id: 3,
      index: '03',
      category: 'Web3 & Blockchain',
      role: 'Protocol UI & Architecture',
      name: 'Flux Labs',
      timeline: '2024 — 2025',
      description: 'Decentralized liquidity telemetry and fluid multi-chain interfaces.',
      marqueeImages: ['/marquee/blockchain.png', '/marquee/blockchain.png'],
      shape: ShapeGear,
      accentColor: '#00eb8f',
    },
    {
      id: 4,
      index: '04',
      category: 'E-Commerce Platform',
      role: 'Merchant Experience',
      name: 'Shopify',
      timeline: '2020 — 2022',
      description: 'High-conversion checkout touchpoints and modular store components.',
      marqueeImages: ['/marquee/shopi.png', '/marquee/shopi.png'],
      shape: ShapePinwheel,
      accentColor: '#a0ec06',
    },
  ];

  // ScrollTrigger velocity scrub: accelerates the opposing motion on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.opposing-scroll-boost-left', {
        x: '-=12vw',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to('.opposing-scroll-boost-right', {
        x: '+=12vw',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Helper: Split text into staggered vertical character slots (SplitText roll-up effect)
  const renderSplitCharacters = (text: string, isTriggered: boolean) => {
    return (
      <span className="inline-flex overflow-hidden">
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="relative inline-block overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{
              transitionDelay: `${i * 22}ms`,
              transform: isTriggered ? 'translateY(-100%)' : 'translateY(0%)',
            }}
          >
            {/* Top slot (idle state: pure white) */}
            <span className="block text-white select-none leading-none">
              {char === ' ' ? '\u00A0' : char}
            </span>
            {/* Bottom slot (hover/active state: GSAP electric green #00eb8f) */}
            <span className="absolute top-full left-0 block text-[#00eb8f] font-semibold select-none leading-none">
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>
    );
  };

  // Helper: Word splitting for category & metadata
  const renderSplitWords = (text: string) => {
    return (
      <span className="inline-flex flex-wrap gap-x-1.5">
        {text.split(' ').map((word, wIdx) => (
          <span key={wIdx} className="inline-block transition-transform duration-300">
            {word}
          </span>
        ))}
      </span>
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#0a0a0a] text-white font-sans pt-28 pb-20 overflow-hidden border-t border-[#181818]"
    >
      {/* =========================================
          OPPOSING MOTION KEYFRAME DEFINITIONS
          ========================================= */}
      <style>{`
        @keyframes opposingLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes opposingRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes continuousSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes continuousSpinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        .animate-opposing-left {
          display: flex;
          width: max-content;
          animation: opposingLeft 24s linear infinite;
          will-change: transform;
        }
        .animate-opposing-right {
          display: flex;
          width: max-content;
          animation: opposingRight 24s linear infinite;
          will-change: transform;
        }
        .animate-shape-spin {
          animation: continuousSpin 14s linear infinite;
          transform-origin: center;
          will-change: transform;
        }
        .animate-shape-spin-reverse {
          animation: continuousSpinReverse 16s linear infinite;
          transform-origin: center;
          will-change: transform;
        }
        .text-outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.45);
        }
      `}</style>

      {/* =========================================
          SECTION HEADER: METADATA & PHILOSOPHY
          ========================================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00eb8f] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
              Work Experience & Systems
            </span>
          </div>

          <div className="max-w-md text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
            Every interface is an aerodynamic lever. We blend high-frequency motion graphics,
            deterministic layouts, and engineered modularity to turn interaction into living machinery.
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-mono tracking-widest text-neutral-500 uppercase">
            <span>[04 Selected Units]</span>
            <ShapeGradientFlower className="w-5 h-5 animate-shape-spin" />
          </div>
        </div>

        {/* Sub-header columns */}
        <div className="grid grid-cols-12 text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-500 pt-4">
          <div className="col-span-3 md:col-span-2">Index / Discipline</div>
          <div className="col-span-6 md:col-span-7">Brand & Inline Anchor</div>
          <div className="col-span-3 text-right">Period / Mode</div>
        </div>
      </div>

      {/* =========================================
          EXPERIENCE ROWS (GSAP-STYLE INTERACTIVE LIST)
          ========================================= */}
      <div className="flex flex-col w-full border-t border-[#1a1a1a]">
        {experiences.map((item) => {
          const ShapeComponent = item.shape;
          const isTriggered = hoveredId === item.id || activeId === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={(e) => {
                e.stopPropagation();
                setActiveId(activeId === item.id ? null : item.id);
              }}
              className="group relative w-full border-b border-[#1a1a1a] transition-colors duration-500 hover:bg-[#0f0f0f] overflow-hidden cursor-pointer"
            >
              {/* =========================================================
                  1. DEFAULT SWISS ROW FACE (Fades/collapses smoothly when hovered)
                  ========================================================= */}
              <div
                className={`relative z-10 w-full px-4 md:px-8 py-10 md:py-14 flex items-center justify-between transition-opacity duration-500 ${
                  isTriggered ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
              >
                {/* Left: Index & Category */}
                <div className="w-1/4 md:w-2/12 flex flex-col gap-1.5">
                  <span className="font-mono text-xs text-[#00eb8f] tracking-widest">
                    {item.index}
                  </span>
                  <span className="text-xs md:text-sm text-neutral-400 font-normal tracking-wide">
                    {renderSplitWords(item.category)}
                  </span>
                </div>

                {/* Center: Brand Title with Character-Splitting + Inline Graphic Anchor */}
                <div className="w-2/4 md:w-8/12 flex items-center justify-center gap-4 md:gap-8">
                  {/* Inline Graphic Anchor: Ambient Spin with Hover Reaction */}
                  <div className="relative text-neutral-500 group-hover:text-[#00eb8f] transition-colors duration-500">
                    <div className="w-7 h-7 md:w-10 md:h-10 animate-shape-spin transition-transform duration-500 group-hover:scale-125">
                      <ShapeComponent className="w-full h-full" />
                    </div>
                  </div>

                  {/* Character-Split Brand Name */}
                  <h3 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter select-none">
                    {renderSplitCharacters(item.name, isTriggered)}
                  </h3>

                  {/* Secondary subtle decorative chevron */}
                  <div className="hidden sm:block text-neutral-600 group-hover:text-white transition-colors duration-300">
                    <ShapeChevron className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Right: Role & Timeline */}
                <div className="w-1/4 md:w-2/12 flex flex-col items-end gap-1 text-right">
                  <span className="font-mono text-[11px] md:text-xs text-neutral-400 tracking-wider">
                    {item.timeline}
                  </span>
                  <span className="hidden sm:inline-block text-[11px] text-neutral-600 font-mono tracking-tight">
                    {item.role}
                  </span>
                </div>
              </div>

              {/* =========================================================
                  2. HOVER/ACTIVE STATE: OPPOSING MOTION KINETIC MARQUEE
                  Two counter-flowing ticker streams (Upper Left, Lower Right)
                  with inline graphic anchors, big typography & image pills
                  ========================================================= */}
              <div
                className={`absolute inset-0 flex flex-col justify-center py-4 bg-[#080808] transition-opacity duration-500 z-20 ${
                  isTriggered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* ── TRACK 1: Upper Kinetic Stream (Moves LEFT) ── */}
                <div className="opposing-scroll-boost-left w-full overflow-hidden flex items-center mb-2">
                  <div className="animate-opposing-left">
                    {[...Array(3)].map((_, loopIdx) => (
                      <div key={loopIdx} className="flex items-center gap-8 md:gap-14 px-4">
                        {/* 1. Project Image Pill */}
                        <div className="w-[180px] sm:w-[260px] md:w-[320px] h-[80px] sm:h-[110px] md:h-[130px] rounded-full overflow-hidden bg-neutral-900 border border-white/20 shadow-2xl flex-shrink-0 group-hover:border-[#00eb8f]/50 transition-colors">
                          <img
                            src={item.marqueeImages[0]}
                            alt={`${item.name} preview`}
                            className="w-full h-full object-cover filter brightness-95 contrast-105"
                          />
                        </div>

                        {/* 2. Inline Graphic Anchor: Rotating Shape */}
                        <div className="w-7 h-7 sm:w-10 sm:h-10 text-[#00eb8f] animate-shape-spin flex-shrink-0">
                          <ShapeComponent className="w-full h-full" />
                        </div>

                        {/* 3. Solid Brand Typography */}
                        <span className="text-4xl sm:text-6xl md:text-8xl tracking-tighter font-semibold text-white whitespace-nowrap">
                          {item.name}
                        </span>

                        {/* 4. Category Pill Tag */}
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[11px] sm:text-xs tracking-widest uppercase backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00eb8f]" />
                          <span>{item.category}</span>
                        </div>

                        {/* 5. Additional Animated Graphic Anchor */}
                        <div className="w-6 h-6 text-white/40 animate-shape-spin-reverse flex-shrink-0">
                          <ShapeRings className="w-full h-full" />
                        </div>

                        {/* 6. Timeline Marker */}
                        <span className="font-mono text-xs sm:text-sm text-neutral-400 tracking-widest whitespace-nowrap">
                          [{item.timeline}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── TRACK 2: Lower Kinetic Stream (Moves RIGHT — Opposing Motion) ── */}
                <div className="opposing-scroll-boost-right w-full overflow-hidden flex items-center mt-2">
                  <div className="animate-opposing-right">
                    {[...Array(3)].map((_, loopIdx) => (
                      <div key={loopIdx} className="flex items-center gap-8 md:gap-14 px-4">
                        {/* 1. Hollow Ghost Typography */}
                        <span className="text-4xl sm:text-6xl md:text-8xl tracking-tighter font-semibold text-outline hover:text-white transition-colors duration-300 whitespace-nowrap">
                          {item.name}
                        </span>

                        {/* 2. Opposing Animated Graphic Anchor */}
                        <div className="w-7 h-7 sm:w-10 sm:h-10 text-[#a0ec06] animate-shape-spin-reverse flex-shrink-0">
                          <ShapeStarburst className="w-full h-full" />
                        </div>

                        {/* 3. Project Image Pill 2 */}
                        <div className="w-[180px] sm:w-[260px] md:w-[320px] h-[80px] sm:h-[110px] md:h-[130px] rounded-full overflow-hidden bg-neutral-900 border border-white/20 shadow-2xl flex-shrink-0">
                          <img
                            src={item.marqueeImages[1] || item.marqueeImages[0]}
                            alt={`${item.name} highlight`}
                            className="w-full h-full object-cover filter brightness-95"
                          />
                        </div>

                        {/* 4. Role Specification Tag */}
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00eb8f]/10 border border-[#00eb8f]/30 text-[#00eb8f] font-mono text-[11px] sm:text-xs tracking-widest uppercase">
                          <span>{item.role}</span>
                        </div>

                        {/* 5. Additional Animated Graphic Anchor */}
                        <div className="w-6 h-6 text-neutral-400 animate-shape-spin flex-shrink-0">
                          <ShapeGear className="w-full h-full" />
                        </div>

                        {/* 6. Action prompt */}
                        <span className="font-mono text-xs tracking-[0.2em] text-neutral-500 uppercase whitespace-nowrap">
                          Explore System • Click to Pin
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtle bottom detail strip inside hover */}
                <div className="absolute bottom-2 left-6 right-6 hidden md:flex items-center justify-between text-[11px] font-mono text-neutral-500 pointer-events-none">
                  <span>{item.description}</span>
                  <span className="text-[#00eb8f]">OPPOSING KINETIC TICKER // DUAL STREAM</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
          BOTTOM TICKER BAND (GSAP BRANDING STYLE)
          ========================================= */}
      <div className="mt-16 pt-8 border-t border-[#181818] flex items-center justify-between max-w-7xl mx-auto px-4 md:px-8 text-neutral-500 text-xs font-mono">
        <div className="flex items-center gap-3">
          <ShapeGradientFlower className="w-4 h-4 animate-shape-spin" />
          <span>Inline Graphic Anchors &bull; SplitText Roll Engine</span>
        </div>
        <div className="hidden sm:block text-neutral-600">
          Crafted with GSAP ScrollTrigger &bull; Pure Vector Silicon
        </div>
      </div>
    </section>
  );
}
