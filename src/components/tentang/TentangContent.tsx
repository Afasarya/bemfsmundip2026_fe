"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { Icons } from "@/components/ui/Icons";
import {
  CORE_VALUES,
  MISI,
  PHILOSOPHY,
  VISI,
} from "@/data/site";

export default function TentangContent() {
  return (
    <div className="pb-10">
      {/* ---------------- Filosofi Nama ---------------- */}
      <section className="section-pad">
        <div className="container-bara">
          <SectionHeading
            eyebrow="Filosofi Nama"
            title="Bara Momentum"
            description="Dua kata yang menjadi nyawa pergerakan kabinet sepanjang tahun 2026."
          />
          <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-2">
            {PHILOSOPHY.name.map((n) => (
              <Reveal.Item key={n.key}>
                <div className="group relative h-full overflow-hidden rounded-3xl glass-panel p-8 transition-shadow hover:shadow-ember-lg">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-bara-orange/20 blur-2xl transition-all group-hover:bg-bara-orange/40" />
                  <span className="font-display text-6xl text-gradient-gold">
                    {n.key}
                  </span>
                  <p className="mt-4 text-base leading-relaxed text-bara-cream/75">
                    {n.meaning}
                  </p>
                </div>
              </Reveal.Item>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- Filosofi Logo ---------------- */}
      <section className="section-pad">
        <div className="container-bara grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center">
              <div className="absolute inset-0 rounded-full bg-bara-orange/20 blur-3xl" />
              <div className="relative grid h-64 w-64 place-items-center rounded-full bg-gradient-to-br from-bara-orange-lt via-bara-orange to-bara-red shadow-ember-lg">
                <Icons.flame className="h-32 w-32 animate-flicker text-bara-cream" />
                {/* 7 garis salur */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute h-2 w-16 origin-left rounded-full bg-bara-gold-lt/70"
                    style={{
                      transform: `rotate(${(360 / 7) * i}deg) translateX(120px)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Filosofi Logo"
              title="Makna di Balik Nyala Api"
              align="left"
            />
            <Reveal stagger className="mt-8 space-y-4">
              {PHILOSOPHY.logo.map((item, i) => (
                <Reveal.Item key={i}>
                  <div className="flex items-start gap-4 rounded-2xl glass-panel p-5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-bara-orange-lt to-bara-red text-sm font-bold text-bara-cream">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-bara-cream/80">
                      {item}
                    </p>
                  </div>
                </Reveal.Item>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Visi ---------------- */}
      <section className="section-pad">
        <div className="container-bara">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-bara-orange/30 bg-gradient-to-br from-bara-red/30 via-bara-maroon/40 to-bara-bg-dark p-10 text-center shadow-ember-lg sm:p-16">
              <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-bara-orange/30 blur-3xl" />
              <span className="inline-flex items-center gap-2 rounded-full glass-panel px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-bara-gold-lt">
                Visi
              </span>
              <p className="relative mx-auto mt-6 max-w-4xl font-display text-2xl leading-relaxed text-bara-cream sm:text-3xl">
                &ldquo;{VISI}&rdquo;
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Misi ---------------- */}
      <section className="section-pad">
        <div className="container-bara">
          <SectionHeading
            eyebrow="Misi"
            title="Enam Langkah Pergerakan"
            description="Arah strategis yang menuntun setiap program kerja kabinet."
          />
          <Reveal stagger className="mt-14 grid gap-5 md:grid-cols-2">
            {MISI.map((misi, i) => (
              <Reveal.Item key={i}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="flex h-full items-start gap-5 rounded-2xl glass-panel p-6 transition-shadow hover:shadow-ember"
                >
                  <span className="font-display text-5xl leading-none text-gradient-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-bara-cream/80">
                    {misi}
                  </p>
                </motion.div>
              </Reveal.Item>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- Core Values ---------------- */}
      <section className="section-pad">
        <div className="container-bara">
          <SectionHeading
            eyebrow="Nilai Inti"
            title="Empat Core Values"
          />
          <Reveal stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value) => {
              const Icon = Icons[value.icon as keyof typeof Icons] ?? Icons.spark;
              return (
                <Reveal.Item key={value.title}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="h-full rounded-3xl glass-panel p-7 text-center transition-shadow hover:shadow-ember-lg"
                  >
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-bara-orange-lt to-bara-red text-bara-cream shadow-ember">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl text-bara-cream">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-bara-cream/65">
                      {value.description}
                    </p>
                  </motion.div>
                </Reveal.Item>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ---------------- Budaya Kerja & Etika ---------------- */}
      <section className="section-pad">
        <div className="container-bara grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl glass-panel p-8">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-bara-gold-lt">
                <Icons.spark className="h-4 w-4" /> Budaya Kerja
              </span>
              <h3 className="mt-4 font-display text-3xl text-bara-cream">
                Pola Pikir yang Membangun
              </h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {PHILOSOPHY.workCulture.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-gradient-to-r from-bara-orange to-bara-red px-5 py-2.5 font-semibold text-bara-cream shadow-ember"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-bara-gold/30 bg-gradient-to-br from-bara-maroon/50 to-bara-bg-dark p-8">
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-bara-gold/20 blur-2xl" />
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-bara-gold-lt">
                <Icons.shield className="h-4 w-4" /> Prinsip Etika
              </span>
              <p className="mt-6 font-display text-2xl leading-relaxed text-gradient-gold sm:text-3xl">
                &ldquo;{PHILOSOPHY.ethics}&rdquo;
              </p>
              <p className="mt-4 text-sm leading-relaxed text-bara-cream/70">
                Segala keangkaramurkaan akan luluh oleh kelembutan dan kebijaksanaan.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
