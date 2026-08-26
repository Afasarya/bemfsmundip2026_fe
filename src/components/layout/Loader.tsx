"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

const DESKTOP_INTRO_DURATION = 2700;
const MOBILE_INTRO_DURATION = 900;

const IntroContext = createContext(false);

export function useIntroComplete() {
  return useContext(IntroContext);
}

export default function Loader({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    setIsMobile(mobile);

    if (reduceMotion) {
      setReady(true);
      setContentReady(true);
      return;
    }

    setVisible(true);
    setReady(true);
    document.documentElement.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setVisible(false);
      document.documentElement.style.overflow = "";
    }, mobile ? MOBILE_INTRO_DURATION : DESKTOP_INTRO_DURATION);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, [reduceMotion]);

  if (!ready) return null;

  return (
    <IntroContext.Provider value={contentReady}>
      <AnimatePresence onExitComplete={() => setContentReady(true)}>
        {visible && (
        <motion.div
          key="bara-intro"
          role="status"
          aria-label="Memuat website BEM FSM UNDIP 2026"
          className="fixed inset-0 z-[10000] overflow-hidden bg-bara-bg-darker text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isMobile ? 0.18 : 0.15 }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-y-0 left-0 hidden w-1/2 bg-[#160704] md:block"
            exit={{ x: "-101%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-1/2 bg-[#160704] md:block"
            exit={{ x: "101%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-between px-6 py-7 sm:px-10 sm:py-9 md:px-14 md:py-11">
            <motion.header
              className="flex items-center justify-between border-b border-white/10 pb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
            >
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                Badan Eksekutif Mahasiswa
              </p>
              <p className="font-display text-sm italic text-bara-gold sm:text-base">
                FSM UNDIP / 2026
              </p>
            </motion.header>

            <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center">
              <motion.div
                aria-hidden
                className="absolute hidden h-48 w-48 rounded-full bg-bara-orange/20 blur-[80px] sm:block sm:h-64 sm:w-64"
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: [0, 0.65, 0.35], scale: [0.65, 1.08, 1] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.72, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: isMobile ? 0.38 : 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44"
                >
                  <Image
                    src="/images/barmonnobg.png"
                    alt="Logo Kabinet Bara Momentum"
                    fill
                    priority
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 176px"
                    className="object-contain drop-shadow-[0_18px_45px_rgba(242,92,5,0.28)]"
                  />
                </motion.div>

                <motion.p
                  className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-bara-orange"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isMobile ? 0.1 : 0.45, duration: isMobile ? 0.25 : 0.5 }}
                >
                  Kabinet 2026
                </motion.p>

                <div className="mt-2 overflow-hidden pb-2">
                  <motion.h1
                    className="font-display text-5xl font-medium leading-none tracking-tight sm:text-7xl md:text-8xl"
                    initial={{ y: "115%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: isMobile ? 0.12 : 0.52, duration: isMobile ? 0.38 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Bara <span className="gradient-text italic">Momentum</span>
                  </motion.h1>
                </div>

                <motion.p
                  className="mt-3 font-display text-lg italic text-white/55 sm:text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: isMobile ? 0.28 : 0.95, duration: isMobile ? 0.25 : 0.55 }}
                >
                  Bara Berdaya, Momentum Berkarya
                </motion.p>
              </div>
            </div>

            <motion.footer
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-white/10 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
            >
              <span className="text-[0.625rem] font-semibold tracking-[0.12em] text-white/40">MEMULAI</span>
              <div className="h-px overflow-hidden bg-white/10">
                <motion.div
                  className="h-full origin-left bg-gradient-to-r from-bara-gold via-bara-orange to-bara-red"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: isMobile ? 0.7 : 2.25, ease: [0.65, 0, 0.35, 1] }}
                />
              </div>
              <span className="font-display text-sm italic text-white/45">FSM UNDIP</span>
            </motion.footer>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        aria-hidden={!contentReady}
        className={contentReady ? "" : "pointer-events-none select-none"}
        initial={false}
        animate={{ opacity: contentReady ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </IntroContext.Provider>
  );
}
