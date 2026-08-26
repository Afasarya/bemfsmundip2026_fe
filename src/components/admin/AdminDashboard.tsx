"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Bell, BookOpen, Building2, CalendarDays, Check,
  ChevronDown, CircleUserRound, Clock3, Eye, FileText, Flame, GripVertical,
  Instagram, LayoutDashboard, Link2, LogOut, Menu, MoreHorizontal, Pencil,
  Plus, Search, Settings, ShieldCheck, Sparkles, Trash2, Upload, Users, X,
  AlignCenter, AlignLeft, AlignRight, Bold, Code2, Heading2, ImageIcon,
  Italic, List, ListOrdered, Quote, Redo2, RemoveFormatting, Strikethrough,
  Underline, Undo2,
} from "lucide-react";
import { ORGANIZATION_UNITS } from "@/data/organization";
import { ARTICLES } from "@/data/site";

type Module = "overview" | "users" | "instagram" | "units" | "news";
type DrawerKind = "user" | "instagram" | "unit" | "news" | null;

type AdminUser = { name: string; email: string; role: string; status: "Aktif" | "Nonaktif"; initials: string; lastSeen: string };
type InstagramPost = { shortcode: string; url: string; title: string; placement: string; highlighted: boolean; status: "Tayang" | "Draf" };

const initialUsers: AdminUser[] = [
  { name: "Arya Fajar", email: "arya@bemfsm.id", role: "Super Admin", status: "Aktif", initials: "AF", lastSeen: "Baru saja" },
  { name: "Nadia Putri", email: "nadia@bemfsm.id", role: "Editor Konten", status: "Aktif", initials: "NP", lastSeen: "18 menit lalu" },
  { name: "Raka Mahendra", email: "raka@bemfsm.id", role: "Admin Bidang", status: "Aktif", initials: "RM", lastSeen: "Kemarin, 21.40" },
  { name: "Salsa Aulia", email: "salsa@bemfsm.id", role: "Editor Konten", status: "Nonaktif", initials: "SA", lastSeen: "12 Agu 2026" },
];

const initialPosts: InstagramPost[] = [
  { shortcode: "DaRk3GIEkQc", url: "https://www.instagram.com/p/DaRk3GIEkQc/", title: "Bara Momentum: Langkah Pertama", placement: "Beranda, Informasi", highlighted: true, status: "Tayang" },
  { shortcode: "DaPblgNkp8P", url: "https://www.instagram.com/p/DaPblgNkp8P/", title: "Kenali Kabinet Bara Momentum", placement: "Beranda", highlighted: true, status: "Tayang" },
  { shortcode: "DZ_jS9aEpbj", url: "https://www.instagram.com/p/DZ_jS9aEpbj/", title: "Ruang Gerak Mahasiswa FSM", placement: "Informasi", highlighted: false, status: "Tayang" },
  { shortcode: "DZ7QqjFEr8Y", url: "https://www.instagram.com/p/DZ7QqjFEr8Y/", title: "Agenda Kabinet Bulan Agustus", placement: "Belum dipilih", highlighted: false, status: "Draf" },
];

const nav = [
  { id: "overview" as const, label: "Ikhtisar", icon: LayoutDashboard },
  { id: "users" as const, label: "Pengguna", icon: Users },
  { id: "instagram" as const, label: "Instagram", icon: Instagram },
  { id: "units" as const, label: "Biro, Bidang & Tim", icon: Building2 },
  { id: "news" as const, label: "Informasi", icon: FileText },
];

const moduleCopy: Record<Module, { eyebrow: string; title: string; description: string }> = {
  overview: { eyebrow: "Pusat kendali", title: "Selamat sore, Arya.", description: "Pantau isi situs dan selesaikan pekerjaan yang perlu perhatian." },
  users: { eyebrow: "Akses & keamanan", title: "Pengguna", description: "Atur akun, peran, dan akses tim pengelola situs." },
  instagram: { eyebrow: "Kanal sosial", title: "Konten Instagram", description: "Kelola tautan post dan susunan konten pilihan pada situs." },
  units: { eyebrow: "Struktur kabinet", title: "Biro, Bidang & Tim", description: "Kelola profil, arah strategis, program kerja, dan fungsionaris." },
  news: { eyebrow: "Ruang redaksi", title: "Informasi & Berita", description: "Tulis, kategorikan, jadwalkan, dan pilih berita utama." },
};

