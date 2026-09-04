"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Instagram, ArrowRight } from "lucide-react";
import { useRef, useState, MouseEvent } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { InstagramPostListItem } from "@/lib/types";
import { placeholderCover } from "@/lib/placeholder";

interface InstagramPost {
  url: string;
  caption?: string | null;
  thumbnail?: string | null;
  shortcode: string;
}

function toPosts(items: InstagramPostListItem[] | undefined): InstagramPost[] {
  if (!items) return [];
  return items.map((p) => ({
    url: p.canonicalUrl,
    caption: p.internalTitle,
    shortcode: p.shortcode,
    // No image stored for admin-managed posts; the card falls back to the iframe embed.
    thumbnail: null,
  }));
}

function InstagramCard({
  url,
  thumbnail,
  shortcode,
  index,
}: {
  url: string;
  thumbnail?: string | null;
  shortcode: string;
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

  // If a thumbnail URL is provided, render it instead of the iframe for SSR/quality reasons.
  const useEmbed = !thumbnail;

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

      <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "4 / 5" }}>
        {!isLoaded && useEmbed && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/[0.03] rounded-2xl">
            <div className="w-10 h-10 rounded-full border-2 border-bara-orange/30 border-t-bara-orange animate-spin" />
            <p className="text-[11px] text-white/30 tracking-wide">
              Memuat postingan...
            </p>
          </div>
        )}

        {useEmbed ? (
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
            allowTransparency={true}
            scrolling="no"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            title={`Instagram Post ${shortcode}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail!}
            alt={`Instagram post ${shortcode}`}
            className="absolute inset-0 h-full w-full object-cover"
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        )}

        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-500 rounded-2xl">
          <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 ease-out">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent z-10 rounded-b-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </div>

      <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-2/3 h-[2px] rounded-full bg-gradient-to-r from-transparent via-bara-orange/0 to-transparent group-hover:via-bara-orange/60 transition-all duration-700 blur-[2px]" />
    </motion.a>
  );
}

function placeholderPost(index: number): InstagramPost {
  return {
    url: "#",
    caption: null,
    shortcode: `placeholder-${index}`,
    thumbnail: placeholderCover(`Postingan ${index + 1}`, 480, 600),
  };
}

export default function InstagramSection() {
  const { data: posts, isLoading } = useSWR<InstagramPostListItem[]>(
    ["public-instagram-posts", "HOME"] as const,
    ([, p]) => apiFetch<InstagramPostListItem[]>(`public/instagram-posts?placement=${p}`),
    { revalidateOnFocus: false, dedupingInterval: 30_000 },
  );

  const realPosts = toPosts(posts).slice(0, 4);
  const items: InstagramPost[] =
    realPosts.length >= 4
      ? realPosts
      : [
          ...realPosts,
          ...Array.from({ length: 4 - realPosts.length }, (_, i) => placeholderPost(realPosts.length + i)),
        ];

  const handle = "bemfsm_undip";
  const profileUrl = `https://www.instagram.com/${handle}/`;
  const showSkeleton = isLoading && realPosts.length === 0;

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden
        className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-bara-orange/[0.06] blur-[150px]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-bara-gold/[0.05] blur-[120px]"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="section-kicker">04 / Latest Posts</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight max-w-2xl">
              Kabar terbaru dari{" "}
              <span className="italic gradient-text">Instagram</span> kami.
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="section-intro md:text-right">
              Ikuti perjalanan Kabinet Bara Momentum melalui konten visual
              terbaru di Instagram resmi BEM FSM UNDIP.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                <span className="relative rounded-full bg-green-400 w-2 h-2" />
              </span>
              <span className="text-xs font-medium tracking-[0.04em] text-white/50">
                Konten diperbarui secara berkala
              </span>
            </motion.div>
          </div>
        </motion.div>

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
          {showSkeleton
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="aspect-[4/5] animate-pulse rounded-2xl bg-white/[0.03]"
                />
              ))
            : items.map((post, i) => (
                <InstagramCard
                  key={`${post.shortcode}-${i}`}
                  url={post.url}
                  thumbnail={post.thumbnail ?? null}
                  shortcode={post.shortcode}
                  index={i}
                />
              ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            href={profileUrl}
            className="bg-gradient-to-r from-bara-orange to-bara-red text-white border border-bara-orange/30 hover:shadow-[0_0_50px_-5px_rgba(242,92,5,0.6)]"
          >
            <Instagram className="w-4 h-4" />
            Ikuti @{handle}
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
