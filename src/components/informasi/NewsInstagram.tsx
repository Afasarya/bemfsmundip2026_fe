"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Instagram, ArrowRight } from "lucide-react";
import { useRef, useState, MouseEvent } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

const INSTAGRAM_POSTS = [
  {
    shortcode: "DaRk3GIEkQc",
    url: "https://www.instagram.com/p/DaRk3GIEkQc/",
  },
  {
    shortcode: "DaPblgNkp8P",
    url: "https://www.instagram.com/p/DaPblgNkp8P/",
  },
  {
    shortcode: "DZ_jS9aEpbj",
    url: "https://www.instagram.com/p/DZ_jS9aEpbj/",
  },
  {
    shortcode: "DZ7QqjFEr8Y",
    url: "https://www.instagram.com/p/DZ7QqjFEr8Y/",
  },
];

function InstagramCard({
  shortcode,
  url,
  index,
}: {
  shortcode: string;
  url: string;
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [3, -3]);
  const rotateY = useTransform(mouseX, [0, 1], [-3, 3]);
  const glareX = useTransform(mouseX, [0, 1], [0, 100]);
  const glareY = useTransform(mouseY, [0, 1], [0, 100]);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.a
      ref={cardRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.92 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.7,
            delay: index * 0.12,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="ig-card group relative block cursor-pointer"
    >
      {/* Glare */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([x, y]) =>
              `radial-gradient(350px circle at ${x}% ${y}%, rgba(242, 92, 5, 0.10), transparent 50%)`
          ),
        }}
      />

      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "4 / 5" }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/[0.03] rounded-2xl">
            <div className="w-10 h-10 rounded-full border-2 border-bara-orange/30 border-t-bara-orange animate-spin" />
            <p className="text-[11px] text-white/30 tracking-wide">
              Memuat postingan...
            </p>
          </div>
        )}

        <iframe
          src={`https://www.instagram.com/p/${shortcode}/embed/captioned/`}
          className="ig-embed-frame absolute border-0"
          style={{
            top: "-56px",
            left: "-1px",
            width: "calc(100% + 2px)",
            height: "calc(100% + 120px)",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
          scrolling="no"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          title={`Instagram Post ${shortcode}`}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-500 rounded-2xl">
          <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 ease-out">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent z-10 rounded-b-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-2/3 h-[2px] rounded-full bg-gradient-to-r from-transparent via-bara-orange/0 to-transparent group-hover:via-bara-orange/60 transition-all duration-700 blur-[2px]" />
    </motion.a>
  );
}

export default function NewsInstagram() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background glow */}
      <motion.div
        aria-hidden
        className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-bara-orange/[0.06] blur-[150px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="h-[2px] w-10 bg-bara-orange rounded-full" />
              <span className="text-xs uppercase tracking-[0.25em] text-bara-orange font-semibold">
                Instagram
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight max-w-xl">
              Langsung dari{" "}
              <span className="italic gradient-text">Instagram</span> kami.
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-white/40 text-sm max-w-sm leading-relaxed md:text-right">
              Ikuti konten visual terbaru dari BEM FSM UNDIP di Instagram
              resmi @bemfsm_undip.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                <span className="relative rounded-full bg-green-400 w-2 h-2" />
              </span>
              <span className="text-[11px] uppercase tracking-widest text-white/40">
                Diperbarui secara berkala
              </span>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {INSTAGRAM_POSTS.map((post, i) => (
            <InstagramCard
              key={post.shortcode}
              shortcode={post.shortcode}
              url={post.url}
              index={i}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <MagneticButton
            href="https://instagram.com/bemfsm_undip"
            className="bg-gradient-to-r from-bara-orange to-bara-red text-white border border-bara-orange/30 hover:shadow-[0_0_50px_-5px_rgba(242,92,5,0.6)]"
          >
            <Instagram className="w-4 h-4" />
            Ikuti @bemfsm_undip
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
