"use client";

import React, { useEffect, useState } from "react";

export default function TypingText({
  text,
  waitTime = 2000,
  alwaysVisibleCount = 0,
}: {
  text: string;
  waitTime?: number;
  alwaysVisibleCount?: number;
}) {
  const [displayedText, setDisplayedText] = useState(text.substring(0, alwaysVisibleCount));
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = alwaysVisibleCount;
    if (index >= text.length) {
      setIsTyping(false);
      return;
    }

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, alwaysVisibleCount]);

  return (
    <span>
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
}
