'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShapeClover,
  ShapeGear,
  ShapeRings,
  ShapeStarburst,
  ShapePinwheel,
  ShapeGradientFlower,
} from './GSAPShapes';

gsap.registerPlugin(ScrollTrigger);

export default function TextMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. ScrollTrigger timeline for opposing kinetic motion
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // Row 1 drifts Left (-x)
      tl.to(
        row1Ref.current,
        {
          xPercent: -32,
          ease: 'none',
        },
        0
      );

      // Row 2 drifts Right (+x) in opposing motion
      tl.to(
        row2Ref.current,
        {
          xPercent: 26,
          ease: 'none',
        },
        0
      );

      // 2. Character-splitting stagger entrance on scroll
      gsap.from('.kinetic-char', {
        y: 60,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Helper: Character Splitting preserving exact original color
  const renderSplitText = (word: string, textColor: string) => {
    return (
      <span className="inline-flex group/word cursor-pointer">
        {word.split('').map((char, i) => (
          <span
            key={i}
            className="kinetic-char relative inline-block overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{
              transitionDelay: `${i * 18}ms`,
            }}
          >
            <span
              className="block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/word:-translate-y-full"
              style={{ color: textColor }}
            >
              {char}
            </span>
            <span
              className="absolute top-full left-0 block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/word:-translate-y-full font-medium"
              style={{ color: textColor }}
            >
              {char}
            </span>
          </span>
        ))}
      </span>
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative min-[425px]:h-1/3 w-full md:min-h-screen bg-[#0a0a0a] flex flex-col justify-center overflow-hidden font-sans py-24 select-none"
    >
      <style>{`
        @keyframes continuousSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes continuousSpinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-anchor {
          animation: continuousSpin 16s linear infinite;
          transform-origin: center;
          will-change: transform;
        }
        .animate-spin-anchor-rev {
          animation: continuousSpinReverse 18s linear infinite;
          transform-origin: center;
          will-change: transform;
        }
      `}</style>

      {/* ROW 1: "Work" + Inline Graphic Anchors (Original text-white, Opposing Motion: Moves Left) */}
      <div
        ref={row1Ref}
        className="flex items-center whitespace-nowrap -ml-[15vw] will-change-transform"
      >
        <div className="flex items-center gap-6 md:gap-12 text-[18vw] leading-[0.85] tracking-tighter text-white font-medium">
          {renderSplitText('Work', '#ffffff')}
          <ShapeClover className="w-[8vw] h-[8vw] text-white animate-spin-anchor flex-shrink-0" />
          {renderSplitText('Work', '#ffffff')}
          <ShapeStarburst className="w-[8vw] h-[8vw] text-white animate-spin-anchor-rev flex-shrink-0" />
          {renderSplitText('Work', '#ffffff')}
          <ShapeGear className="w-[8vw] h-[8vw] text-white animate-spin-anchor flex-shrink-0" />
          {renderSplitText('Work', '#ffffff')}
          <ShapePinwheel className="w-[8vw] h-[8vw] text-white animate-spin-anchor-rev flex-shrink-0" />
        </div>
      </div>

      {/* ROW 2: "Experiences" + Inline Graphic Anchors (Original text-[#222222], Opposing Motion: Moves Right) */}
      <div
        ref={row2Ref}
        className="flex items-center whitespace-nowrap -ml-[35vw] mt-6 will-change-transform"
      >
        <div className="flex items-center gap-6 md:gap-12 text-[18vw] leading-[0.85] tracking-tighter text-[#222222] font-medium">
          {renderSplitText('Experiences', '#222222')}
          <ShapeRings className="w-[8vw] h-[8vw] text-[#222222] animate-spin-anchor flex-shrink-0" />
          {renderSplitText('Experiences', '#222222')}
          <ShapeGradientFlower className="w-[8vw] h-[8vw] opacity-25 animate-spin-anchor-rev flex-shrink-0" />
          {renderSplitText('Experiences', '#222222')}
          <ShapeClover className="w-[8vw] h-[8vw] text-[#222222] animate-spin-anchor flex-shrink-0" />
          {renderSplitText('Experiences', '#222222')}
        </div>
      </div>
    </section>
  );
}
