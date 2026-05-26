'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiPlay, FiSettings, FiActivity, FiLayers, FiSun } from 'react-icons/fi';
import GmailLogo from '@/components/GmailLogo';
import CuteBall from '@/components/Fsg';
 
export default function GmailLogoShowcase() {
  // Showcase Control States
  const [size, setSize] = useState<number>(260);
  const [glow, setGlow] = useState<boolean>(true);
  const [animated, setAnimated] = useState<boolean>(true);
  const [drawingProgress, setDrawingProgress] = useState<number>(100);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger the Draw-In Animation Sequence
  const triggerDrawIn = () => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    setDrawingProgress(0);

    let progress = 0;
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current);
    }

    drawIntervalRef.current = setInterval(() => {
      progress += 1.5;
      if (progress >= 100) {
        setDrawingProgress(100);
        setIsDrawing(false);
        if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
      } else {
        setDrawingProgress(progress);
      }
    }, 16); // ~60fps smooth animation
  };

  useEffect(() => {
    // Clean up interval on unmount
    return () => {
      if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
    };
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#0b090a] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Absolute Dynamic Volcanic Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#161a1d_0%,#0b090a_100%)] z-0 pointer-events-none" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: glow 
            ? 'radial-gradient(circle, rgba(234,67,53,0.4) 0%, rgba(41,121,255,0.3) 50%, rgba(52,168,83,0.2) 100%)' 
            : 'none',
        }}
      />

      {/* Floating Particle Grid Overlay for Premium Tech Feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header Area */}
      <header className="w-full px-6 py-6 md:px-12 flex items-center justify-between relative z-10">
        <Link href="/portfolio">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer backdrop-blur-md">
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/50 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Vector Sandbox v1.0</span>
        </div>
      </header>

      {/* Main Display Playground */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 relative z-10 flex-grow">
        
        {/* Left Side: The Interactive Vector Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] relative w-full">
          {/* Neon Grid Backplate */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 flex items-center justify-center p-8 overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none" />
            
            {/* Displaying Current Status */}
            {isDrawing && (
              <div className="absolute top-4 left-6 flex items-center gap-2 text-xs font-mono text-amber-400">
                <FiActivity className="w-3.5 h-3.5 animate-spin" />
                <span>Drawing Outlines: {Math.round(drawingProgress)}%</span>
              </div>
            )}
            
            {/* The Logo Instance */}
            <GmailLogo 
              size={size} 
              glow={glow} 
              animated={animated && !isDrawing} 
              drawingProgress={drawingProgress}
            />
          </div>
        </div>

        {/* Right Side: The Premium Glassmorphic Settings Panel */}
        <div className="w-full lg:w-[420px] flex flex-col gap-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            
            {/* Saturated Neon Header */}
            <div className="relative mb-6">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-1">
                Ribbon Fold Technology
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-amber-500 to-blue-500 bg-clip-text text-transparent">
                Gmail Gradient Logo
              </h1>
              <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                A mathematical reproduction of the iconic envelope shape, enriched with vibrant flowing HSL spectrum gradients and 3D ribbon folds.
              </p>
            </div>

            {/* Showcase Controller Inputs */}
            <div className="flex flex-col gap-6">
              
              {/* Size Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white/70">
                  <span className="flex items-center gap-1.5">
                    <FiLayers className="w-3.5 h-3.5 text-white/50" />
                    Canvas Scale
                  </span>
                  <span className="font-mono text-white/40">{size}px</span>
                </div>
                <input 
                  type="range" 
                  min="120" 
                  max="440" 
                  value={size} 
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-white/10 appearance-none cursor-pointer accent-red-500 transition-all duration-300"
                />
              </div>

              <hr className="border-white/5" />

              {/* Functional Toggles Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Glow Option */}
                <button
                  onClick={() => setGlow(!glow)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                    glow 
                      ? 'bg-red-500/10 border-red-500/30 text-white' 
                      : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-bold">Neon Aura</span>
                    <span className="text-[9px] opacity-50">Backdrop glow</span>
                  </div>
                  <FiSun className={`w-4 h-4 transition-transform duration-500 ${glow ? 'rotate-45 text-red-400' : ''}`} />
                </button>

                {/* Animation Option */}
                <button
                  onClick={() => setAnimated(!animated)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                    animated 
                      ? 'bg-blue-500/10 border-blue-500/30 text-white' 
                      : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-bold">Float Effect</span>
                    <span className="text-[9px] opacity-50">Physics float</span>
                  </div>
                  <FiSettings className={`w-4 h-4 transition-transform duration-500 ${animated ? 'rotate-90 text-blue-400' : ''}`} />
                </button>
              </div>

              {/* Action Button: Auto Draw-In */}
              <button
                onClick={triggerDrawIn}
                disabled={isDrawing}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg ${
                  isDrawing
                    ? 'bg-white/10 border border-white/5 text-white/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600 text-white hover:shadow-red-500/20 active:scale-[0.98]'
                }`}
              >
                <FiPlay className={`w-4 h-4 ${isDrawing ? 'animate-pulse' : ''}`} />
                <span>{isDrawing ? 'Drawing Vector...' : 'Trigger Draw-In'}</span>
              </button>

            </div>
          </div>

          {/* Quick Technical Architecture Case Card */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] leading-relaxed text-white/40 backdrop-blur-md">
            <div className="font-bold text-white/60 mb-2 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Technical Implementation
            </div>
            Constructed using a unified SVG viewBox coordinate system <code className="text-amber-400/80 font-mono">"52 42 88 66"</code>. Gradients are mapped perfectly to the five geometric paths to establish fluid color shifts (Red $\rightarrow$ Pink $\rightarrow$ Crimson $\rightarrow$ Orange $\rightarrow$ Yellow $\rightarrow$ Green $\rightarrow$ Teal $\rightarrow$ Blue) and layered with Gaussian drop shadows to establish natural 3D occlusion.
          </div>
        </div>

      </section>

      {/* Footer copyright */}
      <footer className="w-full py-6 px-6 md:px-12 text-center text-[10px] text-white/20 relative z-10 border-t border-white/5">
        Designed for pixel-perfect presentation and color fidelity. Fully responsive, lightweight, and hardware-accelerated.
      </footer>

      {/* Tailwind grid background helper style */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-grid-lines {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}} />

      <div className=" relative mt-[10%] flex flex-col ">
        <CuteBall />
      </div>

    </main>
  );
}
