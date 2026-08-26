"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import Magnetic from "@/components/ui/Magnetic";
import { Icons } from "@/components/ui/Icons";
import { SITE } from "@/data/site";

export default function CtaSection() {
  return (
    <section className="section-pad relative">
      <div className="container-bara">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] border border-bara-orange/30 bg-gradient-to-br from-bara-red/40 via-bara-maroon/50 to-bara-bg-dark p-10 text-center shadow-ember-lg sm:p-16"
        >
          {/* glow accents */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-bara-orange/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-bara-gold/20 blur-3xl" />
          <div className="absolute inset-0 bg-noise opacity-[0.04]" />

          <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-bara-orange-lt to-bara-red shadow-ember">
            <Icons.flame className="h-9 w-9 animate-flicker text-bara-cream" />
          </span>

          <h2 className="relative mt-6 font-display text-4xl leading-tight sm:text-6xl">
            <SplitText
              text="Mari Nyalakan Bara Bersama"
              className="text-gradient-gold"
            />
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-bara-cream/75 sm:text-lg">
            Jadilah bagian dari momentum perubahan. Ikuti kanal resmi kami dan
            jangan lewatkan setiap informasi terbaru dari {SITE.cabinet}.
          </p>

          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bara"
              >
                <Icons.instagram className="h-5 w-5" />
                Ikuti {SITE.instagram}
              </a>
            </Magnetic>
            <Magnetic>
              <Link href="/bidang" className="btn-ghost">
                Jelajahi Bidang & Biro
                <Icons.arrow className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
