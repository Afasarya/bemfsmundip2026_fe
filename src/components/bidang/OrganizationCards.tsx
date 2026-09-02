"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { placeholderLogo } from "@/lib/placeholder";
import { UNIT_TYPE_LABELS, type UnitListItem, type UnitType } from "@/lib/types";
import { formatDateShort, unitHref } from "@/lib/format";

const FILTERS = ["Semua", "Tim", "Biro", "Bidang"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_TO_TYPE: Record<Exclude<Filter, "Semua">, UnitType> = {
  Tim: "TEAM",
  Biro: "BUREAU",
  Bidang: "DIVISION",
};

const TONE: Record<UnitType, string> = {
  DIVISION: "border-orange-400/20 bg-orange-400/[0.08] text-orange-300",
  BUREAU: "border-amber-400/20 bg-amber-400/[0.08] text-amber-200",
  TEAM: "border-sky-400/20 bg-sky-400/[0.08] text-sky-300",
};

export default function OrganizationCards() {
  const [filter, setFilter] = useState<Filter>("Semua");
  const { data: units = [], isLoading } = useSWR<UnitListItem[]>(
    "public-units",
    () => apiFetch<UnitListItem[]>("public/organization-units"),
    { revalidateOnFocus: false, dedupingInterval: 60_000 },
  );

  const filtered = useMemo(() => {
    if (filter === "Semua") return units;
    const target = FILTER_TO_TYPE[filter as Exclude<Filter, "Semua">];
    return units.filter((u) => u.type === target);
  }, [units, filter]);

  return (
    <>
      <div className="mt-12 flex flex-wrap gap-2" aria-label="Filter unit organisasi">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              filter === item
                ? "border-bara-orange/50 bg-bara-orange text-white"
                : "border-white/10 bg-white/[0.025] text-white/55 hover:border-white/20 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          layout
          className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((unit, index) => (
              <motion.div
                layout
                key={unit.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, delay: index * 0.025 }}
              >
                <Link
                  href={unitHref(unit.slug)}
                  className="bento-card group flex min-h-[250px] flex-col rounded-3xl p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bara-orange"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#9f2312] shadow-[0_14px_35px_rgba(0,0,0,0.22)]">
                      {unit.logo?.url ? (
                        <Image
                          src={unit.logo.url}
                          alt={`Logo ${unit.name}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <Image
                          src={placeholderLogo(unit.shortName ?? unit.name)}
                          alt={`Logo ${unit.name}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] ${TONE[unit.type]}`}
                    >
                      {UNIT_TYPE_LABELS[unit.type]}
                    </span>
                  </div>
                  <div className="mt-7 flex flex-1 flex-col">
                    {unit.shortName && (
                      <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bara-orange">
                        {unit.shortName}
                      </p>
                    )}
                    <h2 className="font-display text-2xl leading-tight text-white">
                      {unit.name}
                    </h2>
                    {unit.summary && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/50">
                        {unit.summary}
                      </p>
                    )}
                    <span className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold text-white/65 transition-colors group-hover:text-bara-gold">
                      Lihat profil <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!isLoading && filtered.length > 0 && (
        <p className="mt-8 text-xs text-white/30">
          {filtered.length} unit · terakhir diperbarui{" "}
          {formatDateShort(filtered[0]?.updatedAt)}
        </p>
      )}
    </>
  );
}

function SkeletonGrid() {
  return (
    <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="min-h-[250px] animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.015] p-6"
        >
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-2xl bg-white/[0.04]" />
            <div className="h-6 w-16 rounded-full bg-white/[0.04]" />
          </div>
          <div className="mt-7 space-y-2">
            <div className="h-3 w-1/3 rounded bg-white/[0.05]" />
            <div className="h-6 w-3/4 rounded bg-white/[0.05]" />
            <div className="h-3 w-full rounded bg-white/[0.04]" />
            <div className="h-3 w-5/6 rounded bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 grid place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">
      <Building2 className="h-10 w-10 text-white/15" />
      <p className="mt-4 text-sm text-white/55">
        Belum ada unit pada kategori ini.
      </p>
      <p className="mt-1 text-xs text-white/30">
        Tambahkan unit melalui dasbor admin.
      </p>
    </div>
  );
}
