'use client';
 
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectShowcase() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const rafRef = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);

  // Array of dummy images for the scroll reveal
  const projectImages = [
    '/Mobile/mobile1.png',
    '/Mobile/image2.png',
    '/Mobile/image3.png',
    '/Mobile/image4.png',
  ];
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);
  useEffect(() => {
    // 2. Vertical Scroll + 3D Bottom Slide/Flip Reveal (runs on all devices)
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.horizontal-panel');

      panels.forEach((panel: any, i) => {
        const imgWrap = panel.querySelector('.reveal-img');
        if (i === 0) return;

        gsap.fromTo(
          imgWrap,
          {
            y: '30vh',
            rotationX: -45,
            scale: 0.85,
            filter: 'blur(12px)',
            transformOrigin: 'bottom center',
            transformPerspective: 1200,
            opacity: 0,
          },
          {
            y: 0,
            rotationX: 0,
            scale: 1,
            filter: 'blur(0px)',
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 95%',
              end: 'top 35%',
              scrub: 1.5,
            },
          }
        );
      });
    }, containerRef);

    if (isMobile) {
      // Park cursor at bottom-center on mobile — it won't follow touch
      gsap.set(cursorRef.current, {
        x: window.innerWidth / 2,
        y: window.innerHeight - 60,
        opacity: 0,          // hide it entirely on mobile
      });
      return () => ctx.revert();
    }

    // 1. Cursor Follower — desktop only
    // IMPORTANT: do NOT put translate3d in the style prop — GSAP owns x/y.
    // The -50% centering is handled via marginLeft/marginTop instead.
    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.14, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.14, ease: 'power3.out' });

    // Seed cursor at current mouse position to avoid snap from (0,0) on first move
    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
    };
  }, [isMobile]);

  // 3. Handle Cursor Hover State + water animation
  useEffect(() => {
    if (isHovering) {
      gsap.to(cursorRef.current, {
        width: 150, 
        height: 150,
        duration: 0.4,
        ease: 'expo.out',
      });
      gsap.to(cursorTextRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        delay: 0.1,
      });

      // Start water-like turbulence animation (only while hovering)
      const startTime = performance.now();
      const animate = (time: number) => {
        const t = (time - startTime) / 1000;
        // Two offset oscillations create organic, non-repeating water motion
        const bfX = 0.012 + Math.sin(t * 1.4) * 0.006;
        const bfY = 0.012 + Math.cos(t * 1.9) * 0.006;
        turbulenceRef.current?.setAttribute('baseFrequency', `${bfX.toFixed(4)} ${bfY.toFixed(4)}`);
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    } else {
      // Kill animation loop immediately when not hovering
      cancelAnimationFrame(rafRef.current);
      turbulenceRef.current?.setAttribute('baseFrequency', '0.01');

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

    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovering]);

  return (
    <>
      <svg className="hidden">
        <filter id="displacementFilter">
          <feTurbulence
            ref={turbulenceRef}
            type="turbulence"
            baseFrequency="0.01"
            numOctaves="3"
            result="turbulence" 
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="60"
            xChannelSelector="R"
            yChannelSelector="G" 
          />
        </filter>
      </svg>
      
      <section
        ref={containerRef}
        // Removed the mobile check, it just uses cursor-none everywhere now
        className="relative w-full min-h-screen bg-[#0a0a0a] text-white font-sans px-8 py-12 cursor-none"
      >
        {/* =========================================
            THE RAW APPCARD.VUE CURSOR (Optimized)
            ========================================= */}
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 z-50 flex items-center justify-center rounded-full pointer-events-none"
          style={{
            // GSAP controls x/y via transform. We use negative margins for the
            // -50% centering offset so GSAP's transform is never overridden.
            marginLeft: '-8px',
            marginTop: '-8px',
            willChange: 'transform, width, height',
            filter: 'drop-shadow(-8px -10px 46px rgba(0, 0, 0, 0.37))',
            backdropFilter: 'brightness(1.1) blur(2px) url(#displacementFilter)',
            WebkitBackdropFilter: 'brightness(1.1) blur(2px) url(#displacementFilter)',
          }}
        >
          <div
            className="absolute inset-0 z-0 rounded-full"
            style={{
              boxShadow: 'inset 6px 6px 0px -6px rgba(255, 255, 255, 0.7), inset 0 0 8px 1px rgba(255, 255, 255, 0.7)',
              WebkitBoxShadow: 'inset 2px 2px 0px -2px rgba(255, 255, 255, 0.7), inset 0 0 3px 1px rgba(255, 255, 255, 0.7)'
            }} 
          />

          <span
            ref={cursorTextRef}
            className="text-white text-sm font-semibold tracking-widest opacity-0 scale-0 relative z-10 mix-blend-difference"
          >
            HELLO
          </span>
        </div>

        {/* =========================================
            HEADER ROW (Sticky so it stays on screen while scrolling down)
            ========================================= */}
        <div className="sticky top-12 z-40 flex justify-between items-start w-full pointer-events-none mb-12">
          <div className="text-sm min-[375px]:text-xs min-[425px]:text-sm text-neutral-400">Independent</div>
          <div className="text-center min-[375px]:text-sm min-[533px]:text-xl min-[425px]:text-sm md:text-2xl font-light tracking-tight max-w-sm leading-tight">
            Visual concepts & what-if moments.<br />
            Curiosity and growth
          </div>
          <div className="text-sm min-[375px]:text-xs min-[425px]:text-sm text-neutral-400">Showcase</div>
        </div>

        {/* =========================================
            VERTICAL SCROLLING PANELS
            ========================================= */}
        <div className="flex flex-col items-center gap-24 py-12 w-full">
          {projectImages.map((src, index) => (
           <div
  key={index}
  className="horizontal-panel w-full flex justify-center items-center perspective-[2000px]"
>
              <div
                // max-w handles mobile vs desktop widths perfectly
                className="reveal-img relative w-full max-w-[90%] md:max-w-[80%] h-[60vh] md:h-[75vh] rounded-[3rem] overflow-hidden bg-neutral-900 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img
                  src={src}
                  alt={`Project Showcase ${index + 1}`}
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}