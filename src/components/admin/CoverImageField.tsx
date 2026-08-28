"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAdminArticleMutations } from "@/lib/hooks";

export type CoverImageValue = {
  mediaId: string;
  url: string;
  alt: string | null;
} | null;

export type CoverImageFieldProps = {
  value: CoverImageValue;
  onChange: (v: CoverImageValue) => void;
};

export default function CoverImageField({ value, onChange }: CoverImageFieldProps) {
  const { uploadMedia } = useAdminArticleMutations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const media = await uploadMedia(file, "cover");
      onChange({ mediaId: media.id, url: media.url, alt: media.alt });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
        <Loader2 className="h-5 w-5 animate-spin text-bara-orange" />
        <span className="ml-2 text-xs text-white/55">Mengunggah...</span>
      </div>
    );
  }

  if (!value) {
    return (
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-xs text-white/55 transition-colors hover:border-bara-orange/40 hover:bg-bara-orange/[0.04] hover:text-white"
        >
          <ImagePlus className="h-5 w-5" />
          Unggah gambar cover
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        {error && <p className="mt-2 text-[10px] text-red-300">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1a1614]">
        <Image
          src={value.url}
          alt={value.alt ?? "Cover"}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="admin-secondary-button"
        >
          <Upload className="h-3.5 w-3.5" /> Ganti
        </button>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="admin-secondary-button"
        >
          <Trash2 className="h-3.5 w-3.5" /> Hapus
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-[10px] text-red-300">{error}</p>}
    </div>
  );
}