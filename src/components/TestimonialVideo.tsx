// src/components/TestimonialVideo.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { useInView, motion } from "framer-motion";

interface TestimonialVideoProps {
  videoSrc: string;
  poster?: string;
  overlayText?: React.ReactNode;
  onVideoEnd?: () => void;
}

const TestimonialVideo: React.FC<TestimonialVideoProps> = ({
  videoSrc,
  poster,
  overlayText,
  onVideoEnd,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPlayedRef = useRef(false);

  const isVideoInView = useInView(videoRef, { amount: 0.4, once: false });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVideoInView && !hasPlayedRef.current) {
      video.currentTime = 0;
      video.play().catch((err) => {
        console.warn("Video autoplay prevented:", err);
        video.controls = true;
      });
      hasPlayedRef.current = true;
    }

    if (!isVideoInView && hasPlayedRef.current) {
      hasPlayedRef.current = false;
    }
  }, [isVideoInView]);

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (video) video.pause();
    onVideoEnd?.();
  };

  return (
    // ✅ 1. Wrap the entire card in a motion.div to handle the automatic cinematic zoom
    <motion.div 
      initial={{ scale: 1 }}
      animate={{ scale: isVideoInView ? 1.05 : 1 }} // Auto-zooms to 1.05 when in view
      transition={{ duration: 2, ease: "easeOut" }} // Nice, slow cinematic duration
      className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl border border-gray-800/50 relative bg-black overflow-hidden aspect-video"
    >
      
      {/* 1. Animated Video Container (Left Side) */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: isVideoInView ? "55%" : "100%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-0 h-full z-10"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover" 
        />
      </motion.div>

      {/* 2. Text Container (Right Side with Curved Edge) */}
      {overlayText && (
        <motion.div 
          className="absolute right-0 top-0 w-[52%] h-full z-20 flex items-center justify-center p-12 pointer-events-none bg-[#0a0a0a]"
          style={{ clipPath: "ellipse(100% 150% at 100% 50%)" }}
          initial={{ opacity: 0, x: "10vw", scale: 0.95, filter: "blur(10px)" }}
          animate={
            isVideoInView 
              ? { opacity: 1, x: 0, scale: 1, skewX: 0, filter: "blur(0px)" }
              : { opacity: 0, x: "40vw", scale: 0.95, skewX: -15, filter: "blur(12px)" }
          }
          transition={
            isVideoInView 
              ? { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 } 
              : { duration: 0.4, ease: [0.7, -0.05, 0.9, 0.5] } 
          }
        >
          <div className="w-full h-full flex flex-col justify-center items-start pl-10">
            {overlayText}
          </div>
        </motion.div>
      )}

      {/* 3. Decorative Elements */}
      <div className="absolute inset-0 flex items-end justify-end pointer-events-none z-30 p-6">
        <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialVideo;