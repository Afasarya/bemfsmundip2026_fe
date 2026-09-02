"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight, Bell, BookOpen, Building2, Check,
  ChevronDown, CircleUserRound, Eye, FileText, Instagram,
  LayoutDashboard, Link2, LogOut, Menu, Pencil,
  Plus, Search, Settings, Sparkles, Trash2, Users, X,
} from "lucide-react";
import { useSWRConfig } from "swr";
import {
  useAdminArticleCategories,
  useAdminArticleCategoryMutations,
  useAdminArticles,
  useAdminDashboard,
  useAdminInstagramPosts,
  useAdminInstagramMutations,
  useAdminUnits,
  useAdminUnitMutations,
} from "@/lib/hooks";
import { placeholderCover, placeholderLogo } from "@/lib/placeholder";
import { formatDateShort, formatTimeAgo } from "@/lib/format";
import {
  type Article,
  type InstagramPostListItem,
  type InstagramPostStatus,
  type UnitListItem,
  UNIT_TYPE_LABELS,
} from "@/lib/types";
import { useAuth } from "@/components/providers/AuthProvider";
import LoginForm from "./LoginForm";
import ArticleEditor from "./ArticleEditor";
import UnitDrawer from "./UnitDrawer";
import InstagramDrawer from "./InstagramDrawer";
import CategoryDrawer from "./CategoryDrawer";

type Module = "overview" | "instagram" | "units" | "news" | "categories";
type DrawerKind = "instagram" | "unit" | "news" | "category" | null;

type NavItem = { id: Module; label: string; icon: typeof LayoutDashboard };
const nav: NavItem[] = [
  { id: "overview", label: "Ikhtisar", icon: LayoutDashboard },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "units", label: "Biro, Bidang & Tim", icon: Building2 },
  { id: "news", label: "Informasi", icon: FileText },
  { id: "categories", label: "Kategori", icon: BookOpen },
];

const moduleCopy: Record<Module, { eyebrow: string; title: string; description: string }> = {
  overview: { eyebrow: "Pusat kendali", title: "Selamat datang di Bara Command.", description: "Pantau isi situs dan selesaikan pekerjaan yang perlu perhatian." },
  instagram: { eyebrow: "Kanal sosial", title: "Konten Instagram", description: "Kelola tautan post dan susunan konten pilihan pada situs." },
  units: { eyebrow: "Struktur kabinet", title: "Biro, Bidang & Tim", description: "Kelola profil, arah strategis, program kerja, dan fungsionaris." },
  news: { eyebrow: "Ruang redaksi", title: "Informasi & Berita", description: "Tulis, kategorikan, jadwalkan, dan pilih berita utama." },
  categories: { eyebrow: "Taksonomi", title: "Kategori Informasi", description: "Kelompokkan berita dan informasi untuk navigasi yang lebih baik." },
};

