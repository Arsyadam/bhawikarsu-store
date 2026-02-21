"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StarProps {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
}

export const FloatingStars = () => {
  const [stars, setStars] = useState<StarProps[]>([]);

  useEffect(() => {
    // Generate random stars on the client side only to avoid hydration mismatch
    const newStars = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10 * -1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes drift {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translate(100px, -100px) rotate(360deg) scale(1.5); opacity: 0; }
        }
        .star-element {
          animation: drift linear infinite;
        }
      `}</style>
      {stars.map((star) => (
        <div
          key={star.id}
          className="star-element absolute opacity-0"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary fill-current filter drop-shadow-[0_0_8px_rgba(255,49,49,0.5)]">
            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
