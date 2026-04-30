'use client';

import React, { useState } from 'react';

export default function ExperienceList() {
  // 4 Dummy items as requested
  const [activeId, setActiveId] = useState<number | null>(null);
  const experiences = [
    {
      id: 1,
      category: 'Fitness Coaching',
      name: 'Everfit',
      timeline: '(22)-(Present)',
      marqueeImages: ['/marquee/gym.png', '/marquee/gym.png'],
    },
    {
      id: 2,
      category: 'Agency',
      name: 'Sumenki',
      timeline: '(23)-(24)',
      marqueeImages: ['/marquee/map.png', '/marquee/map1.png'],
    },
    {
      id: 3,
      category: 'Blockchain',
      name: 'Flux Labs',
      timeline: '(24)-(25)',
      marqueeImages: ['/marquee/blockchain.png', '/marquee/blockchain.png'],
    },
    {
      id: 4,
      category: 'E-Commerce',
      name: 'Shopify',
      timeline: '(20)-(22)',
      marqueeImages: ['/marquee/shopi.png', '/marquee/shopi.png'],
    },
  ];

  return (
    <section className="w-full min-h-screen bg-[#0a0a0a] text-white font-sans pt-24 pb-12 overflow-hidden">
      
      {/* =========================================
          CUSTOM ANIMATION STYLES
          ========================================= */}
      <style>{`
        @keyframes marqueeRight {
         0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 20s linear infinite;
        }
        /* Pause the marquee if the user hovers directly over the images, optional but nice */
        .group:hover .animate-marquee-right {
          animation-play-state: running;
        }
      `}</style>

      {/* =========================================
          TOP HEADER ROW
          ========================================= */}
      <div className="flex justify-between items-start px-8 pb-12 border-b border-[#222]">
        <div className="w-1/4 min-[375px]:text-xs  min-[425px]:text-sm text-neutral-400 min-[532px]:w-1/6  ">Industry</div>
        <div className="w-2/4 text-center min-[375px]:text-xs  min-[425px]:text-sm md:text-base text-neutral-400 max-w-sm mx-auto leading-relaxed">
          Every decision, every detail is a lever, each one working to make the whole run better than before
        </div>
        <div className="w-1/4 text-right min-[375px]:text-xs  min-[425px]:text-sm text-sm text-neutral-400 min-[532px]:w-1/6  ">Timeline</div>
      </div>

      {/* =========================================
          EXPERIENCE LIST
          ========================================= */}
      <div className="flex flex-col w-full">
        {experiences.map((item) => (
          
          <div 
            key={item.id}
         onClick={(e) => {
  e.stopPropagation();
  setActiveId(activeId === item.id ? null : item.id);
}}
            className="group relative w-full border-b border-[#222] transition-colors duration-500 hover:bg-white text-white hover:text-black overflow-hidden flex items-center min-h-[220px] cursor-pointer"
          >
            
            {/* 1. DEFAULT STATE (Fades out on hover) */}
           <div
  className={`absolute inset-0 flex justify-between items-center px-3 md:px-8 transition-opacity duration-500 z-10
  ${activeId === item.id ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
>
              <div className="w-1/4 min-[375px]:w-1/6 leading-tight min-[375px]:text-xs  min-[425px]:text-xs  min-[517px]:text-lg font-light">  
               
    {item.category}
          
              </div>
              <div className="w-2/4 text-center text-4xl  min-[375px]:text-[47px]  min-[373px]:text-6xl   md:text-8xl tracking-tighter font-medium">
                {item.name}
              </div>
              <div className="w-1/4 text-right min-[375px]:text-[10px]  min-[425px]:text-sm  min-[517px]:text-lg font-light">{item.timeline}</div>
            </div>

            {/* 2. HOVER STATE: MARQUEE (Fades in on hover) */}
           <div
  className={`absolute inset-0 flex items-center transition-opacity duration-500 z-0
  ${activeId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
>
              <div className="animate-marquee-right">
                {/* We render the block of images/text TWICE to create a seamless infinite loop.
                  Because the animation starts at -50% and moves to 0%.
                */}
                {[...Array(2)].map((_, loopIndex) => (
                  
                  <div key={loopIndex} className="flex items-center gap-12 px-6">
                    
                    {/* Item 1: Pill Image */}
                    <div className="w-[300px] h-[140px] rounded-[100px] overflow-hidden bg-neutral-200">
                      <img 
                        src={item.marqueeImages[0]} 
                        alt="Project snippet" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Item 2: Logo / Brand Text */}
                    <div className="text-7xl tracking-tighter font-medium flex items-center gap-4">
                      {/* Optional Asterisk icon from your screenshot */}
                      <span className="text-5xl">✱</span>
                      {item.name}
                    </div>

                    {/* Item 3: Pill Image */}
                    <div className="w-[300px] h-[140px] rounded-[100px] overflow-hidden bg-neutral-200">
                      <img 
                        src={item.marqueeImages[1]} 
                        alt="Project snippet" 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item 4: Logo / Brand Text */}
                    <div className="text-7xl tracking-tighter font-medium flex items-center gap-4">
                      <span className="text-5xl">✱</span>
                      {item.name}
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        ))}
      </div>

    </section>
  );
}