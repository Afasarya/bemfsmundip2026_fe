import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ImageIcon } from "lucide-react";
import { ORGANIZATION_UNITS } from "@/data/organization";

export function generateStaticParams() {
  return ORGANIZATION_UNITS.map((unit) => ({ slug: unit.slug }));
}

export default function UnitDetailPage({ params }: { params: { slug: string } }) {
  const unit = ORGANIZATION_UNITS.find((item) => item.slug === params.slug);
  if (!unit) notFound();

  return (
    <div className="relative bg-bara-bg-dark pb-24 pt-28">
      <div aria-hidden className="absolute left-1/2 top-20 h-96 w-[70vw] -translate-x-1/2 rounded-full bg-bara-red/10 blur-[120px]" />
      <main className="relative mx-auto max-w-7xl px-6 md:px-10">
        <Link href="/bidang" className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Kembali ke struktur kabinet
        </Link>

        <header className="mt-10 grid items-center gap-8 border-b border-white/[0.07] pb-14 md:grid-cols-[190px_1fr] md:gap-12">
          <div className="relative aspect-square w-36 overflow-hidden rounded-[2rem] border border-white/10 bg-[#9f2312] shadow-[0_24px_70px_rgba(0,0,0,0.3)] md:w-48">
            <Image src={unit.logo} alt={`Logo ${unit.name}`} fill sizes="192px" className="object-cover" priority />
          </div>
          <div>
            <p className="section-kicker">{unit.type} · {unit.shortName}</p>
            <h1 className="max-w-4xl font-display text-5xl leading-[0.95] md:text-7xl">{unit.name}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">{unit.summary}</p>
          </div>
        </header>

        <section className="grid gap-12 border-b border-white/[0.07] py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4"><p className="section-kicker">Tentang unit</p><h2 className="font-display text-3xl md:text-4xl">Peran dalam kabinet</h2></div>
          <p className="text-base leading-8 text-white/65 md:col-span-8 md:text-lg">{unit.description}</p>
        </section>

        <section className="border-b border-white/[0.07] py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4"><p className="section-kicker">Arah strategis</p><h2 className="font-display text-3xl md:text-4xl">Fokus gerak 2026</h2></div>
            <ol className="space-y-3 md:col-span-8">
              {unit.strategies.map((strategy, index) => (
                <li key={strategy} className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-sm leading-7 text-white/65">
                  <span className="font-display text-xl text-bara-orange">{String(index + 1).padStart(2, "0")}</span><span>{strategy}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-white/[0.07] py-16 md:py-20">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="section-kicker">Program kerja</p><h2 className="font-display text-3xl md:text-4xl">Dari arah menjadi karya</h2></div>
            <p className="max-w-md text-sm leading-6 text-white/40">Nama dan deskripsi program kerja belum tersedia. Struktur kartu siap diisi saat data diberikan.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {unit.programs?.length ? unit.programs.map((program) => (
              <article key={program.name} className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7"><Check className="h-5 w-5 text-bara-orange" /><p className="mt-8 font-display text-2xl text-white/80">{program.name}</p>{program.schedule && <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-bara-gold/70">{program.schedule}</p>}<p className="mt-3 text-sm leading-6 text-white/45">{program.description}</p></article>
            )) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-7 md:col-span-2"><Check className="h-5 w-5 text-bara-orange" /><p className="mt-8 font-display text-2xl text-white/60">Program kerja segera hadir</p><p className="mt-3 text-sm leading-6 text-white/35">Nama program, tujuan, jadwal, dan deskripsi dapat ditampilkan di sini.</p></div>
            )}
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="section-kicker">Fungsionaris</p><h2 className="font-display text-3xl md:text-4xl">Orang di balik gerak</h2></div>
            <p className="max-w-md text-sm leading-6 text-white/40">Foto dan identitas anggota belum tersedia. Grid ini siap menampung banyak anggota tanpa popup.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {unit.members?.length ? unit.members.map((member) => (
              <article key={`${member.name}-${member.role}`} className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]">
                <div className="relative aspect-[4/5]"><Image src={member.image} alt={member.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" /></div>
                <div className="border-t border-white/[0.06] p-4"><p className="font-display text-lg text-white/80">{member.name}</p><p className="mt-1 text-xs text-white/40">{member.role}</p></div>
              </article>
            )) : Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]"><div className="grid aspect-[4/5] place-items-center bg-white/[0.018]"><ImageIcon className="h-7 w-7 text-white/20" strokeWidth={1.5} /></div><div className="border-t border-white/[0.06] p-4"><p className="font-display text-lg text-white/55">Profil anggota</p><p className="mt-1 text-xs text-white/30">Nama · Jabatan</p></div></div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
