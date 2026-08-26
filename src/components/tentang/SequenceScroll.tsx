"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 244;
const FRAME_PATH = (frame: number) =>
  `/images/sequence-images/ezgif-frame-${String(frame).padStart(3, "0")}.jpg`;

type Story = {
  eyebrow: string;
  title: string;
  body: string;
  range: [number, number];
  align: "left" | "right" | "center";
  accent?: "orange" | "red";
};

const STORIES: Story[] = [
  {
    eyebrow: "01 / Bentuk",
    title: "Nyala Api",
    body: "Bentuk nyala api merepresentasikan esensi keilmuan yang terfokus dan energi aktivasi.",
    range: [0.1, 0.25],
    align: "right",
  },
  {
    eyebrow: "02 / Inisial",
    title: "Huruf B dan M",
    body: "Nyala api diinterpretasikan secara simetris sebagai integrasi dua pilar kabinet. Sisi kiri membentuk B sebagai fondasi Bara. Sisi kanan bergerak ke atas membentuk M sebagai Momentum.",
    range: [0.3, 0.45],
    align: "left",
  },
  {
    eyebrow: "03 / Gerak",
    title: "Salur",
    body: "Garis melengkung yang mengalir di dalam api melambangkan dinamika fluida, kompleksitas, dan interkoneksi sistem.",
    range: [0.5, 0.65],
    align: "right",
  },
  {
    eyebrow: "04 / Filosofi Warna",
    title: "Oranye",
    body: "Antusiasme dan kreativitas berpikir. Semangat mengeksplorasi inovasi, gagasan orisinal, serta solusi yang aplikatif.",
    range: [0.7, 0.85],
    align: "left",
    accent: "orange",
  },
  {
    eyebrow: "05 / Filosofi Warna",
    title: "Merah",
    body: "Keberanian dan kekuatan determinasi. Komitmen mengambil sikap berdasarkan objektivitas dan fakta ilmiah untuk memelopori perubahan berbasis kajian.",
    range: [0.84, 0.985],
    align: "right",
    accent: "red",
  },
];

function StoryPanel({ story, progress }: { story: Story; progress: MotionValue<number> }) {
  const [start, end] = story.range;
  const span = end - start;
  const opacity = useTransform(
    progress,
    [start, start + span * 0.18, end - span * 0.2, end],
    story.range[1] >= 0.98 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, start + span * 0.2, end], [28, 0, -20]);

  const placement = {
    left: "items-start text-left md:pl-[5vw]",
    right: "items-end text-right md:pr-[5vw]",
    center: "items-center text-center",
  }[story.align];

  const accent =
    story.accent === "orange"
      ? "text-bara-orange"
      : story.accent === "red"
        ? "text-[#D94320]"
        : "text-white";

  return (
    <motion.article
      style={{ opacity, y }}
      className={`pointer-events-none absolute inset-0 flex flex-col justify-end px-5 pb-24 sm:px-8 md:justify-center md:px-10 md:pb-0 ${placement}`}
    >
      <div className="w-full max-w-sm border-l border-bara-orange/50 bg-black/55 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4 md:max-w-[25rem] md:bg-black/25 md:px-6 lg:max-w-md">
        <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bara-orange">
          {story.eyebrow}
        </p>
        <h3 className={`font-display text-[2.25rem] font-medium italic leading-[0.95] tracking-tight sm:text-5xl md:text-[3.5rem] lg:text-6xl ${accent}`}>
          {story.title}
        </h3>
        <p className="mt-4 text-sm leading-6 text-white/70 sm:text-[0.9375rem] sm:leading-7 md:mt-5 md:text-base md:leading-8">
          {story.body}
        </p>
      </div>
    </motion.article>
  );
}

