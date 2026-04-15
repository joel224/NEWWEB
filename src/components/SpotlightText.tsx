// components/SpotlightText.tsx
"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";

interface SpotlightTextProps {
  content: string;
  radius?: number;         
  baseColor?: string;       
  spotlightColor?: string;   
  className?: string;        
  enableGlow?: boolean;     
  ariaLabel?: string;      
}

export default function SpotlightText({
  content,
  radius = 190,
  baseColor = "#ffffffff",
  spotlightColor = "white",
  className = "",
  enableGlow = false,
  ariaLabel,
}: SpotlightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Throttle mouse updates via requestAnimationFrame
  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    requestAnimationFrame(() => {
      const rect = containerRef.current!.getBoundingClientRect();
      setTargetPos({
  x: clientX - rect.left,
  y: clientY - rect.top
});
    });
  }, []);
useEffect(() => {
  let animationFrame: number;

  const smoothMove = () => {
    setSmoothPos(prev => ({
      x: prev.x + (targetPos.x - prev.x) * 0.04,
      y: prev.y + (targetPos.y - prev.y) * 0.04,
    }));

    animationFrame = requestAnimationFrame(smoothMove);
  };

  smoothMove();

  return () => cancelAnimationFrame(animationFrame);
}, [targetPos]);


  // Detect touch devices for fallback behavior
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

const maskImage = `radial-gradient(circle ${radius}px at ${smoothPos.x}px ${smoothPos.y}px,
  rgba(0,0,0,1) 0%,        /* 🔥 strong center */
  rgba(0,0,0,0.8) 20%,
  rgba(0,0,0,0.5) 45%,
  rgba(0,0,0,0.2) 70%,
  rgba(0,0,0,0.05) 90%,
  transparent 100%)`;
  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isTouch && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onTouchMove={handleMouseMove}
      onTouchEnd={() => setIsHovering(false)}
      className={`relative cursor-default max-w-4xl px-6 z-40 spotlight-text-reveal ${className}`}
    >
      {/* Base Layer - visible to screen readers */}
      <h1 
        className="text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight select-none"
       aria-hidden="true"
   style={{ color: baseColor }}
      >
        {content}
      </h1>

      {/* Spotlight Overlay - decorative, hidden from a11y */}
      <h1
  aria-hidden="true"
  style={{
    maskImage,
    WebkitMaskImage: maskImage,
    color: spotlightColor,
    opacity: isHovering ? 0.5 : 0.15,
    
 transition: isHovering
  ? "opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
  : "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
  }}
  className="absolute inset-0 px-6 text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight pointer-events-none select-none"
>
  {content}
</h1>

      {/* Optional Glow Effect */}
      {enableGlow && isHovering && (
        <div
          className="absolute rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
          style={{
            left: smoothPos.x - radius,
            top: smoothPos.y - radius,
            width: radius * 2,
            height: radius * 2,
            
      background: `radial-gradient(circle, ${spotlightColor}15 0%, transparent 50%)`,
            opacity: isHovering ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}