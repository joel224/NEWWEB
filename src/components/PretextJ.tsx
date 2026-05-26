'use client';

import React, { useEffect, useRef } from 'react';

// The text characters that form the shape of the J
const PHRASES = [
  "L ", "O ", "V ", "E ", "A ", "N ", "D ", 
];

export default function PretextJ() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Dynamically inject Google Fonts links for Playwrite AT
    const linkId = 'google-font-playwrite-at';
    if (!document.getElementById(linkId)) {
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect1);

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(preconnect2);

      const fontLink = document.createElement('link');
      fontLink.id = linkId;
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Playwrite+AT:ital,wght@0,100..400;1,100..400&display=swap';
      document.head.appendChild(fontLink);
    }

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      originX: number;
      originY: number;
      tunnelRadius: number;
      tunnelAngle: number;
      finalRadius: number;
      finalAngle: number;
      spinOffset: number;
      progress: number;
      speed: number;
      initialZ: number;
      vx: number;
      vy: number;
      text: string;
      width: number;
      fontSize: number;
      alpha: number;
    }> = [];

    // Mouse tracking
    const mouse = {
      x: 0,
      y: 0,
      active: false,
      radius: 100
    };

    // Hardcoded layout & physics constants
    const fontSize = 7;
    const springStrength = 0.02;
    const friction = 0.85;

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Full-screen transparent canvas dimensions
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      ctx.scale(dpr, dpr);
      // Generate layout relative to the inner container size
      generateJLayout(rect.width, rect.height);
    };

    const generateJLayout = (width: number, height: number) => {
      particles = [];
      let phraseIndex = 0;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Create an offscreen canvas to draw the reference italic letter "J"
      const offscreen = document.createElement('canvas');
      const offscreenCtx = offscreen.getContext('2d');
      if (!offscreenCtx) return;

      offscreen.width = 800;
      offscreen.height = 800;

      // Draw the shape of "J" in italic
      offscreenCtx.fillStyle = 'black';
      offscreenCtx.fillRect(0, 0, offscreen.width, offscreen.height);

      offscreenCtx.font = '  500px "Playwrite AT", cursive';
      offscreenCtx.fillStyle = 'white';
      offscreenCtx.textAlign = 'center';
      offscreenCtx.textBaseline = 'middle';
      offscreenCtx.fillText('♡', offscreen.width / 2, offscreen.height / 2);

      // Get image data to analyze filled pixels
      const imgData = offscreenCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const pixels = imgData.data;

      // 2. Sample the offscreen canvas randomly (Rejection Sampling) to perfectly fill the curves
      const targetParticles = 160; // Maximum number of particles to draw
      const minDistance = 10; // Minimum distance to prevent exact overlaps, controlling density
      const minDistanceSq = minDistance * minDistance;
       
      let attempts = 0;
      const maxAttempts = 60000;
      
      const placedCoords: Array<{x: number, y: number}> = [];

      while (particles.length < targetParticles && attempts < maxAttempts) {
        attempts++;
        
        // Pick a random point on the offscreen canvas
        const x = Math.random() * offscreen.width;
        const y = Math.random() * offscreen.height;

        const pixelIndex = (Math.floor(y) * offscreen.width + Math.floor(x)) * 4;
        const isWhite = pixels[pixelIndex] > 120; // check red channel

        if (isWhite) {
          // Check if it's too close to an already placed particle
          let tooClose = false;
          for (let i = 0; i < placedCoords.length; i++) {
            const dx = placedCoords[i].x - x ;
            const dy = placedCoords[i].y - y;
            if (dx * dx + dy * dy < minDistanceSq) {
              tooClose = true;
              break;
            }
          }

          if (!tooClose) {
            placedCoords.push({ x, y });
            const phrase = PHRASES[phraseIndex % PHRASES.length];

            ctx.font = `italic 600 ${fontSize}px "Playwrite AT", "Inter", -apple-system, sans-serif`;
            const textWidth = ctx.measureText(phrase).width;

            // Calculate a uniform scale factor based on the smaller viewport dimension to lock a perfect 1:1 aspect ratio!
            const uniformScale = Math.min(width, height) / 800;

            // Project coordinates uniformly relative to the center of the canvas
            const mainX = centerX + (x - 400) * uniformScale;
            const mainY = centerY + (y - 400) * uniformScale;

            // 3D Circular Tunnel starting coordinates
            const tunnelAngle = Math.random() * Math.PI * 2;
            const tunnelRadius = 180 + Math.random() * 120; // cylinder tunnel radius (180px to 300px)

            // Final coordinates inside J in polar formats
            const dx = mainX - centerX;
            const dy = mainY - centerY;
            const finalRadius = Math.sqrt(dx * dx + dy * dy);
            const finalAngle = Math.atan2(dy, dx);

            // Spin offset (tornado effect: 2.0 to 3.5 full rotations of swirling vortex at the start!)
            const spinOffset = (Math.PI * 2.0) + Math.random() * (Math.PI * 1.5);

            // Depth initial scale from z-20 to z-30 (using user's preferred positive space)
            const initialZ = 20 + Math.random() * 10;

            // Staggered entry progress so they cascade smoothly into place
            const progress = -Math.random() * 0.30;

            // Faster overall speed, with a highly varied individual spectrum
            const speed = 0.009 + Math.random() * 0.16;

            particles.push({
              x: centerX + Math.cos(tunnelAngle) * tunnelRadius,
              y: centerY + Math.sin(tunnelAngle) * tunnelRadius,
              originX: mainX,
              originY: mainY,
              tunnelRadius,
              tunnelAngle,
              finalRadius,
              finalAngle,
              spinOffset,
              progress,
              speed,
              initialZ,
              vx: 0,
              vy: 0,
              text: phrase,
              width: textWidth,
              fontSize: fontSize,
              alpha: 0.0
            });

            phraseIndex++;
          }
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    // Clicking the container re-triggers the cinematic tunnel fly-through!
    const handleCanvasClick = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      particles.forEach(p => {
        const tunnelAngle = Math.random() * Math.PI * 2;
        const tunnelRadius = 180 + Math.random() * 120;

        p.tunnelAngle = tunnelAngle;
        p.tunnelRadius = tunnelRadius;

        p.x = centerX + Math.cos(tunnelAngle) * tunnelRadius;
        p.y = centerY + Math.sin(tunnelAngle) * tunnelRadius;

        p.spinOffset = (Math.PI * 2.0) + Math.random() * (Math.PI * 1.5);
        p.initialZ = 20 + Math.random() * 10;
        p.progress = -Math.random() * 0.35;
        p.speed = 0.009 + Math.random() * 0.016;
        p.vx = 0;
        p.vy = 0;
        p.alpha = 0.0;
      });
      
      isAnimationFinished = false;
    };

    // Listen on window so hovering outside the container still interacts with flying particles!
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Only click the container to restart
    const currentContainer = containerRef.current;    // Only click the container to restart
    
    if (currentContainer) {
      // currentContainer.addEventListener('click', handleCanvasClick);
    }

     

    let isAnimationFinished = false;
    let animationFinishedTime = 0;

    const draw = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Clear the full-screen transparent overlay
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.save();
      // Translate all coordinates to perfectly match the colored container's position on screen
      ctx.translate(rect.left, rect.top);

      let allFinished = true;

      // Calculate auto-trace fake mouse if the animation just finished
      let currentMouseX = mouse.x;
      let currentMouseY = mouse.y;
      let currentMouseActive = mouse.active;

      if (isAnimationFinished) {

        const timeSinceFinish = performance.now() - animationFinishedTime;
        const delay = 300; // Start tracing 300ms after the intro animation completes
        const duration = 2000; // Trace duration of 2 seconds
        
        if (timeSinceFinish > delay && timeSinceFinish < delay + duration) {
           const traceProgress = (timeSinceFinish - delay) / duration;
           currentMouseActive = true;
           
           // Trace down the center of the canvas where the 'j' stem is
           // Using an eased sine curve could be nice, but linear top-to-bottom looks like a precise trace
           currentMouseX = rect.width / 2 + 10; 
           currentMouseY = rect.height * 0.15 + (rect.height * 0.7) * traceProgress; // sweep from near top to near bottom
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Advance the individual progress down the tunnel
        if (p.progress < 1.0) {
          p.progress += p.speed;
          allFinished = false;
        }

        const t = Math.max(0, Math.min(1.0, p.progress));

        // Power-based ease curve: starts very slow (z-30 to z-20), then becomes extremely speedy down to z-0!
        const ease = Math.pow(t, 0.0); //2.5

        // Current Z depth: scales down from initialZ (20 to 30) down to 0
        const currentZ = p.initialZ * (1 - ease);

        // 3D perspective scale calculation matching user's preferred Zoom-in equation
        const scale = 1 + currentZ * 0.45;
        const centerX = rect.width * 5;
        const centerY = rect.height / 2;

        // 2. Continuous polar tornado morphing: morph radius and angle simultaneously
        // Spiral rotation decays to zero as ease approaches 1.0 (forms 'j' with zero pause!)
        const currentRadius = p.tunnelRadius + (p.finalRadius - p.tunnelRadius) * ease;
        const currentAngle = p.tunnelAngle + (p.finalAngle - p.tunnelAngle) * ease + (1 - ease) * p.spinOffset;

        // 3D polar position in space
        const currentX = centerX + Math.cos(currentAngle) * currentRadius;
        const currentY = centerY + Math.sin(currentAngle) * currentRadius;

        // Project to 2D
        const targetX = centerX + (currentX - centerX) * scale;
        const targetY = centerY + (currentY - centerY) * scale;

        if (t < 1.0) {
          // Lock directly to morph coordinates during the intro transition to guarantee zero physics bounce!
          p.x = targetX;
          p.y = targetY;
          p.vx = 0;
          p.vy = 0;
        } else {
          // Transition complete! Now physical spring attraction and mouse cursor scatter are fully active
          const dxHome = p.originX - p.x;
          const dyHome = p.originY - p.y;
          p.vx += dxHome * springStrength;
          p.vy += dyHome * springStrength;

          // Mouse hover scatter physics (uses the auto-trace currentMouse or real mouse)
          if (currentMouseActive) {
            const dxMouse = p.x - currentMouseX;
            const dyMouse = p.y - currentMouseY;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distMouse < mouse.radius) {
              const force = (mouse.radius - distMouse) / mouse.radius;
              const angle = Math.atan2(dyMouse, dxMouse);
              const push = force * 5.5;
              p.vx += Math.cos(angle) * push;
              p.vy += Math.sin(angle) * push;
            }
          }

          p.vx *= friction;
          p.vy *= friction;
          p.x += p.vx;
          p.y += p.vy;
        }

        // 3. Render the text particle with depth-scaling and fade-in
        ctx.save();

        // Font size scales beautifully with depth
        const currentFontSize = Math.max(1, p.fontSize * scale);

        // Fade in as the particle zooms forward
        p.alpha = ease;

        ctx.font = `  900 ${currentFontSize}px "Playwrite AT", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = `rgba(244, 143, 177, ${p.alpha})`;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      }

      // Restore the full screen translation matrix
      ctx.restore();

      if (allFinished && !isAnimationFinished) {
        isAnimationFinished = true;
        animationFinishedTime = performance.now();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (currentContainer) {
        currentContainer.removeEventListener('click', handleCanvasClick);
      }
    };
  }, []);

  return (
    <>
      {/* The colored background box */}
      <div 
        ref={containerRef} 
        className="relative w-full h-[850px] bg-[#460a0aff] overflow-hidden select-none"
      />
      {/* The full-screen transparent particle canvas overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen pointer-events-none z-50 block"
      />
    </>
  );
}
