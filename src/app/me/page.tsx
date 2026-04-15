// src/app/me/page.tsx
"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TestimonialVideo from "@/components/TestimonialVideo";
import OtherVideoComponent from "@/components/OtherVideoComponent";

gsap.registerPlugin(ScrollTrigger);

// ✅ 1. Define actual React Elements here!  dfdf
const slides = [
  <TestimonialVideo 
    key="comp-1"
    videoSrc="/output (1).mp4" 
    overlayText={
      <h2 className="text-white text-6xl md:text-8xl font-light font-bold text-right leading-tight uppercase drop-shadow-2xl">
        CEO
      </h2>
    }
  />,
  <TestimonialVideo 
    key="comp-2"
    videoSrc="/output.mp4" 
    overlayText={
      <h2 className="text-white text-5xl md:text-7xl font-light font-black text-center drop-shadow-2xl">
        CFO 
      </h2>
    }
  />,
  <TestimonialVideo 
    key="comp-3"  // ✅ Fixed: was duplicate "comp-2"
    videoSrc="/output (7).mp4" 
    overlayText={
      <h2 className="text-white text-5xl md:text-7xl font-light font-black text-center drop-shadow-2xl">
        Chairman of the Board
      </h2>
    }
  />,
  
  // ✅ Existing OtherVideoComponent
  <OtherVideoComponent 
    key="comp-4"  // ✅ Updated key for consistency
    videoSrc="/output (6).mp4" 
    overlayText={
      <>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-10 md:mb-10 leading-tight text-white">
          Founder
        </h1>
        <h2 className="text-3xl md:text-4xl font-serif mb-2 text-white">Ms. Glary</h2>
        <p className="text-gray-400 text-sm md:text-base tracking-wide mb-6">
          Actress
        </p>
        <hr className="border-gray-800 mb-3" />
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 pr-0 md:pr-10">
          With extensive experience in real filims and client relations, Mr. Benjos T J serves as your primary point of contact for all projects. Whether you're exploring new projects, seeking detailed project insights, or arranging a personalized site visit.
        </p>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 py-0 border-b border-gray-800/50">
            <a href="mailto:benjos.tj@confident-group.com" className="text-gray-200 hover:text-white transition-colors">
              Hello-group.com
            </a>
          </div>
        </div>
      </>
    }
  />,

  // ✅ NEW: Add these additional slides
  <OtherVideoComponent 
    key="comp-5"
    videoSrc="/output (7).mp4" 
    overlayText={
      <>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-10 leading-tight text-white">
          Founder
        </h1>
        <h2 className="text-3xl md:text-4xl font-serif mb-2 text-white">Ms. Amelia Jackson</h2>
        <p className="text-gray-400 text-sm md:text-base tracking-wide mb-6">Actress</p>
        <hr className="border-gray-800 mb-3" />
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 pr-0 md:pr-10">
          With extensive experience in real filims and client relations, Mr. Benjos T J serves as your primary point of contact for all projects.
        </p>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 py-0 border-b border-gray-800/50">
            <a href="mailto:benjos.tj@confident-group.com" className="text-gray-200 hover:text-white transition-colors">
              Hello-group.com
            </a>
          </div>
        </div>
      </>
    }
  />,

  <OtherVideoComponent 
    key="comp-6"
    videoSrc="/output (8).mp4" 
    overlayText={
      <>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-10 leading-tight text-white">
          Founder
        </h1>
        <h2 className="text-3xl md:text-4xl font-serif mb-2 text-white">Ms. Tasha Thompson</h2>
        <p className="text-gray-400 text-sm md:text-base tracking-wide mb-6">Actress</p>
        <hr className="border-gray-800 mb-3" />
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 pr-0 md:pr-10">
          With extensive experience in real filims and client relations, Mr. Benjos T J serves as your primary point of contact for all projects.
        </p>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 py-0 border-b border-gray-800/50">
            <a href="mailto:benjos.tj@confident-group.com" className="text-gray-200 hover:text-white transition-colors">
              Hello-group.com
            </a>
          </div>
        </div>
      </>
    }
  />,

  <OtherVideoComponent 
    key="comp-7"
    videoSrc="/output (9).mp4" 
    overlayText={
      <>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-10 leading-tight text-white">
          Founder
        </h1>
        <h2 className="text-3xl md:text-4xl font-serif mb-2 text-white">Ms. Soo-jin Park</h2>
        <p className="text-gray-400 text-sm md:text-base tracking-wide mb-6">Actress</p>
        <hr className="border-gray-800 mb-3" />
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 pr-0 md:pr-10">
          With extensive experience in real filims and client relations, Mr. Benjos T J serves as your primary point of contact for all projects.
        </p>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 py-0 border-b border-gray-800/50">
            <a href="mailto:benjos.tj@confident-group.com" className="text-gray-200 hover:text-white transition-colors">
              Hello-group.com
            </a>
          </div>
        </div>
      </>
    }
  />,

  <OtherVideoComponent 
    key="comp-8"
    videoSrc="/output (10).mp4" 
    overlayText={
      <>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-10 leading-tight text-white">
          Founder
        </h1>
        <h2 className="text-3xl md:text-4xl font-serif mb-2 text-white">Ms. Mary George</h2>
        <p className="text-gray-400 text-sm md:text-base tracking-wide mb-6">Actress</p>
        <hr className="border-gray-800 mb-3" />
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 pr-0 md:pr-10">
          With extensive experience in real filims and client relations, Mr. Benjos T J serves as your primary point of contact for all projects.
        </p>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 py-0 border-b border-gray-800/50">
            <a href="mailto:benjos.tj@confident-group.com" className="text-gray-200 hover:text-white transition-colors">
              Hello-group.com
            </a>
          </div>
        </div>
      </>
    }
  />,
];


  // <SomeOtherVideoComponent key="comp-3" /> // You can drop a completely different layout here!



