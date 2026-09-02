"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useAdminArticleMutations } from "@/lib/hooks";

export type InlineImageDialogProps = {
  open: boolean;
  onClose: () => void;
  onInsert: (media: { id: string; url: string; alt: string | null }) => void;
};

export default function InlineImageDialog({ open, onClose, onInsert }: InlineImageDialogProps) {
  const { uploadMedia } = useAdminArticleMutations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const media = await uploadMedia(file, "inline");
      onInsert({ id: media.id, url: media.url, alt: media.alt });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#12100e] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-bara-orange">Sisipkan Gambar</p>
            <h3 className="mt-2 font-display text-xl">Unggah gambar inline</h3>
            <p className="mt-1 text-xs text-white/40">
              Gambar akan diunggah ke /media dan disisipkan ke konten artikel.
            </p>
          </div>
          <button onClick={onClose} className="admin-icon-button">
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="mt-6 flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-xs text-white/55 transition-colors hover:border-bara-orange/40 hover:text-white disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-bara-orange" />
              <span>Mengunggah...</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              Pilih gambar
            </>
          )}
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

        {error && <p className="mt-3 text-[10px] text-red-300">{error}</p>}

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="admin-secondary-button">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}