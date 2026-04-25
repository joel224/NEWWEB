'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a ScrollTrigger timeline tied to the container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom', // Starts when the top of the section hits the bottom of the viewport
          end: 'bottom top',   // Ends when the bottom of the section hits the top of the viewport
          scrub: 1,            // Smooth scrubbing effect (1 second catch-up)
        },
      });

      // Row 1 moves to the Left (-x)
      tl.to(row1Ref.current, {
        xPercent: -30, 
        ease: 'none',
      }, 0); // The '0' ensures both animations start at the exact same time

      // Row 2 moves to the Right (+x)
      tl.to(row2Ref.current, {
        xPercent: 20, 
        ease: 'none',
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      // min-h-screen to give it space, overflow-hidden so the giant text doesn't cause horizontal scrolling 
      className="relative  min-[425px]:h-1/3  w-full md:min-h-screen bg-[#0a0a0a] flex flex-col justify-center overflow-hidden font-sans py-24"
    >
      
      {/* ROW 1: Selected Work
        Starts slightly pushed to the right, moves left on scroll.
        text-white for high contrast.
      */}
      <div 
        ref={row1Ref}
        className="flex whitespace-nowrap -ml-[20vw] will-change-transform"
      >
        <h2 className="text-[22vw] leading-[0.85] tracking-tighter text-white font-medium select-none">
          Work — Work — Work — Work —
        </h2>
      </div>

      {/* ROW 2: Experiences
        Starts slightly pushed to the left, moves right on scroll.
        text-[#222222] for that dark gray, subtle look.
      */}
      <div 
        ref={row2Ref}
        className="flex whitespace-nowrap -ml-[40vw] mt-4 will-change-transform"
      >
        <h2 className="text-[22vw] leading-[0.85] tracking-tighter text-[#222222] font-medium select-none">
          Experiences — Experiences — Experiences —
        </h2>
      </div>

    </section>
  );
}