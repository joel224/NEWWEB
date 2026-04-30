'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
 
// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function PhilosophyCircles() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Array of 20 dummy images
  const images = Array.from({ length: 20 }, (_, i) => `/thoughts/image${i + 1}.webp`);

useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Ambient rotation for Venn circles
      gsap.set('.venn-group-1', { yPercent: -35 ,rotation: "+=-0" });
      gsap.set('.venn-group-2', { xPercent: 21.65, yPercent: 12.5 ,rotation: "+=120"});
      gsap.set('.venn-group-3', { xPercent: -21.65, yPercent: 12.5 ,rotation: "+=360"});

      gsap.to('.venn-dot-container', {
        rotation: "+=860", 
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',   
          end: '+=12000', 
          scrub: 1.5,
        },
      });

      // 2. Initial state
      gsap.set('.floating-img', {
        xPercent: -50,
        yPercent: -50,
        top: '50%',
        left: '50%',
        scale: 0, 
        opacity: 0,
      });

      // 3. ScrollTrigger Setup
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=7000', // Increased to give plenty of room for spacing out traffic
          pin: true,
          scrub: 1.5, 
        //   anticipatePin: 1, // 🔥 smooths entry/exit but did not work 
        },
      });

      // 4. Calculate flight paths and animate
      gsap.utils.toArray('.floating-img').forEach((img, i) => {
        const groupIndex = i % 3;
        const direction = i % 4; 
    const EXITS = [
  { tx: gsap.utils.random(-110, -90), ty: gsap.utils.random(-90, -60)  }, // ↖ top-left
  { tx: gsap.utils.random(90,   110), ty: gsap.utils.random(-90, -60)  }, // ↗ top-right
  { tx: gsap.utils.random(-110, -90), ty: gsap.utils.random(60,   90)  }, // ↙ bottom-left
  { tx: gsap.utils.random(90,   110), ty: gsap.utils.random(60,   90)  }, // ↘ bottom-right
];

const exit = EXITS[i % 4];
const baseY = exit.ty;
const targetY = !(i % 2 === 0) ? -baseY : baseY;
const targetX = -exit.tx;

// Spawn origin: 8–15% of the way toward the exit already
// This makes A→B feel like ONE curve, not a pivot
const spawnX = targetX * gsap.utils.random(0.06, 0.12);
const spawnY = targetY * gsap.utils.random(0.06, 0.12);

// burstX/burstY: 18–25% of the way — gently drifting, never hard-center
const burstX = targetX * gsap.utils.random(0.18, 0.25);
const burstY = targetY * gsap.utils.random(0.18, 0.25);
// optional: bias upward/downward flow

       
        let depth = { scale: 1.2, opacity: 1, z: -10 };

        if (groupIndex === 0) {
          depth = { scale: 1.6, opacity: 1, z: -10 }; 
        } else if (groupIndex === 1) {
          depth = { scale: 1.6, opacity: 1, z: -10 }; 
        } else {
          depth = { scale: 1.5, opacity: 1, z: -10 }; 
        }

        

        // ==========================================
        // THE BURST LOGIC
        // Calculate a point 20% of the way to the final target
        // ==========================================
        

        const imgTl = gsap.timeline();

        imgTl
          // Step A: THE BURST
          // Shoot from center (0,0) to the burst point very quickly.
          // expo.out makes it explode outward then rapidly slow down.
          .fromTo(img as Element, 
            { 
              x: 0, 
              y: 0, 
              opacity: 0, 
                ease: 'power2.out',
              scale: 0.05 // Start tiny so it doesn't block the center
            },
            { 
              x: burstX + 'vw', 
              y: burstY + 'vh', 
              opacity: depth.opacity, 
              scale: depth.scale,
              duration: 0.9, // Very fast burst
              ease: 'none', // 🔥 important
            }
          )
         .to(img as Element, {
            x: targetX + 'vw',
            y: targetY + 'vh',
            scale: 6.5, 
            opacity: 0,
            duration: 1.8,
            ease: 'power1.inOut'
            })
        // ==========================================
        // TRAFFIC CONTROL (2 Exit / 1 Enter Rule)
        const staggerDelay = 1.25; 
        
       const baseSpacing = 0.3; // smaller = smoother stream

tl.add(imgTl, i * baseSpacing);
      });

      tl.to({}, { duration: 0.5 }); // Buffer at the end
      //tl.to({}, { duration: 1.5 }); // did not make any diffrnce

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden font-sans"
    >
      {/* TEXT LAYER */}
      <div className="relative z-30 text-center pointer-events-none px-4">
        <h2 className="text-white text-4xl  min-[320px]:text-2xl min-[484px]:text-3xl   md:text-5xl lg:text-3xl font-medium tracking-tight leading-[1.1] drop-shadow-2xl">
          Creativity is intelligence having fun:<br />
          The machinery of my design
        </h2>
      </div>

      {/* IMAGES LAYER */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {images.map((src, index) => (
          <div 
            key={index} 
            className="floating-img absolute  rounded-sm overflow-hidden"
            style={{ width: '180px', height: '130px' }} 
          >
            <img 
              src={src} 
              alt={`Project ${index + 1}`} 
              className="  min-[320px]:w-1/3 min-[320px]:h-1/3  min-[370px]:w-1/2 min-[370px]:h-1/2    md:w-full md:h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* CIRCLES LAYER */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-[50vh] h-[50vh] max-w-[500px] max-h-[500px]">
          <div className="venn-group venn-group-1 absolute inset-0">
            <div className="absolute inset-0 rounded-full border border-[#333333]" />
            <div className="venn-dot-container absolute inset-0 rounded-full">
              <div className="absolute w-[4px] h-[4px] bg-white rounded-full top-[-2px] left-1/2 -ml-[2px]" />
            </div>
          </div>
          <div className="venn-group venn-group-2 absolute inset-0">
            <div className="absolute inset-0 rounded-full border border-[#333333]" />
            <div className="venn-dot-container absolute inset-0 rounded-full">
              <div className="absolute w-[4px] h-[4px] bg-white rounded-full top-[-2px] left-1/2 -ml-[2px]" />
            </div>
          </div>
          <div className="venn-group venn-group-3 absolute inset-0">
            <div className="absolute inset-0 rounded-full border border-[#333333]" />
            <div className="venn-dot-container absolute inset-0 rounded-full">
              <div className="absolute w-[4px] h-[4px] bg-white rounded-full top-[-2px] left-1/2 -ml-[2px]" />
            </div>
          </div>
        </div>
      </div>
          
    </section>
  );
}