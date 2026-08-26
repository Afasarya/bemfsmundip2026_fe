"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Share2,
  Clock,
} from "lucide-react";
import { ARTICLES } from "@/data/site";

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

function readingTime(text: string) {
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} menit baca`;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const article = ARTICLES.find((a) => a.id === id);
  const articleIndex = ARTICLES.findIndex((a) => a.id === id);
  const prevArticle = articleIndex > 0 ? ARTICLES[articleIndex - 1] : null;
  const nextArticle =
    articleIndex < ARTICLES.length - 1 ? ARTICLES[articleIndex + 1] : null;

  // Related: same category, exclude current
  const related = article
    ? ARTICLES.filter(
        (a) => a.category === article.category && a.id !== article.id
      ).slice(0, 3)
    : [];

  if (!article) {
    return (
      <div className="relative pt-40 pb-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="font-display text-4xl mb-4">Artikel tidak ditemukan</h1>
          <p className="text-white/50 mb-8">
            Berita yang kamu cari tidak tersedia atau sudah dihapus.
          </p>
          <Link
            href="/informasi"
            className="inline-flex items-center gap-2 text-bara-orange hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Informasi
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = article.content.split("\n\n");

  return (
    <div className="relative pt-32 pb-20">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/3 w-[600px] h-[600px] rounded-full bg-bara-orange/10 blur-[150px]"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-sm text-white/40 mb-8"
        >
          <Link
            href="/"
            className="hover:text-white/70 transition-colors"
          >
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href="/informasi"
            className="hover:text-white/70 transition-colors"
          >
            Informasi
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white/60 truncate max-w-[200px]">
            {article.title}
          </span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className={`rounded-md px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ${
                    categoryColor[article.category] || "bg-bara-orange"
                  }`}
                >
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/50">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(article.date)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/50">
                  <Clock className="w-3.5 h-3.5" />
                  {readingTime(article.content)}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-6">
                {article.title}
              </h1>

              <p className="text-lg text-white/60 leading-relaxed mb-8">
                {article.excerpt}
              </p>
            </motion.div>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-10"
            >
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </motion.div>

            {/* Article body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="article-prose"
            >
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            {/* Share */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 pt-8 border-t border-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/40">Bagikan artikel ini</span>
              </div>
            </motion.div>

            {/* Prev / Next navigation */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  href={prevArticle.href}
                  className="group flex flex-col gap-2 rounded-xl bento-card p-5"
                >
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <ArrowLeft className="w-3 h-3" />
                    Sebelumnya
                  </span>
                  <span className="text-sm font-medium text-white/80 group-hover:text-bara-orange transition-colors line-clamp-2">
                    {prevArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextArticle && (
                <Link
                  href={nextArticle.href}
                  className="group flex flex-col gap-2 rounded-xl bento-card p-5 text-right"
                >
                  <span className="flex items-center justify-end gap-1.5 text-xs text-white/40">
                    Selanjutnya
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-medium text-white/80 group-hover:text-bara-orange transition-colors line-clamp-2">
                    {nextArticle.title}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              {/* Related articles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="font-display text-xl mb-6">Berita Terkait</h3>

                {related.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {related.map((a) => (
                      <Link
                        key={a.id}
                        href={a.href}
                        className="group flex gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-white/[0.03]"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={a.image}
                            alt={a.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <span
                            className={`self-start rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${
                              categoryColor[a.category] || "bg-bara-orange"
                            }`}
                          >
                            {a.category}
                          </span>
                          <h4 className="text-sm font-medium text-white/80 group-hover:text-bara-orange transition-colors line-clamp-2 leading-snug">
                            {a.title}
                          </h4>
                          <span className="text-[11px] text-white/35">
                            {formatDate(a.date)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/40">
                    Belum ada berita terkait.
                  </p>
                )}
              </motion.div>

              {/* Back to list */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-6 border-t border-white/[0.06]"
              >
                <Link
                  href="/informasi"
                  className="inline-flex items-center gap-2 text-sm text-bara-orange hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Semua Berita
                </Link>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
