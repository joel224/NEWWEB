import React from "react";
import { cn } from "@/lib/utils";

export default function WideCard({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full items-center gap-4 rounded-xl border bg-white/50 p-4 shadow-sm", className)}>
      <div className="size-10 shrink-0 rounded-full bg-blue-300"></div>
      <div className="flex w-full flex-col gap-2">
        <div className="h-3 w-1/3 rounded bg-blue-300"></div>
        <div className="h-2 w-full rounded bg-blue-200"></div>
        <div className="h-2 w-2/3 rounded bg-blue-200"></div>
      </div>
    </div>
  );
}
