"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/data";

/* ─────────────────────────────────────────────────────────────
   Logo — Magnetic hover + glow pulse
───────────────────────────────────────────────────────────── */
function LogoMark() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18 });
  const springY = useSpring(y, { stiffness: 180, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  return (
    <motion.a
      href="/"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="flex items-center gap-2.5 group select-none"
    >
      <motion.div
        className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
        whileHover={{
          scale: 1.14,
          boxShadow: "0 0 28px 8px rgba(242,92,5,0.60)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <Image
          src="/images/barmon.webp"
          alt="Logo Bara Momentum BEM FSM UNDIP"
          fill
          className="object-contain"
          priority
        />
        <span className="absolute inset-0 rounded-xl bg-[#F25C05]/70 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>

      <div className="flex flex-col leading-none">
        <span className="font-semibold text-[15px] tracking-wide text-white">
          Bara Momentum
        </span>
        <span className="text-[9px] uppercase tracking-[0.22em] text-white/35 mt-0.5">
          BEM FSM UNDIP 2026
        </span>
      </div>
    </motion.a>
  );
}

/* ─────────────────────────────────────────────────────────────
   Single nav link with shared layoutId sliding pill
───────────────────────────────────────────────────────────── */
function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href} className="relative px-4 py-2 flex items-center">
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 rounded-full z-0"
          style={{
            background:
              "linear-gradient(135deg,rgba(242,92,5,0.20) 0%,rgba(178,36,8,0.12) 100%)",
            border: "1px solid rgba(242,92,5,0.28)",
            boxShadow: "inset 0 0 12px rgba(242,92,5,0.10)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
        />
      )}

      <motion.span
        className="relative z-10 text-sm font-medium"
        animate={{ color: active ? "#ffffff" : "rgba(255,255,255,0.52)" }}
        whileHover={{ color: "#ffffff", y: active ? 0 : -1 }}
        transition={{ duration: 0.16 }}
      >
        {label}
      </motion.span>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   Mobile full-screen overlay
───────────────────────────────────────────────────────────── */
function MobileOverlay({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
    exit:   { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0,  filter: "blur(0px)",
               transition: { type: "spring", stiffness: 300, damping: 26 } },
    exit:    { opacity: 0, y: 12, filter: "blur(4px)",
               transition: { duration: 0.15 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[99] flex flex-col"
          style={{
            background: "rgba(10,3,1,0.92)",
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
          }}
          onClick={onClose}
        >
          {/* Glow orb top-center */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 -z-10"
            style={{
              background:
                "radial-gradient(circle,rgba(242,92,5,0.13) 0%,transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div
            className="flex flex-col h-full px-8 pt-28 pb-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nav links */}
            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-2"
            >
              {NAV_LINKS.map((link, idx) => {
                const active = pathname === link.href;
                return (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="group relative flex items-center gap-4 px-6 py-5 rounded-2xl text-2xl font-semibold tracking-tight transition-colors"
                      style={
                        active
                          ? {
                              background:
                                "linear-gradient(135deg,rgba(242,92,5,0.15) 0%,rgba(178,36,8,0.09) 100%)",
                              border: "1px solid rgba(242,92,5,0.22)",
                              color: "#ffffff",
                            }
                          : { color: "rgba(255,255,255,0.42)" }
                      }
                    >
                      <span className="text-xs font-mono text-white/20 w-5">
                        0{idx + 1}
                      </span>
                      {link.label}
                      {active && (
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{ background: "#F25C05" }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Bottom label */}
            <motion.div
              className="mt-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
            >
              <p className="text-center text-xs text-white/20 mt-5 tracking-widest uppercase">
                Kabinet Bara Momentum · 2026
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Set correct initial scroll state before first paint
    setScrolled(window.scrollY > 40);
    // Small delay so entrance animation plays after hydration
    requestAnimationFrame(() => setMounted(true));

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  /* ── CSS transition approach: no framer-motion for layout props ──
     The browser compositor handles these natively = buttery smooth.
     We only use framer-motion for the entrance fade-in animation.   */

  return (
    <>
      {/* ══════════════════════════════════════════
          DESKTOP: Full → Pill transition (CSS-driven)
      ══════════════════════════════════════════ */}
      <div className="fixed inset-x-0 top-0 z-[100] hidden lg:flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full flex justify-center"
        >
          <div
            className="flex items-center gap-5 border relative"
            style={{
              /* Smooth CSS transitions for ALL layout properties */
              transition: `
                max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                margin-top 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                border-radius 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                padding 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                backdrop-filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)
              `,
              /* Interpolated values based on scroll state */
              width: "100%",
              maxWidth: scrolled ? "860px" : "100%",
              marginTop: scrolled ? "18px" : "0px",
              borderRadius: scrolled ? "9999px" : "0px",
              paddingTop: scrolled ? "10px" : "22px",
              paddingBottom: scrolled ? "10px" : "22px",
              paddingLeft: scrolled ? "20px" : "40px",
              paddingRight: scrolled ? "20px" : "40px",
              background: scrolled
                ? "rgba(255,255,255,0.055)"
                : "rgba(10, 3, 1, 0.85)",
              backdropFilter: scrolled
                ? "blur(24px) saturate(160%)"
                : "blur(0px) saturate(100%)",
              WebkitBackdropFilter: scrolled
                ? "blur(24px) saturate(160%)"
                : "blur(0px) saturate(100%)",
              borderColor: scrolled
                ? "rgba(255,255,255,0.09)"
                : "rgba(255,255,255,0.00)",
              boxShadow: scrolled
                ? "0 8px 60px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.08)"
                : "0 1px 0 rgba(255,255,255,0.06)",
              willChange: "max-width, margin-top, border-radius, padding, background, box-shadow",
            }}
          >
            {/* Logo */}
            <LogoMark />

            {/* Divider */}
            <div className="w-px h-5 bg-white/10 flex-shrink-0" />

            {/* Nav links */}
            <nav className="flex items-center gap-0.5 flex-1 justify-center lg:justify-start">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={pathname === link.href}
                />
              ))}
            </nav>

            {/* Right side orange dot indicator */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#F5C542,#F25C05)",
                opacity: scrolled ? 0 : 1,
                transform: scrolled ? "scale(0.5)" : "scale(1)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            />

            {/* Bottom border line that fades out as pill forms */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(242,92,5,0.25) 30%, rgba(242,92,5,0.25) 70%, transparent)",
                opacity: scrolled ? 0 : 1,
                transition: "opacity 0.4s ease",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE: Circular hamburger — top-right
      ══════════════════════════════════════════ */}
      <div className="lg:hidden fixed top-5 right-5 z-[101]">
        <motion.button
          initial={{ y: -40, opacity: 0, scale: 0.8 }}
          animate={{ y: 0,   opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="relative w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg,rgba(255,255,255,0.09) 0%,rgba(255,255,255,0.04) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.55)",
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate:  90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate:  90, opacity: 0 }}
                animate={{ rotate:   0, opacity: 1 }}
                exit={{   rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Menu className="w-5 h-5 text-white" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Orange ring when open */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.span
                key="ring"
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{   opacity: 0, scale: 0.85 }}
                style={{
                  border: "1.5px solid rgba(242,92,5,0.58)",
                  boxShadow: "0 0 16px rgba(242,92,5,0.28)",
                }}
              />
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile overlay */}
      <MobileOverlay
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}