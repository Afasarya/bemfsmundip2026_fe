"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { placeholderCover } from "@/lib/placeholder";
import type { Article, PaginatedArticles } from "@/lib/types";
import { articleHref, formatDateId, formatTimeAgo } from "@/lib/format";

export default function NewsBanner() {
  // Header text is always rendered. Featured + side list populate when data arrives.
  const { data: featured, isLoading: featuredLoading } = useSWR<Article | null>(
    "public-articles-featured",
    () => apiFetch<Article | null>("public/articles/featured"),
    { revalidateOnFocus: false, dedupingInterval: 60_000 },
  );
  const { data: latest } = useSWR<PaginatedArticles>(
    ["public-articles", { page: 1, pageSize: 4 }] as const,
    ([, q]) =>
      apiFetch<PaginatedArticles>("public/articles", {
        query: q as Record<string, number>,
      }),
    { revalidateOnFocus: false, dedupingInterval: 60_000 },
  );

  const showSkeleton = featuredLoading && !featured;
  const sideArticles = (latest?.data ?? [])
    .filter((a) => a.id !== featured?.id)
    .slice(0, 3);

  return (
    <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-bara-orange/15 blur-[140px]"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section label — always visible */}
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
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            Kabar terbaru, pengumuman, dan liputan program kerja Kabinet Bara
            Momentum untuk mahasiswa FSM UNDIP.
          </p>
        </motion.div>

        {/* Featured + side content */}
        {showSkeleton ? (
          <ContentSkeleton />
        ) : !featured ? (
          <EmptyBanner />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Pinned article — large card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Link
              href={articleHref(featured.slug)}
              className="group relative block overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[16/10]"
            >
              <Image
                src={featured.coverUrl ?? placeholderCover(featured.title, 1200, 750)}
                alt={featured.coverAlt ?? featured.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="rounded-md bg-bara-orange px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white">
                    Berita Utama
                  </span>
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs text-white/70">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {formatDateId(featured.publishedAt ?? featured.createdAt)}
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug text-white max-w-xl line-clamp-2">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="hidden sm:block mt-2 text-xs sm:text-sm text-white/60 max-w-lg leading-relaxed line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}
                <span className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-bara-orange group-hover:gap-2.5 transition-all">
                  Baca selengkapnya
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Side list */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {sideArticles.length === 0 ? (
              <p className="text-xs text-white/30">Belum ada berita lain.</p>
            ) : (
              sideArticles.map((article, i) => (
                <SideNewsItem key={article.id} article={article} index={i} />
              ))
            )}
          </motion.div>
        </div>
        )}
      </div>
    </section>
  );
}

function EmptyBanner() {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">
      <Newspaper className="h-10 w-10 text-white/15" />
      <p className="mt-4 text-sm text-white/55">
        Belum ada berita utama yang ditandai.
      </p>
      <p className="mt-1 text-xs text-white/30">
        Pilih berita utama dari dasbor admin untuk menampilkannya di sini.
      </p>
    </div>
  );
}

function SideNewsItem({ article, index }: { article: Article; index: number }) {
  return (
    <Link
      href={articleHref(article.slug)}
      className="group flex flex-col gap-3 rounded-xl p-4 -mx-4 transition-colors hover:bg-white/[0.03]"
    >
      <span className="rounded-md bg-bara-orange self-start px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
        {article.status === "PUBLISHED" ? "Tayang" : "Draf"}
      </span>
      <h3 className="font-display text-lg leading-snug text-white/90 group-hover:text-bara-orange transition-colors line-clamp-2">
        {article.title}
      </h3>
      <div className="flex items-center gap-1.5 text-xs text-white/40">
        <Calendar className="w-3 h-3" />
        {formatTimeAgo(article.publishedAt ?? article.createdAt)}
      </div>
      {index < 2 && <div className="mt-2 h-px w-full bg-white/[0.06]" />}
    </Link>
  );
}

function ContentSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      <div className="lg:col-span-3 aspect-[16/10] animate-pulse rounded-2xl bg-white/5" />
      <div className="lg:col-span-2 flex flex-col gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
