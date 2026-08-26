"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ── Types ── */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; color: string;
}

/* ── Countdown hook ── */
const LAUNCH_DATE = new Date("2026-07-12T08:17:00+07:00");

function useCountdown(target: Date) {
  const calc = () => {
    const d = Math.max(0, target.getTime() - Date.now());
    return {
      days:    Math.floor(d / 86_400_000),
      hours:   Math.floor((d % 86_400_000) / 3_600_000),
      minutes: Math.floor((d % 3_600_000)  / 60_000),
      seconds: Math.floor((d % 60_000)     / 1_000),
    };
  };
  const [t, set] = useState(calc);
  useEffect(() => { const id = setInterval(() => set(calc()), 1000); return () => clearInterval(id); });
  return t;
}

/* ── Aurora canvas ── */
function AuroraCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx    = canvas.getContext("2d")!;

    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    addEventListener("resize", resize);

    // Three slow-moving blobs — warm umber / ember palette, nothing neon
    const blobs = [
      { bx: 0.18, by: 0.22, r: 92,  g: 24,  b: 4,  a: 0.30, sp: 0.00028 },
      { bx: 0.78, by: 0.72, r: 160, g: 40,  b: 6,  a: 0.22, sp: 0.00022 },
      { bx: 0.50, by: 0.48, r: 220, g: 100, b: 8,  a: 0.10, sp: 0.00036 },
    ];

    const draw = (ts: number) => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#100403";
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "screen";
      blobs.forEach((b, i) => {
        const t  = ts * b.sp + i * 9.7;
        const cx = (b.bx + Math.sin(t)       * 0.14) * W;
        const cy = (b.by + Math.cos(t * 1.1) * 0.12) * H;
        const R  = Math.min(W, H) * (0.55 + Math.sin(t * 0.6) * 0.06);
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        g.addColorStop(0,   `rgba(${b.r},${b.g},${b.b},${b.a})`);
        g.addColorStop(0.5, `rgba(${b.r},${b.g},${b.b},${b.a * 0.35})`);
        g.addColorStop(1,   `rgba(${b.r},${b.g},${b.b},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />;
}

/* ── Splash canvas (click effect) ── */
const COLORS = ["rgba(232,78,2,0.9)", "rgba(200,50,5,0.85)", "rgba(240,160,30,0.8)"];

function SplashCanvas({ triggers }: { triggers: { id: number; x: number; y: number }[] }) {
  const ref      = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf      = useRef<number>(0);
  const prevLen  = useRef(0);

  useEffect(() => {
    if (triggers.length === prevLen.current) return;
    const latest = triggers[triggers.length - 1];
    prevLen.current = triggers.length;
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.5;
      const speed = 1.2 + Math.random() * 4;
      const life  = 42 + Math.random() * 36;
      particles.current.push({
        x: latest.x, y: latest.y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life, maxLife: life,
        size: 1.5 + Math.random() * 3.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }, [triggers]);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx    = canvas.getContext("2d")!;
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.life > 0);
      particles.current.forEach(p => {
        ctx.save();
        ctx.globalAlpha = (p.life / p.maxLife) * 0.85;
        ctx.fillStyle   = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        p.x  += p.vx; p.y  += p.vy;
        p.vy += 0.1;  p.vx *= 0.97;
        p.life -= 1.1;
      });
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 6 }}
    />
  );
}

/* ── Countdown block — glass card style ── */
function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: "clamp(72px, 13vw, 116px)",
          height: "clamp(72px, 13vw, 116px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(242,92,5,0.07)",
          border: "1px solid rgba(242,92,5,0.32)",
          borderRadius: "14px",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 0 28px rgba(242,92,5,0.12), inset 0 0 16px rgba(242,92,5,0.04)",
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 5.5vw, 56px)",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #F5C542 0%, #F25C05 55%, #B22408 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(9px, 1.1vw, 11px)",
          fontWeight: 600,
          letterSpacing: "0.20em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Main ── */
export default function ComingSoon() {
  const [clicks,    setClicks]    = useState<{ id: number; x: number; y: number }[]>([]);
  const [cursor,    setCursor]    = useState({ x: -999, y: -999 });
  const [mounted,   setMounted]   = useState(false);
  const idRef = useRef(0);
  const time  = useCountdown(LAUNCH_DATE);

  useEffect(() => { setMounted(true); }, []);

  const onMove  = useCallback((e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY }), []);
  const onClick = useCallback((e: MouseEvent) => {
    const id = idRef.current++;
    setClicks(prev => [...prev.slice(-10), { id, x: e.clientX, y: e.clientY }]);
  }, []);

  useEffect(() => {
    addEventListener("mousemove", onMove);
    addEventListener("click", onClick);
    return () => { removeEventListener("mousemove", onMove); removeEventListener("click", onClick); };
  }, [onMove, onClick]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        overflow: "hidden", cursor: "none",
      }}
    >
      {/* Background */}
      <AuroraCanvas />

      {/* Splash */}
      <SplashCanvas triggers={clicks} />

      {/* Cursor — soft aura */}
      <div
        style={{
          position: "absolute",
          left: cursor.x, top: cursor.y,
          width: 280, height: 280,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(210,65,5,0.14) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 5,
          transition: "left 0.07s linear, top 0.07s linear",
        }}
      />
      {/* Cursor — center dot */}
      <div
        style={{
          position: "absolute",
          left: cursor.x, top: cursor.y,
          width: 8, height: 8,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: "#E84E02",
          boxShadow: "0 0 12px rgba(232,78,2,0.9)",
          pointerEvents: "none",
          zIndex: 20,
          transition: "left 0.025s linear, top 0.025s linear",
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          padding: "clamp(24px, 5vw, 60px)",
          textAlign: "center",
          gap: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            marginBottom: "clamp(20px, 3.5vh, 40px)",
            animation: "cs-float 5s ease-in-out infinite",
            filter: "drop-shadow(0 0 28px rgba(210,65,5,0.45))",
          }}
        >
          <Image
            src="/images/barmonnobg.png"
            alt="BEM FSM UNDIP, Kabinet Bara Momentum"
            width={96}
            height={96}
            priority
            style={{
              width: "clamp(56px, 9vw, 96px)",
              height: "clamp(56px, 9vw, 96px)",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(10px, 1.2vw, 12px)",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "clamp(12px, 2vh, 20px)",
            animation: "cs-up 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          BEM FSM UNDIP 2026
        </p>

        {/* Main heading — mirrors homepage h1 exactly */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(40px, 9vw, 108px)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            marginBottom: "clamp(16px, 2.5vh, 28px)",
            animation: "cs-up 0.8s 0.18s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <span style={{ display: "block", color: "#ffffff" }}>
            Bara Berdaya,
          </span>
          <span
            style={{
              display: "block",
              fontStyle: "italic",
              background: "linear-gradient(110deg, #F5C542 0%, #F25C05 45%, #B22408 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Momentum Berkarya.
          </span>
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(13px, 1.6vw, 17px)",
            fontWeight: 300,
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.42)",
            maxWidth: "480px",
            marginBottom: "clamp(28px, 5vh, 52px)",
            animation: "cs-up 0.8s 0.28s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          Website sedang disiapkan.<br />
          Kami akan segera hadir dengan tampilan penuh.
        </p>

        {/* Countdown — clean editorial row */}
        {mounted && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(8px, 1.8vw, 18px)",
              animation: "cs-up 0.8s 0.38s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <Digit value={time.days}    label="Hari" />
            <SepDot />
            <Digit value={time.hours}   label="Jam" />
            <SepDot />
            <Digit value={time.minutes} label="Menit" />
            <SepDot />
            <Digit value={time.seconds} label="Detik" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes cs-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes cs-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs-breathe {
          0%,100% { opacity: 0.45; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function SepDot() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 7,
        paddingBottom: "28px",
        flexShrink: 0,
      }}
    >
      {[0, 1].map(i => (
        <div
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(242,92,5,0.65)",
            boxShadow: "0 0 7px rgba(242,92,5,0.55)",
            animation: `cs-breathe ${1.3 + i * 0.25}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
