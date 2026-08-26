"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { Icons } from "@/components/ui/Icons";
import { DIVISIONS } from "@/data/site";

export default function BidangGrid() {
  return (
    <section className="section-pad">
      <div className="container-bara">
        <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIVISIONS.map((div) => {
            const Icon = Icons[div.icon as keyof typeof Icons] ?? Icons.flame;
            return (
              <Reveal.Item key={div.name}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative h-full overflow-hidden rounded-3xl glass-panel p-7 transition-all duration-300 hover:border-bara-orange/50 hover:shadow-ember-lg"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-bara-orange/0 blur-2xl transition-all duration-500 group-hover:bg-bara-orange/40" />

                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-bara-orange-lt/20 to-bara-red/20 text-bara-gold-lt ring-1 ring-bara-orange/30 transition-all duration-300 group-hover:from-bara-orange-lt group-hover:to-bara-red group-hover:text-bara-cream group-hover:shadow-ember">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="rounded-full border border-bara-gold/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-bara-gold-lt">
                      {div.type}
                    </span>
                  </div>

                  <h3 className="relative mt-5 font-display text-2xl text-bara-cream">
                    {div.name}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-bara-cream/65">
                    {div.description}
                  </p>
                </motion.div>
              </Reveal.Item>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
