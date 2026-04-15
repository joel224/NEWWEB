"use client";

import { createContext, useContext, useState } from "react";

type RevealContextType = {
  isRevealed: boolean;
  setIsRevealed: (value: boolean) => void;
};

const RevealContext = createContext<RevealContextType | undefined>(undefined);

export function RevealProvider({ children }: { children: React.ReactNode }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <RevealContext.Provider value={{ isRevealed, setIsRevealed }}>
      {children}
    </RevealContext.Provider>
  );
}

export function useReveal() {
  const context = useContext(RevealContext);
  if (context === undefined) {
    throw new Error("useReveal must be used within a RevealProvider");
  }
  return context;
}