"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Icons } from "@/components/ui/Icons";
import { COMPANY_PROFILE } from "@/data/site";

/**
 * Lazy YouTube facade: shows the thumbnail + pulse play button,
 * only loads the iframe after the user clicks (better performance).
 */
export default function VideoSection() {
  const [active, setActive] = useState(false);
  const { youtubeId, title, subtitle } = COMPANY_PROFILE;
  const thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <section className="section-pad relative">
      <div className="container-bara">
        <SectionHeading
          eyebrow="Company Profile"
          title="Kenali Kami Lebih Dekat"
          description={subtitle}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-4xl"
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-bara-orange/20 blur-2xl" />
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-bara-orange/30 shadow-ember-lg">
            {active ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setActive(true)}
                aria-label={`Putar video: ${title}`}
                className="group relative block h-full w-full"
              >
                <Image
                  src={thumb}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-bara-bg-dark/80 via-bara-bg-dark/20 to-transparent" />

                {/* Pulse play */}
                <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
                  <span className="absolute h-20 w-20 animate-pulse-ring rounded-full bg-bara-orange/60" />
                  <span className="absolute h-20 w-20 animate-pulse-ring rounded-full bg-bara-orange/40 [animation-delay:0.6s]" />
                  <span className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-bara-orange-lt to-bara-red text-bara-cream shadow-ember transition-transform duration-300 group-hover:scale-110">
                    <Icons.play className="ml-1 h-8 w-8" />
                  </span>
                </span>

                <span className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="block font-display text-2xl text-bara-cream sm:text-3xl">
                    {title}
                  </span>
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
