"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

const SnakeLine = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Spring makes the draw feel organic, not mechanical
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  // The ribbon is two strokes: a wide base + a narrower highlight on top
  // giving the illusion of a 3D satin ribbon

  return (
    <div ref={containerRef} className="relative w-full pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 400 900"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto overflow-visible"
      >
        <defs>
          {/* Main ribbon gradient — blond/champagne gold */}
          <linearGradient id="ribbonMain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#E8D5A3" />
            <stop offset="20%"  stopColor="#C9A84C" />
            <stop offset="45%"  stopColor="#F0E68C" />
            <stop offset="70%"  stopColor="#B8860B" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>

          {/* Highlight stripe — lighter shimmer running through the center */}
          <linearGradient id="ribbonShimmer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFFDE7" stopOpacity="0.9" />
            <stop offset="30%"  stopColor="#FFF8DC" stopOpacity="0.7" />
            <stop offset="60%"  stopColor="#FFFDE7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F5DEB3" stopOpacity="0.6" />
          </linearGradient>

          {/* Shadow underside */}
          <linearGradient id="ribbonShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7A5C00" stopOpacity="0.5" />
            <stop offset="50%"  stopColor="#5C3D00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7A5C00" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* ── Shadow / underside ── */}
        <motion.path
          d="
            M 200 0
            C 310 80,  90 200, 200 300
            C 320 400,  80 520, 200 620
            C 310 720,  90 840, 200 900
          "
          fill="none"
          stroke="url(#ribbonShadow)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: springProgress }}
        />

        {/* ── Main ribbon body ── */}
        <motion.path
          d="
            M 200 0
            C 310 80,  90 200, 200 300
            C 320 400,  80 520, 200 620
            C 310 720,  90 840, 200 900
          "
          fill="none"
          stroke="url(#ribbonMain)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: springProgress }}
        />

        {/* ── Shimmer highlight (thin, bright center line) ── */}
        <motion.path
          d="
            M 200 0
            C 310 80,  90 200, 200 300
            C 320 400,  80 520, 200 620
            C 310 720,  90 840, 200 900
          "
          fill="none"
          stroke="url(#ribbonShimmer)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: springProgress }}
        />
      </svg>
    </div>
  );
};

export default SnakeLine;
