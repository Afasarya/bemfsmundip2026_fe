"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import Magnetic from "@/components/ui/Magnetic";
import Parallax from "@/components/effects/Parallax";
import { Icons } from "@/components/ui/Icons";
import { CORE_VALUES, VISI } from "@/data/site";

export default function VisionTeaser() {
  return (
    <section className="section-pad relative overflow-hidden">
      {/* parallax ember accents */}
      <Parallax speed={-60} className="pointer-events-none absolute left-6 top-10 opacity-40">
        <Icons.flame className="h-24 w-24 text-bara-orange/40" />
      </Parallax>
      <Parallax speed={90} className="pointer-events-none absolute bottom-10 right-8 opacity-30">
        <Icons.flame className="h-32 w-32 text-bara-gold/40" />
      </Parallax>

      <div className="container-bara">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-bara-gold-lt">
                <span className="h-1.5 w-1.5 rounded-full bg-bara-orange-lt animate-flicker" />
                Visi Kami
              </span>
            </Reveal>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
              <SplitText
                text="Ruang Progresif untuk Potensi Mahasiswa"
                className="text-gradient-gold"
              />
            </h2>
            <Reveal>
              <p className="mt-5 text-base leading-relaxed text-bara-cream/75 sm:text-lg">
                {VISI}
              </p>
            </Reveal>
            <Reveal>
              <div className="mt-8">
                <Magnetic>
                  <Link href="/tentang" className="btn-bara">
                    Filosofi & Misi Lengkap
                    <Icons.arrow className="h-4 w-4" />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <Reveal stagger className="grid gap-4 sm:grid-cols-2">
            {CORE_VALUES.map((value) => {
              const Icon = Icons[value.icon as keyof typeof Icons] ?? Icons.spark;
              return (
                <Reveal.Item key={value.title}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="h-full rounded-2xl glass-panel p-6 transition-shadow hover:shadow-ember"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-bara-orange-lt to-bara-red text-bara-cream shadow-ember">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 font-display text-xl text-bara-cream">
                      {value.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-bara-cream/65">
                      {value.description}
                    </p>
                  </motion.div>
                </Reveal.Item>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
