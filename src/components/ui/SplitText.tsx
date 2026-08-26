"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  active?: boolean;
  /** Animate when in view (default) or immediately on mount. */
  trigger?: "view" | "mount";
};

const container: Variants = {
  hidden: {},
  show: (delay: number) => ({
    transition: { staggerChildren: 0.03, delayChildren: delay },
  }),
};

const letter: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Reveals a headline letter by letter from below. Splits on words so
 * line-breaks stay natural; spaces are preserved.
 *
 * Both "mount" and "view" triggers use whileInView with once:true so the
 * animation fires exactly once and text stays visible on scroll-back.
 * "mount" uses a large positive margin so it triggers instantly.
 */
export default function SplitText({
  text,
  className,
  delay = 0,
  active = true,
  trigger = "view",
}: SplitTextProps) {
  const words = text.split(" ");

  // Mount-triggered headlines must not depend on IntersectionObserver.
  // Smooth-scroll transforms can briefly report them outside the viewport,
  // leaving letters in their hidden state after scrolling back to the top.
  const animateProps =
    trigger === "mount"
      ? {
          animate: active ? ("show" as const) : ("hidden" as const),
        }
      : {
          whileInView: "show" as const,
          viewport: { once: true, margin: "-60px" },
        };

  return (
    <motion.span
      variants={container}
      custom={delay}
      initial="hidden"
      {...animateProps}
      className={cn("inline-block", className)}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {Array.from(word).map((char, ci) => (
            <span key={ci} className="inline-block overflow-hidden">
              <motion.span variants={letter} className="inline-block">
                {char}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}
