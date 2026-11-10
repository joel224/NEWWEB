'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiHeart } from 'react-icons/fi';

function SparkleIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

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
  // Very few razor-sharp specks with zero blur
  isCrisp?: boolean;
  crispType?: 'silver' | 'gold';
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
  const widthRef = useRef<number>(0);
  const heightRef = useRef<number>(0);
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

    // 3. Soft Bokeh Disc Sprite (Out-of-focus subtle background disc)
    const bokehCanvas = document.createElement('canvas');
    bokehCanvas.width = 32;
    bokehCanvas.height = 32;
    const boCtx = bokehCanvas.getContext('2d');
    if (boCtx) {
      const bGrad = boCtx.createRadialGradient(16, 16, 0, 16, 16, 14);
      bGrad.addColorStop(0, 'rgba(255, 235, 185, 0.35)');
      bGrad.addColorStop(0.5, 'rgba(240, 200, 130, 0.12)');
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

  // Spawn a microscopic cosmetic glitter particle evenly across the full atmosphere
  const createParticle = useCallback(
    (width: number, height: number): GlitterDust => {
      // Natural organic distribution across the whole canvas space - ZERO RECTANGLE CLUSTERS!
      const x = Math.random() * width;
      const y = Math.random() * height;

      const rand = Math.random();
      let tier: 'micro' | 'flake' | 'bokeh' = 'micro';
      let baseSize = 0.85 + Math.random() * 0.7; // ~75% micro-grit (0.85px - 1.55px)
      let mass = 0.5 + Math.random() * 0.6;
      let drag = 0.05 + Math.random() * 0.04;

      if (rand > 0.975) {
        // Only ~2.5% subtle background bokeh (much rarer and smaller to avoid big blurry blobs)
        tier = 'bokeh';
        baseSize = 1.3 + Math.random() * 0.7;
        mass = 1.1 + Math.random() * 0.5;
        drag = 0.03 + Math.random() * 0.02;
      } else if (rand > 0.72) {
        // ~25% Specular Flakes
        tier = 'flake';
        baseSize = 1.5 + Math.random() * 0.9;
        mass = 0.9 + Math.random() * 0.7;
        drag = 0.04 + Math.random() * 0.03;
      }

      // Very few (only ~3.5%) are designated as unblurred, razor-sharp silver & gold crystalline specks
      const isCrisp = Math.random() < 0.035 && tier !== 'bokeh';
      const crispType: 'silver' | 'gold' = Math.random() > 0.5 ? 'gold' : 'silver';
      const baseColor = isCrisp
        ? (crispType === 'silver' ? '240, 246, 255' : '255, 215, 0')
        : PALETTE[Math.floor(Math.random() * PALETTE.length)];

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: -4 - Math.random() * 12, // gentle natural buoyancy
        mass,
        drag,
        baseSize,
        tier,
        thetaX: Math.random() * Math.PI * 2,
        thetaY: Math.random() * Math.PI * 2,
        omegaX: (Math.random() - 0.5) * 5.5,
        omegaY: (Math.random() - 0.5) * 5.5,
        baseColor,
        life: 0,
        maxLife: 320 + Math.random() * 260,
        glintPhase: Math.random() * Math.PI * 2,
        isCrisp,
        crispType,
      };
    },
    []
  );

  // Initialize atmospheric glitter field once
  const initGlitterField = useCallback(
    (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
      widthRef.current = width;
      heightRef.current = height;

      // Never wipe or reset existing particles on scroll or resize!
      if (particlesRef.current.length > 0) return;

      const count = Math.min(850, Math.max(450, Math.floor((width * height) / 1400)));
      const list: GlitterDust[] = [];
      for (let i = 0; i < count; i++) {
        const p = createParticle(width, height);
        // Stagger lifecycles evenly so the glitter is immediately glowing & alive across the whole canvas
        p.life = Math.random() * p.maxLife;
        list.push(p);
      }
      particlesRef.current = list;
    },
    [createParticle]
  );

  // Stir Updraft Draft: accelerates air velocity on existing particles naturally (NO RECTANGLE RESPAWN)
  const triggerUpdraft = useCallback(() => {
    draftIntensityRef.current = 1.45;
    const w = widthRef.current || 900;
    const cx = w / 2;

    // Impart natural aerodynamic convective lift & swirl to all active particles
    particlesRef.current.forEach((p) => {
      const normX = (p.x - cx) / (w * 0.5 || 1);
      const lift = 20 + Math.random() * 28;
      p.vy -= lift * (1.15 - 0.35 * Math.abs(normX));
      p.vx += normX * (10 + Math.random() * 16);
      p.omegaX += (Math.random() - 0.5) * 7.0;
      p.omegaY += (Math.random() - 0.5) * 7.0;
    });
  }, []);

  // Mouse interaction: stirs airflow vector field & draws sparkling glitters along cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    const mouse = mouseAirRef.current;
    const distMoved = mouse.active ? Math.hypot(curX - mouse.lastX, curY - mouse.lastY) : 0;

    if (mouse.active) {
      mouse.vx = (curX - mouse.lastX) * 0.5;
      mouse.vy = (curY - mouse.lastY) * 0.5;
    }

    mouse.x = curX;
    mouse.y = curY;
    mouse.lastX = curX;
    mouse.lastY = curY;
    mouse.active = true;

    // Draw sparkling glitters wherever the mouse moves (without clicking!)
    if (distMoved > 2.5) {
      const spawnCount = Math.min(5, Math.max(2, Math.floor(distMoved / 8) + 1));
      const trailSpecks: GlitterDust[] = [];

      for (let i = 0; i < spawnCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 6 + Math.random() * 22;
        const isCrisp = Math.random() < 0.035;
        const crispType: 'silver' | 'gold' = Math.random() > 0.5 ? 'gold' : 'silver';

        trailSpecks.push({
          x: curX + (Math.random() - 0.5) * 12,
          y: curY + (Math.random() - 0.5) * 12,
          vx: mouse.vx * 0.2 + Math.cos(angle) * speed,
          vy: mouse.vy * 0.2 + Math.sin(angle) * speed - 12 - Math.random() * 8, // buoyant upward drift
          mass: 0.5 + Math.random() * 0.7,
          drag: 0.045 + Math.random() * 0.025,
          baseSize: 0.85 + Math.random() * 1.1,
          tier: Math.random() > 0.65 ? 'flake' : 'micro',
          thetaX: Math.random() * Math.PI * 2,
          thetaY: Math.random() * Math.PI * 2,
          omegaX: (Math.random() - 0.5) * 8.0,
          omegaY: (Math.random() - 0.5) * 8.0,
          baseColor: isCrisp
            ? (crispType === 'silver' ? '240, 246, 255' : '255, 215, 0')
            : PALETTE[Math.floor(Math.random() * PALETTE.length)],
          life: 0,
          maxLife: 200 + Math.random() * 160,
          glintPhase: Math.random() * Math.PI * 2,
          isCrisp,
          crispType,
        });
      }

      particlesRef.current.push(...trailSpecks);
      if (particlesRef.current.length > 1200) {
        particlesRef.current.splice(0, particlesRef.current.length - 1200);
      }
    }
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
      const isCrisp = Math.random() < 0.035;
      const crispType: 'silver' | 'gold' = Math.random() > 0.5 ? 'gold' : 'silver';
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
        baseColor: isCrisp
          ? (crispType === 'silver' ? '240, 246, 255' : '255, 215, 0')
          : PALETTE[Math.floor(Math.random() * PALETTE.length)],
        life: 0,
        maxLife: 260 + Math.random() * 200,
        glintPhase: Math.random() * Math.PI * 2,
        isCrisp,
        crispType,
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
      widthRef.current = width;
      heightRef.current = height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initGlitterField(width, height);
      } else {
        // Adjust particles that are out of bounds on resize without re-spawning
        particlesRef.current.forEach((p) => {
          if (p.x > width) p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        });
      }
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
          particles[i] = createParticle(width, height);
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
          // BOKEH LAYER: Subtle, faint out-of-focus background disc (scaled down & reduced)
          if (sprites.softBokeh) {
            const bAlpha = baseAlpha * 0.16;
            ctx.globalAlpha = bAlpha;
            const bR = p.baseSize * 2.0;
            ctx.drawImage(sprites.softBokeh, -bR, -bR, bR * 2, bR * 2);
          }
        } else if (!isGlinting) {
          // COSMETIC MICRO-GRIT (Warm champagne/gold granular pigment)
          const gAlpha = baseAlpha * 0.85;
          const s = p.baseSize; // 0.85px - 2.0px
          ctx.fillStyle = `rgba(${p.baseColor}, ${gAlpha})`;
          ctx.fillRect(-s / 2, -s / 2, s, s);
        } else {
          // SPECULAR GLINT BURST (High-intensity radiant flash)
          const glintPower = Math.min(1.0, specularFactor * 1.8);
          const flashAlpha = Math.min(1.0, baseAlpha * (0.85 + 0.15 * glintPower));

          // Switch to additive luminance blending for glowing core accumulation
          ctx.globalCompositeOperation = 'lighter';

          if (p.isCrisp) {
            // ==========================================================
            // SURGICALLY UNBLURRED: ZERO BLOOM HALO, ZERO BLUR!
            // Sharp, crystalline needle-prick in pure platinum silver or 24k gold
            // ==========================================================
            ctx.globalAlpha = flashAlpha;
            const coreSize = p.baseSize * (1.15 + 0.35 * glintPower);

            // 1. Unblurred crisp metallic facet body (sharp geometry, zero blur)
            ctx.fillStyle = p.crispType === 'silver' ? '#f0f6ff' : '#ffd700';
            ctx.fillRect(-coreSize / 2, -coreSize / 2, coreSize, coreSize);

            // 2. Pure needle spikes along axes (razor 1px lines, zero blur, diamond sparkle)
            if (specularFactor > 0.48) {
              const spikeLen = coreSize * (1.8 + glintPower);
              ctx.fillStyle = p.crispType === 'silver' ? '#ffffff' : '#ffe57f';
              ctx.fillRect(-spikeLen / 2, -0.5, spikeLen, 1);
              ctx.fillRect(-0.5, -spikeLen / 2, 1, spikeLen);
            }

            // 3. Pure diamond specular white-hot needle center
            ctx.fillStyle = '#ffffff';
            const needleSize = Math.max(0.75, coreSize * 0.45);
            ctx.fillRect(-needleSize / 2, -needleSize / 2, needleSize, needleSize);
          } else {
            // Standard particles with soft optical bloom halo
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
      className="w-full min-h-[560px] sm:min-h-[640px] relative overflow-hidden flex flex-col items-center justify-center py-20 px-6 select-none bg-[#0a0a0a]"
    >
      {/* Subtle warm champagne center lighting (No red tint) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-amber-400/[0.035] rounded-full blur-[140px] pointer-events-none" />

      {/* NATURAL FLUID GLITTER CANVAS (Curl noise updraft, micro-grit, specular flashes) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-20 pointer-events-none"
      />

      {/* TYPOGRAPHY: Elegant Editorial Christmas Atmosphere */}
      <div className="relative z-30 max-w-3xl w-full text-center flex flex-col items-center">
        {/* Elegant Luxury Italic Headline */}
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-light italic tracking-normal text-[#f5f5f7] mb-4 leading-[1.15]"
          style={{ fontFamily: 'var(--font-timesnewroman), "EB Garamond", "Cormorant Garamond", Georgia, serif' }}
        >
          Merry Christmas
        </h2>

        {/* Poetic description */}
        <p
          className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mb-8 font-light tracking-wide"
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
        >
          Moments Suspended in Gold
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/');
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200 font-medium text-xs tracking-[0.2em] uppercase backdrop-blur-md transition-all duration-300 cursor-pointer hover:border-white/30"
          >
            <FiHeart className="w-3.5 h-3.5 text-neutral-300 fill-neutral-300/30" />
            <span>View Invitation</span>
          </button>
        </div>
      </div>

      {/* Smooth top/bottom fade gradients into portfolio background */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}
