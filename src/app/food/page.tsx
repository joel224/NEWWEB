"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const products = [
  {
    id: "prod-1",
    title: "Swis Grilled Chicken ",
    price: "$18.50",
    videoSrc: "/Video Project 2 (2).mp4",
    desc: "Freshly grilled salmon over organic quinoa, avocado, edamame, mango, sesame seeds, with a house-made miso dressing.",
  },
  {
    id: "prod-2",
    title: "Spicy Tuna Crunch",
    price: "$16.00",
    videoSrc: "/output (11).mp4",
    desc: "Sriracha marinated tuna, crispy tempura flakes, cucumber, scallions, over sushi rice with a spicy mayo drizzle.",
  },
];

export default function FoodProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);

  const playVideo = (index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.currentTime = 0;
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const animateContentIn = (index: number, fromDirection: "bottom" | "top") => {
    const content = contentRefs.current[index];
    if (!content) return;
    const els = content.querySelectorAll(".anim");
    gsap.killTweensOf(els);
    gsap.fromTo(
      els,
      { y: fromDirection === "bottom" ? 24 : -24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.055,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  };

  const animateContentOut = (index: number, toDirection: "top" | "bottom") => {
    const content = contentRefs.current[index];
    if (!content) return;
    const els = content.querySelectorAll(".anim");
    gsap.killTweensOf(els);
    gsap.to(els, {
      y: toDirection === "top" ? -16 : 16,
      opacity: 0,
      duration: 0.25,
      stagger: 0.03,
      ease: "power2.in",
    });
  };

  const goToSlide = (nextIndex: number) => {
    if (isAnimating.current) return;
    if (nextIndex < 0 || nextIndex >= products.length) return;
    if (nextIndex === currentIndex.current) return;

    isAnimating.current = true;
    const prev = currentIndex.current;
    const goingDown = nextIndex > prev;

    const prevSlide = slideRefs.current[prev];
    const nextSlide = slideRefs.current[nextIndex];

    // Prepare next slide just off-screen
    gsap.set(nextSlide, { y: goingDown ? "100%" : "-100%" });

    // Content out on current
    animateContentOut(prev, goingDown ? "top" : "bottom");

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndex.current = nextIndex;
        setActiveIndex(nextIndex);
        isAnimating.current = false;
        playVideo(nextIndex);
        animateContentIn(nextIndex, goingDown ? "bottom" : "top");
      },
    });

    // Slide out current
    tl.to(
      prevSlide,
      {
        y: goingDown ? "-10%" : "10%",
        duration: 0.2,
        ease: "expo.inOut",
      },
      0
    );

    // Slide in next
    tl.to(
      nextSlide,
      {
        y: "0%",
        duration: 0.3,
        ease: "expo.inOut",
      },
      0
    );
  };

  useEffect(() => {
    // Position all slides
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      gsap.set(slide, { y: i === 0 ? "0%" : "100%" });
    });

    // First slide content in
    animateContentIn(0, "bottom");

    // First video
    setTimeout(() => playVideo(0), 150);

    // Wheel
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      if (e.deltaY > 30) goToSlide(currentIndex.current + 1);
      else if (e.deltaY < -30) goToSlide(currentIndex.current - 1);
    };

    // Touch
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        goToSlide(currentIndex.current + (delta > 0 ? 1 : -1));
      }
    };

    // Keyboard
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goToSlide(currentIndex.current + 1);
      if (e.key === "ArrowUp") goToSlide(currentIndex.current - 1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-white font-sans text-gray-900">
      <main className="relative h-full w-full">
        {products.map((product, i) => (
          <div
            key={product.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center w-full h-full px-6 md:px-12 lg:px-24"
            style={{ willChange: "transform" }}
          >
            <div
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-8xl w-full"
            >
              {/* Video */}
              <div className="anim w-full flex justify-center">
                <div className="relative w-full max-w-md aspect-[3/5] rounded-[2rem] overflow-hidden bg-gray-50 shadow-lg border border-gray-100">
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={product.videoSrc}
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col space-y-6">
                <div className="anim">
                  <h1 className="text-4xl md:text-5xl font-medium text-[#134D49] leading-tight mb-2">
                    {product.title.split(" ").slice(0, 2).join(" ")}
                    <br />
                    {product.title.split(" ").slice(2).join(" ")}
                  </h1>
                  <p className="text-2xl font-medium text-gray-900 mt-2">
                    {product.price}
                  </p>
                </div>

                <p className="anim text-gray-600 text-sm leading-relaxed max-w-md">
                  {product.desc}
                </p>

                <div className="anim space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Customize:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Extra Avocado (+ $2.00)</li>
                    <li>• Spicy Mayo (+ $1.00)</li>
                    <li>• Nutrtion{" >"}</li>
                  </ul>
                </div>

                <div className="anim flex items-center space-x-4 pt-2">
                  <span className="text-sm font-semibold text-gray-900">
                    Quantity:
                  </span>
                  <div className="flex items-center bg-gray-50 rounded-full border border-gray-100">
                    <button
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="anim flex flex-col space-y-3 pt-6 max-w-sm">
                  <button className="w-full py-3.5 bg-[#2A827B] hover:bg-[#1B5E59] text-white rounded-full font-medium transition-colors duration-200 shadow-md">
                    Add to Cart
                  </button>
                  <button className="w-full py-3.5 bg-transparent border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 rounded-full font-medium transition-colors duration-200">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Dot indicators */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                width: "6px",
                height: activeIndex === i ? "24px" : "6px",
                borderRadius: "999px",
                background: activeIndex === i ? "#2A827B" : "#D1D5DB",
                transition: "height 0.3s ease, background 0.3s ease",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}