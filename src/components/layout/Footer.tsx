"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ArrowUpRight, Instagram, Youtube } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/data";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-bara-bg-dark">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bara-maroon/10 pointer-events-none" />
      <motion.div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-bara-orange/10 blur-[120px]"
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src="/images/barmon.webp"
                  alt="Logo Bara Momentum BEM FSM UNDIP"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">Bara Momentum</p>
                <p className="text-[0.6875rem] font-medium tracking-[0.06em] text-white/50">
                  BEM FSM UNDIP 2026
                </p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              Menyalakan potensi, menjaga momentum. Kabinet Bara Momentum berkomitmen
              menjadi katalis perubahan untuk mahasiswa Fakultas Sains dan Matematika
              Universitas Diponegoro 2026.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://www.instagram.com/bemfsm_undip/" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-bara-gold hover:border-bara-gold/40 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/@BEMFSM" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-bara-gold hover:border-bara-gold/40 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="mailto:bemfsmundip.official2@gmail.com" aria-label="Email" className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-bara-gold hover:border-bara-gold/40 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Program</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.program.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-1 group">
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Kabinet</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.kabinet.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Sekretariat</p>
            <p className="text-sm text-white/60 leading-relaxed inline-flex gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-bara-gold/70 shrink-0" />
              <span className="hover:text-white ">
                <a href="https://maps.app.goo.gl/fMgbWRpsg6BdWBzW6">Gedung Dekanat FSM Lantai 1<br />
                Universitas Diponegoro<br />
                Semarang, Jawa Tengah 50275</a>
              </span>
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-white/30">
            © 2026 Kabinet Bara Momentum, BEM FSM UNDIP. All rights reserved.
          </p>
          <p className="text-xs text-white/30 font-display italic">
            "Bara Berdaya, Momentum Berkarya"
          </p>
        </motion.div>
      </div>
    </footer>
  );
}