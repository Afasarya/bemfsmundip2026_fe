// Lightweight placeholder generators — keeps the UI elegant when an
// article/unit doesn't have media yet.

const ORANGE = "F25C05";
const DARK = "130705";

export function placeholderLogo(seed: string, size = 80): string {
  const safeSeed = encodeURIComponent(seed);
  return `https://placehold.co/${size}x${size}/${DARK}/${ORANGE}?text=${safeSeed}&font=raleway`;
}

export function placeholderCover(seed: string, w = 800, h = 500): string {
  const safeSeed = encodeURIComponent(seed);
  return `https://placehold.co/${w}x${h}/${DARK}/${ORANGE}?text=${safeSeed}&font=raleway`;
}

// Avatar initial block — used when a member photo is missing.
export function initialsColor(seed: string): { bg: string; fg: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return {
    bg: `hsl(${hue}, 38%, 22%)`,
    fg: `hsl(${(hue + 30) % 360}, 70%, 80%)`,
  };
}
