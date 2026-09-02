"use client";

import { useEffect, useState } from "react";
import AdminDrawer from "./AdminDrawer";
import { Field, TextInput, Select } from "./FormFields";
import {
  useAdminInstagramPost,
  useAdminInstagramMutations,
} from "@/lib/hooks";
import { ApiClientError } from "@/lib/api";
import type {
  CreateInstagramPostInput,
  InstagramPlacementType,
  InstagramPostStatus,
  InstagramPostListItem,
  UpdateInstagramPostInput,
} from "@/lib/types";

type Props = {
  postId: string | null;
  onClose: () => void;
  onSaved: () => void;
  notify: (msg: string) => void;
};

const STATUS_OPTIONS: { value: InstagramPostStatus; label: string }[] = [
  { value: "DRAFT", label: "Draf" },
  { value: "PUBLISHED", label: "Tayang" },
  { value: "ARCHIVED", label: "Diarsipkan" },
];

const PLACEMENT_OPTIONS: { value: InstagramPlacementType; label: string; hint: string }[] = [
  { value: "HOME", label: "Beranda", hint: "Tampil di section Instagram pada halaman utama." },
  { value: "INFORMATION", label: "Informasi", hint: "Untuk penanda internal pada modul admin." },
];

const URL_RE = /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+(\/.*)?$/;

export default function InstagramDrawer({ postId, onClose, onSaved, notify }: Props) {
  const isEditing = !!postId;
  const { data: post, isLoading } = useAdminInstagramPost(postId);
  const mutations = useAdminInstagramMutations();

  const [title, setTitle] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [status, setStatus] = useState<InstagramPostStatus>("DRAFT");
  const [internalNote, setInternalNote] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingPlacement, setSavingPlacement] = useState<InstagramPlacementType | null>(null);

  // Optimistic local highlight state per placement, keyed by placement id.
  const [highlights, setHighlights] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (post && !initialized) {
      setTitle(post.internalTitle ?? "");
      setCanonicalUrl(post.canonicalUrl);
      setStatus(post.status);
      setInternalNote(post.internalNote ?? "");
      const next: Record<string, boolean> = {};
      for (const pl of post.placements) next[pl.id] = pl.isHighlighted;
      setHighlights(next);
      setInitialized(true);
    }
  }, [post, initialized]);

  const valid = URL_RE.test(canonicalUrl);

  const handleSubmit = async () => {
    if (!title.trim() || !canonicalUrl.trim()) {
      notify("Judul dan URL wajib diisi.");
      return;
    }
    if (!valid) {
      notify("URL harus berupa tautan post Instagram yang valid.");
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing && postId) {
        await mutations.update(postId, {
          title: title.trim(),
          canonicalUrl: canonicalUrl.trim(),
          status,
          internalNote: internalNote.trim() || undefined,
        } as UpdateInstagramPostInput);
      } else {
        await mutations.create({
          title: title.trim(),
          canonicalUrl: canonicalUrl.trim(),
          status,
        } as CreateInstagramPostInput);
      }
      onSaved();
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 422) {
        const firstFieldError = Object.values(err.getFieldErrors())[0]?.[0];
        notify(`Validasi gagal: ${firstFieldError ?? err.message}`);
      } else {
        notify(err instanceof Error ? err.message : "Gagal menyimpan post.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleHighlight = async (placement: InstagramPlacementType) => {
    if (!postId) {
      notify("Simpan post dulu sebelum mengatur penempatan.");
      return;
    }
    const target = post?.placements.find((p) => p.placement === placement);
    if (!target) return;

    const previous = target.isHighlighted;
    const next = !previous;
    // Optimistic update keyed by placement id.
    setHighlights((h) => ({ ...h, [target.id]: next }));
    setSavingPlacement(placement);
    try {
      await mutations.toggleHighlight(postId, placement);
      onSaved();
    } catch (err) {
      // Revert on failure.
      setHighlights((h) => ({ ...h, [target.id]: previous }));
      notify(err instanceof Error ? err.message : "Gagal mengubah sorotan.");
    } finally {
      setSavingPlacement(null);
    }
  };

  return (
    <AdminDrawer
      eyebrow={isEditing ? "Edit post" : "Tambah post Instagram"}
      title={title || "Post Instagram baru"}
      subtitle="Hubungkan kiriman Instagram ke slot pada situs."
      onClose={onClose}
      onSubmit={handleSubmit}
      submitDisabled={submitting || isLoading || (canonicalUrl.length > 0 && !valid)}
      submitLabel={submitting ? "Menyimpan…" : isEditing ? "Simpan perubahan" : "Tambah post"}
    >
      {isEditing && isLoading ? (
        <div className="space-y-3">
          <div className="h-10 animate-pulse rounded-lg bg-white/[0.03]" />
          <div className="h-10 animate-pulse rounded-lg bg-white/[0.03]" />
        </div>
      ) : (
        <div className="space-y-5">
          <Field label="Judul internal" required>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Buka Bersama 2026"
              maxLength={255}
            />
          </Field>

          <Field
            label="URL Instagram"
            required
            hint={canonicalUrl && !valid ? "Format tidak valid" : "https://www.instagram.com/p/..."}
          >
            <TextInput
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/CxYz..."
              maxLength={1024}
            />
          </Field>

          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as InstagramPostStatus)}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>

          <Field label="Catatan internal" hint="tidak tampil di situs publik">
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Catatan untuk redaksi."
              className="admin-input min-h-[80px] resize-y"
            />
          </Field>

          {isEditing && post && (
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-white/55">Penempatan & sorotan</p>
              <p className="text-[10px] text-white/35">
                Sorotan (highlight) menentukan apakah post muncul di slot publik. Untuk Beranda,
                maksimal 4 post dapat ditandai sekaligus — yang terlama akan otomatis digeser.
              </p>
              <div className="space-y-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                {PLACEMENT_OPTIONS.map((opt) => {
                  const placement = post.placements.find((p) => p.placement === opt.value);
                  const isOn = placement ? (highlights[placement.id] ?? placement.isHighlighted) : false;
                  const busy = savingPlacement === opt.value;
                  return (
                    <div
                      key={opt.value}
                      className="flex items-start justify-between gap-3 rounded-md p-2 hover:bg-white/[0.02]"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-white/80">{opt.label}</p>
                        <p className="mt-0.5 text-[10px] text-white/35">{opt.hint}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isOn}
                        disabled={!placement || busy}
                        onClick={() => void handleToggleHighlight(opt.value)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
                          isOn ? "bg-bara-orange" : "bg-white/15"
                        } ${!placement || busy ? "opacity-50" : "hover:opacity-90"}`}
                        title={!placement ? "Belum terpasang" : isOn ? "Matikan sorotan" : "Aktifkan sorotan"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            isOn ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminDrawer>
  );
}