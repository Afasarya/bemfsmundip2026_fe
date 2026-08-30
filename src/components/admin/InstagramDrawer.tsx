"use client";

import { useEffect, useState } from "react";
import AdminDrawer from "./AdminDrawer";
import { Field, TextInput, Select } from "./FormFields";
import {
  useAdminInstagramPost,
  useAdminInstagramMutations,
} from "@/lib/hooks";
import type {
  CreateInstagramPostInput,
  InstagramPostStatus,
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

  useEffect(() => {
    if (post && !initialized) {
      setTitle(post.internalTitle ?? "");
      setCanonicalUrl(post.canonicalUrl);
      setStatus(post.status);
      setInternalNote(post.internalNote ?? "");
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
      const msg = err instanceof Error ? err.message : "Gagal menyimpan post.";
      notify(msg);
    } finally {
      setSubmitting(false);
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
        </div>
      )}
    </AdminDrawer>
  );
}