function StatusPill({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "amber" | "muted" | "orange" | "sky" }) {
  const styles: Record<string, string> = {
    green: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    amber: "border-amber-400/20 bg-amber-400/[0.08] text-amber-200",
    muted: "border-white/10 bg-white/[0.04] text-white/45",
    orange: "border-orange-400/20 bg-orange-400/[0.08] text-orange-300",
    sky: "border-sky-400/20 bg-sky-400/[0.08] text-sky-300",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[tone]}`}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {children}
    </span>
  );
}

function Metric({ label, value, note, icon: Icon, accent }: { label: string; value: string; note: string; icon: typeof Users; accent: string }) {
  return (
    <article className="admin-panel group p-5 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/38">{label}</p>
          <p className="mt-3 font-display text-4xl text-white/90">{value}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl border ${accent}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-5 border-t border-white/[0.06] pt-3 text-[11px] text-white/35">{note}</div>
    </article>
  );
}

function SectionHeader({ title, caption, action, onAction }: { title: string; caption: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold text-white/85">{title}</h2>
        <p className="mt-1 text-xs text-white/35">{caption}</p>
      </div>
      {action && (
        <button onClick={onAction} className="admin-text-button">
          {action}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();

  // Auth gate: splash while hydrating, login form if not authenticated.
  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-bara-bg-dark">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-400/30 border-t-orange-400" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <AdminDashboardInner />;
}

function AdminDashboardInner() {
  const [module, setModule] = useState<Module>("overview");
  const [drawer, setDrawer] = useState<DrawerKind>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const copy = moduleCopy[module];

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };
  const openDrawer = (kind: Exclude<DrawerKind, null>, name?: string) => {
    setEditing(name ?? null);
    setDrawer(kind);
  };
  const go = (next: Module) => {
    setModule(next);
    setMobileNav(false);
    setSearch("");
  };

  return (
    <div className="admin-root min-h-screen bg-[#0d0908] text-white">
      <Sidebar nav={nav} module={module} go={go} mobileNav={mobileNav} setMobileNav={setMobileNav} />
      <div className="lg:pl-[268px]">
        <TopBar title={copy.title} onOpenNav={() => setMobileNav(true)} />
        <main className="mx-auto max-w-[1500px] px-5 pb-20 pt-9 md:px-8 lg:px-10">
          <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
          {module === "overview" && <Overview onNavigate={go} />}
          {module === "instagram" && (
            <InstagramModule
              onEdit={(n) => openDrawer("instagram", n)}
              onCreate={() => openDrawer("instagram", null)}
            />
          )}
          {module === "units" && (
            <UnitsModule
              search={search}
              setSearch={setSearch}
              onEdit={(n) => openDrawer("unit", n)}
              onCreate={() => openDrawer("unit", null)}
            />
          )}
          {module === "news" && <NewsModule search={search} setSearch={setSearch} onEdit={(n) => openDrawer("news", n)} onCreate={() => openDrawer("news", null)} />}
          {module === "categories" && (
            <CategoriesModule
              onEdit={(n) => openDrawer("category", n)}
              onCreate={() => openDrawer("category", null)}
            />
          )}
        </main>
      </div>

      {drawer && (
        <EditorDrawer
          kind={drawer}
          editing={editing}
          onClose={() => {
            setDrawer(null);
            setEditing(null);
          }}
          onSaved={() => {
            setDrawer(null);
            setEditing(null);
            notify(editing ? "Perubahan berhasil disimpan." : "Item baru berhasil ditambahkan.");
          }}
          notify={notify}
        />
      )}
      {toast && (
        <Toast>{toast}</Toast>
      )}
    </div>
  );
}

function Sidebar({
  nav, module, go, mobileNav, setMobileNav,
}: {
  nav: NavItem[];
  module: Module;
  go: (m: Module) => void;
  mobileNav: boolean;
  setMobileNav: (v: boolean) => void;
}) {
  const { user, logout } = useAuth();
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[130] flex w-[268px] flex-col border-r border-white/[0.07] bg-[#100b09] transition-transform lg:translate-x-0 ${
        mobileNav ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-20 items-center gap-3 border-b border-white/[0.06] px-6">
        <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-orange-400/20 bg-bara-red/20">
          <Image src="/images/barmon.webp" alt="Bara Momentum" fill className="object-contain p-0.5" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Bara Command</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-white/30">Admin workspace</p>
        </div>
        <button onClick={() => setMobileNav(false)} className="ml-auto text-white/40 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-6">
        <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">Workspace</p>
        <div className="space-y-1">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] transition ${
                module === item.id
                  ? "bg-gradient-to-r from-bara-orange/15 to-bara-red/[0.05] text-white shadow-[inset_0_0_0_1px_rgba(242,92,5,.14)]"
                  : "text-white/42 hover:bg-white/[0.035] hover:text-white/75"
              }`}
            >
              <item.icon
                className={`h-[17px] w-[17px] ${
                  module === item.id ? "text-bara-orange" : "text-white/28 group-hover:text-white/50"
                }`}
              />
              <span>{item.label}</span>
              {module === item.id && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-bara-orange shadow-[0_0_10px_#F25C05]" />
              )}
            </button>
          ))}
        </div>
        <p className="mb-3 mt-8 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">Sistem</p>
        <Link href="/" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-white/40 hover:bg-white/[0.035]">
          <Eye className="h-[17px] w-[17px] text-white/25" />Lihat situs publik
        </Link>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-white/40 hover:bg-white/[0.035]">
          <Settings className="h-[17px] w-[17px] text-white/25" />Pengaturan situs
        </button>
      </nav>
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-bara-orange to-bara-red text-xs font-bold">
            {user.name?.slice(0, 2).toUpperCase() ?? "AD"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{user.name}</p>
            <p className="truncate text-[10px] text-white/30">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            title="Keluar"
            aria-label="Keluar"
            className="grid h-7 w-7 place-items-center rounded-md hover:bg-white/[0.06]"
          >
            <LogOut className="h-4 w-4 text-white/25" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title, onOpenNav }: { title: string; onOpenNav: () => void }) {
  return (
    <header className="sticky top-0 z-[90] flex h-20 items-center border-b border-white/[0.06] bg-[#0d0908]/90 px-5 backdrop-blur-xl md:px-8 lg:px-10">
      <button onClick={onOpenNav} className="mr-4 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden items-center gap-2 text-[11px] text-white/25 sm:flex">
        <span>Admin</span>
        <span>/</span>
        <span className="text-white/55">{title}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/40">
          <Bell className="h-4 w-4" />
        </button>
        <div className="hidden h-8 w-px bg-white/[0.07] md:block" />
        <button className="hidden items-center gap-2 rounded-xl px-2 py-1.5 text-xs text-white/65 md:flex">
          <CircleUserRound className="h-5 w-5 text-orange-300/70" />Admin
          <ChevronDown className="h-3 w-3 text-white/25" />
        </button>
      </div>
    </header>
  );
}

