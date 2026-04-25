"use client";

import GlassButton from "@/components/Glassbuttonforhome";
import { useReveal } from "./context/RevealContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import GlassNavbar from "@/components/GlassNavbar";

export default function Home() {
  const { isRevealed } = useReveal(); // ✅ Extract isRevealed from context
const router = useRouter();
  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25, // Magic delay between each element appearing
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1]as const  } 
    },
  };

  // ✅ ADD THIS NEW VARIANT
  const svgVariants = {
    hidden: { opacity: 0, y: "100vh" }, // Starts off-screen at the bottom
    visible: { 
      opacity: 1, 
      y: 0, // Ends at whatever top/bottom class you gave it
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const} // ✅ Match exactly
    },
  };
 const coverVariants = {
    hidden: { 
      y: "0%",
      backgroundPosition: "0% 0%" // Start position for the aurora
    },
    visible: { 
      y: "100%", 
      backgroundPosition: "100% 100%", // Shifts the colors diagonally as it drops
      transition: { 
        y: { duration: 1.3, ease: [0.76, 0, 0.24, 1] as const}, // Architectural drop
    backgroundPosition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] as const }// Aurora shimmer speed
      } 
    }
  };
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#f5f1e8] to-[#e8e3d8] flex flex-col items-center justify-center relative overflow-hidden px-6">
     {/* AURORA AUSTRALIS REVEAL COVER */}
     <GlassNavbar/>
<motion.div
  variants={coverVariants}
  initial="hidden"
  animate={isRevealed ? "visible" : "hidden"}
  style={{
    // ✅ Gradient ONLY on parent (no noise here anymore)
    backgroundImage: "linear-gradient(110deg, #030303 40%, #030303ff 50%, #064e3b 70%, #10b981 82%, #d946ef 92%, #ab8942 100%)",
    backgroundSize: "300% 300%"
  }}
  className="absolute -top-1 left-0  min-w-full h-full z-[50] pointer-events-none rotate-1 shadow-[0_-30px_60px_rgba(0,0,0,0.15)]"
>
  {/* ✅ NOISE IMAGE OVERLAY - Separate child with independent opacity */}
  <motion.div
  variants={coverVariants}
  initial="hidden"
  animate={isRevealed ? "visible" : "hidden"}
  style={{
    backgroundImage: `
      url('/hey/nnnoise (6).svg') `,
    backgroundSize: "cover, 300% 300%",
    // backgroundColor: "rgba(255,255,255,0.05)"
    // backgroundBlendMode: "overlay", // 👈 THIS makes it act like Photoshop overlay
  }}
  className="absolute top-0 left-0 -ml-4 w-full h-full z-[50] pointer-events-none rotate-0"
/>
  
</motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isRevealed ? "visible" : "hidden"}
       className={`w-full min-h-screen flex flex-col items-center justify-center ${isRevealed ? 'flex' : 'hidden'}`}
      >
        {/* BACKGROUND SVGs (Layer 0) */} 
        <motion.img variants={svgVariants} src="/hey/blackbird.svg" className="absolute top-1/4 left-95 w-40 z-0 " />
        
        <motion.img variants={svgVariants} src="/hey/laydybug.svg" className="absolute top-61 center w-40 z-0 -scale-x-100 rotate-14 -scale-y-100  " />
        <motion.img variants={svgVariants} src="/hey/leaf.svg" className="absolute bottom-3 left-5 w-30 z-0  rotate-14  " />

        <motion.img variants={svgVariants} src="/hey/Black-cappedChickadee.svg" className="absolute top-14 left-30 -translate-x-1/2 w-28 z-0" />
        
        <motion.img variants={svgVariants} src="/hey/fly1.svg" className="absolute bottom-40 right-27 w-12 z-0 opacity-100 " />
        <motion.img variants={svgVariants} src="/hey/fly1.svg" className="absolute bottom-14 right-70 w-12 z-0 opacity-100 -scale-x-100  " />

        {/* FOREGROUND CONTENT (Layer 20) */}
        <div className="relative z-20 flex flex-col items-center">
          
          {/* HERO TEXT - Animated as one block */}
          <motion.div variants={itemVariants} className="text-center max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-semibold text-[#3a2f25] tracking-wide">
             JOEL JOSHY 
            </h1>
            <p className="mt-6 text-lg text-[#5c5045]">
              A moment of calm, connection, and renewal.[]
            </p>
          </motion.div>

          {/* BUTTONS - Animated as one block */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8 md:gap-10 mt-10">

            {/* BUTTON 1 */}
           <div className="relative flex items-center justify-center isolate">
              <div className="relative z-10 will-change-transform">
               <GlassButton 
  text="ME"
  onClick={() => router.push("/#")}
/>
              </div>
                 </div>

            {/* BUTTON 2 */}
            <div className="relative flex items-center justify-center isolate">
              <div className="relative z-10 will-change-transform">
                
<GlassButton 
  text="COLGATO"
  onClick={() => router.push("/colgato")}
/>
              </div>
             </div>

            {/* BUTTON 3 */}
            <div className="relative flex items-center justify-center isolate">
              <div className="relative z-10 will-change-transform">
                <GlassButton text="WORK" shouldAnimateShine={isRevealed} />
              </div>
              </div>

          </motion.div>
        </div>

        {/* BOTTOM LINES - Now animated with stagger */}
        <motion.div variants={itemVariants} className="absolute bottom-6 w-[90%] h-[1.5px] bg-[#cfc7bb] opacity-100 z-0" />
        <motion.div variants={itemVariants} className="absolute bottom-3 w-[80%] h-[1px] bg-[#cfc7bb] opacity-90 z-0" />
        
      </motion.div>

      
    </main>
  );
}