// Formatters & helpers shared across the app.
import type { MediaRef } from "./types";

const LOCALE = "id-ID";

export function formatDateId(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateShort(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(LOCALE, { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTimeAgo(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  const diff = Date.now() - d.getTime();
  if (Number.isNaN(diff) || diff < 0) return formatDateShort(d);
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari yang lalu";
  if (days < 7) return `${days} hari yang lalu`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} minggu yang lalu`;
  const months = Math.floor(days / 30);
  return `${months} bulan yang lalu`;
}

export function mediaUrl(media: MediaRef | null | undefined): string | null {
  if (!media?.url) return null;
  return media.url;
}

// Resolves a media reference or returns null for placeholder.
export function safeMedia(media: MediaRef | null | undefined): MediaRef | null {
  return media && media.url ? media : null;
}

// Determine an article's href based on slug (id is reserved for admin).
export function articleHref(slug: string): string {
  return `/informasi/${slug}`;
}

// Resolves unit href.
export function unitHref(slug: string): string {
  return `/bidang/${slug}`;
}
