"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { Icons, type IconKey } from "@/components/ui/Icons";
import { DATABASE_CARDS } from "@/data/site";

export default function DatabaseSection() {
  return (
    <section className="section-pad relative">
      <div className="container-bara">
        <SectionHeading
          eyebrow="Pusat Layanan"
          title="Database Informasi"
          description="Akses cepat ke kanal informasi dan layanan unggulan untuk seluruh mahasiswa FSM Undip."
        />

        <Reveal stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DATABASE_CARDS.map((card) => {
            const Icon = Icons[card.icon as IconKey] ?? Icons.flame;
            return (
              <Reveal.Item key={card.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={card.href}
                    className="group relative block h-full overflow-hidden rounded-3xl glass-panel p-7 transition-all duration-300 hover:border-bara-orange/50 hover:shadow-ember-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bara-gold-lt"
                  >
                    {/* hover glow */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-bara-orange/0 blur-2xl transition-all duration-500 group-hover:bg-bara-orange/40" />

                    <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-bara-orange-lt/20 to-bara-red/20 text-bara-gold-lt ring-1 ring-bara-orange/30 transition-all duration-300 group-hover:from-bara-orange-lt group-hover:to-bara-red group-hover:text-bara-cream group-hover:shadow-ember">
                      <Icon className="h-7 w-7" />
                    </span>

                    <h3 className="relative mt-5 font-display text-2xl text-bara-cream">
                      {card.title}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-bara-cream/65">
                      {card.description}
                    </p>

                    <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-bara-gold-lt opacity-0 transition-all duration-300 group-hover:opacity-100">
                      Selengkapnya
                      <Icons.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              </Reveal.Item>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
