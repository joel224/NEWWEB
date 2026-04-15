'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectShowcase() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Array of dummy images for the scroll reveal
  const projectImages = [
    '/Mobile/mobile1.png',
    '/Mobile/image2.png',
    '/Mobile/image3.png',
    '/Mobile/image4.png',
  ];

  useEffect(() => {
    // 1. Cursor Follower Logic
    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.2, ease: 'power3' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.2, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 2. Simple Scroll Reveal for Images
   // 2. Horizontal Scroll + Slide-up/Flip from Bottom
   // 2. Horizontal Scroll + Bottom Slide/Flip Reveal
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.horizontal-panel');

      // Pin the section and scroll the container horizontally
      const scrollTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: '+=4000', // Scroll duration. Increase to slow down the scroll speed.
        },
      });

      // 3D "Page Flip / Slide-up from Bottom" effect
      panels.forEach((panel: any, i) => {
        if (i === 0) return; // Skip the first image so it's already on screen
        
        const imgWrap = panel.querySelector('.reveal-img');
        
        gsap.fromTo(imgWrap, 
          { 
            y: '60vh',           // Starts down at the bottom
            rotationX: -60,      // Folded backward
            transformOrigin: 'bottom center', // Hinges from the bottom like a page
            transformPerspective: 1200, 
            opacity: 0 
          },
          {
            y: 0,
            rotationX: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween, // Links animation to the horizontal scroll
              start: 'left 85%', // Starts flipping when panel enters from right
              end: 'center center',
              scrub: true,
            }
          }
        );
      });
    }, containerRef);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
    };
  }, []);

  // 3. Handle Cursor Hover State
  useEffect(() => {
    if (isHovering) {
      gsap.to(cursorRef.current, {
        width: 150, 
        height: 150,
        duration: 0.5,
        ease: 'expo.out',
      });
      gsap.to(cursorTextRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        delay: 0.1,
      });
    } else {
      gsap.to(cursorRef.current, {
        width: 16, 
        height: 16,
        duration: 0.4,
        ease: 'expo.out',
      });
      gsap.to(cursorTextRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.2,
      });
    }
  }, [isHovering]);

  return (
    <><svg className="hidden">
          <filter id="displacementFilter">
              <feTurbulence
                  type="turbulence"
                  baseFrequency="0.01"
                  numOctaves="3"
                  result="turbulence" />
              <feDisplacementMap
                  in="SourceGraphic"
                  in2="turbulence"
                  scale="60"
                  xChannelSelector="R"
                  yChannelSelector="G" />
          </filter>
      </svg>
      
      <section
          ref={containerRef}
          className="relative w-full min-h-screen bg-[#0a0a0a] text-white font-sans px-8 py-12 cursor-none"
      >
              {/* =========================================
        RAW APPCARD.VUE SVG FILTER
        Exact values: baseFrequency="0.01", numOctaves="2", scale="200"
        ========================================= */}


              {/* =========================================
        THE RAW APPCARD.VUE CURSOR
        ========================================= */}
              <div
                  ref={cursorRef}
                  className="fixed top-0 left-0 z-50 flex items-center justify-center rounded-full pointer-events-none"
                  style={{
                      transform: 'translate(-50%, -50%)',
                      // Exactly matching: filter: drop-shadow(-8px -10px 46px #0000005f);
                      filter: 'drop-shadow(-8px -10px 46px rgba(0, 0, 0, 0.37))',
                      // Exactly matching: backdrop-filter: brightness(1.1) blur(2px) url(#displacementFilter);
                      backdropFilter: 'brightness(1.1) blur(2px) url(#displacementFilter)',
                      WebkitBackdropFilter: 'brightness(1.1) blur(2px) url(#displacementFilter)',
                  }}
              >
                  {/* Exactly matching the .card::before pseudo element */}
                  <div
                      className="absolute inset-0 z-0 rounded-full"
                      style={{
                          boxShadow: 'inset 6px 6px 0px -6px rgba(255, 255, 255, 0.7), inset 0 0 8px 1px rgba(255, 255, 255, 0.7)',
                          WebkitBoxShadow: 'inset 2px 2px 0px -2px rgba(255, 255, 255, 0.7), inset 0 0 3px 1px rgba(255, 255, 255, 0.7)'
                      }} />

                  <span
                      ref={cursorTextRef}
                      className="text-white text-sm font-semibold tracking-widest opacity-0 scale-0 relative z-10 mix-blend-difference"
                  >
                      VIEW
                  </span>
              </div>
              {/* =========================================
              HEADER ROW (Absolute positioned so it stays fixed during scroll)
              ========================================= */}
              <div className="absolute top-12 left-0 z-40 flex justify-between items-start w-full px-8 pointer-events-none">
                  <div className="text-sm text-neutral-400">Independent</div>
                  <div className="text-center text-xl md:text-2xl font-light tracking-tight max-w-sm leading-tight">
                      Visual concepts & what-if moments.<br />
                      Curiosity and growth
                  </div>
                  <div className="text-sm text-neutral-400">Showcase</div>
              </div>

              {/* =========================================
          HEADER ROW (Absolute so it stays fixed while images scroll horizontally)
          ========================================= */}
              <div className="absolute top-12 left-0 z-40 flex justify-between items-start w-full px-8 pointer-events-none">
                  <div className="text-sm text-neutral-400">Independent</div>
                  <div className="text-center text-xl md:text-2xl font-light tracking-tight max-w-sm leading-tight">
                      Visual concepts & what-if moments.<br />
                      Curiosity and growth
                  </div>
                  <div className="text-sm text-neutral-400">Showcase</div>
              </div>

              {/* =========================================
        HORIZONTAL SCROLLING PANELS
        ========================================= */}
              <div className="flex h-screen w-max items-center">
                  {projectImages.map((src, index) => (
                      <div
                          key={index}
                          className="horizontal-panel w-screen h-screen flex justify-center items-center"
                      >
                          <div
                              className="reveal-img relative w-full max-w-[80%] h-[75vh] rounded-[3rem] overflow-hidden bg-neutral-900 shadow-2xl"
                              onMouseEnter={() => setIsHovering(true)}
                              onMouseLeave={() => setIsHovering(false)}
                          >
                              <img
                                  src={src}
                                  alt={`Project Showcase ${index + 1}`}
                                  className="w-full h-full object-cover" />
                          </div>
                      </div>
                  ))}
              </div>
          </section></>
   

 
  );
}