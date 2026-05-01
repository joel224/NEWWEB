"use client";

import { useState } from "react";
import Link from "next/link";
import ClickSpark from "@/components/clicki";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (   
    <main className="w-full min-h-screen bg-[#f4f0eb] font-sans overflow-x-hidden">
      <ClickSpark
        sparkColor="#d47d5aff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >

      {/* ─── VIDEO HERO SECTION ───────────────────────────────── */}
      <section className="relative w-full h-[90dvh] md:h-[96.2dvh] overflow-hidden">

        {/* Background video — replaces the placeholder brown */}
        <video
          autoPlay 
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-[90dvh]  md:h-[96dvh] object-cover object-[25%]"
        >
          <source src="/heropro/nettisivut (2160p).mp4" type="video/mp4" />
        </video>

        {/* Subtle dark overlay so text stays legible */}
        <div className="absolute inset-0 bg-black/10" />

        {/* ── DESKTOP NAV (center-top) ── */}
        <nav className="hidden md:flex absolute top-13 left-0 right-0 flex-col items-center z-20 gap-2">
          <div className="text-center">
            <h1 
              className="text-4xl whitespace-pre tracking-[0.45em] uppercase font-light text-[#3a2f25]"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 580 }}
            >
              JOEL JOSHY
            </h1> 
            <p
              className="text-[12px] tracking-[1.85em] text-[#5c5045] mt-1.5"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600 }}
            >
              Engineer
            </p>
          </div>
          <div className="flex gap-10 mt-5 text-xl   text-[#3a2f25]"
               style={{ fontFamily: "var(--font-timesnewroman)", fontWeight: 300 }}>
            <Link 
              href="https://www.linkedin.com/in/joel-j-824099264/'" 
              onClick={() => setMobileMenuOpen(false)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="tracking-[0.2em]"
            >
              About
            </Link>
            <Link href="/portfolio" className="hover:opacity-90 transition-opacity tracking-wide">Portfolio</Link>
            <Link href="#contact" className="hover:opacity-90 transition-opacity tracking-wide">Contact Me</Link>
          </div>
        </nav>

        {/* ── MOBILE NAV (logo top-left, hamburger top-right) ── */}
        <div className="md:hidden absolute top-5 left-0 right-0 flex items-center justify-between px-5 z-20">
          {/* Logo */}
          <div>
            <p
              className="text-sm tracking-[0.3em] font-light text-[#3a2f25] leading-none"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
            >
              JOEL JOSHY
            </p>
            <p
              className="text-[8px] uppercase tracking-[0.45em] text-[#5c5045] mt-1"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
            >
              WEBSITE'S
            </p>
          </div>

          {/* Hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col gap-[5px] p-1"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[1.5px] bg-[#3a2f25] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-6 h-[1.5px] bg-[#3a2f25] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[1.5px] bg-[#3a2f25] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 z-30 bg-[#f4f0eb]/90 backdrop-blur-sm flex flex-col items-center gap-5 py-8 text-sm text-[#3a2f25]"
               style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}>
            <Link 
              href="https://www.linkedin.com/in/joel-j-824099264/'" 
              onClick={() => setMobileMenuOpen(false)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="tracking-[0.2em]"
            >About</Link>
            <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className="tracking-[0.2em]">Portfolio</Link>
            <Link 
              href="https://www.linkedin.com/in/joel-j-824099264/'" 
              onClick={() => setMobileMenuOpen(false)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="tracking-[0.2em]"
            >
              Contact Me
            </Link>
          </div>
        )}

        {/* ── WAVE CURVE at the bottom ── */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            className="w-full block"
            style={{ height: '90px' }}
          >
            <path
              d="M0,60 C240,100 480,20 720,55 C960,90 1200,25 1440,60 L1440,90 L0,90 Z"
              fill="#f4f0eb"
            />
          </svg>
        </div>
      </section>

      {/* ─── BELOW-WAVE: MOBILE title + nav ───────────────────── */}
      <section id="mobile-hero-nav" className="w-full bg-[#f4f0eb] flex flex-col items-center pt-6 pb-16 md:hidden">
        <h2
          className="text-3xl tracking-[0.25em] font-light text-[#3a2f25]"
          style={{ fontFamily: "`'Montserrat', sans-serif", fontWeight: 300 }}
        >
          JOEL JOSHY
        </h2>
        <p
          className="text-[9px] tracking-[0.5em] text-[#5c5045] mt-1 mb-8"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
        >
          Engineer
        </p>
        <nav className="flex gap-10 text-sm text-[#3a2f25]"
             style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
          <Link href="/portfolio" className="tracking-wide">Portfolio</Link>
          <Link 
              href="https://www.linkedin.com/in/joel-j-824099264/'" 
              onClick={() => setMobileMenuOpen(false)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="tracking-[0.2em]"
            >
              Contact Me
            </Link>
        </nav>
      </section>

      {/* ─── ABOUT SECTION ────────────────────────────────────── */}
      <section id="about" className="w-full bg-[#f4f0eb] flex flex-col items-center px-6 md:px-8 py-18 md:py-32 relative z-20 overflow-hidden">
        <div className="w-full max-w-4xl text-center flex flex-col items-center gap-10 md:gap-12">
          <h3 
            className="text-3xl uppercase md:text-4xl lg:text-5xl text-[#3a2f25] leading-snug md:leading-relaxed"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
          >
            Jo`el 
          </h3>
          
          <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 items-start md:justify-center group">
            {/* The Spine: Visible on desktop, subtle horizontal line on mobile */}
            <div className="hidden md:block w-[1px] h-24 bg-gradient-to-b from-[#3a2f25] via-[#3a2f25]/40 to-transparent opacity-50 mt-2"></div>
            <div className="md:hidden w-12 h-[1px] bg-gradient-to-r from-[#3a2f25] to-transparent opacity-30 mb-2"></div>
            
            <div className="flex flex-col items-start text-left space-y-5 w-full md:w-auto max-w-xl">
              {/* The Label */}
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#3a2f25]/50 select-none" aria-hidden="true">
                01 — Philosophy
              </p>

              <p 
                className="text-lg md:text-xl text-[#3a2f25] leading-[1.6] md:max-w-[38ch] tracking-tight"
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
              >
                I specialize in designing and building <span className="font-light">high-performance</span> web applications that don’t just function flawlessly, but <span className="italic">feel alive</span>. 
              </p>
              
              {/* Social Wrapper */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 pt-4 md:pt-6 md:ml-8 relative z-[70] w-full">
                <div className="hidden sm:block w-4 h-[1px] bg-white/20" aria-hidden="true"></div>

                <div className="flex items-center gap-4">
                  <a 
                    href="https://www.linkedin.com/in/joel-j-824099264/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group/icon"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-12 h-12 md:w-[60px] md:h-[60px] opacity-80 group-hover/icon:opacity-100 group-hover/icon:drop-shadow-[0_0_12px_rgba(167,243,208,0.6)] transition-all duration-300 ease-out"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#ffffffff" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>

                {/* The "Available" Dot */}
                <div className="flex items-center gap-3 md:gap-4 sm:ml-2">
                  <span className="relative flex h-12 w-12 md:h-20 md:w-20 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 md:h-10 md:w-10 bg-white/30"></span>
                  </span>
                  <p className="text-xs md:text-[19px] tracking-widest uppercase text-[#3a2f25]/60 md:text-white/30 select-none whitespace-nowrap">
                    Open for collab
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </ClickSpark>
    </main>
  );
}