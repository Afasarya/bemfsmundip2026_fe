import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const Icons = {
  flame: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 2c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.2.4-2 1-3 .2 1 1 1.6 1.5 1.6C12 8 11 5.5 12 2Z" />
      <path d="M9 14a3 3 0 0 0 6 0c0-1.5-1-2-1.5-3" />
    </svg>
  ),
  megaphone: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z" />
      <path d="M14 8a4 4 0 0 1 0 8" />
      <path d="M18 5a8 8 0 0 1 0 14" />
    </svg>
  ),
  trophy: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3" />
      <path d="M10 13h4M12 13v4M9 21h6M10 17h4l1 4h-6l1-4Z" />
    </svg>
  ),
  briefcase: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
    </svg>
  ),
  scholarship: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 4 2 9l10 5 10-5-10-5Z" />
      <path d="M6 11v4c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-4M21 9v5" />
    </svg>
  ),
  handshake: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="m11 17 2 2a1 1 0 0 0 1.5 0l3-3" />
      <path d="m18 16 3-3-4-5-3 1H10L6 8 3 11l3 3 2-1" />
      <path d="m8 13 3 3" />
    </svg>
  ),
  calendar: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  ),
  spark: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  ),
  shield: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  heart: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 20s-7-4.3-9-9a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c-2 4.7-7 9-7 9Z" />
    </svg>
  ),
  globe: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
    </svg>
  ),
  instagram: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7h.01" />
    </svg>
  ),
  youtube: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="m10 9 5 3-5 3V9Z" />
    </svg>
  ),
  link: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M10 14a4 4 0 0 0 6 .5l2-2a4 4 0 0 0-6-6l-1 1" />
      <path d="M14 10a4 4 0 0 0-6-.5l-2 2a4 4 0 0 0 6 6l1-1" />
    </svg>
  ),
  arrow: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  play: (p: IconProps) => (
    <svg {...{ ...base, fill: "currentColor", stroke: "none" }} {...p}>
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  ),
} as const;

export type IconKey = keyof typeof Icons;
