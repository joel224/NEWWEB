'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiHeart, FiWind, FiRotateCcw } from 'react-icons/fi';

interface GlitterDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;      // 0.45 (micro-dust) to 2.2 (medium flake)
  drag: number;      // Aerodynamic coupling coefficient
  baseSize: number;  // 0.75px to 2.8px
  tier: 'micro' | 'flake' | 'bokeh';
  // 3D Facet Tumbling
  thetaX: number;
  thetaY: number;
  omegaX: number;    // Tumbling rotation speed X
  omegaY: number;    // Tumbling rotation speed Y
  // Photometric properties
  baseColor: string; // Warm champagne, 24k gold, diamond platinum
  life: number;
  maxLife: number;
  glintPhase: number;// High-frequency specular oscillation
}

export default function GlitterBanner() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<GlitterDust[]>([]);

  // Cached pre-rendered optical glare sprites for 120 FPS performance
  const spritesRef = useRef<{
    specularBloom: HTMLCanvasElement | null;
    diamondGlint: HTMLCanvasElement | null;
    softBokeh: HTMLCanvasElement | null;
  }>({
    specularBloom: null,
    diamondGlint: null,
    softBokeh: null,
  });

  // Convective airflow simulation state
  const draftIntensityRef = useRef<number>(1.0);
  const mouseAirRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    lastX: number;
    lastY: number;
    active: boolean;
  }>({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    active: false,
  });

  const [isRevealed, setIsRevealed] = useState<boolean>(true);
  const [openingKey, setOpeningKey] = useState<number>(0);

  // Cosmetic Gold & Platinum palette (RGB triples for additive specular math)
  const PALETTE = [
    '255, 235, 180', // Radiant Champagne Gold
    '255, 248, 225', // Diamond Platinum
    '250, 215, 140', // 24k Pure Gold
    '240, 225, 200', // Pearlescent Ivory
    '215, 185, 130', // Deep Warm Amber Dust
  ];

  // Pre-render optical flare & bloom sprites for photorealistic HDR glare
  const initSprites = useCallback(() => {
    // 1. Specular Bloom Sprite (Radial halo around flashing glints)
    const bloomCanvas = document.createElement('canvas');
    bloomCanvas.width = 48;
    bloomCanvas.height = 48;
    const bCtx = bloomCanvas.getContext('2d');
    if (bCtx) {
      const grad = bCtx.createRadialGradient(24, 24, 0, 24, 24, 22);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.18, 'rgba(255, 240, 190, 0.85)');
      grad.addColorStop(0.45, 'rgba(255, 210, 120, 0.35)');
      grad.addColorStop(0.8, 'rgba(250, 180, 80, 0.08)');
      grad.addColorStop(1, 'rgba(250, 180, 80, 0)');
      bCtx.fillStyle = grad;
      bCtx.beginPath();
      bCtx.arc(24, 24, 22, 0, Math.PI * 2);
      bCtx.fill();
    }

    // 2. Diamond Anamorphic Glint Sprite (Razor-sharp optical diffraction streaks)
    const glintCanvas = document.createElement('canvas');
    glintCanvas.width = 64;
    glintCanvas.height = 64;
    const gCtx = glintCanvas.getContext('2d');
    if (gCtx) {
      // Horizontal flare streak
      const hGrad = gCtx.createLinearGradient(0, 32, 64, 32);
      hGrad.addColorStop(0, 'rgba(255, 245, 210, 0)');
      hGrad.addColorStop(0.4, 'rgba(255, 245, 210, 0.6)');
      hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
      hGrad.addColorStop(0.6, 'rgba(255, 245, 210, 0.6)');
      hGrad.addColorStop(1, 'rgba(255, 245, 210, 0)');
      gCtx.fillStyle = hGrad;
      gCtx.fillRect(0, 31, 64, 2);

      // Vertical micro-spike
      const vGrad = gCtx.createLinearGradient(32, 8, 32, 56);
      vGrad.addColorStop(0, 'rgba(255, 245, 210, 0)');
      vGrad.addColorStop(0.4, 'rgba(255, 245, 210, 0.45)');
      vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      vGrad.addColorStop(0.6, 'rgba(255, 245, 210, 0.45)');
      vGrad.addColorStop(1, 'rgba(255, 245, 210, 0)');
      gCtx.fillStyle = vGrad;
      gCtx.fillRect(31, 8, 2, 48);

      // Pure white brilliant center diamond
      gCtx.fillStyle = '#ffffff';
      gCtx.beginPath();
      gCtx.arc(32, 32, 2.2, 0, Math.PI * 2);
      gCtx.fill();
    }

    // 3. Soft Bokeh Disc Sprite (Out-of-focus background disc)
    const bokehCanvas = document.createElement('canvas');
    bokehCanvas.width = 32;
    bokehCanvas.height = 32;
    const boCtx = bokehCanvas.getContext('2d');
    if (boCtx) {
      const bGrad = boCtx.createRadialGradient(16, 16, 0, 16, 16, 14);
      bGrad.addColorStop(0, 'rgba(255, 235, 185, 0.55)');
      bGrad.addColorStop(0.6, 'rgba(240, 200, 130, 0.2)');
      bGrad.addColorStop(1, 'rgba(240, 200, 130, 0)');
      boCtx.fillStyle = bGrad;
      boCtx.beginPath();
      boCtx.arc(16, 16, 14, 0, Math.PI * 2);
      boCtx.fill();
    }

    spritesRef.current = {
      specularBloom: bloomCanvas,
      diamondGlint: glintCanvas,
      softBokeh: bokehCanvas,
    };
  }, []);

  // Spawn a microscopic cosmetic glitter particle
  const createParticle = useCallback(
    (width: number, height: number, forceCenter = false): GlitterDust => {
      const cx = width / 2;
      const cy = height / 2;

      // Spawn distribution: biased towards lower-middle convective column when drafting
      const spreadX = forceCenter ? width * 0.3 : width * 0.9;
      const x = cx + (Math.random() - 0.5) * spreadX;
      const y = forceCenter ? cy + (Math.random() - 0.1) * (height * 0.45) : Math.random() * height;

      const rand = Math.random();
      let tier: 'micro' | 'flake' | 'bokeh' = 'micro';
      let baseSize = 0.85 + Math.random() * 0.7; // 70% micro-grit (0.85px - 1.55px)
      let mass = 0.5 + Math.random() * 0.6;
      let drag = 0.05 + Math.random() * 0.04;

      if (rand > 0.88) {
        // 12% Foreground Bokeh
        tier = 'bokeh';
        baseSize = 2.6 + Math.random() * 2.2;
        mass = 1.3 + Math.random() * 0.8;
        drag = 0.025 + Math.random() * 0.02;
      } else if (rand > 0.68) {
        // 20% Specular Flakes
        tier = 'flake';
        baseSize = 1.6 + Math.random() * 1.1;
        mass = 0.9 + Math.random() * 0.7;
        drag = 0.04 + Math.random() * 0.03;
      }

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -8 - Math.random() * 16, // gentle upward buoyant start
        mass,
        drag,
        baseSize,
        tier,
        thetaX: Math.random() * Math.PI * 2,
        thetaY: Math.random() * Math.PI * 2,
        omegaX: (Math.random() - 0.5) * 5.5,
        omegaY: (Math.random() - 0.5) * 5.5,
        baseColor: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        life: 0,
        maxLife: 320 + Math.random() * 260,
        glintPhase: Math.random() * Math.PI * 2,
      };
    },
    []
  );

  // Initialize atmospheric glitter field
  const initGlitterField = useCallback(
    (width: number, height: number) => {
      // Density: 700 to 900 particles for rich cosmetic glitter depth
      const count = Math.min(850, Math.max(450, Math.floor((width * height) / 1400)));
      const list: GlitterDust[] = [];
      for (let i = 0; i < count; i++) {
        const p = createParticle(width, height, true);
        p.life = Math.random() * p.maxLife * 0.8; // Stagger initial life
        list.push(p);
      }
      particlesRef.current = list;
    },
    [createParticle]
  );

  // Trigger convective airflow updraft plume
  const triggerUpdraft = useCallback(() => {
    draftIntensityRef.current = 1.35;
    setOpeningKey((k) => k + 1);

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      initGlitterField(rect.width, rect.height);
    }
  }, [initGlitterField]);

  // Mouse interaction: stirs airflow vector field
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    const mouse = mouseAirRef.current;
    if (mouse.active) {
      mouse.vx = (curX - mouse.lastX) * 0.5;
      mouse.vy = (curY - mouse.lastY) * 0.5;
    }

    mouse.x = curX;
    mouse.y = curY;
    mouse.lastX = curX;
    mouse.lastY = curY;
    mouse.active = true;
  };

  const handleMouseLeave = () => {
    mouseAirRef.current.active = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Inject air vortex puff with sparkling specks at cursor
    const burstCount = 65;
    const newDust: GlitterDust[] = [];
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 12 + Math.random() * 40;
      newDust.push({
        x: clickX + (Math.random() - 0.5) * 16,
        y: clickY + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 22,
        mass: 0.5 + Math.random() * 0.7,
        drag: 0.05 + Math.random() * 0.03,
        baseSize: 0.9 + Math.random() * 1.1,
        tier: Math.random() > 0.65 ? 'flake' : 'micro',
        thetaX: Math.random() * Math.PI * 2,
        thetaY: Math.random() * Math.PI * 2,
        omegaX: (Math.random() - 0.5) * 8.0,
        omegaY: (Math.random() - 0.5) * 8.0,
        baseColor: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        life: 0,
        maxLife: 260 + Math.random() * 200,
        glintPhase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current.push(...newDust);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    initSprites();

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
      initGlitterField(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    // Key studio light vector for specular reflection calculation
    const lightX = 0.22;
    const lightY = -0.58;
    const lightZ = 0.78;

    // Camera view direction
    const viewZ = 1.0;

    // Half-vector H = normalize(L + V)
    const lenHV = Math.hypot(lightX, lightY, lightZ + viewZ);
    const hx = lightX / lenHV;
    const hy = lightY / lenHV;
    const hz = (lightZ + viewZ) / lenHV;

    const render = (time: number) => {
      const now = time * 0.001; // seconds
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      // Soft decay of the updraft impulse to steady breathing ambient airflow
      if (draftIntensityRef.current > 0.08) {
        draftIntensityRef.current -= dt * 0.22;
      } else {
        draftIntensityRef.current = 0.08;
      }

      const mouse = mouseAirRef.current;
      mouse.vx *= 0.88;
      mouse.vy *= 0.88;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const draft = draftIntensityRef.current;
      const particles = particlesRef.current;
      const sprites = spritesRef.current;

      // ====================================================================
      // 1. ADVANCED DIVERGENT FLUID AIRFLOW FIELD + CURL NOISE
      // Rather than particles pushing themselves apart artificially, a continuous
      // aerodynamic fluid field circulates air: rising in chimney plume and
      // naturally diverging/fanning outward as it hits upper levels.
      // ====================================================================
      const scaleL = 0.0022; // Low frequency ambient roll
      const scaleH = 0.0055; // Micro-eddy frequency
      const tFlow = now * 0.42;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        // Incompressible 2D Curl Noise stream function derivatives
        const curlVx =
          Math.cos(p.y * scaleL + tFlow) * Math.sin(p.x * scaleL * 0.8) * 26 +
          Math.cos(p.y * scaleH - tFlow * 1.3) * 16;

        const curlVy =
          -Math.sin(p.y * scaleL + tFlow) * Math.cos(p.x * scaleL * 0.8) * 26 -
          Math.sin(p.x * scaleH + tFlow * 0.9) * 16;

        // Convective chimney updraft physics
        const normX = (p.x - cx) / (width * 0.5); // -1.0 to +1.0
        const normY = Math.max(0, Math.min(1, p.y / height)); // 0 (top) to 1 (bottom)

        // Fluid continuity: Rising air in center must diverge horizontally to both sides as it ascends
        // Divergence is zero at bottom, peaks in mid-to-top as plume fans outward gracefully
        const plumeExpansion = Math.sin((1 - normY) * Math.PI * 0.85);
        const airOutward = normX * (80 * draft) * plumeExpansion;

        // Central chimney upward velocity (concentrated in center column, decaying radially)
        const chimneyCore = Math.exp(-Math.pow(normX * 2.2, 2));
        const airUpward = -125 * draft * chimneyCore * (0.45 + 0.55 * normY);

        // Net air velocity vector at (p.x, p.y)
        let airVx = curlVx + airOutward;
        let airVy = curlVy + airUpward - 6.0; // slight thermal buoyancy

        // User mouse wake injection
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const distSq = mdx * mdx + mdy * mdy;
          if (distSq < 130 * 130 && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const inf = 1 - dist / 130;
            airVx += mouse.vx * inf * 2.2;
            airVy += mouse.vy * inf * 2.2;
          }
        }

        // Aerodynamic Drag Coupling: Acceleration a = (V_air - V_p) * (drag / mass)
        const ax = (airVx - p.vx) * (p.drag * 60);
        const ay = (airVy - p.vy) * (p.drag * 60);

        p.vx += (ax / p.mass) * dt;
        p.vy += (ay / p.mass) * dt;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // 3D Facet Tumbling in Air Stream
        p.thetaX += p.omegaX * dt;
        p.thetaY += p.omegaY * dt;

        // Lifecycle & graceful fade curves
        const fadeIn = Math.min(1, p.life / 22);
        const fadeOut = Math.max(0, 1 - p.life / p.maxLife);
        const edgeFade = Math.max(0, 1 - Math.pow(Math.abs(normX), 2.2));
        const baseAlpha = fadeIn * fadeOut * edgeFade;

        // Respawn if decayed or drifted outside boundary
        if (
          p.life >= p.maxLife ||
          p.x < -70 ||
          p.x > width + 70 ||
          p.y < -70 ||
          p.y > height + 70 ||
          baseAlpha <= 0.002
        ) {
          particles[i] = createParticle(width, height, false);
          continue;
        }

        // ====================================================================
        // 2. 3D FACET TUMBLING & SPECULAR REFLECTION OPTICS
        // Real glitter is flat micro-mirrors. When normal aligns with half-vector,
        // it reflects high-intensity specular flash for 1-3 frames.
        // ====================================================================
        // Normal vector in 3D:
        const nx = Math.sin(p.thetaX) * Math.cos(p.thetaY);
        const ny = Math.sin(p.thetaY);
        const nz = Math.cos(p.thetaX) * Math.cos(p.thetaY);

        // Specular dot product: N dot H
        const specDot = Math.max(0, nx * hx + ny * hy + nz * hz);

        // High specular exponent simulates polished metallic facet
        const specularFactor = Math.pow(specDot, 24);

        // High-frequency facet oscillation (twinkle)
        const microFlicker = Math.sin(now * 12 + p.glintPhase);
        const isGlinting = specularFactor > 0.35 && microFlicker > -0.2 && p.tier !== 'bokeh';

        // ====================================================================
        // 3. PHOTOREALISTIC RENDERING & OPTICAL BLOOM GLARE
        // ====================================================================
        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.tier === 'bokeh') {
          // BOKEH LAYER: Soft out-of-focus background disc
          if (sprites.softBokeh) {
            const bAlpha = baseAlpha * 0.32;
            ctx.globalAlpha = bAlpha;
            const bR = p.baseSize * 4.0;
            ctx.drawImage(sprites.softBokeh, -bR, -bR, bR * 2, bR * 2);
          }
        } else if (!isGlinting) {
          // COSMETIC MICRO-GRIT (Warm champagne/gold granular pigment)
          const gAlpha = baseAlpha * 0.85;
          const s = p.baseSize; // 0.85px - 2.0px
          ctx.fillStyle = `rgba(${p.baseColor}, ${gAlpha})`;
          ctx.fillRect(-s / 2, -s / 2, s, s);
        } else {
          // SPECULAR GLINT BURST (High-intensity radiant flash with optical bloom & diffraction glint)
          const glintPower = Math.min(1.0, specularFactor * 1.8);
          const flashAlpha = Math.min(1.0, baseAlpha * (0.85 + 0.15 * glintPower));

          // Switch to additive luminance blending for glowing core accumulation
          ctx.globalCompositeOperation = 'lighter';

          // 1. Golden Optical Bloom Halo
          if (sprites.specularBloom) {
            const bloomRadius = p.baseSize * (5.5 + 4.5 * glintPower);
            ctx.globalAlpha = flashAlpha * 0.8;
            ctx.drawImage(sprites.specularBloom, -bloomRadius, -bloomRadius, bloomRadius * 2, bloomRadius * 2);
          }

          // 2. Anamorphic Diffraction Star-Glint Streak (Only when peak specular alignment)
          if (sprites.diamondGlint && specularFactor > 0.55) {
            const streakScale = p.baseSize * (4.0 + 3.0 * glintPower);
            ctx.globalAlpha = flashAlpha * 0.95;
            ctx.drawImage(sprites.diamondGlint, -streakScale, -streakScale, streakScale * 2, streakScale * 2);
          }

          // 3. Blinding Pure White / Diamond Specular Core
          const coreSize = p.baseSize * 1.35;
          ctx.globalAlpha = flashAlpha;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-coreSize / 2, -coreSize / 2, coreSize, coreSize);
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
  }, [initGlitterField, createParticle, initSprites]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCanvasClick}
      className="w-full min-h-[560px] sm:min-h-[640px] relative overflow-hidden flex flex-col items-center justify-center py-20 px-6 cursor-crosshair select-none border-y border-white/10"
      style={{
        // Zero red/burgundy tint: Pure luxury deep obsidian matching #0a0a0a
        background: 'radial-gradient(ellipse at 50% 40%, #131316 0%, #0a0a0a 60%, #050505 100%)',
      }}
    >
      {/* Subtle warm champagne center lighting (No red tint) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-amber-400/[0.035] rounded-full blur-[140px] pointer-events-none" />

      {/* NATURAL FLUID GLITTER CANVAS (Curl noise updraft, micro-grit, specular flashes) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-20 pointer-events-none"
      />

      {/* TYPOGRAPHY: Revealed through ambient glowing gold currents */}
      <div
        key={openingKey}
        className={`relative z-30 max-w-3xl w-full text-center flex flex-col items-center transition-all duration-1000 ease-out ${
          isRevealed ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Subtle HUD tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-[#fde68a] text-[10px] tracking-[0.3em] uppercase font-mono mb-6">
          <FiWind className="w-3 h-3 text-amber-300" />
          <span>Aerodynamic Airflow Draft</span>
        </div>

        {/* Elegant Luxury Headline */}
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#f5f5f7] mb-6 uppercase leading-[1.1] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: 'var(--font-timesnewroman), "EB Garamond", serif' }}
        >
          Moments Suspended in Gold
        </h2>

        {/* Poetic description */}
        <p
          className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed font-light tracking-wide drop-shadow-md"
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
        >
          Driven by curl-noise fluid dynamics and 3D facet tumbling, microscopic cosmetic grit lingers weightlessly in
          curling air currents—billowing upward and fanning outward into quiet ambient space.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerUpdraft();
            }}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 cursor-pointer"
          >
            <FiRotateCcw className="w-3.5 h-3.5" />
            <span>Stir Updraft Draft</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/wedding');
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200 font-medium text-xs tracking-[0.2em] uppercase backdrop-blur-md transition-all duration-300 cursor-pointer hover:border-white/30"
          >
            <FiHeart className="w-3.5 h-3.5 text-neutral-300 fill-neutral-300/30" />
            <span>View Invitation</span>
          </button>
        </div>

        {/* Interactive hint */}
        <span className="mt-8 text-[11px] font-mono tracking-widest uppercase text-neutral-500 pointer-events-none">
          Move cursor to stir airflow • Click to puff glitter
        </span>
      </div>

      {/* Smooth top/bottom fade gradients into portfolio background */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}
