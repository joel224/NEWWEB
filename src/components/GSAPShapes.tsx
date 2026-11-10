import React from 'react';

// 1. Clover Shape (4 rounded-corner quadrant petals)
export function ShapeClover({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

// 2. Gear / Cog Shape (8-pointed stepped cross)
export function ShapeGear({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 152 70.059 L 201.539 20.519 L 235.48 54.461 L 185.941 104 L 256 104 L 256 152 L 185.941 152 L 235.48 201.539 L 201.539 235.48 L 152 185.941 L 152 256 L 104 256 L 104 185.941 L 54.46 235.48 L 20.52 201.539 L 70.059 152 L 0 152 L 0 104 L 70.059 104 L 20.519 54.46 L 54.461 20.52 L 104 70.059 L 104 0 L 152 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

// 3. Rings / 4-Bubble Chain Shape
export function ShapeRings({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 192 0 C 227.346 0 256 28.654 256 64 C 256 99.346 227.346 128 192 128 C 227.346 128 256 156.654 256 192 C 256 227.346 227.346 256 192 256 C 156.654 256 128 227.346 128 192 C 128 227.346 99.346 256 64 256 C 28.654 256 0 227.346 0 192 C 0 156.654 28.654 128 64 128 C 28.654 128 0 99.346 0 64 C 0 28.654 28.654 0 64 0 C 99.346 0 128 28.654 128 64 C 128 28.654 156.654 0 192 0 Z M 128 100 C 112.536 100 100 112.536 100 128 C 100 143.464 112.536 156 128 156 C 143.464 156 156 143.464 156 128 C 156 112.536 143.464 100 128 100 Z"
        fill="currentColor"
      />
    </svg>
  );
}

// 4. Starburst / 16-Ray Asterisk Shape
export function ShapeStarburst({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 108.89 108.89" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M58.34,0h-7.78v34.44L37.66,2.51l-7.21,2.91,13.24,32.76L18.7,13.2l-5.5,5.5,23.95,23.95L6.11,29.08l-3.11,7.13,32.83,14.35H0v7.78h35.83L3,72.68l3.11,7.13,31.03-13.56-23.95,23.95,5.5,5.5,24.98-24.98-13.24,32.76,7.21,2.91,12.9-31.93v34.44h7.78v-34.44l12.9,31.93,7.21-2.91-13.23-32.76,24.98,24.98,5.5-5.5-23.95-23.95,31.03,13.56,3.11-7.13-32.83-14.35h35.83v-7.78h-35.83l32.83-14.35-3.11-7.13-31.03,13.56,23.95-23.95-5.5-5.5-24.98,24.98,13.23-32.76-7.21-2.91-12.9,31.93V0Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

// 5. Pinwheel / Geometric Blade Star
export function ShapePinwheel({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 101.94 107.28" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor">
        <polygon points="60.01 0 53.23 11.74 53.23 32.06 68.8 5.08 60.01 0" />
        <polygon points="33.14 5.08 48.72 32.06 48.72 11.74 41.94 0 33.14 5.08" />
        <polygon points="33.41 40.9 17.83 13.92 9.03 19 15.81 30.74 33.41 40.9" />
        <polygon points="13.56 34.64 0 34.64 0 44.8 31.16 44.8 13.56 34.64" />
        <polygon points="31.16 62.48 0 62.48 0 72.64 13.56 72.64 31.16 62.48" />
        <polygon points="15.81 76.54 9.03 88.29 17.83 93.37 33.41 66.38 15.81 76.54" />
        <polygon points="41.94 107.28 48.72 95.54 48.72 75.22 33.14 102.2 41.94 107.28" />
        <polygon points="53.23 95.54 60.01 107.28 68.8 102.2 53.23 75.22 53.23 95.54" />
        <polygon points="68.53 66.38 84.11 93.37 92.91 88.29 86.13 76.54 68.53 66.38" />
        <polygon points="88.38 72.64 101.94 72.64 101.94 62.48 70.79 62.48 88.38 72.64" />
        <polygon points="70.79 44.8 101.94 44.8 101.94 34.64 88.38 34.64 70.79 44.8" />
        <polygon points="86.13 30.74 92.91 19 84.11 13.92 68.53 40.9 86.13 30.74" />
      </g>
    </svg>
  );
}

// 6. Chevron / Forward Slash Stripes
export function ShapeChevron({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 109.32 105.85" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor">
        <polygon points="45.42 0 10.14 105.85 0 105.85 35.28 0 45.42 0" />
        <polygon points="59.85 0 24.57 105.85 14.43 105.85 49.71 0 59.85 0" />
        <polygon points="74.29 0 39.01 105.85 28.87 105.85 64.15 0 74.29 0" />
        <polygon points="109.32 105.85 99.18 105.85 72.44 25.62 77.5 10.4 109.32 105.85" />
        <polygon points="94.88 105.85 84.74 105.85 65.22 47.27 70.28 32.06 94.88 105.85" />
        <polygon points="80.45 105.85 70.31 105.85 58 68.92 63.07 53.71 80.45 105.85" />
      </g>
    </svg>
  );
}

// 7. Gradient Flower (The famous GSAP iridescent floral star)
export function ShapeGradientFlower({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <img
      src="/shapes/actualyshapes/shape-gradient-flower.svg"
      alt="GSAP Flower"
      className={`object-contain pointer-events-none select-none inline-block ${className}`}
    />
  );
}

