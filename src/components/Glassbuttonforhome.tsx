import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps {
    text?: string;
    onClick?: () => void;
    shouldAnimateShine?: boolean; // ✅ NEW: Control shine animation timing
}

const GlassButton: React.FC<GlassButtonProps> = ({ text = "EXPLORE FORESTS", onClick, shouldAnimateShine = false }) => {
    return (
        <button
            onClick={onClick}
            className="
                group relative
                w-48 h-16 sm:w-36 sm:h-10 /* Slightly wider and taller to match the pill shape */
                flex items-center justify-center
                rounded-full
                
                /* Base background with subtle warm tint matching the image */
                bg-gradient-to-b from-[#fbf8f1]/70 via-[#f0ebe1]/50 to-[#e6e0d4]/40
                backdrop-blur-md
                
                /* Main border */
                border border-white/50
                
                /* Complex shadows for depth: 
                   1. Top inner white glow
                   2. Bottom inner dark shadow for 3D depth
                   3. Soft outer drop shadow */
                
                text-[#2d1c0b] font-cormorant  text-lg sm:text-sm tracking-widest
                transition-all duration-300
                hover:scale-[1.02] active:scale-95
            "
        >
            {/* Top Glossy Reflection - Wrapped to contain the rounded top */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                   <div className="absolute ml-14 mt-3 z-0 w-19 h-4 rounded-full bg-gradient-to-br from-[#732e11]/40 via-[#588157]/30 to-[#3a5a40]/20 blur-[10px] pointer-events-none -rotate-14" />
         
                {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[45%] bg-gradient-to-b from-white/80 to-transparent rounded-t-full opacity-90" /> */}
            </div>

            {/* --- THE ANIMATED BORDER SHINE EFFECT --- */}
            
            {/* 1. Sharp Inner Core (Replaces your fading white line and ultra-bright core) */}
            <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    padding: "1px", // Exactly matches your border thickness
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }}
            >
                <motion.div 
                    className="blur-[3px]  absolute left-1/2 top-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2"
                    initial={{ rotate: 180 }} // 180deg forces the bright spot to start exactly at the bottom
                   // AFTER:

// ✅ AFTER (2 loops = 360° × 2 = 720):
animate={shouldAnimateShine ? { rotate: 180 + 720 } : { rotate: 180 }}// 360 degrees * 10 loops
                    transition={{ duration: 7, ease: "circOut" }} // Spins fast then gently slows to a stop
                    style={{
                        background: "conic-gradient(from 0deg, transparent 0%, transparent 90%, rgba(255,255,255,0.4) 98%, rgba(255,255,255,1) 100%)",
                    }}
                />
            </div>

            {/* 2. Soft Outer Flare (Replaces your intense blurred flare dot) */}
            <div 
                className=" absolute inset-[-4px] blur-[2px] rounded-full pointer-events-none"
                style={{
                    padding: "4px", // Gives room for the blur to breathe
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }}
            >
                <motion.div 
                    className="absolute left-1/2 top-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 blur-[1px] "
                    initial={{ rotate: 180 }}
                    // AFTER:

// ✅ AFTER (2 loops = 360° × 2 = 720):
animate={shouldAnimateShine ? { rotate: 180 + 720 } : { rotate: 180 }}
                    transition={{ duration: 6, ease: "circOut" }}
                    style={{
                        background: "conic-gradient(from 0deg, transparent 0%, transparent 95%, rgba(255,255,255,0.7) 98%, white 100%)",
                    }}
                />
            </div>

            <span className="relative z-10 drop-shadow-sm">
                {text}
            </span>
        </button>
    );
};

export default GlassButton;