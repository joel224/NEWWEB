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
      <section className="relative w-full h-[96dvh] overflow-hidden">

        {/* Background video — replaces the placeholder brown */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-[96dvh] object-cover object-[25%]"
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
              className="text-[12px] tracking-[1.85em] text-[#5c5045] mt-1"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600 }}
            >
              WEBSITES
            </p>
          </div>
          <div className="flex gap-10 mt-5 text-xl   text-[#3a2f25]"
               style={{ fontFamily: "var(--font-timesnewroman)", fontWeight: 300 }}>
            <Link href="#about" className="hover:opacity-90 transition-opacity tracking-wide">About</Link>
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
              className="text-[8px] tracking-[0.45em] text-[#5c5045] mt-0.5"
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
            <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="tracking-[0.2em]">About</Link>
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
      <section id="about" className="w-full bg-[#f4f0eb] flex flex-col items-center pt-6 pb-16 md:hidden">
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
          WEBSITE'S
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

      </ClickSpark>
    </main>
  );
}