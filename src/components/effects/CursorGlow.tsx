"use client";

import { useEffect, useRef } from "react";

/**
 * Orange glow that follows the cursor. Disabled on touch devices
 * and when the user prefers reduced motion.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || isTouch) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onDown = () => el.classList.add("scale-150");
    const onUp = () => el.classList.remove("scale-150");

    const loop = () => {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      el.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return <div ref={ref} className="cursor-glow hidden md:block" aria-hidden="true" />;
}
