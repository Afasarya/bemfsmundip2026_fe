"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SplitText from "@/components/ui/SplitText";
import Magnetic from "@/components/ui/Magnetic";
import { Icons } from "@/components/ui/Icons";
import { SITE } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/web3agencysaasherosection-BgGpIXFBxyIZiJbWmQvIDimz/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="pointer-events-auto"
          title="Hero 3D Scene"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen flex-col justify-end pb-20 sm:pb-28">
        <div className="container-bara">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-2">
            {/* Left: headline & CTA */}
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full glass-panel px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-bara-gold-lt"
              >
                <span className="h-2 w-2 rounded-full bg-bara-orange-lt animate-flicker" />
                {SITE.cabinet} · BEM FSM UNDIP 2026
              </motion.div>

              <h1 className="font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
                <SplitText
                  text="Bara Berdaya,"
                  trigger="mount"
                  delay={0.5}
                  className="block text-bara-cream"
                />
                <SplitText
                  text="Momentum Berkarya"
                  trigger="mount"
                  delay={0.9}
                  className="block text-gradient-gold"
                />
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Magnetic>
                  <Link href="/tentang" className="btn-bara">
                    Kenali Kabinet
                    <Icons.arrow className="h-4 w-4" />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/informasi" className="btn-ghost">
                    Lihat Informasi
                  </Link>
                </Magnetic>
              </motion.div>
            </div>

            {/* Right: description text */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.6 }}
              className="max-w-md text-sm leading-relaxed text-bara-cream/70 sm:text-base lg:text-right"
            >
              Menyalakan bara semangat dalam momentum perubahan untuk menghadirkan
              kebermanfaatan nyata bagi mahasiswa FSM Undip, Undip, dan masyarakat.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-bara-cream/50"
      >
        <span className="text-[11px] uppercase tracking-[0.3em]">Gulir</span>
        <span className="h-9 w-5 rounded-full border border-bara-cream/30 p-1">
          <span className="block h-2 w-full rounded-full bg-bara-gold-lt" />
        </span>
      </motion.div>
    </section>
  );
}
