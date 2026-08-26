"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Positive moves down as you scroll, negative moves up. */
  speed?: number;
};

/**
 * GSAP ScrollTrigger parallax. Disabled under prefers-reduced-motion.
 */
export default function Parallax({
  children,
  className,
  speed = 80,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={cn(className)} aria-hidden="true">
      {children}
    </div>
  );
}
