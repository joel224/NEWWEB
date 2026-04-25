"use client";

import { Cormorant_Garamond } from "next/font/google";
import { motion } from "framer-motion";
import GlassGradientButton from "@/components/GlassButton";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal"],
  variable: "--font-cormorant",
});

export default function ColgatePage() {
  const onceTransition = {
    duration: 2,
     ease: [0.42, 0, 0.58, 1] as const,
  };

  return (
   <main className="bg-[#821019] h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col items-center justify-center">

        {/* 1. Text + Button Wrapper */}
        <div className="relative z-10 flex flex-col items-center text-white/90 mt-16 select-none">

          {/* "C" — starts bright, settles to dim */}
          <motion.h1
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.2 }}
            transition={onceTransition}
            className={`${cormorant.className} text-8xl mb-10 md:text-[8rem] font-bold uppercase tracking-wide leading-none`}
          >
            C
          </motion.h1>

          <h1 className={`${cormorant.className} text-6xl md:text-[8rem] font-bold uppercase tracking-wide leading-none drop-shadow-sm`}>
            Colgato
          </h1>

          <h2 className={`${cormorant.className} text-3xl md:text-[4rem] font-semibold uppercase tracking-[0.3em] mt-2 md:mt-4 opacity-80`}>
            University
          </h2>

          <GlassGradientButton text=" " />
        </div>

        {/* 2. Main Static Grid Layer */}
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "80px 70px",
            filter: "blur(0.8px) drop-shadow(2px 2px 2px rgba(0,0,0,0.4))",
          }}
        />

        {/* 3a. Thin shadow grid — fades IN at the end (the "settled" lighter state) */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 0.2, filter: "blur(2px)" }}
          transition={onceTransition}
          style={{
            backgroundImage: `
              linear-gradient(to right, black 1px, transparent 1px),
              linear-gradient(to bottom, black 1px, transparent 1px)
            `,
            backgroundSize: "80px 70px",
            transform: "translate(2px, 2px)",
          }}
        />

        {/* 3b. Thick shadow grid — starts fully visible (dark), fades OUT */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          initial={{ opacity: 1, filter: "blur(10px)" }}
          animate={{ opacity: 0, filter: "blur(2px)" }}
          transition={onceTransition}
          style={{
            backgroundImage: `
              linear-gradient(to right, black 10px, transparent 100px),
              linear-gradient(to bottom, black 10px, transparent 10px)
            `,
            backgroundSize: "80px 70px",
            transform: "translate(2px, 2px)",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none z-30" />
      </div>
    </main>
  );
}