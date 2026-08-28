import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ImageIcon } from "lucide-react";
import { fetchAllPublicUnitSlugs, fetchUnitBySlug } from "@/lib/server-api";
import { UNIT_TYPE_LABELS, type UnitMember, type UnitProgram } from "@/lib/types";
import { placeholderLogo, initialsColor } from "@/lib/placeholder";

export async function generateStaticParams() {
  try {
    return (await fetchAllPublicUnitSlugs()).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;
export const revalidate = 60;

const TYPE_TONE: Record<string, string> = {
  DIVISION: "bg-orange-400/10 text-orange-300 border-orange-400/20",
  BUREAU: "bg-amber-400/10 text-amber-200 border-amber-400/20",
  TEAM: "bg-sky-400/10 text-sky-300 border-sky-400/20",
};

export default async function UnitDetailPage({ params }: { params: { slug: string } }) {
  const unit = await fetchUnitBySlug(params.slug);
  if (!unit) notFound();

  const activeMembers = unit.members.filter((m) => m.isActive);
  const visiblePrograms = unit.programs.filter(
    (p) => p.status === "ACTIVE" || p.status === "PLANNED" || p.status === "COMPLETED"
  );

  return (
    <div className="relative bg-bara-bg-dark pb-24 pt-28">
      <div aria-hidden className="absolute left-1/2 top-20 h-96 w-[70vw] -translate-x-1/2 rounded-full bg-bara-red/10 blur-[120px]" />

      <main className="relative mx-auto max-w-7xl px-6 md:px-10">
        <Link
          href="/bidang"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke struktur kabinet
        </Link>

        <header className="mt-10 grid items-center gap-8 border-b border-white/[0.07] pb-14 md:grid-cols-[190px_1fr] md:gap-12">
          <div className="relative aspect-square w-36 overflow-hidden rounded-[2rem] border border-white/10 bg-[#9f2312] shadow-[0_24px_70px_rgba(0,0,0,0.3)] md:w-48">
            {unit.logo?.url ? (
              <Image
                src={unit.logo.url}
                alt={`Logo ${unit.name}`}
                fill
                sizes="192px"
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src={placeholderLogo(unit.shortName ?? unit.name, 192)}
                alt={`Logo ${unit.name}`}
                fill
                sizes="192px"
                className="object-cover"
                priority
              />
            )}
          </div>
          <div>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
              <span className={`rounded-full border px-3 py-1 ${TYPE_TONE[unit.type] ?? "border-white/10 text-white/55"}`}>
                {UNIT_TYPE_LABELS[unit.type]}
              </span>
              {unit.shortName && <span className="text-bara-orange">{unit.shortName}</span>}
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-5xl leading-[0.95] md:text-7xl">
              {unit.name}
            </h1>
            {unit.summary && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
                {unit.summary}
              </p>
            )}
          </div>
        </header>

        {unit.description && (
          <section className="grid gap-12 border-b border-white/[0.07] py-16 md:grid-cols-12 md:py-20">
            <div className="md:col-span-4">
              <p className="section-kicker">Tentang unit</p>
              <h2 className="font-display text-3xl md:text-4xl">Peran dalam kabinet</h2>
            </div>
            <p className="text-base leading-8 text-white/65 md:col-span-8 md:text-lg">
              {unit.description}
            </p>
          </section>
        )}

        {unit.strategies.length > 0 && (
          <section className="border-b border-white/[0.07] py-16 md:py-20">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="section-kicker">Arah strategis</p>
                <h2 className="font-display text-3xl md:text-4xl">Fokus gerak 2026</h2>
              </div>
              <ol className="space-y-3 md:col-span-8">
                {unit.strategies
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((strategy, index) => (
                    <li
                      key={strategy.id}
                      className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-sm leading-7 text-white/65"
                    >
                      <span className="font-display text-xl text-bara-orange">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{strategy.content}</span>
                    </li>
                  ))}
              </ol>
            </div>
          </section>
        )}

        <section className="border-b border-white/[0.07] py-16 md:py-20">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">Program kerja</p>
              <h2 className="font-display text-3xl md:text-4xl">Dari arah menjadi karya</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/40">
              {visiblePrograms.length > 0
                ? "Berikut program kerja yang menjadi prioritas utama unit."
                : "Nama program, tujuan, jadwal, dan deskripsi dapat ditampilkan di sini."}
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <ProgramList programs={visiblePrograms} />
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">Fungsionaris</p>
              <h2 className="font-display text-3xl md:text-4xl">Orang di balik gerak</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/40">
              {activeMembers.length > 0
                ? `${activeMembers.length} anggota aktif mengelola ${unit.name}.`
                : "Foto dan identitas anggota belum tersedia."}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <MembersList members={activeMembers} />
          </div>
        </section>
      </main>
    </div>
  );
}

function ProgramList({ programs }: { programs: UnitProgram[] }) {
  if (programs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-7 md:col-span-2">
        <Check className="h-5 w-5 text-bara-orange" />
        <p className="mt-8 font-display text-2xl text-white/60">Program kerja segera hadir</p>
        <p className="mt-3 text-sm leading-6 text-white/35">
          Nama program, tujuan, jadwal, dan deskripsi dapat ditampilkan di sini.
        </p>
      </div>
    );
  }
  return (
    <>
      {programs.map((program) => (
        <article
          key={program.id}
          className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7"
        >
          <Check className="h-5 w-5 text-bara-orange" />
          <p className="mt-8 font-display text-2xl text-white/80">{program.name}</p>
          {program.scheduleLabel && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-bara-gold/70">
              {program.scheduleLabel}
            </p>
          )}
          {program.description && (
            <p className="mt-3 text-sm leading-6 text-white/45">{program.description}</p>
          )}
          {program.externalUrl && (
            <a
              href={program.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-xs font-semibold text-bara-orange hover:underline"
            >
              Info selengkapnya →
            </a>
          )}
        </article>
      ))}
    </>
  );
}

function MembersList({ members }: { members: UnitMember[] }) {
  if (members.length === 0) {
    return Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]"
      >
        <div className="grid aspect-[4/5] place-items-center bg-white/[0.018]">
          <ImageIcon className="h-7 w-7 text-white/20" strokeWidth={1.5} />
        </div>
        <div className="border-t border-white/[0.06] p-4">
          <p className="font-display text-lg text-white/55">Profil anggota</p>
          <p className="mt-1 text-xs text-white/30">Nama · Jabatan</p>
        </div>
      </div>
    ));
  }
  return members.map((member) => (
    <article
      key={member.id}
      className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]"
    >
      <div className="relative aspect-[4/5]">
        {member.photo?.url ? (
          <Image
            src={member.photo.url}
            alt={member.photoAlt ?? member.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
        ) : (
          <MemberInitials name={member.name} />
        )}
      </div>
      <div className="border-t border-white/[0.06] p-4">
        <p className="font-display text-lg text-white/80">{member.name}</p>
        <p className="mt-1 text-xs text-white/40">{member.role}</p>
      </div>
    </article>
  ));
}

function MemberInitials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const { bg, fg } = initialsColor(name);
  return (
    <div
      className="grid h-full w-full place-items-center font-display text-3xl"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </div>
  );
}
