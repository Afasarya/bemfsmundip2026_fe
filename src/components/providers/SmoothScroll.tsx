"use client";

import { type ReactNode, useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

/**
 * Global buttery smooth scroll. Drives Lenis from GSAP's ticker so
 * ScrollTrigger and Lenis share one clock (no jitter / double-RAF),
 * and refreshes ScrollTrigger on every Lenis scroll event.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [useNativeScroll, setUseNativeScroll] = useState(false);

  useEffect(() => {
    setUseNativeScroll(
      window.matchMedia("(max-width: 767px), (pointer: coarse), (prefers-reduced-motion: reduce)").matches
    );
  }, []);

  if (useNativeScroll) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
