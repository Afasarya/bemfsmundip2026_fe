"use client";

import { useRef, useState, ReactNode, MouseEvent } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  href,
  className = "",
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  const baseClass = `relative inline-flex items-center justify-center px-7 py-3.5 rounded-full font-medium text-sm transition-colors ${className}`;

  const inner = (
    <motion.span
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      className="inline-flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as any}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.96 }}
        className={baseClass}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as any}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      className={baseClass}
    >
      {inner}
    </motion.button>
  );
}