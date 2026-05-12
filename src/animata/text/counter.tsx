"use client";

import React, { useEffect, useState } from "react";

export default function Counter({
  targetValue,
  format,
}: {
  targetValue: number;
  format?: (v: number) => string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetValue;
    const duration = 1000;
    const incrementTime = 16;
    const step = (end / duration) * incrementTime;

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        setValue(end);
      } else {
        setValue(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetValue]);

  return <span>{format ? format(value) : Math.floor(value)}</span>;
}