export default function SequenceScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number>();
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const image = framesRef.current.get(frameIndex);
    if (!canvas || !image?.complete || !image.naturalWidth) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const container = canvas.parentElement;
    const cssWidth = container?.clientWidth || window.innerWidth;
    const cssHeight = container?.clientHeight || window.innerHeight;
    if (cssWidth <= 0 || cssHeight <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.round(cssWidth * dpr);
    const height = Math.round(cssHeight * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const containScale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const viewportRatio = cssWidth / cssHeight;
    const responsiveBoost = viewportRatio < 0.8 ? 1.38 : viewportRatio < 1.25 ? 1.2 : 1.08;
    const scale = containScale * responsiveBoost;
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;

    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    context.drawImage(
      image,
      (width - drawWidth) / 2,
      (height - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
  }, []);

  const requestDraw = useCallback(
    (frameIndex: number) => {
      currentFrameRef.current = frameIndex;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    },
    [drawFrame],
  );

  useEffect(() => {
    const priorityFrames = Array.from({ length: FRAME_COUNT }, (_, index) => index).sort(
      (a, b) => {
        if (a === 0) return -1;
        if (b === 0) return 1;
        return Math.abs(a - currentFrameRef.current) - Math.abs(b - currentFrameRef.current);
      },
    );
    let cursor = 0;
    let cancelled = false;

    const loadBatch = () => {
      if (cancelled || cursor >= priorityFrames.length) return;
      const batch = priorityFrames.slice(cursor, cursor + 8);
      cursor += batch.length;

      Promise.all(
        batch.map(
          (index) =>
            new Promise<void>((resolve) => {
              const image = new Image();
              image.decoding = "async";
              image.src = FRAME_PATH(index + 1);
              image.onload = () => {
                if (!cancelled) {
                  framesRef.current.set(index, image);
                  if (index === 0) {
                    setFirstFrameReady(true);
                    requestDraw(0);
                  }
                  if (index === targetFrameRef.current) requestDraw(index);
                }
                resolve();
              };
              image.onerror = () => resolve();
            }),
        ),
      ).then(() => {
        if (!cancelled) window.setTimeout(loadBatch, 24);
      });
    };

    loadBatch();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      framesRef.current.clear();
    };
  }, [requestDraw]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduceMotion) return;
    const target = Math.min(FRAME_COUNT - 1, Math.round(latest * (FRAME_COUNT - 1)));
    targetFrameRef.current = target;
    if (framesRef.current.has(target)) {
      requestDraw(target);
      return;
    }

    for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
      const before = target - distance;
      const after = target + distance;
      if (before >= 0 && framesRef.current.has(before)) {
        requestDraw(before);
        return;
      }
      if (after < FRAME_COUNT && framesRef.current.has(after)) {
        requestDraw(after);
        return;
      }
    }
  });

  useEffect(() => {
    const handleResize = () => requestDraw(currentFrameRef.current);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [requestDraw]);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 -mt-[15svh] border-b border-white/[0.06]"
      style={{ height: "600vh", width: "100%", position: "relative" }}
    >
      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-black shadow-[0_-30px_80px_rgba(0,0,0,0.4)] md:rounded-t-[3rem]"
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100svh",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <canvas
          ref={canvasRef}
          aria-label="Animasi filosofi logo Kabinet Bara Momentum"
          className={`h-full w-full transition-opacity duration-700 ${firstFrameReady ? "opacity-100" : "opacity-0"}`}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            maxWidth: "100%",
          }}
        />

        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="pointer-events-none absolute left-5 top-24 max-w-[17rem] sm:left-8 md:left-10 md:top-28 md:max-w-sm">
          <p className="font-display text-3xl font-medium italic leading-none tracking-tight text-white sm:text-4xl md:text-5xl">
            Filosofi <span className="gradient-text">Logo</span>
          </p>
          <p className="font-display mt-2 text-base italic leading-6 text-white/55 md:mt-3 md:text-lg">
            Gulir untuk membaca bentuk, gerak, dan warna Bara Momentum.
          </p>
        </div>

        {STORIES.map((story) => (
          <StoryPanel key={story.title} story={story} progress={scrollYProgress} />
        ))}

        <div className="pointer-events-none absolute bottom-7 left-6 right-6 flex items-center gap-4 md:left-10 md:right-10">
          <span className="text-[0.6875rem] font-medium tracking-[0.08em] text-white/35">SCROLL</span>
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <motion.div
              className="h-full origin-left bg-bara-orange"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <span className="text-[0.6875rem] font-medium tracking-[0.08em] text-white/35">244 FRAME</span>
        </div>
      </div>
    </section>
  );
}
