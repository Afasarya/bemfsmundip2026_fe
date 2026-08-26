"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icons } from "@/components/ui/Icons";
import { ARTICLES, INFO_CATEGORIES } from "@/data/site";
import { cn } from "@/lib/utils";

const categoryTone: Record<string, string> = {
  Lomba: "from-bara-orange to-bara-red",
  Beasiswa: "from-bara-gold to-bara-orange",
  Magang: "from-bara-red to-bara-maroon",
  Umum: "from-bara-ember to-bara-maroon",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function InfoFeed() {
  const [active, setActive] = useState<(typeof INFO_CATEGORIES)[number]>("Semua");

  const filtered = useMemo(() => {
    if (active === "Semua") return ARTICLES;
    return ARTICLES.filter((a) => a.category === active);
  }, [active]);

  return (
    <section className="section-pad">
      <div className="container-bara">
        {/* Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {INFO_CATEGORIES.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                aria-pressed={isActive}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bara-gold-lt",
                  isActive
                    ? "text-bara-bg-dark"
                    : "glass-panel text-bara-cream/80 hover:text-bara-gold-lt"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="info-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-bara-gold-lt to-bara-gold shadow-gold-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((article) => (
              <motion.article
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group h-full"
              >
                <Link
                  href={article.href}
                  className="flex h-full flex-col overflow-hidden rounded-3xl glass-panel transition-all duration-300 hover:border-bara-orange/50 hover:shadow-ember-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bara-gold-lt"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-bara-bg-dark/80 to-transparent" />
                    <span
                      className={cn(
                        "absolute left-4 top-4 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-bara-cream shadow-ember",
                        categoryTone[article.category]
                      )}
                    >
                      {article.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-medium uppercase tracking-wider text-bara-gold-lt/80">
                      {formatDate(article.date)}
                    </span>
                    <h3 className="mt-2 font-display text-xl leading-snug text-bara-cream transition-colors group-hover:text-bara-gold-lt">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-bara-cream/65">
                      {article.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-bara-gold-lt">
                      Baca selengkapnya
                      <Icons.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-bara-cream/60">
            Belum ada informasi pada kategori ini.
          </p>
        )}
      </div>
    </section>
  );
}
