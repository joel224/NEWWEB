// lib/particleConfig.ts
// Seeded random number generator (deterministic for SSR safety)
export const seededRandom = (seed: number, decimals = 4): number => {
  const x = Math.sin(seed * 9999) * 10000;
  const raw = x - Math.floor(x);
  return Number(raw.toFixed(decimals)); // ✅ Round to 4 decimals
};

export interface ParticleConfig {
  delay: number;
  duration: number;
  size: string; // CSS value with unit
  left: string; // CSS percentage
  top: string;  // CSS percentage
  xRange: [number, number]; // For animation offset
  yRange: [number, number];
}

export const generateParticleConfigs = (count: number): ParticleConfig[] => {
  return Array.from({ length: count }, (_, index) => {
    const rand = (offset = 0) => seededRandom(index + offset);

    return {
      delay: Number((index * 0.3).toFixed(1)),           // ✅ Round delay to 1 decimal
      duration: Number((8 + rand(1) * 4).toFixed(2)),    // ✅ Round duration to 2 decimals
      size: `${(4 + rand(2) * 8).toFixed(4)}px`,         // ✅ Round size to 4 decimals + "px"
      left: `${(rand(3) * 100).toFixed(4)}%`,            // ✅ Round left to 4 decimals + "%"
      top: `${(rand(4) * 100).toFixed(4)}%`,             // ✅ Round top to 4 decimals + "%"
      xRange: [
        Number((rand(5) * 40 - 20).toFixed(2)),          // ✅ Round animation offsets
        Number((rand(6) * 60 - 30).toFixed(2)),
      ],
      yRange: [20, -80] as [number, number],
    };
  });
};

// Reusable animation variants
export const particleAnimation = {
  initial: { opacity: 0, scale: 0, y: 20 },
  animate: (xRange: [number, number], yRange: [number, number]) => ({
    opacity: [0, 0.8, 0] as const,
    scale: [0, 1.2, 0] as const,
    y: yRange,
    x: [0, xRange[0], xRange[1]] as const,
  }),
  transition: (duration: number, delay: number) => ({
    duration,
    delay,
    repeat: Infinity,
    repeatType: "loop" as const,
    ease: "easeOut" as const,
  }),
};