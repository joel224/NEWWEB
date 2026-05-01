'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SpotlightText from '@/components/SpotlightText';
import PhilosophyCircles from '@/components/thoughts';
import TextMarquee from '@/components/Magazine';
import ExperienceList from '@/components/Marquee';
import ProjectShowcase from '@/components/glass';
import ContactSection from '@/components/lastly';
import { useRouter } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function PortfolioHero() {
  const router = useRouter(); // <--- ADD THIS LINE
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderBoxRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loaderImages = [
    '/heropro/1.webp',
    '/heropro/2.webp',
    '/heropro/3.webp',
    '/heropro/4.webp',
    '/heropro/5.webp',
    '/heropro/6.webp',
    '/heropro/7.webp',
    '/heropro/8.webp',
  ];

  useEffect(() => {
    // Wait for the first 2 loader images to be decoded before starting
    const imgElements = Array.from(document.querySelectorAll('.loader-img')) as HTMLImageElement[];
    const waitTargets = imgElements.slice(0, 2).map(img =>
      img.complete ? Promise.resolve() : img.decode().catch(() => { })
    );

    let ctx: gsap.Context;

    Promise.all(waitTargets).then(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        gsap.set(['.hero-25', '.nav-item', '.ui-overlay .text-block'], { autoAlpha: 0 });

        // Get all images as an array
        const images = gsap.utils.toArray('.loader-img');

        // Create a specific, controlled loop for the "office blind" effect
        images.forEach((img, index) => {
          tl.fromTo(img,
            // Starting state: The image is "rolled up" (invisible, clipped to the bottom)
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              // End state: The image unrolls fully
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.7,         // <-- CONTROL 1: Speed of ONE individual image unrolling
              ease: 'power2.inOut',  // The "mechanical but elegant" feel
            },
            // <-- CONTROL 2: When does the NEXT image start?
            // i === 0 starts immediately. Every other image starts 0.5s before the previous one finishes.
            index === 0 ? "+=0" : "-=0.5"
          );
        });

        // Remove the images and show the hero background immediately so they switch places before expansion
        tl.set('.loader-img-wrapper', { autoAlpha: 0 })
          .set('.hero-25', { autoAlpha: 1 });

        // 1. The Expansion
        tl.to(loaderBoxRef.current, {
          width: '100vw',
          height: '100vh',
          duration: 1.2,
          ease: 'expo.inOut',
          delay: 0.2
        })
          // 2. Blur UP (Starts exactly when expansion starts)
          .to(loaderBoxRef.current, {
            filter: 'blur(15px)',
            duration: 1,
            ease: 'power2.in'
          }, '<')
          // 3. Blur DOWN (Starts right after Blur UP finishes, making it sharp at the end)
          .to(loaderBoxRef.current, {
            filter: 'blur(0px)',
            duration: 0.6,
            ease: 'power2.out'
          }, '>')

          // The rest of your timeline animations...
          .to('.loader-img-wrapper', {
            autoAlpha: 0,
            duration: 0.3,
            ease: 'power2.out'
          }, '<')
          .fromTo('.hero-25',
            { autoAlpha: 0, scale: 1.15, filter: 'blur(12px)' },
            { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 2, ease: 'power3.out' },
            '<'
          )
          .fromTo(['.nav-item', '.ui-overlay .text-block'],
            { autoAlpha: 0, scale: 1.1, filter: 'blur(4px)' },
            { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.08, ease: 'power3.out' },
            '-=1.5'
          );

        // ==========================================
        // PARALLAX EFFECT FOR NAME SVG
        // ==========================================
        gsap.to('.name-logo-wrap', {
          y: '50vh', // Moves it down at a different speed than the scroll
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true, // Locks the movement strictly to the user's scrollbar
          }
        });

      }, containerRef);
    });

    return () => ctx?.revert();
  }, []);

  return (
    // MASTER WRAPPER: Allows scrolling. min-h-screen ensures it takes up at least the full window.
    <main className="w-full bg-[#0a0a0a] min-h-screen font-sans overflow-x-hidden">

      {/* HERO SECTION: Locked to exactly one screen height (h-screen) with overflow hidden for the animation */}
      {/* Add: flex items-center justify-center */}
      <section ref={containerRef} className="relative  w-full h-screen flex items-center justify-center overflow-hidden bg-gray-100">

        <div className="name-logo-wrap absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <img
            src="/heropro/name.svg"
            alt="Joel Joshy"
            className="xl:w-[20%] 2xl:w-[50%] w-[50%] md:w-[25%] h-auto object-contain"
          />
        </div>

        {/* Hero background — lives OUTSIDE loaderBox so expansion/blur don't affect it */}
        <div className="hero-25   opacity-0 absolute inset-0 z-[15] flex items-center justify-center mix-blend-screen pointer-events-none">
          <img src="/heropro/bg (6).png" alt="Background" className="w-[90%] h-[80vh] object-contain opacity-70" />
        </div>

        <div
          ref={loaderBoxRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-[#0a0a0a] overflow-hidden flex items-center justify-center text-white z-10 will-change-[width,height,filter]"
        >
          <div className="loader-img-wrapper absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-transparent   pointer-events-none">
            {loaderImages.map((src, index) => (
              <Image
                key={index}
                src={src}
                fill
                sizes="300px"
                priority={index < 2}
                alt={`Loader image ${index + 1}`}
                className="loader-img h-full w-full object-cover"
              />
            ))}
          </div>

          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">

            <nav className="absolute top-5 left-0 w-full p-4 md:px-8 flex justify-between items-center text-sm z-50 pointer-events-auto">
              <span className="nav-item opacity-0 cursor-pointer hover:text-neutral-400 transition-colors">
                (About)
              </span>

              {/* Uses Next.js router to navigate to the new page */}
              <span
                onClick={() => router.push('/colgato')}
                className="nav-item opacity-0 cursor-pointer hover:text-neutral-400 transition-colors"
              >
                (Philosophy)
              </span>

              <span className="nav-item opacity-0 cursor-pointer hover:text-neutral-400 transition-colors">
                (Works)
              </span>

              {/* Uses native smooth scroll to find the ID we just added */}
              <span
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="nav-item opacity-0 cursor-pointer hover:text-neutral-400 transition-colors"
              >
                (Contact)
              </span>
            </nav>
            <div className="ui-overlay absolute inset-0 pointer-events-none p-1.5 md:p-8 flex flex-col justify-between z-50">
              <div className="flex-1 flex items-center justify-between">
                <div className="text-block opacity-0 text-sm text-neutral-400 min-[240px]:w-[20.8%]  max-[425px]:w-[70px] md:max-w-[200px]">
                  Web Developer. Scalable systems over social statements.
                </div>
                <div className="text-block opacity-0 text-sm text-neutral-400 min-[240px]:w-[20.8%]  max-[425px]:w-[99px] md:max-w-[200px] text-right">
                  Focused on building high-performance solutions, not just websites.
                </div>
              </div>

              <div className="grid grid-cols-3 items-end text-xs  text-neutral-500 tracking-widest uppercase w-full">
                <div className="text-block opacity-0 text-left  whitespace-nowrap  ">16°03'35" N</div>
                <div className="text-block opacity-0 text-center transform   whitespace-nowrap  ">Koratty, Kerala, India</div>
                <div className="text-block  opacity-0 text-right">108°14'33" E</div>
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
      <PhilosophyCircles />
      <TextMarquee />
      <ExperienceList />
      <ProjectShowcase />
      <ContactSection />

    </main>
  );
}