"use client";

import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-bara-gold-lt">
            <span className="h-1.5 w-1.5 rounded-full bg-bara-orange-lt animate-flicker" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <h2 className="mt-5 font-display text-4xl leading-tight text-bara-cream sm:text-5xl">
        <SplitText text={title} className="text-gradient-gold" />
      </h2>
      {description && (
        <Reveal>
          <p className="mt-4 text-base leading-relaxed text-bara-cream/70 sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
