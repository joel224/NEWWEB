'use client';

import { useEffect, useRef } from 'react';
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
      // Create a ScrollTrigger timeline tied to the container for opposing motion
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom', // Starts when the top of the section hits the bottom of the viewport
          end: 'bottom top',   // Ends when the bottom of the section hits the top of the viewport
          scrub: 1.2,          // Smooth scrubbing effect
        },
      });

      // Row 1 moves to the Left (-x)
      tl.to(
        row1Ref.current,
        {
          xPercent: -35,
          ease: 'none',
        },
        0
      );

      // Row 2 moves to the Right (+x) in opposing motion
      tl.to(
        row2Ref.current,
        {
          xPercent: 28,
          ease: 'none',
        },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

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

      {/* ROW 1: Selected Work + Inline Graphic Anchors (Moves Left on scroll) */}
      <div
        ref={row1Ref}
        className="flex items-center whitespace-nowrap -ml-[15vw] will-change-transform"
      >
        <div className="flex items-center gap-6 md:gap-12 text-[18vw] leading-[0.85] tracking-tighter text-white font-medium">
          <span>Work</span>
          <ShapeClover className="w-[8vw] h-[8vw] text-[#00eb8f] animate-spin-anchor" />
          <span>Work</span>
          <ShapeStarburst className="w-[8vw] h-[8vw] text-white animate-spin-anchor-rev" />
          <span>Work</span>
          <ShapeGear className="w-[8vw] h-[8vw] text-[#a0ec06] animate-spin-anchor" />
          <span>Work</span>
          <ShapePinwheel className="w-[8vw] h-[8vw] text-[#00eb8f] animate-spin-anchor-rev" />
        </div>
      </div>

      {/* ROW 2: Experiences + Inline Graphic Anchors (Moves Right on scroll — Opposing Motion) */}
      <div
        ref={row2Ref}
        className="flex items-center whitespace-nowrap -ml-[35vw] mt-6 will-change-transform"
      >
        <div className="flex items-center gap-6 md:gap-12 text-[18vw] leading-[0.85] tracking-tighter text-[#2a2a2a] hover:text-[#444] transition-colors duration-500 font-medium">
          <span>Experiences</span>
          <ShapeRings className="w-[8vw] h-[8vw] text-white/20 animate-spin-anchor" />
          <span>Experiences</span>
          <ShapeGradientFlower className="w-[8vw] h-[8vw] animate-spin-anchor-rev" />
          <span>Experiences</span>
          <ShapeClover className="w-[8vw] h-[8vw] text-white/25 animate-spin-anchor" />
          <span>Experiences</span>
        </div>
      </div>
    </section>
  );
}
