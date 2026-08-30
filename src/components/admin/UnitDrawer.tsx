"use client";

import { useEffect, useState } from "react";
import AdminDrawer from "./AdminDrawer";
import { Field, TextArea, TextInput, Select, SectionTitle, ArrayField } from "./FormFields";
import {
  useAdminUnit,
  useAdminUnitMutations,
} from "@/lib/hooks";
import type {
  CreateUnitInput,
  UnitDetail,
  UnitMemberInput,
  UnitProgramInput,
  UnitStrategyInput,
  UnitType,
  UnitStatus,
  UpdateUnitInput,
} from "@/lib/types";

type Props = {
  unitId: string | null;
  onClose: () => void;
  onSaved: () => void;
  notify: (msg: string) => void;
};

const UNIT_TYPE_OPTIONS: { value: UnitType; label: string }[] = [
  { value: "TEAM", label: "Tim" },
  { value: "BUREAU", label: "Biro" },
  { value: "DIVISION", label: "Bidang" },
];

const STATUS_OPTIONS: { value: UnitStatus; label: string }[] = [
  { value: "DRAFT", label: "Draf" },
  { value: "PUBLISHED", label: "Tayang" },
  { value: "ARCHIVED", label: "Diarsipkan" },
];

type FormState = {
  name: string;
  slug: string;
  shortName: string;
  type: UnitType;
  summary: string;
  description: string;
  status: UnitStatus;
  sortOrder: number;
  seoTitle: string;
  seoDesc: string;
  logoMediaId: string;
  strategies: UnitStrategyInput[];
  programs: UnitProgramInput[];
  members: UnitMemberInput[];
};

function emptyForm(): FormState {
  return {
    name: "",
    slug: "",
    shortName: "",
    type: "BUREAU",
    summary: "",
    description: "",
    status: "DRAFT",
    sortOrder: 0,
    seoTitle: "",
    seoDesc: "",
    logoMediaId: "",
    strategies: [],
    programs: [],
    members: [],
  };
}