function StatusPill({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "amber" | "muted" | "orange" }) {
  const styles = { green: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300", amber: "border-amber-400/20 bg-amber-400/[0.08] text-amber-200", muted: "border-white/10 bg-white/[0.04] text-white/45", orange: "border-orange-400/20 bg-orange-400/[0.08] text-orange-300" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[tone]}`}><span className="h-1 w-1 rounded-full bg-current" />{children}</span>;
}

function Metric({ label, value, note, icon: Icon, accent }: { label: string; value: string; note: string; icon: typeof Users; accent: string }) {
  return <article className="admin-panel group p-5 md:p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-white/38">{label}</p><p className="mt-3 font-display text-4xl text-white/90">{value}</p></div><span className={`grid h-10 w-10 place-items-center rounded-xl border ${accent}`}><Icon className="h-4 w-4" /></span></div><div className="mt-5 border-t border-white/[0.06] pt-3 text-[11px] text-white/35">{note}</div></article>;
}

function SectionHeader({ title, caption, action, onAction }: { title: string; caption: string; action?: string; onAction?: () => void }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-sm font-semibold text-white/85">{title}</h2><p className="mt-1 text-xs text-white/35">{caption}</p></div>{action && <button onClick={onAction} className="admin-text-button">{action}<ArrowRight className="h-3.5 w-3.5" /></button>}</div>;
}

function EmptyImage({ label }: { label: string }) {
  return <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-bara-red/30 to-white/[0.02]"><span className="font-display text-sm text-orange-200/80">{label.slice(0, 2).toUpperCase()}</span></div>;
}

export default function AdminDashboard() {
  const [module, setModule] = useState<Module>("overview");
  const [drawer, setDrawer] = useState<DrawerKind>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [toast, setToast] = useState("");
  const copy = moduleCopy[module];

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2400); };
  const openDrawer = (kind: Exclude<DrawerKind, null>, name?: string) => { setEditing(name ?? null); setDrawer(kind); };
  const go = (next: Module) => { setModule(next); setMobileNav(false); setSearch(""); };

  const filteredUnits = useMemo(() => ORGANIZATION_UNITS.filter((unit) => `${unit.name} ${unit.type}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const filteredArticles = useMemo(() => ARTICLES.filter((article) => `${article.title} ${article.category}`.toLowerCase().includes(search.toLowerCase())), [search]);

  const deleteUser = (email: string) => { setUsers(users.filter((user) => user.email !== email)); notify("Akun dihapus dari daftar."); };
  const deletePost = (shortcode: string) => { setPosts(posts.filter((post) => post.shortcode !== shortcode)); notify("Konten Instagram dihapus."); };

  return (
    <div className="admin-root min-h-screen bg-[#0d0908] text-white">
      <aside className={`fixed inset-y-0 left-0 z-[130] flex w-[268px] flex-col border-r border-white/[0.07] bg-[#100b09] transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/[0.06] px-6">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-orange-400/20 bg-bara-red/20"><Image src="/images/barmon.webp" alt="Bara Momentum" fill className="object-contain p-0.5" /></div>
          <div><p className="text-sm font-semibold tracking-tight">Bara Command</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-white/30">Admin workspace</p></div>
          <button onClick={() => setMobileNav(false)} className="ml-auto text-white/40 lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">Workspace</p>
          <div className="space-y-1">{nav.map((item) => <button key={item.id} onClick={() => go(item.id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] transition ${module === item.id ? "bg-gradient-to-r from-bara-orange/15 to-bara-red/[0.05] text-white shadow-[inset_0_0_0_1px_rgba(242,92,5,.14)]" : "text-white/42 hover:bg-white/[0.035] hover:text-white/75"}`}><item.icon className={`h-[17px] w-[17px] ${module === item.id ? "text-bara-orange" : "text-white/28 group-hover:text-white/50"}`} /><span>{item.label}</span>{module === item.id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-bara-orange shadow-[0_0_10px_#F25C05]" />}</button>)}</div>
          <p className="mb-3 mt-8 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">Sistem</p>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-white/40 hover:bg-white/[0.035]"><Settings className="h-[17px] w-[17px] text-white/25" />Pengaturan situs</button>
          <a href="/" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-white/40 hover:bg-white/[0.035]"><Eye className="h-[17px] w-[17px] text-white/25" />Lihat situs publik</a>
        </nav>
        <div className="border-t border-white/[0.06] p-4"><div className="flex items-center gap-3 rounded-xl bg-white/[0.025] p-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-bara-orange to-bara-red text-xs font-bold">AF</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Arya Fajar</p><p className="truncate text-[10px] text-white/30">Super Admin</p></div><LogOut className="h-4 w-4 text-white/25" /></div></div>
      </aside>

      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-[90] flex h-20 items-center border-b border-white/[0.06] bg-[#0d0908]/90 px-5 backdrop-blur-xl md:px-8 lg:px-10">
          <button onClick={() => setMobileNav(true)} className="mr-4 lg:hidden"><Menu className="h-5 w-5" /></button>
          <div className="hidden items-center gap-2 text-[11px] text-white/25 sm:flex"><span>Admin</span><span>/</span><span className="text-white/55">{copy.title}</span></div>
          <div className="ml-auto flex items-center gap-2"><button className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/40"><Bell className="h-4 w-4" /></button><div className="hidden h-8 w-px bg-white/[0.07] md:block" /><button className="hidden items-center gap-2 rounded-xl px-2 py-1.5 text-xs text-white/65 md:flex"><CircleUserRound className="h-5 w-5 text-orange-300/70" />Arya Fajar<ChevronDown className="h-3 w-3 text-white/25" /></button></div>
        </header>

        <main className="mx-auto max-w-[1500px] px-5 pb-20 pt-9 md:px-8 lg:px-10">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-bara-orange"><span className="h-px w-5 bg-bara-orange" />{copy.eyebrow}</p><h1 className="font-display text-4xl leading-none text-white/95 md:text-5xl">{copy.title}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-white/38">{copy.description}</p></div>{module !== "overview" && <button onClick={() => openDrawer(module === "users" ? "user" : module === "instagram" ? "instagram" : module === "units" ? "unit" : "news")} className="admin-primary-button"><Plus className="h-4 w-4" />{module === "users" ? "Tambah pengguna" : module === "instagram" ? "Tambah tautan" : module === "units" ? "Tambah unit" : "Tulis informasi"}</button>}</div>

          {module === "overview" && <Overview onNavigate={go} onCreate={() => openDrawer("news")} />}
          {module === "users" && <UsersModule users={users} search={search} setSearch={setSearch} onEdit={(name) => openDrawer("user", name)} onDelete={deleteUser} />}
          {module === "instagram" && <InstagramModule posts={posts} search={search} setSearch={setSearch} setPosts={setPosts} onEdit={(name) => openDrawer("instagram", name)} onDelete={deletePost} />}
          {module === "units" && <UnitsModule units={filteredUnits} search={search} setSearch={setSearch} onEdit={(name) => openDrawer("unit", name)} />}
          {module === "news" && <NewsModule articles={filteredArticles} search={search} setSearch={setSearch} onEdit={(name) => openDrawer("news", name)} />}
        </main>
      </div>

      {drawer && <EditorDrawer kind={drawer} editing={editing} onClose={() => setDrawer(null)} onSave={() => { setDrawer(null); notify(editing ? "Perubahan berhasil disimpan." : "Item baru berhasil ditambahkan."); }} />}
      {toast && <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-[#15120f] px-4 py-3 text-xs shadow-2xl"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><Check className="h-3.5 w-3.5" /></span>{toast}</div>}
    </div>
  );
}

function Overview({ onNavigate, onCreate }: { onNavigate: (m: Module) => void; onCreate: () => void }) {
  const recent = ARTICLES.slice(0, 4);
  return <div className="space-y-8">
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Konten tayang" value="42" note="8 diperbarui bulan ini" icon={FileText} accent="border-orange-400/15 bg-orange-400/[0.07] text-orange-300" /><Metric label="Unit kabinet" value="12" note="Seluruh profil aktif" icon={Building2} accent="border-amber-400/15 bg-amber-400/[0.07] text-amber-200" /><Metric label="Admin aktif" value="3" note="1 akun sedang nonaktif" icon={Users} accent="border-sky-400/15 bg-sky-400/[0.07] text-sky-300" /><Metric label="Tautan Instagram" value="4" note="2 konten disorot" icon={Instagram} accent="border-fuchsia-400/15 bg-fuchsia-400/[0.07] text-fuchsia-300" /></section>
    <section className="grid gap-6 xl:grid-cols-[1.55fr_.85fr]">
      <div className="admin-panel p-5 md:p-6"><SectionHeader title="Aktivitas konten" caption="Perubahan terakhir pada situs" action="Buka informasi" onAction={() => onNavigate("news")} /><div className="divide-y divide-white/[0.06]">{recent.map((article, index) => <div key={article.id} className="flex items-center gap-4 py-4"><div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5"><Image src={article.image} alt="" fill className="object-cover opacity-70" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-white/75">{article.title}</p><p className="mt-1 text-[10px] text-white/30">{index === 0 ? "Diedit 14 menit lalu" : `${index + 1} hari lalu`} · {article.category}</p></div>{article.pinned ? <StatusPill tone="orange">Sorotan</StatusPill> : <StatusPill>Tayang</StatusPill>}</div>)}</div></div>
      <div className="admin-panel overflow-hidden"><div className="relative border-b border-white/[0.06] p-6"><div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-bara-orange/10 blur-3xl" /><div className="relative"><span className="grid h-10 w-10 place-items-center rounded-xl border border-orange-400/20 bg-orange-400/[0.08] text-orange-300"><Sparkles className="h-4 w-4" /></span><h2 className="mt-5 font-display text-2xl">Mulai menulis.</h2><p className="mt-2 text-xs leading-5 text-white/35">Publikasikan kabar terbaru atau simpan sebagai draf untuk ditinjau tim.</p><button onClick={onCreate} className="admin-primary-button mt-6 w-full justify-center"><Plus className="h-4 w-4" />Informasi baru</button></div></div><div className="p-5"><p className="text-[10px] font-semibold uppercase tracking-wider text-white/25">Perlu perhatian</p><div className="mt-4 space-y-3"><button onClick={() => onNavigate("instagram")} className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] p-3 text-left hover:bg-white/[0.025]"><Clock3 className="h-4 w-4 text-amber-300" /><span className="flex-1 text-[11px] text-white/55">1 post Instagram masih draf</span><ArrowRight className="h-3 w-3 text-white/25" /></button><button onClick={() => onNavigate("users")} className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] p-3 text-left hover:bg-white/[0.025]"><ShieldCheck className="h-4 w-4 text-sky-300" /><span className="flex-1 text-[11px] text-white/55">Tinjau 1 akun nonaktif</span><ArrowRight className="h-3 w-3 text-white/25" /></button></div></div></div>
    </section>
  </div>;
}

function Toolbar({ search, setSearch, placeholder, filter = "Semua status" }: { search: string; setSearch: (v: string) => void; placeholder: string; filter?: string }) {
  return <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} className="admin-input pl-10" /></label><button className="admin-filter-button">{filter}<ChevronDown className="h-3.5 w-3.5" /></button></div>;
}

function UsersModule({ users, search, setSearch, onEdit, onDelete }: { users: AdminUser[]; search: string; setSearch: (v: string) => void; onEdit: (v: string) => void; onDelete: (v: string) => void }) {
  const rows = users.filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase()));
  return <section className="admin-panel overflow-hidden"><Toolbar search={search} setSearch={setSearch} placeholder="Cari nama atau email..." filter="Semua peran" /><div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>Pengguna</th><th>Peran</th><th>Status</th><th>Aktivitas terakhir</th><th /></tr></thead><tbody>{rows.map((user) => <tr key={user.email}><td><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-white/10 to-white/[0.03] text-[10px] font-bold text-orange-200">{user.initials}</span><div><p className="font-medium text-white/75">{user.name}</p><p className="mt-0.5 text-[10px] text-white/30">{user.email}</p></div></div></td><td>{user.role}</td><td><StatusPill tone={user.status === "Aktif" ? "green" : "muted"}>{user.status}</StatusPill></td><td>{user.lastSeen}</td><td><div className="flex justify-end gap-1"><button onClick={() => onEdit(user.name)} className="admin-icon-button"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => onDelete(user.email)} className="admin-icon-button hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}</tbody></table></div><div className="admin-table-footer">Menampilkan {rows.length} dari {users.length} pengguna</div></section>;
}

function InstagramModule({ posts, search, setSearch, setPosts, onEdit, onDelete }: { posts: InstagramPost[]; search: string; setSearch: (v: string) => void; setPosts: (v: InstagramPost[]) => void; onEdit: (v: string) => void; onDelete: (v: string) => void }) {
  const rows = posts.filter((p) => `${p.title} ${p.url}`.toLowerCase().includes(search.toLowerCase()));
  const toggle = (code: string) => setPosts(posts.map((post) => post.shortcode === code ? { ...post, highlighted: !post.highlighted } : post));
  return <section className="admin-panel overflow-hidden"><Toolbar search={search} setSearch={setSearch} placeholder="Cari judul atau tautan..." /><div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>Konten</th><th>Penempatan</th><th>Sorotan</th><th>Status</th><th /></tr></thead><tbody>{rows.map((post) => <tr key={post.shortcode}><td><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl border border-fuchsia-400/10 bg-gradient-to-br from-fuchsia-500/15 via-orange-400/10 to-transparent"><Instagram className="h-4 w-4 text-orange-200/70" /></div><div className="max-w-sm"><p className="truncate font-medium text-white/75">{post.title}</p><p className="mt-1 flex items-center gap-1 truncate text-[10px] text-white/28"><Link2 className="h-3 w-3" />/p/{post.shortcode}</p></div></div></td><td>{post.placement}</td><td><button onClick={() => toggle(post.shortcode)} className={`relative h-6 w-11 rounded-full transition ${post.highlighted ? "bg-bara-orange" : "bg-white/10"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${post.highlighted ? "left-6" : "left-1"}`} /></button></td><td><StatusPill tone={post.status === "Tayang" ? "green" : "amber"}>{post.status}</StatusPill></td><td><div className="flex justify-end gap-1"><button onClick={() => onEdit(post.title)} className="admin-icon-button"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => onDelete(post.shortcode)} className="admin-icon-button hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}</tbody></table></div><div className="admin-table-footer">Maksimal 4 konten sorotan per halaman · {posts.filter((p) => p.highlighted).length} sedang dipilih</div></section>;
}

function UnitsModule({ units, search, setSearch, onEdit }: { units: typeof ORGANIZATION_UNITS; search: string; setSearch: (v: string) => void; onEdit: (v: string) => void }) {
  return <section className="admin-panel overflow-hidden"><Toolbar search={search} setSearch={setSearch} placeholder="Cari biro, bidang, atau tim..." filter="Semua jenis" /><div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-3">{units.map((unit) => <article key={unit.slug} className="group bg-[#12100e] p-5 transition hover:bg-[#17120f]"><div className="flex items-start gap-4"><div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#8e2517]"><Image src={unit.logo} alt="" fill className="object-cover" /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><StatusPill tone={unit.type === "Bidang" ? "orange" : unit.type === "Biro" ? "amber" : "muted"}>{unit.type}</StatusPill><button className="text-white/20"><MoreHorizontal className="h-4 w-4" /></button></div><h3 className="mt-3 truncate text-sm font-semibold text-white/80">{unit.shortName}</h3><p className="mt-1 truncate text-[10px] text-white/32">{unit.name}</p></div></div><p className="mt-5 line-clamp-2 min-h-[40px] text-xs leading-5 text-white/38">{unit.summary}</p><div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-center"><div><p className="text-sm font-semibold text-white/65">{unit.strategies.length}</p><p className="text-[9px] text-white/25">Strategi</p></div><div><p className="text-sm font-semibold text-white/65">{unit.programs?.length ?? 0}</p><p className="text-[9px] text-white/25">Program</p></div><div><p className="text-sm font-semibold text-white/65">{unit.members?.length ?? 0}</p><p className="text-[9px] text-white/25">Personel</p></div></div><button onClick={() => onEdit(unit.name)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] py-2.5 text-[11px] text-white/45 transition hover:border-orange-400/20 hover:text-orange-200"><Pencil className="h-3 w-3" />Kelola profil unit</button></article>)}</div><div className="admin-table-footer">{units.length} unit kabinet ditemukan</div></section>;
}

function NewsModule({ articles, search, setSearch, onEdit }: { articles: typeof ARTICLES; search: string; setSearch: (v: string) => void; onEdit: (v: string) => void }) {
  return <section className="admin-panel overflow-hidden"><Toolbar search={search} setSearch={setSearch} placeholder="Cari judul informasi..." filter="Semua kategori" /><div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>Informasi</th><th>Kategori</th><th>Tanggal</th><th>Status</th><th /></tr></thead><tbody>{articles.map((article) => <tr key={article.id}><td><div className="flex items-center gap-3"><div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5"><Image src={article.image} alt="" fill className="object-cover opacity-75" /></div><div className="max-w-md"><p className="line-clamp-1 font-medium text-white/75">{article.title}</p><p className="mt-1 line-clamp-1 text-[10px] text-white/30">{article.excerpt}</p></div></div></td><td><span className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] text-white/45">{article.category}</span></td><td>{new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(article.date))}</td><td>{article.pinned ? <StatusPill tone="orange">Utama</StatusPill> : <StatusPill>Tayang</StatusPill>}</td><td><div className="flex justify-end gap-1"><button onClick={() => onEdit(article.title)} className="admin-icon-button"><Pencil className="h-3.5 w-3.5" /></button><button className="admin-icon-button hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}</tbody></table></div><div className="admin-table-footer">Menampilkan {articles.length} informasi · Data UI sementara</div></section>;
}

function EditorDrawer({ kind, editing, onClose, onSave }: { kind: Exclude<DrawerKind, null>; editing: string | null; onClose: () => void; onSave: () => void }) {
  const labels = { user: ["Pengguna", "Atur identitas dan hak akses akun."], instagram: ["Konten Instagram", "Hubungkan post dan pilih lokasi tampil."], unit: ["Profil Unit", "Kelola seluruh isi halaman detail unit."], news: ["Informasi", "Susun berita untuk portal informasi."] } as const;
  return <div className="fixed inset-0 z-[180] bg-black/65 backdrop-blur-sm" onMouseDown={onClose}><aside className="absolute inset-y-0 right-0 w-full max-w-[620px] overflow-y-auto border-l border-white/[0.08] bg-[#12100e] shadow-2xl" onMouseDown={(e) => e.stopPropagation()}><div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/[0.07] bg-[#12100e]/95 px-6 py-5 backdrop-blur-xl"><div><p className="text-[10px] uppercase tracking-[0.18em] text-bara-orange">{editing ? "Edit" : "Tambah baru"}</p><h2 className="mt-2 font-display text-2xl">{labels[kind][0]}</h2><p className="mt-1 text-xs text-white/35">{labels[kind][1]}</p></div><button onClick={onClose} className="admin-icon-button"><X className="h-4 w-4" /></button></div><div className="p-6">{kind === "user" && <UserForm editing={editing} />}{kind === "instagram" && <InstagramForm editing={editing} />}{kind === "unit" && <UnitForm editing={editing} />}{kind === "news" && <NewsForm editing={editing} />}</div><div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-white/[0.07] bg-[#12100e]/95 px-6 py-4 backdrop-blur-xl"><p className="hidden text-[10px] text-white/25 sm:block">Periksa kembali sebelum menyimpan.</p><div className="ml-auto flex gap-2"><button onClick={onClose} className="admin-secondary-button">Batal</button><button onClick={onSave} className="admin-primary-button"><Check className="h-4 w-4" />Simpan</button></div></div></aside></div>;
}

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => <label className="block"><span className="mb-2 block text-[11px] font-semibold text-white/55">{label}</span>{children}{hint && <span className="mt-1.5 block text-[10px] text-white/25">{hint}</span>}</label>;
const input = "admin-input";

function UserForm({ editing }: { editing: string | null }) { return <div className="space-y-5"><Field label="Nama lengkap"><input className={input} defaultValue={editing ?? ""} placeholder="Nama pengelola" /></Field><Field label="Email"><input className={input} type="email" placeholder="nama@bemfsm.id" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Peran"><select className={input}><option>Editor Konten</option><option>Admin Bidang</option><option>Super Admin</option></select></Field><Field label="Status"><select className={input}><option>Aktif</option><option>Nonaktif</option></select></Field></div><div className="rounded-xl border border-sky-400/10 bg-sky-400/[0.04] p-4"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-sky-300" /><p className="text-[11px] leading-5 text-white/38">Tautan aktivasi dikirim lewat email. Editor hanya dapat mengelola konten; Super Admin dapat mengatur akun dan seluruh modul.</p></div></div></div>; }
function InstagramForm({ editing }: { editing: string | null }) { return <div className="space-y-5"><Field label="Tautan post Instagram" hint="Shortcode dibaca otomatis dari tautan post atau reel."><div className="relative"><Link2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" /><input className={`${input} pl-10`} placeholder="https://instagram.com/p/..." /></div></Field><Field label="Judul internal"><input className={input} defaultValue={editing ?? ""} placeholder="Nama agar mudah dicari" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Status"><select className={input}><option>Tayang</option><option>Draf</option></select></Field><Field label="Penempatan"><select className={input}><option>Beranda & Informasi</option><option>Beranda</option><option>Informasi</option></select></Field></div><label className="flex items-center justify-between rounded-xl border border-white/[0.07] p-4"><div><p className="text-xs font-medium text-white/60">Jadikan sorotan</p><p className="mt-1 text-[10px] text-white/27">Prioritaskan konten pada urutan teratas.</p></div><input type="checkbox" className="h-4 w-4 accent-orange-500" /></label></div>; }
function UnitForm({ editing }: { editing: string | null }) { return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama unit"><input className={input} defaultValue={editing ?? ""} placeholder="Nama lengkap" /></Field><Field label="Nama singkat"><input className={input} placeholder="Contoh: KMI" /></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Jenis"><select className={input}><option>Bidang</option><option>Biro</option><option>Tim</option></select></Field><Field label="Slug halaman"><input className={input} placeholder="nama-unit" /></Field></div><Field label="Logo unit"><button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.015] py-7 text-xs text-white/35 hover:border-orange-400/25"><Upload className="h-4 w-4" />Unggah logo PNG / WebP</button></Field><Field label="Deskripsi singkat"><textarea className={`${input} min-h-20 resize-y`} placeholder="Ringkasan pada kartu unit" /></Field><Field label="Tentang unit / Peran dalam kabinet"><textarea className={`${input} min-h-28 resize-y`} placeholder="Jelaskan peran utama unit" /></Field><Repeater title="Arah strategis" placeholder="Tambah fokus gerak" /><Repeater title="Program kerja" placeholder="Tambah program kerja" /><FunctionaryRepeater /></div>; }
function Repeater({ title, placeholder }: { title: string; placeholder: string }) { const [count, setCount] = useState(1); return <div><div className="mb-2 flex items-center justify-between"><p className="text-[11px] font-semibold text-white/55">{title}</p><button type="button" onClick={() => setCount(count + 1)} className="text-[10px] text-orange-300"><Plus className="mr-1 inline h-3 w-3" />Tambah</button></div><div className="space-y-2">{Array.from({ length: count }).map((_, index) => <div key={index} className="flex items-center gap-2"><GripVertical className="h-4 w-4 text-white/15" /><input className={input} placeholder={placeholder} /><button className="admin-icon-button"><Trash2 className="h-3 w-3" /></button></div>)}</div></div>; }

function FunctionaryRepeater() {
  const [members, setMembers] = useState([{ id: 1, image: "" }]);
  const addMember = () => setMembers([...members, { id: Date.now(), image: "" }]);
  const removeMember = (id: number) => setMembers(members.filter((member) => member.id !== id));
  const setImage = (id: number, file?: File) => {
    if (!file) return;
    const image = URL.createObjectURL(file);
    setMembers(members.map((member) => member.id === id ? { ...member, image } : member));
  };

  return <div><div className="mb-3 flex items-center justify-between"><div><p className="text-[11px] font-semibold text-white/55">Fungsionaris</p><p className="mt-1 text-[10px] text-white/25">Foto potret, nama, dan jabatan setiap anggota.</p></div><button type="button" onClick={addMember} className="text-[10px] text-orange-300"><Plus className="mr-1 inline h-3 w-3" />Tambah</button></div><div className="space-y-3">{members.map((member, index) => <div key={member.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-3.5"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><GripVertical className="h-4 w-4 text-white/15" /><span className="text-[10px] font-semibold uppercase tracking-wider text-white/28">Anggota {String(index + 1).padStart(2, "0")}</span></div><button type="button" onClick={() => removeMember(member.id)} disabled={members.length === 1} className="admin-icon-button hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-20"><Trash2 className="h-3.5 w-3.5" /></button></div><div className="grid gap-3 sm:grid-cols-[96px_1fr]"><label className="group relative grid aspect-[4/5] cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-white/10 bg-white/[0.02] transition hover:border-orange-400/30">{member.image ? <img src={member.image} alt="Preview fungsionaris" className="h-full w-full object-cover" /> : <span className="flex flex-col items-center gap-2 text-center text-[9px] leading-4 text-white/28"><Upload className="h-4 w-4" />Unggah<br />foto</span>}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => setImage(member.id, event.target.files?.[0])} />{member.image && <span className="absolute inset-x-1.5 bottom-1.5 rounded-md bg-black/70 py-1 text-center text-[8px] text-white/70 opacity-0 backdrop-blur transition group-hover:opacity-100">Ganti foto</span>}</label><div className="space-y-3"><Field label="Nama lengkap"><input className={input} placeholder="Nama fungsionaris" /></Field><Field label="Jabatan"><input className={input} placeholder="Ketua, Kepala Bidang, Staf..." /></Field></div></div></div>)}</div></div>;
}
function NewsForm({ editing }: { editing: string | null }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [cover, setCover] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [status, setStatus] = useState("Tayang");

  const command = (name: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(name, false, value);
    setWordCount((editorRef.current?.innerText.trim().match(/\S+/g) ?? []).length);
  };
  const insertLink = () => {
    const url = window.prompt("Masukkan URL lengkap", "https://");
    if (url && url !== "https://") command("createLink", url);
  };
  const insertImage = () => {
    const url = window.prompt("Masukkan URL gambar", "https://");
    if (url && url !== "https://") command("insertImage", url);
  };
  const setCoverFile = (file?: File) => {
    if (!file) return;
    setCover(URL.createObjectURL(file));
  };

  const tools = [
    { label: "Undo", icon: Undo2, action: () => command("undo") },
    { label: "Redo", icon: Redo2, action: () => command("redo") },
    { label: "Bold", icon: Bold, action: () => command("bold") },
    { label: "Italic", icon: Italic, action: () => command("italic") },
    { label: "Underline", icon: Underline, action: () => command("underline") },
    { label: "Coret", icon: Strikethrough, action: () => command("strikeThrough") },
    { label: "Heading", icon: Heading2, action: () => command("formatBlock", "h2") },
    { label: "Kutipan", icon: Quote, action: () => command("formatBlock", "blockquote") },
    { label: "Bullet list", icon: List, action: () => command("insertUnorderedList") },
    { label: "Numbered list", icon: ListOrdered, action: () => command("insertOrderedList") },
    { label: "Rata kiri", icon: AlignLeft, action: () => command("justifyLeft") },
    { label: "Rata tengah", icon: AlignCenter, action: () => command("justifyCenter") },
    { label: "Rata kanan", icon: AlignRight, action: () => command("justifyRight") },
    { label: "Link", icon: Link2, action: insertLink },
    { label: "Gambar", icon: ImageIcon, action: insertImage },
    { label: "Hapus format", icon: RemoveFormatting, action: () => command("removeFormat") },
  ];

  return <div className="space-y-6">
    <section className="space-y-5"><div className="flex items-center gap-2 border-b border-white/[0.06] pb-3"><FileText className="h-4 w-4 text-orange-300" /><h3 className="text-xs font-semibold text-white/70">Informasi utama</h3></div><Field label="Judul informasi" hint="Tampil pada banner, kartu, breadcrumb, dan halaman detail."><input className={input} defaultValue={editing ?? ""} placeholder="Judul yang jelas dan ringkas" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Slug URL"><input className={input} placeholder="judul-informasi" /></Field><Field label="Penulis"><input className={input} placeholder="BEM FSM UNDIP / Nama penulis" /></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Kategori"><select className={input}><option>Kegiatan</option><option>Prestasi</option><option>Informasi</option><option>Beasiswa</option><option>Lomba</option></select></Field><Field label="Tanggal publikasi"><div className="relative"><CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" /><input className={`${input} pl-10`} type="date" /></div></Field></div><Field label="Ringkasan / excerpt" hint="Dipakai pada banner berita utama, kartu berita, dan pengantar halaman detail."><textarea maxLength={260} className={`${input} min-h-24 resize-y py-3`} placeholder="Ringkas isi berita dalam 1–2 kalimat" /></Field></section>

    <section className="space-y-4"><div className="flex items-center gap-2 border-b border-white/[0.06] pb-3"><ImageIcon className="h-4 w-4 text-orange-300" /><h3 className="text-xs font-semibold text-white/70">Gambar sampul</h3></div><input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => setCoverFile(event.target.files?.[0])} /><button type="button" onClick={() => coverInputRef.current?.click()} className="group relative flex aspect-[16/7] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/10 bg-white/[0.015] text-xs text-white/35 transition hover:border-orange-400/25">{cover ? <img src={cover} alt="Preview sampul" className="absolute inset-0 h-full w-full object-cover" /> : <span className="flex flex-col items-center gap-2"><Upload className="h-5 w-5" />Unggah sampul 16:9 · JPG, PNG, atau WebP</span>}{cover && <span className="relative rounded-lg bg-black/70 px-3 py-2 opacity-0 backdrop-blur transition group-hover:opacity-100">Ganti gambar sampul</span>}</button><Field label="Alt text gambar" hint="Wajib untuk aksesibilitas dan SEO."><input className={input} placeholder="Deskripsi singkat isi gambar" /></Field></section>

    <section className="space-y-4"><div className="flex items-center justify-between border-b border-white/[0.06] pb-3"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-orange-300" /><h3 className="text-xs font-semibold text-white/70">Isi artikel</h3></div><span className="text-[10px] text-white/25">{wordCount} kata · ±{Math.max(1, Math.ceil(wordCount / 200))} menit baca</span></div><div className="overflow-hidden rounded-xl border border-white/[0.08] focus-within:border-orange-400/25"><div className="flex flex-wrap gap-1 border-b border-white/[0.07] bg-white/[0.025] p-2">{tools.map((tool) => <button key={tool.label} type="button" title={tool.label} aria-label={tool.label} onMouseDown={(event) => event.preventDefault()} onClick={tool.action} className="admin-icon-button"><tool.icon className="h-3.5 w-3.5" /></button>)}<span className="mx-1 h-8 w-px bg-white/[0.07]" /><button type="button" title="Paragraf" onMouseDown={(event) => event.preventDefault()} onClick={() => command("formatBlock", "p")} className="admin-secondary-button h-8 px-3">Paragraf</button></div><div ref={editorRef} contentEditable suppressContentEditableWarning data-placeholder="Mulai tulis isi informasi. Gunakan heading untuk bagian, list untuk rincian, dan kutipan untuk pernyataan penting..." onInput={(event) => setWordCount((event.currentTarget.innerText.trim().match(/\S+/g) ?? []).length)} className="admin-rich-editor min-h-[360px] p-5 text-sm leading-7 text-white/65 outline-none" /></div><p className="flex items-center gap-2 text-[10px] text-white/25"><Code2 className="h-3 w-3" />Format tersimpan sebagai rich HTML dan perlu disanitasi saat backend dihubungkan.</p></section>

    <section className="space-y-5"><div className="flex items-center gap-2 border-b border-white/[0.06] pb-3"><Search className="h-4 w-4 text-orange-300" /><h3 className="text-xs font-semibold text-white/70">SEO & publikasi</h3></div><Field label="Meta description" hint="Rekomendasi 120–160 karakter untuk hasil pencarian."><textarea maxLength={160} className={`${input} min-h-20 resize-y py-3`} placeholder="Deskripsi artikel untuk mesin pencari" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Status"><select value={status} onChange={(event) => setStatus(event.target.value)} className={input}><option>Tayang</option><option>Draf</option><option>Terjadwal</option></select></Field>{status === "Terjadwal" ? <Field label="Waktu tayang"><input className={input} type="datetime-local" /></Field> : <Field label="Visibilitas"><select className={input}><option>Publik</option><option>Internal</option></select></Field>}</div><label className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.015] p-4"><div><p className="text-xs font-medium text-white/60">Jadikan berita utama</p><p className="mt-1 text-[10px] text-white/27">Artikel tampil besar pada banner teratas halaman Informasi. Hanya satu artikel aktif.</p></div><input type="checkbox" className="h-4 w-4 accent-orange-500" /></label></section>
  </div>;
}
