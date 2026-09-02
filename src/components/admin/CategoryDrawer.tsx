"use client";

import { useEffect, useState } from "react";
import AdminDrawer from "./AdminDrawer";
import { Field, TextArea, TextInput } from "./FormFields";
import {
  useAdminArticleCategories,
  useAdminArticleCategoryMutations,
} from "@/lib/hooks";
import { ApiClientError } from "@/lib/api";
import type { ArticleCategory, CreateCategoryInput, UpdateCategoryInput } from "@/lib/types";

type Props = {
  categoryId: string | null;
  onClose: () => void;
  onSaved: () => void;
  notify: (msg: string) => void;
};

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryDrawer({ categoryId, onClose, onSaved, notify }: Props) {
  const isEditing = !!categoryId;
  const { data: categories = [] } = useAdminArticleCategories();
  const mutations = useAdminArticleCategoryMutations();

  const existing: ArticleCategory | undefined = isEditing
    ? categories.find((c) => c.id === categoryId)
    : undefined;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [autoSlug, setAutoSlug] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setSlug(existing.slug);
      setDescription(existing.description ?? "");
      setSortOrder(existing.sortOrder);
      setAutoSlug(false);
    }
  }, [existing]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) setSlug(toSlug(val));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim()) {
      notify("Nama dan slug wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing && categoryId) {
        await mutations.update(categoryId, {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          sortOrder: Number(sortOrder) || 0,
        } as UpdateCategoryInput);
      } else {
        await mutations.create({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          sortOrder: Number(sortOrder) || 0,
        } as CreateCategoryInput);
      }
      onSaved();
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 422) {
        const firstFieldError = Object.values(err.getFieldErrors())[0]?.[0];
        notify(`Validasi gagal: ${firstFieldError ?? err.message}`);
      } else {
        notify(err instanceof Error ? err.message : "Gagal menyimpan kategori.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminDrawer
      eyebrow={isEditing ? "Edit kategori" : "Tambah kategori"}
      title={name || "Kategori baru"}
      subtitle="Kelompokkan informasi agar mudah ditemukan."
      onClose={onClose}
      onSubmit={handleSubmit}
      submitDisabled={submitting}
      submitLabel={submitting ? "Menyimpan…" : isEditing ? "Simpan perubahan" : "Tambah kategori"}
    >
      <div className="space-y-5">
        <Field label="Nama kategori" required>
          <TextInput
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Contoh: Opini"
            maxLength={100}
          />
        </Field>

        <Field label="Slug" required hint="huruf kecil dan tanda strip">
          <TextInput
            value={slug}
            onChange={(e) => {
              setAutoSlug(false);
              setSlug(toSlug(e.target.value));
            }}
            placeholder="opini"
            maxLength={120}
          />
        </Field>

        <Field label="Deskripsi" hint="maks. 255 karakter">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Penjelasan singkat kategori."
            maxLength={255}
            className="min-h-[80px]"
          />
        </Field>

        <Field label="Urutan tampil">
          <TextInput
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
          />
        </Field>
      </div>
    </AdminDrawer>
  );
}