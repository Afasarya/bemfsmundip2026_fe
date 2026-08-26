"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function LeadershipSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 54]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.965]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0.35]);

  return (
    <section ref={sectionRef} className="relative z-10 h-[115svh] bg-bara-bg-dark">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-bara-bg-dark">
        <div className="relative mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr] px-5 pb-5 pt-20 sm:px-8 md:px-12 md:pb-10 md:pt-24">
          <motion.header
            style={{ opacity: copyOpacity }}
            className="flex items-end justify-between gap-6 pb-5 md:pb-7"
          >
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-bara-orange">Pimpinan Kabinet</p>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-6 text-white/45 md:block">
              Ketua dan Wakil Ketua BEM FSM UNDIP 2026
            </p>
          </motion.header>

          <div className="relative aspect-[1054/1492] w-full self-start overflow-hidden rounded-[1.25rem] border border-white/[0.12] bg-[#130604] shadow-[0_24px_60px_rgba(0,0,0,0.28)] md:aspect-auto md:h-full md:min-h-0 md:self-stretch md:rounded-[1.75rem]">
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              initial={{ opacity: 0, clipPath: "inset(12% 0 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 hidden overflow-hidden md:block"
            >
              <Image
                src="/images/barmon-ketua-wakil.png"
                alt="Galen dan Faditya, Ketua dan Wakil Ketua BEM FSM UNDIP 2026"
                fill
                priority
                sizes="(min-width: 1280px) 1184px, 92vw"
                className="object-cover object-center"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 md:hidden"
            >
              <Image
                src="/images/mobile-ketua-wakil.png"
                alt="Galen dan Faditya, Ketua dan Wakil Ketua BEM FSM UNDIP 2026"
                fill
                priority
                sizes="(max-width: 767px) calc(100vw - 2.5rem), 1px"
                className="object-cover object-center"
              />
            </motion.div>

            <motion.div
              style={{ opacity: copyOpacity }}
              className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-16 md:px-7 md:pb-6 md:pt-24"
            >
              <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                <p className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white/60">Ketua BEM</p>
                <p className="mt-1 font-display text-xl font-medium text-white sm:text-2xl md:text-3xl">Galen</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-right">
                <p className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white/60">Wakil Ketua BEM</p>
                <p className="mt-1 font-display text-xl font-medium text-white sm:text-2xl md:text-3xl">Faditya</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
