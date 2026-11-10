'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiHeart } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
 
// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function PhilosophyCircles() {
  const router = useRouter();
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

      gsap.set('.invitation-btn-wrapper', {
        opacity: 0,
        y: 16,
        scale: 0.95,
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

      // 4. Calculate continuous perspective flight paths (Zero brakes, unified flow: slow -> cruise -> rush)
      const flightDuration = 2.8;

      // =========================================================================
      // 🎛️ INNER RADIUS CONTROLLER (Controls where images emerge from):
      // • 0 = EXACT DEAD CENTER (0, 0)
      // • Adjust (e.g. 0 to 2, or 0 to 5) to control how wide the inner emergence circle is (in vw)
      // =========================================================================
      const innerRadiusMin = 0; // Minimum inner radius (0 = dead center)
      const innerRadiusMax = 3; // Maximum inner radius (0 = dead center; set e.g. 3 for a subtle ring)

      gsap.utils.toArray('.floating-img').forEach((img, i) => {
        // Natural 4-quadrant dispersal (top-left, top-right, bottom-left, bottom-right)
        const QUADRANTS = [
          { angle: -135, distMin: 105, distMax: 125 }, // ↖ top-left
          { angle: -45,  distMin: 105, distMax: 125 }, // ↗ top-right
          { angle: 135,  distMin: 105, distMax: 125 }, // ↙ bottom-left
          { angle: 45,   distMin: 105, distMax: 125 }, // ↘ bottom-right
        ];

        const q = QUADRANTS[i % 4];
        const spreadAngle = ((q.angle + gsap.utils.random(-14, 14)) * Math.PI) / 180;
        const dist = gsap.utils.random(q.distMin, q.distMax);

        // Final exit coordinates in viewport units
        const targetX = Math.cos(spreadAngle) * dist;
        const targetY = Math.sin(spreadAngle) * (dist * 0.72); // Screen aspect ratio compensation

        // Emergence origin: controlled by innerRadius (0 = exact dead center)
        const spawnRadius = gsap.utils.random(innerRadiusMin, innerRadiusMax);
        const spawnX = Math.cos(spreadAngle) * spawnRadius;
        const spawnY = Math.sin(spreadAngle) * (spawnRadius * 0.72);

        // Subtle 3D aerodynamic rotation & final scale variance
        const startRot = gsap.utils.random(-3, 3);
        const endRot = (i % 2 === 0 ? 1 : -1) * gsap.utils.random(6, 14);
        const finalScale = 5.0 + gsap.utils.random(0, 1.2);

        // =========================================================================
        // UNIFIED CONTINUOUS FLOW (No intermediate waypoints that slam brakes!)
        // Single continuous Power2.in curve:
        // - Small slow flow: Gentle distant float during emergence (t = 0 to 0.3)
        // - Normal flow: Steady, readable cruising through mid-field (t = 0.3 to 0.7)
        // - Fast flow: Exponential perspective fly-by rush (t = 0.7 to 1.0)
        // =========================================================================
        const imgTl = gsap.timeline();

        // 1. Continuous X displacement
        imgTl.fromTo(
          img as Element,
          { x: spawnX + 'vw' },
          {
            x: targetX + 'vw',
            duration: flightDuration,
            ease: 'power2.in',
          },
          0
        );

        // 2. Continuous Y displacement (Alternating power eases create a gentle aerodynamic arc)
        imgTl.fromTo(
          img as Element,
          { y: spawnY + 'vh' },
          {
            y: targetY + 'vh',
            duration: flightDuration,
            ease: (i % 2 === 0) ? 'power1.in' : 'power2.in',
          },
          0
        );

        // 3. Continuous 3D Scale & Rotation
        imgTl.fromTo(
          img as Element,
          {
            scale: 0.03,
            rotation: startRot,
          },
          {
            scale: finalScale,
            rotation: endRot,
            duration: flightDuration,
            ease: 'power2.in',
          },
          0
        );

        // 4. Smooth Opacity Lifecycle:
        // - Fades in gently during the small slow flow (first 25% of flight)
        // - Stays crystal clear at 1.0 throughout the entire normal cruising phase
        // - Dissolves seamlessly only in the final flyby rush as it passes the screen border
        imgTl.fromTo(
          img as Element,
          { opacity: 0 },
          {
            opacity: 1,
            duration: flightDuration * 0.25,
            ease: 'power1.out',
          },
          0
        );

        imgTl.to(
          img as Element,
          {
            opacity: 0,
            duration: flightDuration * 0.29,
            ease: 'power1.in',
          },
          flightDuration * 0.72
        );

        // Seamless staggered stream
        const baseSpacing = 0.32;
        tl.add(imgTl, i * baseSpacing);
      });

      // Reveal Invitation Button as the last thing rendered after all images
      tl.to('.invitation-btn-wrapper', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      });

      tl.to({}, { duration: 0.8 }); // Buffer at the end

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden font-sans"
    >
      {/* TEXT & ACTION LAYER */}
      <div className="relative z-30 text-center pointer-events-none px-4 flex flex-col items-center">
        <h2 className="text-white text-4xl  min-[320px]:text-2xl min-[484px]:text-3xl   md:text-5xl lg:text-3xl font-medium tracking-tight leading-[1.1] drop-shadow-2xl mb-8">
          Creativity is intelligence having fun:<br />
          The machinery of my design
        </h2>

        {/* View Invitation Button (revealed as the last thing rendered after all images fly past) */}
        <div className="invitation-btn-wrapper opacity-0 pointer-events-auto flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/');
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200 font-medium text-xs tracking-[0.2em] uppercase backdrop-blur-md transition-all duration-300 cursor-pointer hover:border-white/30"
          >
            <FiHeart className="w-3.5 h-3.5 text-neutral-300 fill-neutral-300/30" />
            <span>View Invitation</span>
          </button>
        </div>
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