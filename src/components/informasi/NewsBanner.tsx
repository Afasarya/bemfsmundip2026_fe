"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { ARTICLES } from "@/data/site";
import type { Article } from "@/data/site";

const categoryColor: Record<string, string> = {
  Kegiatan: "bg-bara-orange",
  Prestasi: "bg-bara-gold text-bara-bg-dark",
  Informasi: "bg-bara-red",
  Beasiswa: "bg-gradient-to-r from-bara-gold to-bara-orange text-bara-bg-dark",
  Lomba: "bg-gradient-to-r from-bara-orange to-bara-red",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari yang lalu";
  if (days < 7) return `${days} hari yang lalu`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} minggu yang lalu`;
  const months = Math.floor(days / 30);
  return `${months} bulan yang lalu`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsBanner() {
  const pinnedArticle = ARTICLES.find((a) => a.pinned) || ARTICLES[0];
  const sideArticles = ARTICLES.filter((a) => a.id !== pinnedArticle.id).slice(0, 3);

  return (
    <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-bara-orange/15 blur-[140px]"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="h-[2px] w-10 bg-bara-orange rounded-full" />
            <span className="text-xs uppercase tracking-[0.25em] text-bara-orange font-semibold">
              Informasi Terkini
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            Update Berita &{" "}
            <span className="italic gradient-text">Bara Momentum</span>
          </h1>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Pinned article — large card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Link
              href={pinnedArticle.href}
              className="group relative block overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[16/10]"
            >
              <Image
                src={pinnedArticle.image}
                alt={pinnedArticle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Content on image */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="rounded-md bg-bara-orange px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white">
                    Berita Utama
                  </span>
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs text-white/70">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {formatDate(pinnedArticle.date)}
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug text-white max-w-xl line-clamp-2">
                  {pinnedArticle.title}
                </h2>
                <p className="hidden sm:block mt-2 text-xs sm:text-sm text-white/60 max-w-lg leading-relaxed line-clamp-2">
                  {pinnedArticle.excerpt}
                </p>
                <span className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-bara-orange group-hover:gap-2.5 transition-all">
                  Baca selengkapnya
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Side list — 3 recent articles */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {sideArticles.map((article, i) => (
              <SideNewsItem key={article.id} article={article} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SideNewsItem({ article, index }: { article: Article; index: number }) {
  return (
    <Link
      href={article.href}
      className="group flex flex-col gap-3 rounded-xl p-4 -mx-4 transition-colors hover:bg-white/[0.03]"
    >
      <span
        className={`self-start rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${
          categoryColor[article.category] || "bg-bara-orange"
        }`}
      >
        {article.category}
      </span>
      <h3 className="font-display text-lg leading-snug text-white/90 group-hover:text-bara-orange transition-colors line-clamp-2">
        {article.title}
      </h3>
      <div className="flex items-center gap-1.5 text-xs text-white/40">
        <Calendar className="w-3 h-3" />
        {timeAgo(article.date)}
      </div>
      {/* Divider */}
      {index < 2 && (
        <div className="mt-2 h-px w-full bg-white/[0.06]" />
      )}
    </Link>
  );
}
