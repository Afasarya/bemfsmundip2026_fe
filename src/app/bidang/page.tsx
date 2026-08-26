"use client";

import { motion } from "framer-motion";
import OrganizationCards from "@/components/bidang/OrganizationCards";

export default function BidangPage() {
  return (
    <div className="relative bg-bara-bg-dark pb-24 pt-32">
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-20 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-bara-red/10 blur-[120px]"
      />

      <section className="relative mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-kicker">Struktur Kabinet</p>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] md:text-7xl">
            Satu struktur, <span className="italic gradient-text">banyak gerak.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
            Kenali tim, biro, dan bidang yang menjaga Bara Momentum tetap menyala.
            Pilih setiap unit untuk membaca peran, arah strategis, dan orang di balik geraknya.
          </p>
        </motion.div>

        <OrganizationCards />
      </section>
    </div>
  );
}