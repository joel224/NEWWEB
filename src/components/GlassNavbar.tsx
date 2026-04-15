"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useReveal } from "@/app/context/RevealContext";
import { div } from "framer-motion/client";
import link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Add this


const GlassNavbar = () => {

  const { setIsRevealed } = useReveal();
  const [isActivated, setIsActivated] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
   const pathname = usePathname(); // ✅ Add this line
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// ✅ 1. New state to control our custom animation sequence
  const [animationState, setAnimationState] = useState("centered");

  // ✅ 2. Sync normal interactions & auto-docking to the animation state
  // This ensures your default /colgato auto-dock works perfectly untouched!
  useEffect(() => {
    if (isActivated && animationState === "centered") {
      setAnimationState("docked");
    }
  }, [isActivated, animationState]);

// ✅ 3. The custom sequence for the "Give" button
  const handleGiveAnimation = () => {
    // 1. Zoom close to screen (Takes 0.6s)
    setAnimationState("zoomIn");
    
    // 2. PAUSE for 600ms after the zoom finishes (Total time elapsed: 1200ms)
    setTimeout(() => {
      setAnimationState("swipeRight");
      
      // 3. Fire the logic ALMOST IMMEDIATELY as the swipe starts!
      // (Just a tiny 100ms delay so the swipe motion registers visually first)
      setTimeout(() => {
        handleNavInteraction(() => setIsRevealed(true));
      }, 100);
      
    }, 1200); 
    
    // 4. Move invisibly to the top of the screen (Total time: 1600ms)
    setTimeout(() => setAnimationState("hiddenTop"), 1600);
    
    // 5. Drop down into docked position in the background (Total time: 1650ms)
    setTimeout(() => {
      setAnimationState("docked");
    }, 1650);
  };
  const navLinks = ["Academics", "Admissions", "Campus Life", "Athletics"];

  useEffect(() => {
    // Fade content in after the spring settles (~900ms)
    const timer = setTimeout(() => setContentVisible(true), 900);
    return () => clearTimeout(timer);
  }, []);
const [showCustomCursor, setShowCustomCursor] = useState(false);
const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

const handleCursorMove = (e: React.MouseEvent) => {
  setCursorPos({ x: e.clientX, y: e.clientY });
};
  // ✅ PRO: Auto-dock navbar ONLY on /colgato after 1s delay
  useEffect(() => {
    // Only trigger on the specific route
    if (pathname !== "/colgato") return;

    // Delay docking to let page content settle
    const dockTimer = setTimeout(() => {
      setIsActivated(true);
    }, 2000);

    // Cleanup: prevents memory leaks if component unmounts early
    return () => clearTimeout(dockTimer);
  }, [pathname]); // Re-run only if pathname changes (e.g., client-side nav)
  
  const handleNavInteraction = (callback?: () => void) => {
    if (!isActivated) setIsActivated(true);
    if (callback) callback();
  };

  // Rubber-band spring — overshoots slightly, then snaps into place
  const snapSpring = {
    type: "spring" as const,
    stiffness: 120,
    damping: 22,
    mass: 0.9,
  };

  // Outer wrapper handles centered ↔ docked position
  // Outer wrapper handles centered ↔ docked position AND custom sequence
  const wrapperVariants = {
    centered: { top: "50%", y: "-50%", scale: 1, x: 0 },
    docked: {
      top: 0,
      y: 0,
      scale: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const},
    },
    zoomIn: {
      top: "50%",
      y: "-50%",
      scale: 1.20,
      x: -320,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const   },
    },
    swipeRight: {
      top: "50%",
      y: "-50%",
      scale: 1.15,
      x: "100vw", // Fast swipe off screen to the right
      transition: { duration: 0.3, ease: [0.42, 0, 1, 1] as const    },
    },
    hiddenTop: {
      top: 0,
      y: "-100%", // Invisibly teleport above the screen
      scale: 1,
      x: 0,
      transition: { duration: 0 }, // Instant jump
    },
  };
  return (

    
  <motion.div
      variants={wrapperVariants}
      initial="centered"
      animate={animationState} // ✅ Uses our new state engine
      className="fixed left-1/2 -translate-x-1/2 w-full max-w-5xl z-[100]"
    >
      {/* ── CONTENT — fades in only after halves have joined ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const   }}
          className="relative flex items-center justify-between px-6 py-5 pointer-events-none"
        ></motion.div>
      <div className="relative">

        {/* ── LEFT HALF — flies in from the left ── */}
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ ...snapSpring, delay: 0.8 }}
          className="absolute inset-y-0 left-0 w-1/1
                     bg-gradient-to-b from-white/10 to-white/5
                     backdrop-blur-xl
                     border-l border-t border-b border-white/5
                     rounded-l-2xl   rounded-r-2xl"
        />

        {/* ── RIGHT HALF — flies in from the right ── */}
{/* ── RIGHT HALF — flies in from the right ── */}
       {/* ── RIGHT HALF — flies in from the right ── */}
        <motion.div
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ ...snapSpring, delay: 0.5 }}
          
          style={{
            cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%239c8451'/%3E%3C/svg%3E") 12 12, auto`
          }}
          className="absolute inset-y-0 right-0 w-1/5
                     bg-gradient-to-b from-white/10 to-white/5
                     backdrop-blur-xl
                     border-r border-t border-b border-white/5
                     rounded-r-2xl"
        />

        {/* ── CONTENT — fades in only after halves have joined ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const   }}
          className="relative flex items-center justify-between px-6 py-5 pointer-events-none"
        >
          {/* Brand / Logo */}
          <div
            className="text-white font-cormorant text-xl tracking-widest uppercase drop-shadow-md cursor-pointer pointer-events-auto"
            onClick={() => handleNavInteraction()}
          >
            Colgato
          </div>

         {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-14 pointer-events-auto">
            {navLinks.map((link) => (
              <a // <-- Add the opening tag here
                key={link}
                href={"#" + link.toLowerCase()}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavInteraction();
                }}
                className="relative text-white/70 hover:text-white transition-colors text-sm font-cormorant tracking-wider uppercase group cursor-pointer"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
     {/* Desktop CTA Button */}
          <div className="hidden md:block pointer-events-auto">
            <button
              onClick={() => handleGiveAnimation()} // ✅ Trigger the sequence
              style={{
                cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%239c8451'/%3E%3C/svg%3E") 12 12, auto`
              }}
              className="px-5 py-2.5 rounded-2xl font-cormorant text-xs tracking-wider uppercase text-white
                         bg-white/10 hover:bg-white/20 backdrop-blur-md
                         border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]
                         transition-all duration-300 active:scale-95"
            >
              Give to Colgato
            </button>
          </div>
       {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white/80 hover:text-white cursor-pointer pointer-events-auto"
  onClick={() => {
    handleNavInteraction(); // Dock the navbar
    setIsMobileMenuOpen(prev => !prev); // ✅ Toggle mobile menu
  }}
>
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

{/* ✅ MOBILE MENU DROPDOWN */}
{isMobileMenuOpen && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute top-full left-0 right-0 mt-2 mx-4 
               bg-white/10 backdrop-blur-xl border border-white/10 
               rounded-2xl py-4 px-6 z-50 md:hidden"
  >
    <div className="flex flex-col space-y-4">
      {navLinks.map((link) => (
        <a
          key={link}
          href={`#${link.toLowerCase()}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavInteraction();
            setIsMobileMenuOpen(false); // ✅ Close menu on link click
          }}
          className="text-white/80 hover:text-white text-sm font-cormorant tracking-wider uppercase"
        >
          {link}
        </a>
      ))}
     {/* Mobile CTA Button */}
      <button
        onClick={() => {
          handleNavInteraction(() => setIsRevealed(true));
          setIsMobileMenuOpen(false);
        }}
        style={{
          cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%239c8451'/%3E%3C/svg%3E") 12 12, auto`
        }}
        className="mt-2 px-4 py-2 rounded-xl text-xs font-cormorant uppercase text-white
                   bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
      >
        Give to Colgato
      </button>
    </div>
  </motion.div>
)}
        </motion.div>

      </div>
    </motion.div>
  );
};

export default GlassNavbar;