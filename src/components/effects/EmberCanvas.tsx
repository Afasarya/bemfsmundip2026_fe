"use client";

import { useEffect, useRef } from "react";

type Ember = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  life: number;
  maxLife: number;
};

/**
 * Floating ember particles rendered on a full-screen canvas.
 * Skips all animation when the user prefers reduced motion.
 */
export default function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let embers: Ember[] = [];
    let width = 0;
    let height = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor(width / 22));
      embers = Array.from({ length: count }, () => spawn());
    };

    const spawn = (): Ember => {
      const maxLife = 200 + Math.random() * 260;
      return {
        x: Math.random() * width,
        y: height + Math.random() * height,
        r: 0.6 + Math.random() * 2.4,
        vy: -(0.2 + Math.random() * 0.8),
        vx: (Math.random() - 0.5) * 0.4,
        life: 0,
        maxLife,
      };
    };

    const colors = ["#FF8324", "#F25C05", "#F5C542", "#FFD56B"];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.life += 1;
        const t = e.life / e.maxLife;
        const alpha = Math.sin(t * Math.PI) * 0.8;
        const color = colors[i % colors.length];
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
        if (e.life >= e.maxLife || e.y < -10) {
          embers[i] = spawn();
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
