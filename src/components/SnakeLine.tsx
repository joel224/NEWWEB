"use client";
import { motion, useScroll } from "framer-motion";
import React from "react";

const SnakeLine = () => {
  // scrollYProgress tracks the window scroll automatically
  const { scrollYProgress } = useScroll();

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[15] overflow-hidden">
      <svg
        className="w-full h-full opacity-80"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="blondGradient" x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF1B8" />  {/* Very light blond/gold */}
            <stop offset="25%" stopColor="#E6C27A" /> 
            <stop offset="50%" stopColor="#D4AF37" /> {/* Pure gold */}
            <stop offset="75%" stopColor="#B8860B" /> {/* Darker goldenrod */}
            <stop offset="100%" stopColor="#E6C27A" />
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 
          The path draws a smooth sine-like wave from top to bottom.
          The X coordinate stays between 20 and 80 to prevent edge clipping.
        */}
        <motion.path
          d="M 50 0 
             C 85 100, 15 200, 50 300 
             C 85 400, 15 500, 50 600 
             C 85 700, 15 800, 50 900 
             C 70 950, 50 1000, 50 1000"
          fill="none"
          stroke="url(#blondGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter="url(#goldGlow)"
          style={{ 
            pathLength: scrollYProgress,
          }}
        />
      </svg>
    </div>
  );
};

export default SnakeLine;
