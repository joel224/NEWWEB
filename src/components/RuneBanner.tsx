'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiExternalLink,
  FiZap,
  FiCpu,
  FiCheckCircle,
  FiAlertTriangle,
  FiCamera,
  FiCode,
  FiLayers,
  FiActivity,
  FiArrowUpRight,
  FiCopy,
  FiCheck,
} from 'react-icons/fi';

interface QuadNode {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  label: string;
  category: 'layout' | 'text' | 'agent' | 'physics';
  hue: number;
}

export default function RuneBanner() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Interactive controls
  const [activeTab, setActiveTab] = useState<'matrix' | 'canvas' | 'code'>('matrix');
  const [stiffness, setStiffness] = useState<number>(240);
  const [damping, setDamping] = useState<number>(18);
  const [fps, setFps] = useState<number>(120);
  const [isSnapshotting, setIsSnapshotting] = useState<boolean>(false);
  const [snapshotLogs, setSnapshotLogs] = useState<string[]>([
    'Initialized wgpu Surface (WebGPU Backend)',
    'Loaded Taffy v0.5.2 Layout Tree: 24 active flex nodes',
    'Glyph cache warmed via Parley + HarfRust',
    'Agent headless listener attached on IPC port: 9120',
  ]);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Mouse tracking for the spring canvas
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  // Canvas simulation nodes
  const nodesRef = useRef<QuadNode[]>([]);

  // Initialize nodes grid
  const initNodes = useCallback((width: number, height: number) => {
    const cols = Math.max(4, Math.floor(width / 130));
    const rows = 3;
    const startX = (width - cols * 110) / 2 + 55;
    const startY = (height - rows * 65) / 2 + 35;

    const labels = [
      { text: 'Layout::Taffy', cat: 'layout', hue: 195 },
      { text: 'wgpu::DrawBatch', cat: 'physics', hue: 215 },
      { text: 'Glyph::Parley', cat: 'text', hue: 280 },
      { text: 'Agent::Snapshot', cat: 'agent', hue: 145 },
      { text: 'Spring::RK4', cat: 'physics', hue: 35 },
      { text: 'Tree::Dump', cat: 'agent', hue: 145 },
      { text: 'Shaper::HarfRust', cat: 'text', hue: 280 },
      { text: 'winit::EventLoop', cat: 'layout', hue: 195 },
      { text: 'Instanced::Quads', cat: 'physics', hue: 215 },
      { text: 'Font::Skrifa', cat: 'text', hue: 280 },
      { text: 'Headless::Render', cat: 'agent', hue: 145 },
      { text: 'Theme::TokenSet', cat: 'layout', hue: 35 },
    ] as const;

    const newNodes: QuadNode[] = [];
    let idx = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const item = labels[idx % labels.length];
        const tx = startX + c * 110;
        const ty = startY + r * 65;

        newNodes.push({
          x: tx + (Math.random() - 0.5) * 40,
          y: ty + (Math.random() - 0.5) * 40,
          targetX: tx,
          targetY: ty,
          vx: 0,
          vy: 0,
          width: 96,
          height: 44,
          label: item.text,
          category: item.cat,
          hue: item.hue,
        });
        idx++;
      }
    }
    nodesRef.current = newNodes;
  }, []);

  // Main canvas animation loop (Physics + Instanced Quad Simulation)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initNodes(rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      // Calculate approximate FPS
      frameCount++;
      if (time - fpsTimer >= 500) {
        setFps(Math.round((frameCount * 1000) / (time - fpsTimer)));
        frameCount = 0;
        fpsTimer = time;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw faint architectural grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < rect.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }
      for (let y = 0; y < rect.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      const mouse = mousePosRef.current;
      const nodes = nodesRef.current;

      // Draw interconnecting spring lines between neighboring nodes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 110 * 110) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw each instanced quad
      nodes.forEach((node) => {
        // Spring physics: F = -k * (x - target) - c * v
        const fx = -stiffness * (node.x - node.targetX) - damping * node.vx;
        const fy = -stiffness * (node.y - node.targetY) - damping * node.vy;

        node.vx += fx * dt;
        node.vy += fy * dt;

        // Mouse cursor repulsion force
        if (mouse.active) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 1) {
            const force = (130 - dist) * 12;
            node.vx += (dx / dist) * force * dt;
            node.vy += (dy / dist) * force * dt;
          }
        }

        node.x += node.vx * dt;
        node.y += node.vy * dt;

        // Render Quad mimicking Rune's GPU instanced quad pipeline
        ctx.save();
        ctx.translate(node.x, node.y);

        // Subtle tilt based on velocity
        const angle = Math.max(-0.25, Math.min(0.25, node.vx * 0.002));
        ctx.rotate(angle);

        const w = node.width;
        const h = node.height;

        // Background fill
        ctx.fillStyle = 'rgba(18, 18, 20, 0.85)';
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, 8);
        ctx.fill();

        // Border with category color accent
        ctx.strokeStyle = `hsla(${node.hue}, 80%, 65%, 0.45)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Corner GPU quad indicator dots
        ctx.fillStyle = `hsla(${node.hue}, 90%, 70%, 0.9)`;
        ctx.fillRect(-w / 2 + 5, -h / 2 + 5, 3, 3);
        ctx.fillRect(w / 2 - 8, -h / 2 + 5, 3, 3);

        // Quad text label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, 0, 1);

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initNodes, stiffness, damping]);

  // Handle agent snapshot trigger
  const triggerHeadlessSnapshot = () => {
    if (isSnapshotting) return;
    setIsSnapshotting(true);

    const timestamp = new Date().toISOString().substring(11, 19);
    const newLogs = [
      `[${timestamp}] Headless snapshot captured: frame_0128.png (1920x1080)`,
      `[${timestamp}] Element tree dumped: 24 nodes verified by agent`,
      `[${timestamp}] Zero DOM overhead: 1 draw call @ 120 FPS`,
      ...snapshotLogs.slice(0, 3),
    ];
    setSnapshotLogs(newLogs);

    // Apply impulse to all nodes
    nodesRef.current.forEach((node) => {
      node.vx += (Math.random() - 0.5) * 350;
      node.vy += (Math.random() - 0.5) * 350;
    });

    setTimeout(() => {
      setIsSnapshotting(false);
    }, 1200);
  };

  const copyCode = () => {
    const code = `// Anomaly Rune - Declarative View Definition in Rust
