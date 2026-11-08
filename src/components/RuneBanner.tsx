'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSparkles, FiHeart, FiRotateCcw } from 'react-icons/fi';

interface GlitterParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
  rotation: number;
  rotationSpeed: number;
  depth: number; // 0: background soft bokeh, 1: foreground crisp glitter
  alpha: number;
  life: number;
  maxLife: number;
  side: -1 | 1; // -1: parts to left, 1: parts to right
}

export default function GlitterBanner() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<GlitterParticle[]>([]);
  const isOpeningRef = useRef<boolean>(true);
  const openingProgressRef = useRef<number>(0);
  const [openingKey, setOpeningKey] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  // Palette of real metallic & diamond glitter (RGB triples)
  const GLITTER_COLORS = [
    '255, 235, 175', // Warm Champagne Gold
    '255, 248, 220', // Diamond White Gold
    '254, 215, 170', // Rose Gold
    '255, 255, 255', // Pure Specular Diamond
    '251, 191, 36',  // Rich 24k Amber Gold
    '244, 219, 185', // Pearlescent Ivory
  ];

  // Spawn a single particle
  const createParticle = useCallback(
    (width: number, height: number, forceCenter = false): GlitterParticle => {
      const centerX = width / 2;
      // If forceCenter (initial curtain opening), concentrate heavily along the center seam
      const spread = forceCenter ? width * 0.15 : width * 0.45;
      const x = centerX + (Math.random() - 0.5) * spread * 2;
      const y = Math.random() * height;
      const side = x < centerX ? -1 : 1;

      const depth = Math.random();
      // Foreground flakes are tiny (0.9px - 2.8px), background bokeh slightly larger (2.5px - 5.5px)
      const baseSize = depth > 0.4 ? 0.9 + Math.random() * 2.0 : 2.5 + Math.random() * 3.0;

      // Almost zero gravity — weightless air buoyancy
      // Initial horizontal velocity pushes gently towards their respective side
      const outwardSpeed = 0.4 + Math.random() * 1.4;
      const vx = side * outwardSpeed;
      // Gentle vertical hover (-0.3 to +0.35)
      const vy = (Math.random() - 0.5) * 0.55;

      return {
        x,
        y,
        vx,
        vy,
        baseSize,
        color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
        twinkleSpeed: 1.5 + Math.random() * 3.5,
        twinklePhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        depth,
        alpha: 0,
        life: 0,
        maxLife: 260 + Math.random() * 200,
        side,
      };
    },
    []
  );

  // Initialize particle cloud
  const initGlitter = useCallback(
    (width: number, height: number) => {
      const count = Math.min(500, Math.floor((width * height) / 2200));
      const list: GlitterParticle[] = [];
      for (let i = 0; i < count; i++) {
        const p = createParticle(width, height, true);
        // Stagger lifecycles for natural fluidity
        p.life = Math.random() * p.maxLife * 0.7;
        list.push(p);
      }
      particlesRef.current = list;
    },
    [createParticle]
  );

  // Trigger the dreamy curtain opening animation
  const triggerOpening = useCallback(() => {
    isOpeningRef.current = true;
    openingProgressRef.current = 0;
    setIsRevealed(false);
    setOpeningKey((prev) => prev + 1);

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      initGlitter(rect.width, rect.height);
    }

    setTimeout(() => {
      setIsRevealed(true);
    }, 1200);
  }, [initGlitter]);

  // Scatter extra glitter on interactive click / touch
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn a burst of sparkling glitter at cursor that splits outward
    const burstCount = 60;
    const newParticles: GlitterParticle[] = [];
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 2.5;
      const side: -1 | 1 = Math.cos(angle) < 0 ? -1 : 1;
      const depth = Math.random();

      newParticles.push({
        x: clickX + (Math.random() - 0.5) * 20,
        y: clickY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed + side * 0.8,
        vy: Math.sin(angle) * speed * 0.5,
        baseSize: depth > 0.4 ? 1.0 + Math.random() * 2.2 : 3.0 + Math.random() * 2.5,
        color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
        twinkleSpeed: 2.5 + Math.random() * 4.0,
        twinklePhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        depth,
        alpha: 0,
        life: 0,
        maxLife: 220 + Math.random() * 160,
        side,
      });
    }

    particlesRef.current.push(...newParticles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initGlitter(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      // Update opening progress (smooth curtain opening split factor)
      if (isOpeningRef.current) {
        openingProgressRef.current = Math.min(1, openingProgressRef.current + dt * 0.45);
        if (openingProgressRef.current >= 1) {
          isOpeningRef.current = false;
        }
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        // Curtain Split Physics:
        // Lateral acceleration away from the center to simulate curtains parting from both sides
        const distFromCenter = p.x - centerX;
        const normalizedDist = Math.abs(distFromCenter) / (width * 0.5);

        // Constant gentle lateral parting force
        const partingForce = (0.7 + openingProgressRef.current * 1.5) * p.side;
        p.vx += partingForce * dt;

        // Damping / Air resistance: keeps it weightless and dreamy
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Weightless vertical oscillation (gentle floating air currents)
        const verticalFlutter = Math.sin(time * 0.002 + p.twinklePhase) * 0.12;
        p.y += (p.vy + verticalFlutter) * (60 * dt);
        p.x += p.vx * (60 * dt);

        p.rotation += p.rotationSpeed;

        // Life fade in and fade out
        const fadeIn = Math.min(1, p.life / 25);
        const fadeOut = Math.max(0, 1 - p.life / p.maxLife);

        // Curtain Exit Fade: As particles drift far to the left or right, they fade gradually
        const curtainFade = Math.max(0, 1 - Math.pow(normalizedDist, 1.8));
        const currentAlpha = fadeIn * fadeOut * curtainFade;

        // Twinkle factor (sparkling sinusoidal modulation)
        const twinkle = Math.sin(time * 0.003 * p.twinkleSpeed + p.twinklePhase);
        const sparkleIntensity = 0.35 + 0.65 * Math.abs(twinkle);
        const finalAlpha = Math.min(1, currentAlpha * sparkleIntensity);

        // Respawn if dead or drifted completely off-screen
        if (p.life >= p.maxLife || p.x < -80 || p.x > width + 80 || currentAlpha <= 0.001) {
          particles[i] = createParticle(width, height, false);
          continue;
        }

        // DRAW PARTICLE
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.depth < 0.35) {
          // BACKGROUND BOKEH: Soft, warm, out-of-focus suspended disc
          ctx.beginPath();
          ctx.arc(0, 0, p.baseSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${finalAlpha * 0.35})`;
          ctx.fill();
        } else {
          // FOREGROUND GLITTER: Sharp, crystalline diamond/gold speck
          const size = p.baseSize;

          // 1. Core metallic glitter flake
          ctx.fillStyle = `rgba(${p.color}, ${finalAlpha * 0.95})`;
          ctx.fillRect(-size / 2, -size / 2, size, size);

          // 2. Soft specular halo
          ctx.beginPath();
          ctx.arc(0, 0, size * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${finalAlpha * 0.25})`;
          ctx.fill();

          // 3. Four-point star glint (appears when glitter catches the light at peak twinkle)
          if (twinkle > 0.65 && p.depth > 0.6) {
            const glintLength = size * (2.8 + twinkle * 3.2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${finalAlpha * 0.85})`;
            ctx.lineWidth = 0.75;

            ctx.beginPath();
            // Horizontal ray
            ctx.moveTo(-glintLength, 0);
            ctx.lineTo(glintLength, 0);
            // Vertical ray
            ctx.moveTo(0, -glintLength);
            ctx.lineTo(0, glintLength);
            ctx.stroke();

            // Tiny central diamond dot
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-0.8, -0.8, 1.6, 1.6);
          }
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initGlitter, createParticle]);

  return (
    <section
      ref={containerRef}
      onClick={handleCanvasClick}
      className="w-full min-h-[580px] sm:min-h-[640px] relative overflow-hidden flex flex-col items-center justify-center py-20 px-6 cursor-pointer select-none border-y border-white/10"
      style={{
        // Deep luxury ruby-velvet curtain backdrop matching the inspiration screenshot
        background: 'radial-gradient(ellipse at 50% 45%, #3d050a 0%, #1f0205 50%, #0a0103 100%)',
      }}
    >
      {/* VELVET CURTAIN DRAPERY SHADOWS (Vertical fabric folds) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.45) 0px,
            rgba(0, 0, 0, 0.45) 30px,
            rgba(255, 255, 255, 0.03) 70px,
            rgba(0, 0, 0, 0.5) 120px
          )`,
        }}
      />

      {/* Atmospheric center spotlight highlighting the parting seam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-red-600/[0.12] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] bg-amber-200/[0.08] rounded-full blur-[90px] pointer-events-none" />

      {/* DREAMY GLITTER CANVAS (Zero gravity, sparkles, splits and exits to both sides) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-20 pointer-events-none"
      />

      {/* CENTER REVEAL CONTENT: Elegantly revealed as the glitter curtain parts */}
      <div
        key={openingKey}
        className={`relative z-30 max-w-3xl w-full text-center flex flex-col items-center transition-all duration-1000 ease-out ${
          isRevealed ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Subtle decorative crest */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-amber-200/20 backdrop-blur-md text-[#fde68a] text-[10px] tracking-[0.35em] uppercase font-mono mb-6 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          <FiSparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          <span>A Dreamy Invitation</span>
        </div>

        {/* Elegant Headline in serif / luxury typography */}
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#fffaf0] mb-6 uppercase leading-[1.1] drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: 'var(--font-timesnewroman), serif' }}
        >
          Moments Suspended in Gold & Velvet
        </h2>

        {/* Poetic description */}
        <p
          className="text-sm sm:text-base text-neutral-300/90 max-w-xl mx-auto mb-10 leading-relaxed font-light tracking-wide drop-shadow-md"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Free from gravity, micro-specks of champagne light drift weightlessly across rich ruby folds—parting
          gracefully to both horizons like a slow-motion curtain opening to reveal the celebration within.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerOpening();
            }}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#f59e0b] text-[#1c0408] font-semibold text-xs tracking-[0.2em] uppercase hover:brightness-110 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-300 cursor-pointer"
          >
            <FiRotateCcw className="w-3.5 h-3.5" />
            <span>Part the Shimmer</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/wedding');
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-[#fef3c7] font-medium text-xs tracking-[0.2em] uppercase backdrop-blur-md transition-all duration-300 cursor-pointer hover:border-amber-200/40"
          >
            <FiHeart className="w-3.5 h-3.5 text-rose-300 fill-rose-300/30" />
            <span>View Invitation</span>
          </button>
        </div>

        {/* Interactive hint */}
        <span className="mt-8 text-[11px] font-mono tracking-widest uppercase text-neutral-400/60 pointer-events-none">
          Click anywhere to toss sparkling light
        </span>
      </div>

      {/* Soft edge fade overlays blending smoothly into surrounding page */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}
