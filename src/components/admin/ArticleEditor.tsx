"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Eye, History, Pencil, Star, Trash2, ChevronDown, RotateCcw,
  Loader2, X, Check,
} from "lucide-react";
import {
  useAdminArticle,
  useAdminArticleMutations,
  useAdminArticleRevisions,
  useAdminMedia,
  usePublicArticleCategories,
} from "@/lib/hooks";
import { ApiClientError } from "@/lib/api";
import type {
  Article, ArticleCategory, ArticleRevision,
  CreateArticleInput, UpdateArticleInput,
} from "@/lib/types";
import SafeHtml from "@/components/ui/SafeHtml";
import ArticleEditorToolbar from "./ArticleEditorToolbar";
import CoverImageField, { type CoverImageValue } from "./CoverImageField";
import InlineImageDialog from "./InlineImageDialog";
import ScheduleDialog from "./ScheduleDialog";

export type ArticleEditorProps = {
  articleId: string | null;
  onClose: () => void;
  onSaved: (article: Article) => void;
  notify: (message: string) => void;
};

type FormState = {
  title: string;
  excerpt: string;
  content: string;
  cover: CoverImageValue;
  coverAlt: string;
  categoryId: string;
  visibility: "PUBLIC" | "INTERNAL";
};

const EXCERPT_MAX = 260;

const EMPTY_FORM: FormState = {
  title: "",
  excerpt: "",
  content: "<p></p>",
  cover: null,
  coverAlt: "",
  categoryId: "",
  visibility: "PUBLIC",
};

type Tab = "edit" | "preview" | "revisions";

function articleToForm(a: Article, mediaUrl?: string | null): FormState {
  return {
    title: a.title,
    excerpt: a.excerpt ?? "",
    content: a.content,
    cover: a.coverMediaId
      ? { mediaId: a.coverMediaId, url: mediaUrl ?? "", alt: a.coverAlt }
      : null,
    coverAlt: a.coverAlt ?? "",
    categoryId: a.categoryId ?? "",
    visibility: a.visibility,
  };
}

function htmlTextLength(html: string): number {
  return html.replace(/<[^>]+>/g, "").trim().length;
}

function validateForPublish(form: FormState): string | null {
  if (form.title.trim().length < 1) return "Judul wajib diisi.";
  if (htmlTextLength(form.content) < 1) return "Konten tidak boleh kosong.";
  if (!form.cover) return "Cover wajib diunggah sebelum publish.";
  if (form.coverAlt.trim().length < 1) return "Teks alternatif cover wajib diisi sebelum publish.";
  if (form.excerpt.length > EXCERPT_MAX) return `Excerpt maksimum ${EXCERPT_MAX} karakter.`;
  return null;
}

// Tiptap v3 StarterKit exposes extension chain commands at runtime but the
// ChainedCommands TS type does not include them through StarterKit's bundled
// extension inference. Cast the chain to any for content mutations.
type Chain = any;