export default function KineticPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${slides.length * 93}%`, // Scroll distance based on component count
          scrub: 1, 
          pin: true,
        },
      });

      // --- INITIAL SETUP ---
      slideRefs.current.forEach((slide) => {
        if (slide) {
          gsap.set(slide, { 
            y: "120%", 
            opacity: 0, 
            rotateX: -45, 
            scale: 0.8,
            filter: "blur(10px)",
            transformOrigin: "center center"
          });
        }
      });

      // --- ANIMATION LOOP ---
      slides.forEach((_, i) => {
        const slide = slideRefs.current[i];
        if (!slide) return;

        // 1. ENTER (Come from bottom, unblur, rotate up)
        tl.to(slide, {
          y: "0%",
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power4.out",
        });

        // 2. HOLD (Stay visible & scale up slightly)
        tl.to(slide, {
          scale: 1.1, // Adjust if you want the massive 2.2 scale back
          duration: 0.8,
          ease: "none"
        });

        // 3. EXIT (Go up, blur out, rotate away)
        if (i < slides.length - 1) {
            tl.to(slide, {
                y: "-120%",
                opacity: 0,
                rotateX: 45,
                scale: 1.2,
                filter: "blur(10px)",
                duration: 0.8,
                ease: "power2.in",
            }, ">-0.2"); 
        }
      });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <main className="w-full bg-black/97 text-[#FFE9D9]">
      <section ref={containerRef} className="h-screen w-full relative overflow-hidden perspective-1000">
        
        {/* CENTERED STAGE */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          
          {/* ✅ 2. Map over the actual React components */}
          {slides.map((SlideComponent, i) => (
            <div
              key={SlideComponent.key}
              ref={(el) => { slideRefs.current[i] = el; }}
              className="absolute w-full flex justify-center"
              style={{ willChange: "transform, opacity, filter" }} 
            >
              {/* Render the specific component for this slide */}
              {SlideComponent}
           
            </div>
          ))}

        </div>

      </section>
      
      {/* Spacer to allow scrolling past */}
      <div className="h-[50vh]"></div>
    </main>
  );
}