function fromDetail(detail: UnitDetail): FormState {
  return {
    name: detail.name,
    slug: detail.slug,
    shortName: detail.shortName ?? "",
    type: detail.type,
    summary: detail.summary ?? "",
    description: detail.description ?? "",
    status: detail.status,
    sortOrder: detail.sortOrder,
    seoTitle: detail.seoTitle ?? "",
    seoDesc: detail.seoDesc ?? "",
    logoMediaId: detail.logoMediaId ?? "",
    strategies: detail.strategies.map((s) => ({ id: s.id, content: s.content, sortOrder: s.sortOrder })),
    programs: detail.programs.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      scheduleLabel: p.scheduleLabel ?? "",
      externalUrl: p.externalUrl ?? "",
      status: p.status,
      sortOrder: p.sortOrder,
    })),
    members: detail.members.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      photoMediaId: m.photoMediaId ?? "",
      photoAlt: m.photoAlt ?? "",
      instagramUrl: m.instagramUrl ?? "",
      linkedinUrl: m.linkedinUrl ?? "",
      sortOrder: m.sortOrder,
      isActive: m.isActive,
    })),
  };
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function UnitDrawer({ unitId, onClose, onSaved, notify }: Props) {
  const isEditing = !!unitId;
  const { data: detail, isLoading } = useAdminUnit(unitId);
  const mutations = useAdminUnitMutations();
  const [form, setForm] = useState<FormState>(emptyForm());
  const [initialized, setInitialized] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (detail && !initialized) {
      setForm(fromDetail(detail));
      setInitialized(true);
    }
  }, [detail, initialized]);

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleNameChange = (val: string) => {
    setForm((f) => ({
      ...f,
      name: val,
      ...(autoSlug ? { slug: toSlug(val) } : {}),
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      notify("Nama dan slug wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      const payload: CreateUnitInput | UpdateUnitInput = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        shortName: form.shortName.trim() || undefined,
        type: form.type,
        summary: form.summary.trim() || undefined,
        description: form.description.trim() || undefined,
        status: form.status,
        sortOrder: Number(form.sortOrder) || 0,
        seoTitle: form.seoTitle.trim() || undefined,
        seoDesc: form.seoDesc.trim() || undefined,
        logoMediaId: form.logoMediaId.trim() || undefined,
        strategies: form.strategies.filter((s) => s.content.trim()).map((s, i) => ({
          ...(s.id ? { id: s.id } : {}),
          content: s.content.trim(),
          sortOrder: typeof s.sortOrder === "number" ? s.sortOrder : i,
        })),
        programs: form.programs.filter((p) => p.name.trim()).map((p, i) => ({
          ...(p.id ? { id: p.id } : {}),
          name: p.name.trim(),
          description: p.description?.trim() || undefined,
          scheduleLabel: p.scheduleLabel?.trim() || undefined,
          externalUrl: p.externalUrl?.trim() || undefined,
          status: p.status,
          sortOrder: typeof p.sortOrder === "number" ? p.sortOrder : i,
        })),
        members: form.members.filter((m) => m.name.trim() && m.role.trim()).map((m, i) => ({
          ...(m.id ? { id: m.id } : {}),
          name: m.name.trim(),
          role: m.role.trim(),
          photoMediaId: m.photoMediaId?.trim() || undefined,
          photoAlt: m.photoAlt?.trim() || undefined,
          instagramUrl: m.instagramUrl?.trim() || undefined,
          linkedinUrl: m.linkedinUrl?.trim() || undefined,
          sortOrder: typeof m.sortOrder === "number" ? m.sortOrder : i,
          isActive: m.isActive ?? true,
        })),
      };

      if (isEditing && unitId) {
        await mutations.update(unitId, payload as UpdateUnitInput);
      } else {
        await mutations.create(payload as CreateUnitInput);
      }
      onSaved();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan unit.";
      notify(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminDrawer
      eyebrow={isEditing ? "Edit unit" : "Tambah unit"}
      title={form.name || "Unit baru"}
      subtitle="Kelola profil lengkap unit kabinet."
      onClose={onClose}
      onSubmit={handleSubmit}
      submitDisabled={submitting || isLoading}
      submitLabel={submitting ? "Menyimpan…" : isEditing ? "Simpan perubahan" : "Tambah unit"}
    >
      {isEditing && isLoading ? (
        <div className="space-y-3">
          <div className="h-10 animate-pulse rounded-lg bg-white/[0.03]" />
          <div className="h-10 animate-pulse rounded-lg bg-white/[0.03]" />
          <div className="h-24 animate-pulse rounded-lg bg-white/[0.03]" />
        </div>
      ) : (
        <div className="space-y-5">
          <Field label="Nama unit" required>
            <TextInput
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Biro Komunikasi"
              maxLength={200}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" required hint="huruf kecil dan tanda strip">
              <TextInput
                value={form.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  update("slug", toSlug(e.target.value));
                }}
                placeholder="biro-komunikasi"
                maxLength={120}
              />
            </Field>
            <Field label="Nama singkat">
              <TextInput
                value={form.shortName}
                onChange={(e) => update("shortName", e.target.value)}
                placeholder="BK"
                maxLength={50}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Jenis" required>
              <Select
                value={form.type}
                onChange={(e) => update("type", e.target.value as UnitType)}
              >
                {UNIT_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(e) => update("status", e.target.value as UnitStatus)}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Ringkasan" hint="maks. 500 karakter">
            <TextArea
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
              placeholder="Deskripsi singkat yang tampil di kartu unit."
              maxLength={500}
            />
          </Field>

          <Field label="Deskripsi lengkap">
            <TextArea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Profil lengkap, sejarah, dan tanggung jawab unit."
              className="min-h-[160px]"
            />
          </Field>

          <SectionTitle title="Pengaturan tampilan" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Urutan tampil">
              <TextInput
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => update("sortOrder", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Logo (media id)" hint="UUID dariunggah sebelumnya">
              <TextInput
                value={form.logoMediaId}
                onChange={(e) => update("logoMediaId", e.target.value)}
                placeholder="uuid media"
              />
            </Field>
          </div>

          <SectionTitle title="SEO" />
          <Field label="Judul SEO">
            <TextInput
              value={form.seoTitle}
              onChange={(e) => update("seoTitle", e.target.value)}
              maxLength={255}
            />
          </Field>
          <Field label="Deskripsi SEO">
            <TextArea
              value={form.seoDesc}
              onChange={(e) => update("seoDesc", e.target.value)}
              maxLength={160}
              className="min-h-[80px]"
            />
          </Field>

          <SectionTitle title="Strategi unit" hint="Daftar butir arah strategis" />
          <ArrayField<UnitStrategyInput>
            title="Butir strategi"
            items={form.strategies}
            onChange={(next) => update("strategies", next)}
            emptyLabel="Belum ada butir strategi. Klik tambah untuk menulis."
            addLabel="Tambah strategi"
            newItem={() => ({ content: "", sortOrder: form.strategies.length })}
            renderItem={(item, idx, setItem) => (
              <div className="space-y-2">
                <TextArea
                  value={item.content}
                  onChange={(e) => setItem({ ...item, content: e.target.value })}
                  placeholder={`Strategi #${idx + 1}`}
                  className="min-h-[64px]"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30">Urutan</span>
                  <TextInput
                    type="number"
                    min={0}
                    className="w-24"
                    value={item.sortOrder}
                    onChange={(e) => setItem({ ...item, sortOrder: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>
            )}
          />

          <SectionTitle title="Program kerja" />
          <ArrayField<UnitProgramInput>
            title="Program"
            items={form.programs}
            onChange={(next) => update("programs", next)}
            emptyLabel="Belum ada program. Klik tambah untuk menambahkan."
            addLabel="Tambah program"
            newItem={() => ({
              name: "",
              description: "",
              scheduleLabel: "",
              externalUrl: "",
              status: "PLANNED",
              sortOrder: form.programs.length,
            })}
            renderItem={(item, idx, setItem) => (
              <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <TextInput
                    value={item.name}
                    onChange={(e) => setItem({ ...item, name: e.target.value })}
                    placeholder="Nama program"
                  />
                  <Select
                    value={item.status ?? "PLANNED"}
                    onChange={(e) =>
                      setItem({ ...item, status: e.target.value as UnitProgramInput["status"] })
                    }
                  >
                    <option value="PLANNED">Direncanakan</option>
                    <option value="ACTIVE">Berjalan</option>
                    <option value="COMPLETED">Selesai</option>
                  </Select>
                </div>
                <TextArea
                  value={item.description ?? ""}
                  onChange={(e) => setItem({ ...item, description: e.target.value })}
                  placeholder="Deskripsi program"
                  className="min-h-[60px]"
                />
                <div className="grid gap-2 sm:grid-cols-3">
                  <TextInput
                    value={item.scheduleLabel ?? ""}
                    onChange={(e) => setItem({ ...item, scheduleLabel: e.target.value })}
                    placeholder="Jadwal (mis. Semester 1)"
                  />
                  <TextInput
                    value={item.externalUrl ?? ""}
                    onChange={(e) => setItem({ ...item, externalUrl: e.target.value })}
                    placeholder="URL terkait"
                  />
                  <TextInput
                    type="number"
                    min={0}
                    value={item.sortOrder}
                    onChange={(e) => setItem({ ...item, sortOrder: Number(e.target.value) || 0 })}
                    placeholder="Urutan"
                  />
                </div>
                <p className="text-[10px] text-white/25"># {idx + 1}</p>
              </div>
            )}
          />

          <SectionTitle title="Fungsionaris" />
          <ArrayField<UnitMemberInput>
            title="Anggota"
            items={form.members}
            onChange={(next) => update("members", next)}
            emptyLabel="Belum ada anggota. Klik tambah untuk menambahkan."
            addLabel="Tambah anggota"
            newItem={() => ({
              name: "",
              role: "",
              photoMediaId: "",
              photoAlt: "",
              instagramUrl: "",
              linkedinUrl: "",
              sortOrder: form.members.length,
              isActive: true,
            })}
            renderItem={(item, idx, setItem) => (
              <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <TextInput
                    value={item.name}
                    onChange={(e) => setItem({ ...item, name: e.target.value })}
                    placeholder="Nama"
                  />
                  <TextInput
                    value={item.role}
                    onChange={(e) => setItem({ ...item, role: e.target.value })}
                    placeholder="Jabatan"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <TextInput
                    value={item.photoMediaId ?? ""}
                    onChange={(e) => setItem({ ...item, photoMediaId: e.target.value })}
                    placeholder="UUID foto"
                  />
                  <TextInput
                    value={item.photoAlt ?? ""}
                    onChange={(e) => setItem({ ...item, photoAlt: e.target.value })}
                    placeholder="Alt foto"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <TextInput
                    value={item.instagramUrl ?? ""}
                    onChange={(e) => setItem({ ...item, instagramUrl: e.target.value })}
                    placeholder="Instagram URL"
                  />
                  <TextInput
                    value={item.linkedinUrl ?? ""}
                    onChange={(e) => setItem({ ...item, linkedinUrl: e.target.value })}
                    placeholder="LinkedIn URL"
                  />
                  <TextInput
                    type="number"
                    min={0}
                    value={item.sortOrder}
                    onChange={(e) => setItem({ ...item, sortOrder: Number(e.target.value) || 0 })}
                    placeholder="Urutan"
                  />
                </div>
                <label className="flex items-center gap-2 text-[11px] text-white/55">
                  <input
                    type="checkbox"
                    checked={item.isActive ?? true}
                    onChange={(e) => setItem({ ...item, isActive: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-white/10 bg-white/5"
                  />
                  Aktif ditampilkan
                </label>
                <p className="text-[10px] text-white/25"># {idx + 1}</p>
              </div>
            )}
          />
        </div>
      )}
    </AdminDrawer>
  );
}