export default function ArticleEditor({ articleId, onClose, onSaved, notify }: ArticleEditorProps) {
  const isNew = articleId === null;
  const { data: article, isLoading: articleLoading, mutate: refreshArticle } = useAdminArticle(articleId);
  const { data: revisions = [], isLoading: revisionsLoading, mutate: refreshRevisions } =
    useAdminArticleRevisions(articleId);
  const { data: categories = [] } = usePublicArticleCategories();
  const m = useAdminArticleMutations();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const { data: mediaByCoverId } = useAdminMedia(form.cover?.mediaId ?? null);
  const [tab, setTab] = useState<Tab>("edit");
  const [saving, setSaving] = useState(false);
  const [promoting, setPromoting] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [restoreConfirm, setRestoreConfirm] = useState<ArticleRevision | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: form.content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none min-h-[280px] focus:outline-none px-4 py-4",
      },
    },
    onUpdate: ({ editor }) => {
      setForm((f) => ({ ...f, content: editor.getHTML() }));
    },
    immediatelyRender: false,
  });

  // Load article into form when fetched
  useEffect(() => {
    if (article) setForm(articleToForm(article));
  }, [article]);

  // Push form.content into editor when editor first mounts
  useEffect(() => {
    if (editor && article && form.content !== editor.getHTML()) {
      editor.commands.setContent(article.content, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, article?.id]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const saveDraft = async () => {
    if (form.title.trim().length < 1) {
      setError("Judul wajib diisi.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const input: CreateArticleInput | UpdateArticleInput = {
        title: form.title,
        excerpt: form.excerpt || undefined,
        content: form.content,
        coverMediaId: form.cover?.mediaId,
        coverAlt: form.coverAlt || undefined,
        categoryId: form.categoryId || undefined,
        visibility: form.visibility,
      };
      const saved = isNew
        ? await m.create(input as CreateArticleInput)
        : await m.update(articleId!, input as UpdateArticleInput, article!.version);
      notify(isNew ? "Draft dibuat." : "Perubahan disimpan.");
      onSaved(saved);
      await refreshArticle();
      await refreshRevisions();
    } catch (e) {
      if (e instanceof ApiClientError && e.status === 409) {
        notify("Artikel diubah orang lain. Memuat ulang...");
        await refreshArticle();
        onClose();
      } else {
        setError(e instanceof Error ? e.message : "Gagal menyimpan.");
      }
    } finally {
      setSaving(false);
    }
  };

  const runPromote = async (key: string, fn: () => Promise<Article>) => {
    setPromoting(key);
    setError(null);
    try {
      await fn();
      notify("Berhasil.");
      await refreshArticle();
      await refreshRevisions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal.");
    } finally {
      setPromoting(null);
    }
  };

  const restoreRev = async (rev: ArticleRevision) => {
    setRestoreConfirm(null);
    setPromoting(`restore-${rev.id}`);
    setError(null);
    try {
      await m.restoreRevision(articleId!, rev.id);
      notify("Revisi dipulihkan.");
      await refreshArticle();
      await refreshRevisions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memulihkan.");
    } finally {
      setPromoting(null);
    }
  };

  const removeArticle = async () => {
    if (!window.confirm("Hapus artikel ini secara permanen?")) return;
    setPromoting("delete");
    setError(null);
    try {
      await m.remove(articleId!);
      notify("Artikel dihapus.");
      onSaved(article!);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setPromoting(null);
    }
  };

  const publishBlock = validateForPublish(form);
  const canSaveDraft = form.title.trim().length >= 1 && !saving;
  const canPublish = publishBlock === null && !promoting && !saving;

  return (
    <div className="fixed inset-0 z-[180] bg-black/65 backdrop-blur-sm" onMouseDown={onClose}>
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-[760px] flex-col border-l border-white/[0.08] bg-[#12100e] shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.07] bg-[#12100e] px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-bara-orange">
              {isNew ? "Tambah baru" : "Edit"}
            </p>
            <h2 className="mt-2 font-display text-2xl">Artikel Informasi</h2>
            <p className="mt-1 text-xs text-white/35">
              {isNew
                ? "Buat draf artikel untuk portal informasi."
                : `Status: ${article?.status ?? "..."}${article?.isFeatured ? " · Unggulan" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isNew && article && (
              <button
                type="button"
                onClick={() => runPromote("feature", () => m.feature(articleId!))}
                disabled={!!promoting}
                className={`admin-secondary-button ${
                  article.isFeatured ? "border-bara-gold/40 text-bara-gold" : ""
                }`}
              >
                <Star className="h-3.5 w-3.5" />
                {article.isFeatured ? "Lepas Unggulan" : "Jadikan Unggulan"}
              </button>
            )}
            <button onClick={onClose} className="admin-icon-button">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.07] bg-[#12100e] px-6">
          <TabButton active={tab === "edit"} onClick={() => setTab("edit")}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </TabButton>
          <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
            <Eye className="h-3.5 w-3.5" /> Pratinjau
          </TabButton>
          {!isNew && (
            <TabButton active={tab === "revisions"} onClick={() => setTab("revisions")}>
              <History className="h-3.5 w-3.5" /> Revisi ({revisions.length})
            </TabButton>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {articleLoading && !isNew ? (
            <div className="grid h-40 place-items-center text-xs text-white/40">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : tab === "edit" ? (
            <EditTab
              form={form}
              updateField={updateField}
              editor={editor as Chain}
              onInsertImage={() => setImageDialogOpen(true)}
              categories={categories}
              coverUrl={mediaByCoverId?.url ?? null}
            />
          ) : tab === "preview" ? (
            <PreviewTab form={form} coverUrl={mediaByCoverId?.url ?? null} />
          ) : (
            <RevisionsTab
              revisions={revisions}
              isLoading={revisionsLoading}
              onRestore={(r) => setRestoreConfirm(r)}
              promoting={promoting}
            />
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="border-t border-red-500/20 bg-red-500/[0.06] px-6 py-3 text-[11px] text-red-200">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-[#12100e] px-6 py-4">
          <div className="text-[10px] text-white/30">
            {publishBlock ? (
              <span className="text-amber-300/80">Publish: {publishBlock}</span>
            ) : (
              <span>Siap dipublikasikan.</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isNew && (
              <button
                type="button"
                onClick={removeArticle}
                disabled={!!promoting || saving}
                className="admin-secondary-button text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" /> Hapus
              </button>
            )}
            <button
              type="button"
              onClick={saveDraft}
              disabled={!canSaveDraft}
              className="admin-primary-button"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Simpan Draft
            </button>
            <PromoteMenu
              status={article?.status ?? "DRAFT"}
              promoting={promoting}
              disabled={!canPublish || isNew}
              onPublish={() => runPromote("publish", () => m.publish(articleId!))}
              onSchedule={() => setScheduleOpen(true)}
              onUnpublish={() => runPromote("unpublish", () => m.unpublish(articleId!))}
              onArchive={() => runPromote("archive", () => m.archive(articleId!))}
              onUnarchive={() => runPromote("unarchive", () => m.unarchive(articleId!))}
            />
          </div>
        </div>

        <InlineImageDialog
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          onInsert={(m) => {
            const e = editor as Chain;
            e?.chain().focus().setImage({ src: m.url, alt: m.alt ?? "" }).run();
          }}
        />

        <ScheduleDialog
          open={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
          onConfirm={async (at) => {
            setScheduleOpen(false);
            await runPromote("schedule", () => m.schedule(articleId!, at));
          }}
        />

        {restoreConfirm && (
          <div
            className="fixed inset-0 z-[200] grid place-items-center bg-black/70 backdrop-blur-sm"
            onMouseDown={() => setRestoreConfirm(null)}
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#12100e] p-6 shadow-2xl"
            >
              <h3 className="font-display text-lg">Pulihkan revisi?</h3>
              <p className="mt-2 text-xs text-white/55">
                Konten akan dikembalikan ke versi {restoreConfirm.version}. Revisi baru akan
                dibuat untuk mencatat pemulihan ini.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setRestoreConfirm(null)}
                  className="admin-secondary-button"
                >
                  Batal
                </button>
                <button
                  onClick={() => restoreRev(restoreConfirm)}
                  className="admin-primary-button"
                >
                  <RotateCcw className="h-4 w-4" /> Pulihkan
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
        active
          ? "border-bara-orange text-white"
          : "border-transparent text-white/55 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function EditTab({
  form,
  updateField,
  editor,
  onInsertImage,
  categories,
  coverUrl,
}: {
  form: FormState;
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  editor: Chain;
  onInsertImage: () => void;
  categories: ArticleCategory[];
  coverUrl: string | null;
}) {
  const excerptLen = form.excerpt.length;
  const coverDisplay: CoverImageValue = form.cover
    ? { ...form.cover, url: form.cover.url || coverUrl || "" }
    : null;
  return (
    <div className="space-y-5">
      <Field label="Judul">
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Judul artikel"
          className="admin-input"
          maxLength={255}
        />
      </Field>

      <Field label={`Excerpt (maks ${EXCERPT_MAX} karakter)`}>
        <textarea
          value={form.excerpt}
          onChange={(e) => updateField("excerpt", e.target.value)}
          placeholder="Ringkasan singkat untuk kartu dan daftar artikel"
          className="admin-input min-h-20 resize-y"
          maxLength={EXCERPT_MAX + 20}
        />
        <div
          className={`mt-1.5 text-right text-[10px] ${
            excerptLen > EXCERPT_MAX ? "text-red-300" : "text-white/30"
          }`}
        >
          {excerptLen} / {EXCERPT_MAX}
        </div>
      </Field>

      <Field label="Kategori">
        <select
          value={form.categoryId}
          onChange={(e) => updateField("categoryId", e.target.value)}
          className="admin-input"
        >
          <option value="">— Tanpa kategori —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Visibilitas">
        <div className="flex gap-4 text-xs">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.visibility === "PUBLIC"}
              onChange={() => updateField("visibility", "PUBLIC")}
            />
            Publik
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.visibility === "INTERNAL"}
              onChange={() => updateField("visibility", "INTERNAL")}
            />
            Internal
          </label>
        </div>
      </Field>

      <Field label="Cover">
        <CoverImageField value={coverDisplay} onChange={(v) => updateField("cover", v)} />
      </Field>

      {form.cover && (
        <Field label="Teks alternatif cover (wajib sebelum publish)">
          <input
            type="text"
            value={form.coverAlt}
            onChange={(e) => updateField("coverAlt", e.target.value)}
            placeholder="Deskripsikan gambar untuk aksesibilitas"
            className="admin-input"
            maxLength={255}
          />
        </Field>
      )}

      <Field label="Konten">
        <ArticleEditorToolbar editor={editor} onInsertImage={onInsertImage} />
        <div className="rounded-b-2xl border border-t-0 border-white/[0.07] bg-[#0e0c0a]">
          <EditorContent editor={editor} />
        </div>
      </Field>
    </div>
  );
}

function PreviewTab({ form, coverUrl }: { form: FormState; coverUrl: string | null }) {
  const finalCoverUrl = form.cover?.url || coverUrl;
  return (
    <article className="prose prose-invert mx-auto max-w-2xl">
      <h1 className="font-display">{form.title || "Tanpa judul"}</h1>
      {finalCoverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={finalCoverUrl}
          alt={form.coverAlt}
          className="w-full rounded-2xl border border-white/10"
        />
      )}
      {form.excerpt && (
        <p className="text-base leading-7 text-white/65">{form.excerpt}</p>
      )}
      <SafeHtml html={form.content} />
    </article>
  );
}

function RevisionsTab({
  revisions,
  isLoading,
  onRestore,
  promoting,
}: {
  revisions: ArticleRevision[];
  isLoading: boolean;
  onRestore: (r: ArticleRevision) => void;
  promoting: string | null;
}) {
  if (isLoading) {
    return (
      <div className="grid h-40 place-items-center text-xs text-white/40">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }
  if (revisions.length === 0) {
    return (
      <p className="py-12 text-center text-xs text-white/40">
        Belum ada revisi tersimpan.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {revisions.map((r) => (
        <li
          key={r.id}
          className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
        >
          <div>
            <p className="font-display text-base text-white/80">
              v{r.version}
              {r.restoreSourceId && (
                <span className="ml-2 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] uppercase text-amber-300">
                  restore
                </span>
              )}
            </p>
            <p className="mt-1 text-[10px] text-white/40">
              {new Date(r.createdAt).toLocaleString("id-ID")} ·{" "}
              {r.createdBy?.name ?? "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRestore(r)}
            disabled={!!promoting}
            className="admin-secondary-button"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Pulihkan
          </button>
        </li>
      ))}
    </ul>
  );
}

function PromoteMenu({
  status,
  promoting,
  disabled,
  onPublish,
  onSchedule,
  onUnpublish,
  onArchive,
  onUnarchive,
}: {
  status: string;
  promoting: string | null;
  disabled: boolean;
  onPublish: () => void;
  onSchedule: () => void;
  onUnpublish: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled || !!promoting}
        onClick={() => setOpen((o) => !o)}
        className="admin-primary-button"
      >
        Promosikan <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute bottom-full right-0 z-10 mb-2 w-56 rounded-xl border border-white/[0.08] bg-[#1a1614] p-1 shadow-2xl">
          <PromoteItem
            label="Publish Sekarang"
            onClick={() => {
              setOpen(false);
              onPublish();
            }}
            disabled={!!promoting}
          />
          <PromoteItem
            label="Jadwalkan..."
            onClick={() => {
              setOpen(false);
              onSchedule();
            }}
            disabled={!!promoting}
          />
          {(status === "PUBLISHED" || status === "SCHEDULED") && (
            <PromoteItem
              label="Kembalikan ke Draft"
              onClick={() => {
                setOpen(false);
                onUnpublish();
              }}
              disabled={!!promoting}
            />
          )}
          {status === "PUBLISHED" && (
            <PromoteItem
              label="Arsipkan"
              onClick={() => {
                setOpen(false);
                onArchive();
              }}
              disabled={!!promoting}
            />
          )}
          {status === "ARCHIVED" && (
            <PromoteItem
              label="Pulihkan dari Arsip"
              onClick={() => {
                setOpen(false);
                onUnarchive();
              }}
              disabled={!!promoting}
            />
          )}
        </div>
      )}
    </div>
  );
}

function PromoteItem({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="block w-full rounded-lg px-3 py-2 text-left text-xs text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold text-white/55">{label}</span>
      {children}
    </label>
  );
}