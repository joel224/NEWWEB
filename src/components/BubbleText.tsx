"use client";
import React, { useEffect, useRef } from "react";

const BubbleText = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const spans = containerRef.current?.querySelectorAll("span") as NodeListOf<HTMLSpanElement>;
    if (!spans || spans.length === 0) return;

    // Wait a brief moment after mount before triggering the wave
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        // Reset all spans to base state
        spans.forEach(span => {
          span.style.fontWeight = ""; // empty string removes the inline style to fallback to CSS/inherit
        });

        // Finish the wave
        if (currentIndex >= spans.length + 1) {
          clearInterval(interval);
          return;
        }

        // Center bubble
        if (currentIndex < spans.length) {
          spans[currentIndex].style.fontWeight = "900";
        }
        
        // Left neighbor
        if (currentIndex - 1 >= 0 && currentIndex - 1 < spans.length) {
          spans[currentIndex - 1].style.fontWeight = "600";
        }
        
        // Right neighbor
        if (currentIndex + 1 >= 0 && currentIndex + 1 < spans.length) {
          spans[currentIndex + 1].style.fontWeight = "600";
        }

        currentIndex++;
      }, 100); // Speed of the wave across letters

    }, 800); // Delay after page load

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <span ref={containerRef}>
      {text.split("").map((child, idx) => (
        <span
          key={idx}
          style={{
            transition: "0.35s font-weight ease",
          }}
        >
          {child}
        </span>
      ))}
    </span>
  );
};

export default BubbleText;
