import React from "react";
import { cn } from "@/lib/utils";

interface AvatarListProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function AvatarList({ size = "md", className }: AvatarListProps) {
  const sizeClasses = {
    sm: "size-6 text-xs",
    md: "size-8 text-sm",
    lg: "size-10 text-base",
  };

  const avatars = [
    "https://api.dicebear.com/8.x/lorelei/svg?seed=Alice",
    "https://api.dicebear.com/8.x/lorelei/svg?seed=Bob",
    "https://api.dicebear.com/8.x/lorelei/svg?seed=Charlie",
    "https://api.dicebear.com/8.x/lorelei/svg?seed=Diana",
  ];

  return (
    <div className={cn("flex -space-x-2", className)}>
      {avatars.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Avatar ${i}`}
          className={cn("rounded-full border-2 border-white bg-zinc-200", sizeClasses[size])}
        />
      ))}
      <div className={cn("flex items-center justify-center rounded-full border-2 border-white bg-zinc-100 font-medium text-zinc-600", sizeClasses[size])}>
        +
      </div>
    </div>
  );
}
