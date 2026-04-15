// src/components/OtherVideoComponent.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { useInView } from "framer-motion";

interface OtherVideoComponentProps {
  videoSrc: string;
  poster?: string;
  overlayText?: React.ReactNode;
  onVideoEnd?: () => void;
}

const OtherVideoComponent: React.FC<OtherVideoComponentProps> = ({
  videoSrc,
  poster,
  overlayText,
  onVideoEnd,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPlayedRef = useRef(false);

  // Playback control
  const isVideoInView = useInView(videoRef, { amount: 0.4, once: false });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // PLAY LOGIC
    if (isVideoInView && !hasPlayedRef.current) {
      video.currentTime = 0;
      video.play().catch((err) => {
        console.warn("Video autoplay prevented:", err);
        video.controls = true;
      });
      hasPlayedRef.current = true;
    }

    // RESET LOGIC
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
    // ✅ ADDED pt-24 md:pt-32 HERE: This pushes the content down safely below your navbar!
    <section className="w-full max-w-[1400px] mx-auto text-white px-6 pt-24 md:pt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        
        {/* Left Column: Smart Video */}
        <div className="w-full   relative">
          <div className=" rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50 bg-[#0a0a0a] aspect-[4/5] md:aspect-square lg:aspect-[4/3]">
            <video
              ref={videoRef}
              src={videoSrc}
              poster={poster}
              muted
              playsInline
              preload="metadata"
              onEnded={handleVideoEnd}
              className="w-full h-full pl-4    object-cover"
            />
          </div>
        </div>

        {/* Right Column: Passed Content */}
        <div className="flex flex-col pt-4 md:pt-14">
          {overlayText}
        </div>

      </div>
    </section>
  );
};

export default OtherVideoComponent;