use rune::prelude::*;

#[derive(Default)]
struct AppState {
    counter: Spring<f32>,
}

fn view(state: &AppState) -> impl View {
    vstack((
        text("Rune Native UI Engine")
            .font("GeistMono")
            .size(28.0)
            .color(Color::WHITE),
            
        spring_container(
            button("Agent Headless Verification")
                .on_click(|s| s.trigger_eval()),
        )
        .stiffness(240.0)
        .damping(18.0),
    ))
    .padding(24.0)
    .background(Color::rgba(10, 10, 10, 0.95))
}`;
    navigator.clipboard?.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <section className="w-full bg-[#070708] py-20 px-4 sm:px-6 lg:px-10 border-y border-white/10 relative overflow-hidden flex flex-col items-center">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl w-full relative z-10 flex flex-col gap-10">
        {/* TOP STATUS BAR & BADGES */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-300 font-semibold">
              Anomaly // Rune Engine Architecture
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-neutral-400">
              Rust + wgpu + WebGPU
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/anomalyco/rune"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-neutral-200 hover:text-white transition-all cursor-pointer font-mono"
            >
              <span>github.com/anomalyco/rune</span>
              <FiExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* HERO TITLE & THESIS */}
        <div className="flex flex-col gap-5 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] tracking-widest uppercase font-mono w-fit">
            <FiZap className="w-3 h-3" />
            <span>Next-Gen GPU-Rendered Frontend Paradigm</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white uppercase leading-[1.1]"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Rune: Native GPU UI Framework in Rust
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Crafted by Anomaly, <strong className="text-white font-medium">Rune</strong> fundamentally reimagines
            how user interfaces are rendered. Instead of the browser DOM and CSS trees, Rune renders its entire UI via{' '}
            <code className="text-neutral-200 bg-white/5 px-1.5 py-0.5 rounded font-mono text-xs">wgpu</code> into
            hardware-instanced quads with built-in spring physics, custom Taffy layout calculations, and native headless
            inspection tailored for AI coding agents.
          </p>
        </div>

        {/* INTERACTIVE NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/10">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FiLayers className="w-3.5 h-3.5" />
              <span>Architectural Trade-offs (Pros & Cons)</span>
            </button>

            <button
              onClick={() => setActiveTab('canvas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'canvas'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FiActivity className="w-3.5 h-3.5" />
              <span>Interactive Spring & GPU Quad Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FiCode className="w-3.5 h-3.5" />
              <span>Declarative Rust Architecture</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">●</span> {fps} FPS VSync
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline text-neutral-400">1 Draw Call (Instanced)</span>
          </div>
        </div>

        {/* TAB 1: ARCHITECTURAL PROS & CONS (The core evaluation requested by user) */}
        {activeTab === 'matrix' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* PROS CARD */}
            <div className="p-6 md:p-8 rounded-2xl bg-neutral-900/50 border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>The Breakthroughs (Pros for Web & Apps)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Engine Superpowers
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Pro 1 */}
                  <div className="space-y-1.5">
                    <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                      <span className="text-emerald-400 font-mono text-xs">01</span>
                      Flawless 120Hz UI Performance
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Custom Taffy layout engine, HarfRust/Parley glyph shaping, and GPU-driven spring physics bypass
                      the DOM completely. Zero browser garbage collection spikes, zero CSS reflow cascades, and smooth
                      120 FPS rendering.
                    </p>
                  </div>

                  {/* Pro 2 */}
                  <div className="space-y-1.5">
                    <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                      <span className="text-emerald-400 font-mono text-xs">02</span>
                      True Multiplatform Core
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Write frontend UI once in clean Rust functions. Compiles seamlessly to native binaries on macOS,
                      Windows, Linux, and to WebGPU/Wasm in modern browsers without rewrite.
                    </p>
                  </div>

                  {/* Pro 3 */}
                  <div className="space-y-1.5">
                    <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                      <span className="text-emerald-400 font-mono text-xs">03</span>
                      Agent-Friendly Autonomous Runtime
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Built natively for AI coding agents (Claude, Cursor, Codex). Apps run fully headless without a
                      screen to render direct frame PNGs, dump layout trees, and execute automated UI verification loops.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-500/10 flex items-center justify-between text-[11px] font-mono text-emerald-400/70">
                <span>IDEAL FOR: Creative suites, canvas editors, game UI, agent tools</span>
              </div>
            </div>

            {/* CONS CARD */}
            <div className="p-6 md:p-8 rounded-2xl bg-neutral-900/50 border border-amber-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
                    <FiAlertTriangle className="w-4 h-4" />
                    <span>The Web Design Realities (Cons for Web Use)</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Trade-off Matrix
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Con 1 */}
                  <div className="space-y-1.5">
                    <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                      <span className="text-amber-400 font-mono text-xs">01</span>
                      Poor SEO & Crawler Invisibility
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Search engine bots (Googlebot, Bing) cannot inspect text rasterized inside a WebGPU/Canvas
                      pipeline. Terrible for content-dense websites, marketing portals, and editorial blogs without
                      complex SSR dual-rendering layers.
                    </p>
                  </div>

                  {/* Con 2 */}
                  <div className="space-y-1.5">
                    <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                      <span className="text-amber-400 font-mono text-xs">02</span>
                      Large Initial Load & Wasm Overhead
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Packaging Rust runtime libraries, font shapers, and wgpu pipelines into WebAssembly results in
                      multimegabyte initial download sizes compared to lightweight, progressive HTML/CSS.
                    </p>
                  </div>

                  {/* Con 3 */}
                  <div className="space-y-1.5">
                    <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                      <span className="text-amber-400 font-mono text-xs">03</span>
                      Accessibility (a11y) Barriers
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Bypassing the DOM destroys native screen reader accessibility, browser text selection, find-in-page
                      (Ctrl+F), and assistive OS devices unless an entirely parallel accessibility tree is manually constructed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-amber-500/10 flex items-center justify-between text-[11px] font-mono text-amber-400/70">
                <span>AVOID FOR: Blogs, documentation hubs, SEO-critical landing pages</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE GPU SPRING & QUAD SIMULATOR */}
        {activeTab === 'canvas' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Interactive Canvas Canvas Card */}
            <div
              className="relative w-full h-[380px] sm:h-[420px] rounded-2xl bg-neutral-950 border border-white/10 overflow-hidden cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mousePosRef.current = {
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  active: true,
                };
              }}
              onMouseLeave={() => {
                mousePosRef.current.active = false;
              }}
            >
              {/* Scanline overlay effect when agent snapshotting */}
              {isSnapshotting && (
                <div className="absolute inset-0 bg-emerald-400/10 z-20 pointer-events-none flex flex-col justify-between p-4 border-2 border-emerald-400/50 animate-pulse">
                  <div className="flex justify-between items-center text-xs font-mono text-emerald-400">
                    <span>AGENT_HEADLESS_CAPTURE::RUNNING</span>
                    <span>DUMPING_TAFFY_TREE</span>
                  </div>
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-bounce" />
                </div>
              )}

              {/* The Live Simulation Canvas */}
              <canvas ref={canvasRef} className="w-full h-full block" />

              {/* Interactive Canvas HUD */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none font-mono text-[10px] text-neutral-400 bg-neutral-900/80 backdrop-blur-md p-3 rounded-lg border border-white/10">
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <FiCpu className="w-3.5 h-3.5 text-cyan-400" />
                  Rune Instanced Quad Pipeline
                </span>
                <span>LAYOUT: Taffy Flex Engine</span>
                <span>PHYSICS: RK4 Spring Integrator</span>
                <span>DRAW CALLS: 1 (Batched Quads)</span>
                <span>HOVER: Cursor Repulsion Active</span>
              </div>

              {/* Snapshot Button overlay */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <button
                  onClick={triggerHeadlessSnapshot}
                  disabled={isSnapshotting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs transition-all cursor-pointer shadow-lg backdrop-blur-md disabled:opacity-50"
                >
                  <FiCamera className="w-3.5 h-3.5" />
                  <span>{isSnapshotting ? 'Capturing Frame...' : 'Simulate Agent Snapshot'}</span>
                </button>
              </div>
            </div>

            {/* Simulation Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Spring Stiffness (k):</span>
                  <span className="text-white">{stiffness}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="450"
                  value={stiffness}
                  onChange={(e) => setStiffness(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Spring Damping (c):</span>
                  <span className="text-white">{damping}</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="35"
                  value={damping}
                  onChange={(e) => setDamping(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-neutral-500 text-[11px]">
                  Simulates Rune&apos;s physical spring engine. Hover across the quads to feel non-linear GPU spring elasticity.
                </span>
              </div>
            </div>

            {/* Agent Inspection Stream Logs */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs flex flex-col gap-1.5">
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <FiActivity className="w-3 h-3 text-emerald-400" />
                <span>Headless Agent Inspection Stream</span>
              </div>
              {snapshotLogs.slice(0, 3).map((log, i) => (
                <div key={i} className="text-neutral-300 text-[11px] truncate flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DECLARATIVE RUST CODE VIEW */}
        {activeTab === 'code' && (
          <div className="rounded-2xl bg-neutral-950 border border-white/10 p-5 font-mono text-xs text-neutral-300 relative overflow-hidden animate-fade-in flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                  RUST VIEW
                </span>
                <span>src/views/dashboard.rs</span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer text-[11px]"
              >
                {codeCopied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                <span>{codeCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="overflow-x-auto leading-relaxed text-[11px] text-neutral-300">
              <code>{`// Anomaly Rune - Declarative View Definition in Rust
use rune::prelude::*;

#[derive(Default)]
struct AppState {
    counter: Spring<f32>,
    active_agent: Option<AgentSession>,
}

// Views are pure Rust functions mapping state directly to GPU draw primitives
fn view(state: &AppState) -> impl View {
    vstack((
        text("Rune Native UI Engine")
            .font("GeistMono")
            .size(28.0)
            .color(Color::WHITE),
            
        text("Hardware-accelerated instanced quads via wgpu")
            .size(14.0)
            .color(Color::rgba(255, 255, 255, 0.6)),

        // Spring-physics button with continuous sub-pixel layout
        spring_container(
            button("Trigger Headless Agent Verification")
                .on_click(|s: &mut AppState| {
                    s.counter.set_target(100.0);
                }),
        )
        .stiffness(240.0)
        .damping(18.0),
    ))
    .padding(24.0)
    .background(Color::rgba(10, 10, 10, 0.95))
    .border(1.0, Color::rgba(255, 255, 255, 0.1))
}`}</code>
            </pre>

            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
              <span>Layout engine: Taffy (Rust flexbox) • Shaper: HarfRust • Backend: wgpu</span>
              <span className="text-neutral-400">Dependency: rune = &#123; git = &quot;https://github.com/anomalyco/rune&quot; &#125;</span>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/anomalyco/rune"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] font-mono"
            >
              <span>Explore anomalyco/rune</span>
              <FiArrowUpRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => router.push('/pretext-j')}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs tracking-wider uppercase transition-all cursor-pointer font-mono"
            >
              <span>Launch Pretext-J Lab</span>
            </button>
          </div>

          <div className="text-right text-[11px] font-mono text-neutral-500">
            <span>Engineering showcase by Joel Joshy</span>
          </div>
        </div>
      </div>
    </section>
  );
}
