"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

/**
 * Wraps its child and nudges it toward the cursor on hover, easing
 * back to center on leave. Purely presentational — no layout change.
 */
export default function Magnetic({
  children,
  className,
  strength = 0.35,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      className={className}
      style={{ display: "inline-flex" }}
    >
      {children}
    </motion.div>
  );
}
