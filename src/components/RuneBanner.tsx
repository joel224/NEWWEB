'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiHeart, FiWind } from 'react-icons/fi';

interface GlitterDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Natural physical properties
  mass: number;     // 0.4 (light micro-dust) to 2.2 (heavier flake)
  drag: number;     // Aerodynamic coupling coefficient
  baseSize: number; // 0.6px to 2.0px (microscopic grit)
  tier: 'grit' | 'flake' | 'bokeh';
  // 3D Facet Tumbling
  angleX: number;
  angleY: number;
  rotSpeedX: number;
  rotSpeedY: number;
  // Color palette
  baseColor: string; // Warm champagne, pale gold, diamond silver
  alpha: number;
  life: number;
  maxLife: number;
}

export default function GlitterBanner() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<GlitterDust[]>([]);

  // Airflow impulse states
  const draftProgressRef = useRef<number>(1.0); // 1 = full draft parting, decays to ambient
  const isDraftingRef = useRef<boolean>(true);
  const mouseAirRef = useRef<{ x: number; y: number; vx: number; vy: number; lastX: number; lastY: number; active: boolean }>({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    active: false,
  });

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [openingKey, setOpeningKey] = useState<number>(0);

  // Elegant cosmetic glitter color palettes (RGB triples for additive specular math)
  const TIER_COLORS = [
    '235, 215, 175', // Warm Champagne Gold
    '255, 248, 230', // Diamond Platinum
    '220, 190, 140', // Pale Amber Dust
    '245, 235, 220', // Pearlescent Ivory
    '180, 160, 135', // Deep Antique Bronze (Low-specular grit)
  ];

  // Spawn a microscopic cosmetic glitter speck
  const createSpeck = useCallback(
    (width: number, height: number, forceCenter = false): GlitterDust => {
      const cx = width / 2;
      const cy = height / 2;

      // Spawn concentrated around central convective chimney
      const spreadX = forceCenter ? width * 0.18 : width * 0.45;
      const x = cx + (Math.random() - 0.5) * spreadX * 2;
      // Start biased toward lower-middle for convective updraft
      const y = forceCenter ? cy + (Math.random() - 0.1) * (height * 0.4) : Math.random() * height;

      const rand = Math.random();
      let tier: 'grit' | 'flake' | 'bokeh' = 'grit';
      let baseSize = 0.65 + Math.random() * 0.55; // 75% are microscopic non-blinking dots (0.65px - 1.2px)
      let mass = 0.5 + Math.random() * 0.7;
      let drag = 0.055 + Math.random() * 0.035;

      if (rand > 0.88) {
        // Soft out-of-focus background bokeh (5%)
        tier = 'bokeh';
        baseSize = 2.2 + Math.random() * 1.6;
        mass = 1.4 + Math.random() * 0.8;
        drag = 0.025 + Math.random() * 0.02;
      } else if (rand > 0.72) {
        // Specular medium flake (17%)
        tier = 'flake';
        baseSize = 1.25 + Math.random() * 0.75;
        mass = 1.0 + Math.random() * 0.8;
        drag = 0.04 + Math.random() * 0.025;
      }

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: -5 - Math.random() * 15, // initial upward air buoyant lift
        mass,
        drag,
        baseSize,
        tier,
        angleX: Math.random() * Math.PI * 2,
        angleY: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 4.5,
        rotSpeedY: (Math.random() - 0.5) * 4.5,
        baseColor: TIER_COLORS[Math.floor(Math.random() * TIER_COLORS.length)],
        alpha: 0,
        life: 0,
        maxLife: 280 + Math.random() * 220,
      };
    },
    []
  );

  // Initialize atmospheric glitter field
  const initGlitterField = useCallback(
    (width: number, height: number) => {
      // Density: ~550 particles for rich cosmetic texture without framerate drop
      const count = Math.min(600, Math.max(300, Math.floor((width * height) / 1900)));
      const list: GlitterDust[] = [];
      for (let i = 0; i < count; i++) {
        const p = createSpeck(width, height, true);
        p.life = Math.random() * p.maxLife * 0.75; // Stagger initial life
        list.push(p);
      }
      particlesRef.current = list;
    },
    [createSpeck]
  );

  // Trigger convective updraft plume (air draft pushes upward and parts outward)
  const triggerUpdraft = useCallback(() => {
    draftProgressRef.current = 1.25;
    isDraftingRef.current = true;
    setIsRevealed(false);
    setOpeningKey((k) => k + 1);

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      initGlitterField(rect.width, rect.height);
    }

    setTimeout(() => {
      setIsRevealed(true);
    }, 1100);
  }, [initGlitterField]);

  // Mouse interaction: stirs airflow in the vector field
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    const mouse = mouseAirRef.current;
    if (mouse.active) {
      mouse.vx = (curX - mouse.lastX) * 0.45;
      mouse.vy = (curY - mouse.lastY) * 0.45;
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

    // Inject air vortex puff at click point
    const burstCount = 55;
    const newDust: GlitterDust[] = [];
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 15 + Math.random() * 45;
      newDust.push({
        x: clickX + (Math.random() - 0.5) * 15,
        y: clickY + (Math.random() - 0.5) * 15,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20, // upward bias
        mass: 0.6 + Math.random() * 0.8,
        drag: 0.05 + Math.random() * 0.03,
        baseSize: 0.7 + Math.random() * 0.9,
        tier: Math.random() > 0.75 ? 'flake' : 'grit',
        angleX: Math.random() * Math.PI * 2,
        angleY: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 8.0,
        rotSpeedY: (Math.random() - 0.5) * 8.0,
        baseColor: TIER_COLORS[Math.floor(Math.random() * TIER_COLORS.length)],
        alpha: 0,
        life: 0,
        maxLife: 240 + Math.random() * 180,
      });
    }
    particlesRef.current.push(...newDust);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
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
      initGlitterField(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    // MAIN RENDER LOOP: 2D Curl Noise Aerodynamics + 3D Facet Specular Tumbling
    const render = (time: number) => {
      const now = time * 0.001; // seconds
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      // Soft decay of the updraft draft impulse toward natural hovering ambient state
      if (draftProgressRef.current > 0.05) {
        draftProgressRef.current -= dt * 0.28;
      } else {
        draftProgressRef.current = 0.05; // residual subtle breathing airflow
      }

      // Decay mouse air momentum
      const mouse = mouseAirRef.current;
      mouse.vx *= 0.88;
      mouse.vy *= 0.88;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const draft = draftProgressRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        // ========================================================
        // 1. INCOMPRESSIBLE 2D CURL NOISE AIRFLOW DYNAMICS
        // ========================================================
        const scale1 = 0.0028;
        const scale2 = 0.0065;
        const tOffset = now * 0.35;

        // Stream function derivatives for micro-eddies and vortices
        const curlU =
          Math.cos(p.y * scale1 + tOffset) * Math.sin(p.x * scale1) * 22 +
          Math.cos(p.y * scale2 - tOffset * 1.2) * 14;

        const curlV =
          -Math.sin(p.y * scale1 + tOffset) * Math.cos(p.x * scale1) * 22 -
          Math.sin(p.x * scale2 + tOffset * 0.8) * 14;

        // Convective Chimney Updraft (sweeps from center bottom, fanning outward)
        const relX = (p.x - cx) / (width * 0.5); // -1.0 (left edge) to +1.0 (right edge)
        const relY = Math.max(0, Math.min(1, p.y / height));

        // Lateral air expansion: air fans outward left (<0) and right (>0)
        // Strongest in middle-to-upper half as draft billows out like a plume
        const airOutward = relX * (75 * draft) * (1.15 - Math.min(1, Math.abs(relX)));

        // Upward chimney draft: concentrated at center seam
        const centerBell = Math.exp(-Math.pow(relX * 2.4, 2));
        const airUpward = -110 * draft * centerBell * (0.5 + 0.5 * relY);

        // Combined air velocity vector at this point in space
        let airVx = curlU + airOutward;
        let airVy = curlV + airUpward - 7.0; // slight thermal buoyancy so it never drops like stone

        // Mouse wake injection (user stirs the air)
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const distSq = mdx * mdx + mdy * mdy;
          if (distSq < 110 * 110 && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const influence = (1 - dist / 110);
            airVx += mouse.vx * influence * 1.8;
            airVy += mouse.vy * influence * 1.8;
          }
        }

        // Aerodynamic Drag Force: F = drag * (v_air - v_particle)
        // High drag micro-dust matches air immediately; heavier flakes have momentum
        const ax = (airVx - p.vx) * (p.drag * 60);
        const ay = (airVy - p.vy) * (p.drag * 60);

        p.vx += (ax / p.mass) * dt;
        p.vy += (ay / p.mass) * dt;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // 3D Facet Tumbling
        p.angleX += p.rotSpeedX * dt;
        p.angleY += p.rotSpeedY * dt;

        // ========================================================
        // 2. LIFECYCLE & NATURAL DISSIPATION
        // ========================================================
        const fadeIn = Math.min(1, p.life / 20);
        const fadeOut = Math.max(0, 1 - p.life / p.maxLife);

        // Natural edge dispersion: as particles fan out to lateral margins, fade gracefully
        const lateralFade = Math.max(0, 1 - Math.pow(Math.abs(relX), 1.9));
        const baseAlpha = fadeIn * fadeOut * lateralFade;

        // Respawn if drifted off-screen or decayed
        if (p.life >= p.maxLife || p.x < -60 || p.x > width + 60 || p.y < -60 || p.y > height + 60 || baseAlpha <= 0.002) {
          particles[i] = createSpeck(width, height, false);
          continue;
        }

        // ========================================================
        // 3. 3D FACET SPECULAR FLASH OPTICS (1-3 Frame Glints)
        // ========================================================
        // Surface normal of micro-platelet in 3D
        const nz = Math.cos(p.angleX) * Math.cos(p.angleY);
        const ny = Math.sin(p.angleY);

        // Specular reflection toward viewer/overhead spotlight
        const specDot = Math.max(0, nz * 0.88 - ny * 0.35);

        // Very high specular exponent: only flashes when facet aligns with light!
        // 85% of particles stay low-key grit; 10-15% flash brilliant white/gold
        const specularPower = Math.pow(specDot, 28);
        const isSpecularGlint = specularPower > 0.45 && p.tier !== 'bokeh';

        // ========================================================
        // 4. PHOTOREALISTIC RENDERING (No cartoon crosses/stars!)
        // ========================================================
        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.tier === 'bokeh') {
          // BOKEH LAYER: Soft, low-contrast out-of-focus background disc
          const bAlpha = baseAlpha * 0.22;
          ctx.beginPath();
          ctx.arc(0, 0, p.baseSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.baseColor}, ${bAlpha})`;
          ctx.fill();
        } else if (!isSpecularGlint) {
          // COSMETIC MICRO-GRIT (The non-blinking dots are made microscopic: sub-pixel to 1.1px)
          const gAlpha = baseAlpha * 0.65;
          const s = p.baseSize; // 0.65px - 1.2px
          ctx.fillStyle = `rgba(${p.baseColor}, ${gAlpha})`;
          // Render as microscopic granular speck
          ctx.fillRect(-s / 2, -s / 2, s, s);
        } else {
          // TRANSIENT SPECULAR GLINT: 1-3 frame explosive highlight
          const glintIntensity = Math.min(1, specularPower * 1.5);
          const flashAlpha = Math.min(1, baseAlpha * (0.8 + 0.2 * glintIntensity));
          const coreSize = p.baseSize * (1.1 + 0.5 * glintIntensity);

          // Additive luminance blending for hot specular core
          ctx.globalCompositeOperation = 'lighter';

          // 1. Radiant specular core (blows out to pure white/platinum)
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          ctx.fillRect(-coreSize / 2, -coreSize / 2, coreSize, coreSize);

          // 2. Microscopic optical bloom halo (soft lens bleeding)
          ctx.beginPath();
          ctx.arc(0, 0, coreSize * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.baseColor}, ${flashAlpha * 0.38})`;
          ctx.fill();
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
  }, [initGlitterField, createSpeck]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCanvasClick}
      className="w-full min-h-[560px] sm:min-h-[620px] relative overflow-hidden flex flex-col items-center justify-center py-20 px-6 cursor-crosshair select-none border-y border-white/10"
      style={{
        // Deep obsidian showroom dark background matching #0a0a0a (Zero red background)
        background: 'radial-gradient(ellipse at 50% 45%, #131316 0%, #0a0a0a 65%, #050505 100%)',
      }}
    >
      {/* Subtle atmospheric center luminance beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-amber-500/[0.035] rounded-full blur-[140px] pointer-events-none" />

      {/* NATURAL FLUID GLITTER CANVAS (Curl noise updraft, micro-grit, specular flashes) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-20 pointer-events-none"
      />

      {/* TYPOGRAPHY: Revealed softly through the parting air currents */}
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
            <FiWind className="w-3.5 h-3.5" />
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
