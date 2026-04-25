'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SpotlightText from '@/components/SpotlightText';
import PhilosophyCircles from '@/components/thoughts';
import TextMarquee from '@/components/Magazine';
import ExperienceList from '@/components/Marquee';
import ProjectShowcase from '@/components/glass';
import ContactSection from '@/components/lastly';

export default function PortfolioHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderBoxRef = useRef<HTMLDivElement>(null);

  const loaderImages = [
    '/heropro/1.webp',
    '/heropro/2.webp',
    '/heropro/3.webp',
    '/heropro/4.webp'
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.set(['.hero-25', '.nav-item', '.ui-overlay .text-block'], { autoAlpha: 0 });

      tl.fromTo(
        '.loader-img',
        { yPercent: 100 },
        { 
          yPercent: 0, 
          duration: 0.7, 
          stagger: 0.35, 
          ease: 'power3.out' 
        }
      )
      .to(loaderBoxRef.current, {
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0aff',
        duration: 1.2,
        ease: 'expo.inOut',
        delay: 0.2
      })
      .to('.loader-img-wrapper', {
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.4') 
      .to('.hero-25', { 
        autoAlpha: 1, 
        duration: 1.5, 
        ease: 'power2.out' 
      }, '<')
      .fromTo(['.nav-item', '.ui-overlay .text-block'], 
        { y: 15 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out' },
        '-=0.8'
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    // MASTER WRAPPER: Allows scrolling. min-h-screen ensures it takes up at least the full window.
    <main className="w-full bg-[#0a0a0a] min-h-screen font-sans overflow-x-hidden">
      
      {/* HERO SECTION: Locked to exactly one screen height (h-screen) with overflow hidden for the animation */}
      <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-gray-100 flex items-center justify-center">
        
        <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <img 
            src="/heropro/name.svg" 
            alt="Joel Joshy" 
            className="xl:w-[50%] w-[50%] md:w-[25%] h-auto object-contain" 
          />
        </div>
        
        <div 
          ref={loaderBoxRef} 
         className="relative w-[300px] h-[400px] bg-transparent overflow-hidden shadow-2xl flex items-center justify-center text-white z-10" 
        >
          <div className="loader-img-wrapper absolute inset-0 z-20 pointer-events-none">
            {loaderImages.map((src, index) => (
              <img 
                key={index}
                src={src}
                alt={`Loader image ${index + 1}`}
                className="loader-img absolute inset-0 w-full h-full object-cover"
              />
            ))}
          </div>

          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="hero-25 opacity-0 absolute inset-0 flex items-center justify-center mix-blend-screen pointer-events-none -z-10">
              <img src="/heropro/bg.png" alt="Background" className="w-[90%] h-[80vh] object-contain opacity-70" />
            </div>

            <nav className="absolute top-5 left-0 w-full px-8 flex justify-between items-center text-sm z-50 pointer-events-auto">
  <span className="nav-item opacity-0 cursor-pointer hover:text-neutral-400 transition-colors">(About)</span>
  <span className="nav-item opacity-0 cursor-pointer hover:text-neutral-400 transition-colors">(Philosophy)</span>
  <span className="nav-item opacity-0 cursor-pointer hover:text-neutral-400 transition-colors">(Works)</span>
  <span className="nav-item opacity-0 cursor-pointer hover:text-neutral-400 transition-colors">(Contact)</span>
</nav>

            <div className="ui-overlay absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-50">
              <div className="flex-1 flex items-center justify-between">
                <div className="text-block text-sm text-neutral-400 min-[240px]:w-[20.8%]  max-[425px]:w-[70px] md:max-w-[200px]">
                  Web Developer. Scalable systems over social statements.
                </div>
                <div className="text-block text-sm text-neutral-400 min-[240px]:w-[20.8%]  max-[425px]:w-[99px] md:max-w-[200px] text-right">
                  A Web Developer focused on building high-performance solutions, not just websites.
                </div>
              </div>

              <div className="flex justify-between items-end text-xs text-neutral-500 tracking-widest uppercase">
                <div className="text-block text-left min-[240px]:w-[10.8%] min-[455px]:w-1/4 md:w-full ">16°03'35" N</div>
                <div className="text-block text-center transform -translate-x-6 ">Koratty, Kerala, India</div>
                <div className="text-block text-right">108°14'33" E</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLLABLE CONTENT AREA */}
      {/* This section sits below the hero and will become visible as you scroll down */}
     <section className="w-full min-h-screen flex items-center bg-[#0a0a0a] px-6 -pt-20">
      <div className="max-w-full mx-auto w-full">
        <SpotlightText
          content="I found my way by chasing every spark. I fixed
each small slip and just kept moving. Uniqueness, It wasn't
about the look, but the life inside. The multiple quiet
gears, the rhythm and the simple rules that let a
dream stand tall and stay bright."
          baseColor="#333333" 
          spotlightColor="#ffffff"
          enableGlow={true}
          
          className="max-w-[84ch]   min-[375px]:indent-10 min-[425px]:indent-20 xl:indent-40 md:indent-40 text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight"
          
        /></div>
      </section>
      <PhilosophyCircles/>
      <TextMarquee/>
      <ExperienceList/>
      <ProjectShowcase/>
      <ContactSection/>

    </main>
  );
}