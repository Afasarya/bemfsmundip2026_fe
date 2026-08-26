"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ORGANIZATION_UNITS } from "@/data/organization";

const filters = ["Semua", "Tim", "Biro", "Bidang"] as const;
type Filter = (typeof filters)[number];

export default function OrganizationCards() {
  const [filter, setFilter] = useState<Filter>("Semua");
  const units = filter === "Semua" ? ORGANIZATION_UNITS : ORGANIZATION_UNITS.filter((unit) => unit.type === filter);

  return (
    <>
      <div className="mt-12 flex flex-wrap gap-2" aria-label="Filter unit organisasi">
        {filters.map((item) => (
          <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${filter === item ? "border-bara-orange/50 bg-bara-orange text-white" : "border-white/10 bg-white/[0.025] text-white/55 hover:border-white/20 hover:text-white"}`}>
            {item}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {units.map((unit, index) => (
            <motion.div layout key={unit.slug} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35, delay: index * 0.025 }}>
              <Link href={`/bidang/${unit.slug}`} className="bento-card group flex min-h-[250px] flex-col rounded-3xl p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bara-orange">
                <div className="flex items-start justify-between gap-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#9f2312] shadow-[0_14px_35px_rgba(0,0,0,0.22)]">
                    <Image src={unit.logo} alt={`Logo ${unit.name}`} fill sizes="80px" className="object-cover" />
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">{unit.type}</span>
                </div>
                <div className="mt-7 flex flex-1 flex-col">
                  <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bara-orange">{unit.shortName}</p>
                  <h2 className="font-display text-2xl leading-tight text-white">{unit.name}</h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/50">{unit.summary}</p>
                  <span className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold text-white/65 transition-colors group-hover:text-bara-gold">Lihat profil <ArrowUpRight className="h-3.5 w-3.5" /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
