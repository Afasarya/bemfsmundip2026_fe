import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Share2,
  Clock,
} from "lucide-react";
import { fetchArticleBySlug, fetchLatestArticles } from "@/lib/server-api";
import { articleHref, formatDateId } from "@/lib/format";
import { placeholderCover } from "@/lib/placeholder";
import SafeHtml from "@/components/ui/SafeHtml";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const article = await fetchArticleBySlug(params.id);
  if (!article) return { title: "Artikel tidak ditemukan" };
  return {
    title: `${article.title} | BEM FSM UNDIP 2026`,
    description: article.excerpt ?? undefined,
  };
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const [article, latest] = await Promise.all([
    fetchArticleBySlug(params.id),
    fetchLatestArticles(8),
  ]);

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

  const related = latest.filter((a) => a.id !== article.id).slice(0, 3);
  const coverUrl = article.coverMediaId ?? placeholderCover(article.title, 1200, 675);
  const publishedDate = formatDateId(article.publishedAt ?? article.createdAt);

  return (
    <div className="relative pt-32 pb-20">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/3 w-[600px] h-[600px] rounded-full bg-bara-orange/10 blur-[150px]"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white/70 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/informasi" className="hover:text-white/70 transition-colors">
            Informasi
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white/60 truncate max-w-[200px]">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="rounded-md bg-bara-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  {article.status === "PUBLISHED" ? "Tayang" : article.status}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/50">
                  <Calendar className="w-3.5 h-3.5" />
                  {publishedDate}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/50">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingMinutes || 1} menit baca
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-6">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-lg text-white/60 leading-relaxed mb-8">{article.excerpt}</p>
              )}
            </div>

            {/* Hero image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-10">
              <Image
                src={coverUrl}
                alt={article.coverAlt ?? article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>

            {/* Article body — sanitized via DOMPurify in SafeHtml */}
            <SafeHtml html={article.content} />

            {/* Share */}
            <div className="mt-10 pt-8 border-t border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Share2 className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/40">Bagikan artikel ini</span>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/informasi"
                className="group flex flex-col gap-2 rounded-xl bento-card p-5"
              >
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  <ArrowLeft className="w-3 h-3" />
                  Semua berita
                </span>
                <span className="text-sm font-medium text-white/80 group-hover:text-bara-orange transition-colors">
                  Kembali ke daftar informasi
                </span>
              </Link>
              <Link
                href="/"
                className="group flex flex-col gap-2 rounded-xl bento-card p-5 text-right"
              >
                <span className="flex items-center justify-end gap-1.5 text-xs text-white/40">
                  Halaman utama
                  <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-sm font-medium text-white/80 group-hover:text-bara-orange transition-colors">
                  Lihat beranda BEM FSM
                </span>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div>
                <h3 className="font-display text-xl mb-6">Berita Lainnya</h3>
                {related.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {related.map((a) => {
                      const url = a.coverMediaId ?? placeholderCover(a.title, 200, 200);
                      return (
                        <Link
                          key={a.id}
                          href={articleHref(a.slug)}
                          className="group flex gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-white/[0.03]"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/[0.04]">
                            <Image
                              src={url}
                              alt={a.coverAlt ?? a.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 min-w-0">
                            <span className="self-start rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-bara-orange text-white">
                              Tayang
                            </span>
                            <h4 className="text-sm font-medium text-white/80 group-hover:text-bara-orange transition-colors line-clamp-2 leading-snug">
                              {a.title}
                            </h4>
                            <span className="text-[11px] text-white/35">
                              {formatDateId(a.publishedAt ?? a.createdAt)}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-white/40">Belum ada berita lain.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
