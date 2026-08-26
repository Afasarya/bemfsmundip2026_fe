import type { Metadata } from "next";
import NewsBanner from "@/components/informasi/NewsBanner";
import NewsGrid from "@/components/informasi/NewsGrid";
import NewsInstagram from "@/components/informasi/NewsInstagram";

export const metadata: Metadata = {
  title: "Informasi & Berita | BEM FSM UNDIP 2026",
  description:
    "Portal berita dan informasi terkini dari Kabinet Bara Momentum BEM FSM UNDIP 2026. Berita kegiatan, prestasi, beasiswa, dan lomba.",
};

export default function InformasiPage() {
  return (
    <div className="relative">
      {/* Divider between banner and grid */}
      <NewsBanner />
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </div>
      <NewsGrid />
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </div>
      <NewsInstagram />
    </div>
  );
}