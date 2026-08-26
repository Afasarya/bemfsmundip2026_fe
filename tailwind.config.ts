import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bara-orange": "#F25C05",
        "bara-red": "#B22408",
        "bara-maroon": "#5C1002",
        "bara-gold": "#F5C542",
        "bara-bg-dark": "#1A0A06",
        "bara-bg-darker": "#110604",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "float-slow": "floatSlow 14s ease-in-out infinite",
        "float-slower": "floatSlow 20s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(40px, -30px) scale(1.05)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;