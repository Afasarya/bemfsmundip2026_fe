"use client";

import { motion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

/** Shared header band for inner pages. */
export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pb-10 pt-36 sm:pt-44">
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-bara-orange/25 blur-[110px]" />
      <div className="container-bara relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full glass-panel px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-bara-gold-lt"
        >
          <span className="h-2 w-2 rounded-full bg-bara-orange-lt animate-flicker" />
          {eyebrow}
        </motion.span>

        <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl leading-[1.08] sm:text-6xl lg:text-7xl">
          <SplitText text={title} trigger="mount" delay={0.2} className="text-gradient-gold" />
        </h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-bara-cream/75 sm:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
