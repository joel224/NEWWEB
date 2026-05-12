import React from "react";
import { cn } from "@/lib/utils";

export default function Report({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm", className)}>
      <div className="h-4 w-1/2 rounded bg-zinc-200"></div>
      <div className="mt-2 space-y-2">
        <div className="h-2 w-full rounded bg-zinc-100"></div>
        <div className="h-2 w-5/6 rounded bg-zinc-100"></div>
        <div className="h-2 w-4/6 rounded bg-zinc-100"></div>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="h-8 w-8 rounded-full bg-zinc-200"></div>
        <div className="h-6 w-16 rounded bg-green-200"></div>
      </div>
    </div>
  );
}