function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-9">
      <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-bara-orange">
        <span className="h-px w-5 bg-bara-orange" />
        {eyebrow}
      </p>
      <h1 className="font-display text-4xl leading-none text-white/95 md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-white/38">{description}</p>
    </div>
  );
}

function Toast({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-[#15120f] px-4 py-3 text-xs shadow-2xl">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
        <Check className="h-3.5 w-3.5" />
      </span>
      {children}
    </div>
  );
}

// ============================ OVERVIEW ============================

function Overview({ onNavigate }: { onNavigate: (m: Module) => void }) {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading || !data) {
    return <OverviewSkeleton />;
  }

  const articleTotal = Object.entries(data.articles)
    .filter(([k]) => k !== "total")
    .reduce((sum, [, v]) => sum + (v ?? 0), 0);
  const articleDraft = data.articles.DRAFT ?? 0;
  const articlePublished = data.articles.PUBLISHED ?? 0;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Konten tayang"
          value={String(articlePublished)}
          note={`${articleTotal} total · ${articleDraft} draf`}
          icon={FileText}
          accent="border-orange-400/15 bg-orange-400/[0.07] text-orange-300"
        />
        <Metric
          label="Unit kabinet"
          value={String(data.organization.published)}
          note={`${data.organization.total} total · ${data.organization.draft} draf`}
          icon={Building2}
          accent="border-amber-400/15 bg-amber-400/[0.07] text-amber-200"
        />
        <Metric
          label="Aset media"
          value={String(data.media.count)}
          note={formatBytes(data.media.totalSizeBytes)}
          icon={Sparkles}
          accent="border-sky-400/15 bg-sky-400/[0.07] text-sky-300"
        />
        <Metric
          label="Program kerja"
          value="—"
          note="Segera tersedia di dasbor"
          icon={BookOpen}
          accent="border-fuchsia-400/15 bg-fuchsia-400/[0.07] text-fuchsia-300"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_.85fr]">
        <div className="admin-panel p-5 md:p-6">
          <SectionHeader
            title="Aktivitas konten"
            caption="Perubahan terakhir pada situs"
            action="Buka informasi"
            onAction={() => onNavigate("news")}
          />
          <div className="divide-y divide-white/[0.06]">
            {data.recentArticles.length === 0 ? (
              <p className="py-8 text-xs text-white/30">Belum ada aktivitas.</p>
            ) : (
              data.recentArticles.map((article, index) => (
                <div key={article.id} className="flex items-center gap-4 py-4">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    <Image src={placeholderCover(article.title, 200, 150)} alt="" fill className="object-cover opacity-70" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white/75">{article.title}</p>
                    <p className="mt-1 text-[10px] text-white/30">
                      {article.publishedAt
                        ? formatTimeAgo(article.publishedAt)
                        : `Diubah ${formatTimeAgo(new Date().toISOString())}`}{" "}
                      · {article.status}
                    </p>
                  </div>
                  {article.status === "PUBLISHED" ? (
                    <StatusPill tone="green">Tayang</StatusPill>
                  ) : (
                    <StatusPill tone="amber">{article.status}</StatusPill>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-panel overflow-hidden">
          <div className="relative border-b border-white/[0.06] p-6">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-bara-orange/10 blur-3xl" />
            <div className="relative">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-orange-400/20 bg-orange-400/[0.08] text-orange-300">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="mt-5 font-display text-2xl">Statistik kabinet.</h2>
              <p className="mt-2 text-xs leading-5 text-white/35">
                Ringkasan agregat dari seluruh modul situs. Gunakan sebagai titik awal sebelum menulis konten baru.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-[11px]">
                <Stat label="Artikel" value={articleTotal} />
                <Stat label="Unit" value={data.organization.total} />
                <Stat label="Pengguna" value={data.recentUsers.length} />
                <Stat label="Media" value={data.media.count} />
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25">Pengguna terbaru</p>
            <div className="mt-4 space-y-3">
              {data.recentUsers.slice(0, 3).map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] p-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-white/10 to-white/[0.03] text-[10px] font-bold text-orange-200">
                    {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] text-white/75">{u.name}</p>
                    <p className="truncate text-[10px] text-white/30">{u.roleCode}</p>
                  </div>
                  <span className="text-[10px] text-white/30">{formatDateShort(u.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-center">
      <p className="font-display text-lg text-white/85">{value}</p>
      <p className="mt-0.5 text-[9px] uppercase tracking-wider text-white/40">{label}</p>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-panel h-32 animate-pulse rounded-2xl bg-white/[0.015]" />
        ))}
      </section>
      <div className="grid gap-6 xl:grid-cols-[1.55fr_.85fr]">
        <div className="admin-panel h-72 animate-pulse rounded-2xl bg-white/[0.015]" />
        <div className="admin-panel h-72 animate-pulse rounded-2xl bg-white/[0.015]" />
      </div>
    </div>
  );
}

// ============================ INSTAGRAM ============================

const STATUS_LABELS: Record<InstagramPostStatus | "DRAFT" | "PUBLISHED" | "ARCHIVED", string> = {
  DRAFT: "Draf",
  PUBLISHED: "Tayang",
  ARCHIVED: "Arsip",
};

function InstagramModule({
  onEdit,
  onCreate,
}: {
  onEdit: (id: string) => void;
  onCreate: () => void;
}) {
  const { data, isLoading, mutate } = useAdminInstagramPosts({ pageSize: 50 });
  const posts: InstagramPostListItem[] = data?.data ?? [];
  const mutations = useAdminInstagramMutations();

  const handleDelete = async (post: InstagramPostListItem) => {
    if (!confirm(`Hapus post "${post.internalTitle ?? post.shortcode}"?`)) return;
    try {
      await mutations.remove(post.id);
      await mutate();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus post.");
    }
  };

  return (
    <section className="admin-panel overflow-hidden">
      <Toolbar
        search=""
        setSearch={() => {}}
        placeholder="Cari judul post..."
        filter="Semua status"
        actionLabel="Tambah post"
        onAction={onCreate}
      />
      {isLoading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.025]" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-xs text-white/40">Belum ada post Instagram.</p>
          <button onClick={onCreate} className="admin-primary-button mt-4 inline-flex">
            <Plus className="h-4 w-4" />Tambah post pertama
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500/30 to-orange-400/20 text-fuchsia-200">
                        <Instagram className="h-4 w-4" />
                      </span>
                      <div className="max-w-md">
                        <p className="line-clamp-1 font-medium text-white/75">
                          {post.internalTitle ?? `Post ${post.shortcode}`}
                        </p>
                        <a
                          href={post.canonicalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[10px] text-white/30 hover:text-bara-orange"
                        >
                          <Link2 className="h-3 w-3" />
                          {post.shortcode}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusPill tone={post.status === "PUBLISHED" ? "green" : post.status === "DRAFT" ? "muted" : "amber"}>
                      {STATUS_LABELS[post.status]}
                    </StatusPill>
                  </td>
                  <td>{formatDateShort(post.createdAt)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onEdit(post.id)} className="admin-icon-button">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(post)} className="admin-icon-button hover:!border-red-400/30 hover:!text-red-300">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="admin-table-footer">
        {posts.length > 0 ? `${posts.length} post termuat` : "Belum ada post"}
      </div>
    </section>
  );
}

// ============================ UNITS ============================

function UnitsModule({
  search,
  setSearch,
  onEdit,
  onCreate,
}: {
  search: string;
  setSearch: (v: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
}) {
  const { data, isLoading, mutate } = useAdminUnits({ pageSize: 100 });
  const units = data?.data ?? [];
  const mutations = useAdminUnitMutations();
  const filtered = useMemo(
    () =>
      units.filter((unit) =>
        `${unit.name} ${unit.type} ${unit.shortName ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [units, search],
  );

  const handleDelete = async (unit: UnitListItem) => {
    if (!confirm(`Hapus unit "${unit.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await mutations.remove(unit.id);
      await mutate();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus unit.");
    }
  };

  const handlePublishToggle = async (unit: UnitListItem) => {
    try {
      if (unit.status === "PUBLISHED") {
        await mutations.archive(unit.id);
      } else {
        await mutations.publish(unit.id);
      }
      await mutate();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengubah status.");
    }
  };

  return (
    <section className="admin-panel overflow-hidden">
      <Toolbar
        search={search}
        setSearch={setSearch}
        placeholder="Cari biro, bidang, atau tim..."
        filter="Semua jenis"
        actionLabel="Tambah unit"
        onAction={onCreate}
      />
      {isLoading ? (
        <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse bg-[#12100e]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-xs text-white/40">Tidak ada unit yang cocok dengan pencarian.</p>
          <button onClick={onCreate} className="admin-primary-button mt-4 inline-flex">
            <Plus className="h-4 w-4" />Tambah unit pertama
          </button>
        </div>
      ) : (
        <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onEdit={() => onEdit(unit.id)}
              onDelete={() => handleDelete(unit)}
              onPublishToggle={() => handlePublishToggle(unit)}
            />
          ))}
        </div>
      )}
      <div className="admin-table-footer">{filtered.length} unit kabinet ditemukan</div>
    </section>
  );
}

function UnitCard({
  unit,
  onEdit,
  onDelete,
  onPublishToggle,
}: {
  unit: UnitListItem;
  onEdit: () => void;
  onDelete: () => void;
  onPublishToggle: () => void;
}) {
  return (
    <article className="group bg-[#12100e] p-5 transition hover:bg-[#17120f]">
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#8e2517]">
          {unit.logo?.url ? (
            <Image src={unit.logo.url} alt="" fill sizes="56px" className="object-cover" />
          ) : (
            <Image src={placeholderLogo(unit.shortName ?? unit.name, 56)} alt="" fill sizes="56px" className="object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <StatusPill tone={unit.type === "DIVISION" ? "orange" : unit.type === "BUREAU" ? "amber" : "sky"}>
              {UNIT_TYPE_LABELS[unit.type]}
            </StatusPill>
            <StatusPill tone={unit.status === "PUBLISHED" ? "green" : unit.status === "DRAFT" ? "muted" : "amber"}>
              {unit.status === "PUBLISHED" ? "Tayang" : unit.status === "DRAFT" ? "Draf" : "Arsip"}
            </StatusPill>
          </div>
          <h3 className="mt-3 truncate text-sm font-semibold text-white/80">{unit.shortName ?? "—"}</h3>
          <p className="mt-1 truncate text-[10px] text-white/32">{unit.name}</p>
        </div>
      </div>
      {unit.summary && (
        <p className="mt-5 line-clamp-2 min-h-[40px] text-xs leading-5 text-white/38">{unit.summary}</p>
      )}
      <div className="mt-4 grid grid-cols-3 gap-1">
        <button onClick={onEdit} className="admin-secondary-button justify-center">
          <Pencil className="h-3 w-3" />
          Edit
        </button>
        <button onClick={onPublishToggle} className="admin-secondary-button justify-center">
          {unit.status === "PUBLISHED" ? "Arsipkan" : "Tayang"}
        </button>
        <button onClick={onDelete} className="admin-secondary-button justify-center hover:!border-red-400/30 hover:!text-red-300">
          <Trash2 className="h-3 w-3" />
          Hapus
        </button>
      </div>
    </article>
  );
}

// ============================ NEWS ============================

function NewsModule({
  search,
  setSearch,
  onEdit,
  onCreate,
}: {
  search: string;
  setSearch: (v: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
}) {
  const { data, isLoading } = useAdminArticles({ pageSize: 50 });
  const articles: Article[] = data?.data ?? [];
  const filtered = articles.filter((a) =>
    `${a.title}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="admin-panel overflow-hidden">
      <Toolbar
        search={search}
        setSearch={setSearch}
        placeholder="Cari judul informasi..."
        filter="Semua kategori"
        actionLabel="Tulis informasi"
        onAction={onCreate}
      />
      {isLoading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.025]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-xs text-white/40">Tidak ada informasi yang cocok.</p>
          <button onClick={onCreate} className="admin-primary-button mt-4 inline-flex">
            <Plus className="h-4 w-4" />Tulis informasi pertama
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Informasi</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((article) => (
                <tr key={article.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
                        <Image src={placeholderCover(article.title, 200, 150)} alt="" fill className="object-cover opacity-75" />
                      </div>
                      <div className="max-w-md">
                        <p className="line-clamp-1 font-medium text-white/75">{article.title}</p>
                        {article.excerpt && (
                          <p className="mt-1 line-clamp-1 text-[10px] text-white/30">{article.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusPill tone={article.status === "PUBLISHED" ? "green" : article.status === "DRAFT" ? "muted" : "amber"}>
                      {article.status === "PUBLISHED" ? "Tayang" : article.status === "DRAFT" ? "Draf" : article.status === "SCHEDULED" ? "Terjadwal" : article.status}
                    </StatusPill>
                  </td>
                  <td>{formatDateShort(article.publishedAt ?? article.createdAt)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onEdit(article.id)} className="admin-icon-button">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="admin-table-footer">
        {articles.length > 0 ? `${articles.length} informasi termuat` : "Belum ada informasi"}
      </div>
    </section>
  );
}

// ============================ CATEGORIES ============================

function CategoriesModule({
  onEdit,
  onCreate,
}: {
  onEdit: (id: string) => void;
  onCreate: () => void;
}) {
  const { data: categories = [], isLoading, mutate } = useAdminArticleCategories();
  const mutations = useAdminArticleCategoryMutations();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    try {
      await mutations.remove(id);
      await mutate();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus kategori.");
    }
  };

  return (
    <section className="admin-panel overflow-hidden">
      <Toolbar
        search=""
        setSearch={() => {}}
        placeholder=""
        filter="Semua kategori"
        actionLabel="Tambah kategori"
        onAction={onCreate}
      />
      {isLoading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.025]" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-xs text-white/40">Belum ada kategori.</p>
          <button onClick={onCreate} className="admin-primary-button mt-4 inline-flex">
            <Plus className="h-4 w-4" />Tambah kategori pertama
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Slug</th>
                <th>Urutan</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <p className="font-medium text-white/75">{c.name}</p>
                    {c.description && (
                      <p className="mt-1 line-clamp-1 text-[10px] text-white/30">{c.description}</p>
                    )}
                  </td>
                  <td>
                    <code className="rounded bg-white/5 px-2 py-1 text-[10px] text-white/55">
                      {c.slug}
                    </code>
                  </td>
                  <td className="text-[11px] text-white/55">{c.sortOrder}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onEdit(c.id)} className="admin-icon-button">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="admin-icon-button hover:!border-red-400/30 hover:!text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="admin-table-footer">{categories.length} kategori terdaftar</div>
    </section>
  );
}

// ============================ DRAWER ============================

function Toolbar({
  search,
  setSearch,
  placeholder,
  filter = "Semua status",
  actionLabel,
  onAction,
}: {
  search: string;
  setSearch: (v: string) => void;
  placeholder: string;
  filter?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row">
      <label className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="admin-input pl-10"
        />
      </label>
      <button className="admin-filter-button">
        {filter}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {actionLabel && onAction && (
        <button onClick={onAction} className="admin-primary-button justify-center">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EditorDrawer({
  kind,
  editing,
  onClose,
  onSaved,
  notify,
}: {
  kind: Exclude<DrawerKind, null>;
  editing: string | null;
  onClose: () => void;
  onSaved: () => void;
  notify: (msg: string) => void;
}) {
  const { mutate } = useSWRConfig();
  // After any save, invalidate every cache key that may show stale data for this kind.
  // Most keys are arrays with the namespace as first element (e.g. ["admin-articles", params]).
  const matchesKey = (namespace: string) => (key: unknown) =>
    (typeof key === "string" && key === namespace) ||
    (Array.isArray(key) && key[0] === namespace);

  const invalidate = async () => {
    const namespaces: Record<Exclude<DrawerKind, null>, string[]> = {
      instagram: ["admin-instagram-posts", "admin-dashboard", "public-instagram-posts"],
      unit: ["admin-units", "admin-dashboard", "public-units"],
      news: [
        "admin-articles",
        "admin-dashboard",
        "admin-article",
        "admin-article-revisions",
        "admin-media",
        "public-articles",
        "public-articles-featured",
      ],
      category: [
        "admin-article-categories",
        "admin-dashboard",
        "admin-articles",
        "public-article-categories",
      ],
    };
    await Promise.all(
      namespaces[kind].map((ns) => mutate(matchesKey(ns), undefined, { revalidate: true })),
    );
  };

  const handleSaved = async () => {
    onSaved();
    await invalidate();
  };

  if (kind === "news") {
    return (
      <ArticleEditor
        articleId={editing}
        onClose={onClose}
        onSaved={handleSaved}
        notify={notify}
      />
    );
  }
  if (kind === "unit") {
    return (
      <UnitDrawer unitId={editing} onClose={onClose} onSaved={handleSaved} notify={notify} />
    );
  }
  if (kind === "instagram") {
    return (
      <InstagramDrawer postId={editing} onClose={onClose} onSaved={handleSaved} notify={notify} />
    );
  }
  if (kind === "category") {
    return (
      <CategoryDrawer categoryId={editing} onClose={onClose} onSaved={handleSaved} notify={notify} />
    );
  }
  return null;
}