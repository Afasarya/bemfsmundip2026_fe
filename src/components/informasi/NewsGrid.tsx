"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ARTICLES, INFO_CATEGORIES } from "@/data/site";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 6;

const categoryColor: Record<string, string> = {
  Kegiatan: "bg-bara-orange",
  Prestasi: "bg-bara-gold text-bara-bg-dark",
  Informasi: "bg-bara-red",
  Beasiswa: "bg-gradient-to-r from-bara-gold to-bara-orange text-bara-bg-dark",
  Lomba: "bg-gradient-to-r from-bara-orange to-bara-red",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsGrid() {
  const [active, setActive] = useState<(typeof INFO_CATEGORIES)[number]>("Semua");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (active === "Semua") return ARTICLES;
    return ARTICLES.filter((a) => a.category === active);
  }, [active]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filter changes
  const handleCategoryChange = (cat: (typeof INFO_CATEGORIES)[number]) => {
    setActive(cat);
    setPage(1);
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle bg glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-bara-red/10 blur-[140px]"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl leading-tight">
            Telusuri Berita
          </h2>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {INFO_CATEGORIES.map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative isolate rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bara-orange/50",
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/80 bg-white/[0.04] border border-white/[0.08]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="news-pill"
                      className="absolute inset-0 z-0 rounded-full bg-bara-orange"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {paged.map((article) => (
              <motion.article
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group"
              >
                <Link
                  href={article.href}
                  className="flex flex-col h-full overflow-hidden rounded-2xl bento-card"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span
                      className={cn(
                        "absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white",
                        categoryColor[article.category] || "bg-bara-orange"
                      )}
                    >
                      {article.category}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col flex-1 p-5">
                    <span className="flex items-center gap-1.5 text-xs text-white/40 mb-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.date)}
                    </span>
                    <h3 className="font-display text-lg leading-snug text-white/90 group-hover:text-bara-orange transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/45 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-bara-orange group-hover:gap-2.5 transition-all">
                      Selengkapnya
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <p className="py-16 text-center text-white/40">
            Belum ada berita pada kategori ini.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={cn(
                  "w-9 h-9 rounded-full text-sm font-medium transition-colors",
                  n === page
                    ? "bg-bara-orange text-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              aria-label="Halaman selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
