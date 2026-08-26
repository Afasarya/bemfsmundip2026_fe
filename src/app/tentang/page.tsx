"use client";

import { motion } from "framer-motion";
import { Compass, Target, Sparkles, ArrowRight, Flame } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import LeadershipSection from "@/components/tentang/LeadershipSection";
import SequenceScroll from "@/components/tentang/SequenceScroll";
import { VISI_TEXT, MISI_LIST, STATS } from "@/lib/data";

export default function TentangPage() {
  return (
    <div className="relative bg-bara-bg-dark">
      <LeadershipSection />
      <SequenceScroll />

      <section className="relative z-30 -mt-8 rounded-t-[2rem] border-t border-white/10 bg-bara-bg-dark px-6 pb-24 pt-20 shadow-[0_-20px_45px_rgba(0,0,0,0.2)] md:-mt-12 md:rounded-t-[3rem] md:px-10 md:pb-32 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          >
            <p className="section-kicker">Tentang Kabinet</p>
            <h2 className="font-display max-w-4xl text-5xl leading-[0.95] md:text-7xl">
              Kabinet <span className="italic gradient-text">Bara Momentum</span>
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
              Sebuah kabinet yang lahir dari keyakinan: setiap mahasiswa FSM UNDIP
              memiliki bara potensi yang layak dinyalakan, dan setiap momentum yang
              terbangun layak dijaga hingga menjadi karya nyata.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="bg-bara-bg-dark p-5 md:p-6">
                <p className="font-display text-3xl font-semibold gradient-text md:text-4xl">{s.value}</p>
                <p className="mt-2 text-xs font-medium tracking-[0.04em] text-white/45">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Visi */}
      <section className="relative z-40 -mt-8 rounded-t-[2rem] border-t border-white/10 bg-bara-bg-dark px-6 pb-28 pt-20 md:-mt-12 md:rounded-t-[3rem] md:px-10 md:pb-36 md:pt-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="inline-flex items-center gap-2 text-bara-gold mb-4">
              <Compass className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">Visi</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-bara-orange" />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-8"
          >
            <p className="font-display text-3xl md:text-4xl leading-[1.3] text-white/90">
              "{VISI_TEXT}"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Misi */}
      <section className="relative z-50 -mt-8 rounded-t-[2rem] border-t border-white/10 bg-bara-bg-dark px-6 pb-28 pt-20 md:-mt-12 md:rounded-t-[3rem] md:px-10 md:pb-36 md:pt-28">
        <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="inline-flex items-center gap-2 text-bara-gold mb-4">
              <Target className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">Misi</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl">
              Enam arah gerak yang menjaga bara tetap <span className="italic gradient-text">menyala.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MISI_LIST.map((m, i) => (
            <motion.div
              key={m.no}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bento-card rounded-3xl p-8 group"
            >
              <div className="flex items-start gap-5">
                <span className="font-display text-4xl text-white/20 group-hover:text-bara-orange transition-colors duration-500">
                  {m.no}
                </span>
                <div>
                  <h3 className="font-display text-2xl mb-3">{m.title}</h3>
                  <p className="text-white/50 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-[60] -mt-8 rounded-t-[2rem] border-t border-white/10 bg-bara-bg-dark px-6 pb-16 pt-20 text-center md:-mt-12 md:rounded-t-[3rem] md:px-10 md:pb-20 md:pt-28">
        <div className="mx-auto max-w-4xl">
        <Sparkles className="w-8 h-8 text-bara-gold mx-auto mb-6" />
        <h2 className="font-display text-3xl md:text-5xl leading-tight">
          Ingin tahu bagaimana kami <span className="italic gradient-text">mengeksekusinya?</span>
        </h2>
        <div className="mt-8">
          <MagneticButton
            href="/bidang"
            className="bg-gradient-to-r from-bara-orange to-bara-red text-white border border-bara-orange/30 hover:shadow-[0_0_50px_-5px_rgba(242,92,5,0.6)]"
          >
            Lihat Bidang & Biro
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
        </div>
      </section>
    </div>
  );
}