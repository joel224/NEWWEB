import React from "react";
import { cn } from "@/lib/utils";

interface BarChartProps {
  items: { progress: number; label: string; className?: string }[];
  height?: number;
}

export default function BarChart({ items, height = 100 }: BarChartProps) {
  return (
    <div className="flex w-full items-end justify-between gap-1" style={{ height }}>
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center gap-1 w-full h-full justify-end">
          <div
            className={cn("w-full transition-all duration-500", item.className)}
            style={{ height: `${item.progress}%` }}
          />
          <span className="text-xs font-semibold text-neutral-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
