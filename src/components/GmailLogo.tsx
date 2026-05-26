'use client';

import React from 'react';

interface GmailLogoProps {
  size?: number;
  glow?: boolean;
  animated?: boolean;
  drawingProgress?: number; // 0 to 100 for interactive drawing effect
  className?: string;
}

export default function GmailLogo({
  size = 200,
  glow = true,
  animated = true,
  drawingProgress = 100,
  className = '',
}: GmailLogoProps) {
  // SVG viewBox settings
  const viewBox = "52 42 88 66";

  // Calculate stroke properties for draw-in animation
  const isDrawing = drawingProgress < 100;
  
  // Approximate length of each path for dash-array animations
  const pathLengths = {
    leftPillar: 110,
    rightPillar: 110,
    centerV: 180,
    leftFlap: 80,
    rightFlap: 80,
  };

  const getDashStyle = (length: number) => {
    if (!isDrawing) return {};
    const offset = length - (length * drawingProgress) / 100;
    return {
      strokeDasharray: length,
      strokeDashoffset: offset,
      transition: 'stroke-dashoffset 0.1s ease-out',
    };
  };

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-700 ${
        animated ? 'hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
        filter: glow && !isDrawing
          ? 'drop-shadow(0 0 15px rgba(234, 67, 53, 0.25)) drop-shadow(0 0 30px rgba(41, 121, 255, 0.15))'
          : 'none',
      }}
    >
      {/* Dynamic Glowing Aura behind the logo */}
      {glow && !isDrawing && (
        <div
          className="absolute inset-0 rounded-full opacity-60 blur-3xl pointer-events-none transition-all duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(234,67,53,0.3) 0%, rgba(41,121,255,0.2) 40%, rgba(52,168,83,0.1) 70%, transparent 100%)',
            transform: 'scale(1.2)',
            animation: animated ? 'pulseGlow 6s infinite alternate ease-in-out' : 'none',
          }}
        />
      )}

      {/* Main Vector SVG Graphic */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width="100%"
        height="100%"
        className={`w-full h-full relative z-10 transition-transform duration-500`}
        style={{
          animation: animated ? 'floatLogo 6s infinite ease-in-out' : 'none',
        }}
      >
        <defs>
          {/* Left Pillar Gradient (Red to Pink/Magenta) */}
          <linearGradient id="leftPillarGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ea2f2f" /> {/* Vibrant saturated red */}
            <stop offset="45%" stopColor="#f43c7b" /> {/* Hot cherry pink */}
            <stop offset="100%" stopColor="#ff2e93" /> {/* Premium neon magenta */}
          </linearGradient>

          {/* Left Flap Gradient (Pink/Magenta to Crimson) */}
          <linearGradient id="leftFlapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2e93" /> {/* Neon magenta */}
            <stop offset="50%" stopColor="#f43c7b" /> {/* Hot cherry pink */}
            <stop offset="100%" stopColor="#c5221f" /> {/* Deep dark crimson */}
          </linearGradient>

          {/* Center V Gradient (Crimson to Google Red) */}
          <linearGradient id="centerVGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c5221f" />
            <stop offset="35%" stopColor="#ea4335" />
            <stop offset="70%" stopColor="#e53935" />
            <stop offset="100%" stopColor="#b71c1c" />
          </linearGradient>

          {/* Right Flap Gradient (Crimson to Orange to Saturated Yellow) */}
          <linearGradient id="rightFlapGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c5221f" /> {/* Sits nicely at the center junction */}
            <stop offset="35%" stopColor="#ea4335" />
            <stop offset="65%" stopColor="#ff7043" /> {/* Warm bright coral orange */}
            <stop offset="100%" stopColor="#ffca28" /> {/* Creamy brilliant yellow */}
          </linearGradient>

          {/* Right Pillar Gradient (Yellow-Green to Green to Teal/Cyan to Royal Blue) */}
          <linearGradient id="rightPillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9ccc65" /> {/* Delicate yellowish green transition */}
            <stop offset="15%" stopColor="#34a853" /> {/* Saturated Google green */}
            <stop offset="45%" stopColor="#00e5ff" /> {/* Electric cyan/teal */}
            <stop offset="80%" stopColor="#2979ff" /> {/* Electric royal blue */}
            <stop offset="100%" stopColor="#1565c0" /> {/* Saturated deep blue */}
          </linearGradient>

          {/* Layered Drop Shadow filter for premium 3D folding ribbon effect */}
          <filter id="premiumShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="-0.6" dy="1.2" stdDeviation="1.0" floodColor="#000" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* 1. Left Pillar (Path 1) */}
        <path
          d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"
          fill={isDrawing ? 'none' : 'url(#leftPillarGrad)'}
          stroke="url(#leftPillarGrad)"
          strokeWidth={isDrawing ? 2 : 0}
          strokeLinecap="round"
          style={getDashStyle(pathLengths.leftPillar)}
          className="transition-all duration-500"
        />

        {/* 2. Right Pillar (Path 2) */}
        <path
          d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"
          fill={isDrawing ? 'none' : 'url(#rightPillarGrad)'}
          stroke="url(#rightPillarGrad)"
          strokeWidth={isDrawing ? 2 : 0}
          strokeLinecap="round"
          style={getDashStyle(pathLengths.rightPillar)}
          className="transition-all duration-500"
        />

        {/* 3. Center V (Path 5) - sits behind the top flaps */}
        <path
          d="M72 74V48l24 18 24-18v26L96 92z"
          fill={isDrawing ? 'none' : 'url(#centerVGrad)'}
          stroke="url(#centerVGrad)"
          strokeWidth={isDrawing ? 2 : 0}
          strokeLinejoin="round"
          style={getDashStyle(pathLengths.centerV)}
          className="transition-all duration-500"
        />

        {/* 4. Left Flap (Path 4) - sits on top with premium drop shadow */}
        <path
          d="M72 48v26L52 59v-8c0-7.42 8.47-11.65 14.4-7.2"
          fill={isDrawing ? 'none' : 'url(#leftFlapGrad)'}
          stroke="url(#leftFlapGrad)"
          strokeWidth={isDrawing ? 2 : 0}
          strokeLinecap="round"
          filter={isDrawing ? undefined : 'url(#premiumShadow)'}
          style={getDashStyle(pathLengths.leftFlap)}
          className="transition-all duration-500"
        />

        {/* 5. Right Flap (Path 3) - sits on top with premium drop shadow */}
        <path
          d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"
          fill={isDrawing ? 'none' : 'url(#rightFlapGrad)'}
          stroke="url(#rightFlapGrad)"
          strokeWidth={isDrawing ? 2 : 0}
          strokeLinecap="round"
          filter={isDrawing ? undefined : 'url(#premiumShadow)'}
          style={getDashStyle(pathLengths.rightFlap)}
          className="transition-all duration-500"
        />
      </svg>

      {/* Custom Styles for Keyframe Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatLogo {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(0.5deg);
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1.15);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.3);
          }
        }
      `}} />
    </div>
  );
}
