"use client";

import React, { useEffect, useState } from "react";

export default function Ticker({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    let current = 0;
    const target = parseFloat(value);
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }
    const interval = setInterval(() => {
      current += 0.1;
      if (current >= target) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(current.toFixed(1));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [value]);

  return <span>{displayValue}</span>;
}
