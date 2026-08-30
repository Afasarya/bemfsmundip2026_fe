"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { apiFetch, CDN_BASE_URL, API_BASE_URL } from "@/lib/api";

type MediaItem = {
  id: string;
  url: string;
  filename?: string;
  originalName?: string;
  alt: string | null;
  mimeType: string;
  width: number | null;
  height: number | null;
  variant: string;
  createdAt: string;
};

type Props = {
  label: string;
  required?: boolean;
  variant: "logo" | "photo" | "cover" | "inline" | "avatar";
  value: string | null;
  onChange: (mediaId: string | null, url?: string) => void;
  hint?: string;
};

const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 5 * 1024 * 1024;

export default function MediaPicker({
  label,
  required,
  variant,
  value,
  onChange,
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [current, setCurrent] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (!value) {
      setCurrent(null);
      return;
    }
    apiFetch<{ data: MediaItem }>(`media/${value}`, { withCredentials: true })
      .then((res) => setCurrent(res.data))
      .catch(() => setCurrent(null));
  }, [value]);

  const refreshGallery = async () => {
    setGalleryLoading(true);
    try {
      const wrapped = await apiFetch<{ data: MediaItem[] }>(
        `media?variant=${variant}&pageSize=24`,
        { withCredentials: true },
      );
      setGallery(wrapped.data);
    } catch {
      setGallery([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handlePick = async (file: File) => {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError(`File terlalu besar (maks ${MAX_BYTES / 1024 / 1024} MB).`);
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("variant", variant);

      // Use apiFetch so Authorization + auto-refresh on 401 works.
      // apiFetch accepts FormData directly and skips JSON Content-Type.
      const json = await apiFetch<{ data: MediaItem }>("media", {
        method: "POST",
        body: form,
        withCredentials: true,
      });
      setCurrent(json.data);
      onChange(json.data.id, json.data.url);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Upload gagal.";
      setError(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const openGallery = async () => {
    setGalleryOpen(true);
    await refreshGallery();
  };

  return (
    <div>
      <span className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-medium text-white/55">
        <span>
          {label}
          {required && <span className="ml-1 text-bara-orange">*</span>}
        </span>
        {hint && <span className="text-[10px] font-normal text-white/30">{hint}</span>}
      </span>

      <div className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-white/[0.08] bg-[#1a1311]">
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.url.startsWith("http") ? current.url : `${CDN_BASE_URL}/${current.url}`}
              alt={current.alt ?? ""}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-white/30">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 grid place-items-center bg-black/60">
              <Loader2 className="h-5 w-5 animate-spin text-bara-orange" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handlePick(f);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="admin-secondary-button"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Mengunggah…" : current ? "Ganti file" : "Unggah"}
            </button>
            <button
              type="button"
              onClick={() => void openGallery()}
              disabled={uploading}
              className="admin-secondary-button"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Pilih dari galeri
            </button>
            {current && (
              <button
                type="button"
                onClick={() => {
                  setCurrent(null);
                  onChange(null);
                }}
                className="admin-icon-button hover:!border-red-400/30 hover:!text-red-300"
                aria-label="Hapus"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {current && (
            <p className="line-clamp-1 text-[10px] text-white/40">
              <Check className="mr-1 inline h-3 w-3 text-emerald-300" />
              {current.originalName ?? current.id}
            </p>
          )}
          {error && <p className="text-[10px] text-red-300">{error}</p>}
        </div>
      </div>

      {galleryOpen && (
        <div
          className="fixed inset-0 z-[220] grid place-items-center bg-black/70 p-6 backdrop-blur-sm"
          onClick={() => setGalleryOpen(false)}
        >
          <div
            className="admin-panel max-h-[80vh] w-full max-w-4xl overflow-hidden p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <h3 className="font-display text-lg">Galeri — {variant}</h3>
              <button
                onClick={() => setGalleryOpen(false)}
                className="admin-icon-button"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-5">
              {galleryLoading ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-md bg-white/[0.03]" />
                  ))}
                </div>
              ) : gallery.length === 0 ? (
                <p className="py-10 text-center text-xs text-white/40">
                  Belum ada aset untuk variant ini.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {gallery.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCurrent(item);
                        onChange(item.id, item.url);
                        setGalleryOpen(false);
                      }}
                      className={`group relative aspect-square overflow-hidden rounded-md border ${
                        item.id === value
                          ? "border-bara-orange"
                          : "border-white/[0.06] hover:border-white/30"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url.startsWith("http") ? item.url : `${CDN_BASE_URL}/${item.url}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      {item.id === value && (
                        <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-bara-orange text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}