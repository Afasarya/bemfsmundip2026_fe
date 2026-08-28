import useSWR, { type SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { apiFetch } from "./api";
import type {
  AdminDashboard,
  Article,
  ArticleCategory,
  ArticleRevision,
  CreateArticleInput,
  InstagramProfileData,
  Media,
  MediaVariant,
  PaginatedArticles,
  PublicDashboard,
  UnitDetail,
  UnitListItem,
  UpdateArticleInput,
} from "./types";

type ListParams = {
  page?: number;
  pageSize?: number;
  status?: string;
  categoryId?: string;
  search?: string;
};

type FeaturedConfig = SWRConfiguration<Article | null>;

const defaults: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 30_000,
};

// ============================== ARTICLES ==============================

export function usePublicArticles(
  params?: ListParams,
  config?: SWRConfiguration<PaginatedArticles>,
) {
  const path = "public/articles";
  return useSWR<PaginatedArticles>(
    ["public-articles", params ?? null] as const,
    ([, q]) => apiFetch<PaginatedArticles>(path, { query: q as Record<string, string | number | undefined> }),
    { ...defaults, ...config },
  );
}

export function useFeaturedArticle(config?: FeaturedConfig) {
  return useSWR<Article | null>(
    "public-articles-featured",
    () => apiFetch<Article | null>("public/articles/featured"),
    { ...defaults, ...config },
  );
}

export function useArticleBySlug(slug: string | null, config?: SWRConfiguration<Article>) {
  return useSWR<Article | null>(
    slug ? ["public-article", slug] as const : null,
    ([, s]) => apiFetch<Article>(`public/articles/${s}`),
    { ...defaults, ...config },
  );
}

export function useAdminArticles(
  params?: ListParams,
  config?: SWRConfiguration<PaginatedArticles>,
) {
  return useSWR<PaginatedArticles>(
    ["admin-articles", params ?? null] as const,
    async ([, q]) =>
      apiFetch<PaginatedArticles>("admin/articles", {
        query: q as Record<string, string | number | undefined>,
        withCredentials: true,
      }),
    { ...defaults, ...config },
  );
}

export function useAdminArticle(id: string | null, config?: SWRConfiguration<Article>) {
  return useSWR<Article | null>(
    id ? ["admin-article", id] as const : null,
    async ([, aid]) =>
      apiFetch<Article>(`admin/articles/${aid}`, { withCredentials: true }),
    { ...defaults, ...config },
  );
}

export function useAdminMedia(id: string | null) {
  return useSWR<Media | null>(
    id ? ["admin-media", id] as const : null,
    async ([, mid]) => {
      try {
        const wrapped = await apiFetch<{ data: Media }>(`media/${mid}`, {
          withCredentials: true,
        });
        return wrapped.data;
      } catch {
        return null;
      }
    },
    { ...defaults },
  );
}

export function useAdminArticleRevisions(id: string | null) {
  return useSWR<ArticleRevision[]>(
    id ? ["admin-article-revisions", id] as const : null,
    async ([, aid]) => {
      const wrapped = await apiFetch<{ data: ArticleRevision[] }>(
        `admin/articles/${aid}/revisions`,
        { withCredentials: true },
      );
      return wrapped.data;
    },
    { ...defaults },
  );
}

export function usePublicArticleCategories(
  config?: SWRConfiguration<ArticleCategory[]>,
) {
  return useSWR<ArticleCategory[]>(
    "public-article-categories",
    async () => {
      const wrapped = await apiFetch<{ data: ArticleCategory[] }>(
        "public/article-categories",
      );
      return wrapped.data;
    },
    { ...defaults, ...config },
  );
}

type AdminArticleMutations = {
  create: (input: CreateArticleInput) => Promise<Article>;
  update: (id: string, input: UpdateArticleInput, version: number) => Promise<Article>;
  publish: (id: string) => Promise<Article>;
  unpublish: (id: string) => Promise<Article>;
  schedule: (id: string, at: Date) => Promise<Article>;
  archive: (id: string) => Promise<Article>;
  unarchive: (id: string) => Promise<Article>;
  feature: (id: string) => Promise<Article>;
  remove: (id: string) => Promise<void>;
  restoreRevision: (articleId: string, revisionId: string) => Promise<Article>;
  uploadMedia: (file: File, variant: MediaVariant) => Promise<Media>;
};

export function useAdminArticleMutations(): AdminArticleMutations {
  return {
    create: (input) =>
      apiFetch<Article>("admin/articles", {
        method: "POST",
        body: input,
        withCredentials: true,
      }),
    update: (id, input, version) =>
      apiFetch<Article>(`admin/articles/${id}`, {
        method: "PUT",
        body: input,
        withCredentials: true,
        headers: { "If-Match": `"${version}"` },
      }),
    publish: (id) =>
      apiFetch<Article>(`admin/articles/${id}/publish`, {
        method: "POST",
        withCredentials: true,
      }),
    unpublish: (id) =>
      apiFetch<Article>(`admin/articles/${id}/unpublish`, {
        method: "POST",
        withCredentials: true,
      }),
    schedule: (id, at) =>
      apiFetch<Article>(`admin/articles/${id}/schedule`, {
        method: "POST",
        body: { scheduledAt: at.toISOString() },
        withCredentials: true,
      }),
    archive: (id) =>
      apiFetch<Article>(`admin/articles/${id}/archive`, {
        method: "POST",
        withCredentials: true,
      }),
    unarchive: (id) =>
      apiFetch<Article>(`admin/articles/${id}/unarchive`, {
        method: "POST",
        withCredentials: true,
      }),
    feature: (id) =>
      apiFetch<Article>(`admin/articles/${id}/feature`, {
        method: "POST",
        withCredentials: true,
      }),
    remove: (id) =>
      apiFetch<void>(`admin/articles/${id}`, {
        method: "DELETE",
        withCredentials: true,
      }),
    restoreRevision: (articleId, revisionId) =>
      apiFetch<Article>(
        `admin/articles/${articleId}/revisions/${revisionId}/restore`,
        { method: "POST", withCredentials: true },
      ),
    uploadMedia: async (file, variant) => {
      const form = new FormData();
      form.append("file", file);
      form.append("variant", variant);
      const base =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";
      const res = await fetch(`${base}/media`, {
        method: "POST",
        body: form,
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Media upload failed (${res.status})`);
      }
      const json = (await res.json()) as { data: Media };
      return json.data;
    },
  };
}

// ============================== UNITS ==============================

export function usePublicUnits(config?: SWRConfiguration<UnitListItem[]>) {
  return useSWR<UnitListItem[]>(
    "public-units",
    () => apiFetch<UnitListItem[]>("public/organization-units"),
    { ...defaults, ...config },
  );
}

export function useUnitBySlug(slug: string | null, config?: SWRConfiguration<UnitDetail | null>) {
  return useSWR<UnitDetail | null>(
    slug ? ["public-unit", slug] as const : null,
    async ([, s]) => {
      try {
        return await apiFetch<UnitDetail>(`public/organization-units/${s}`);
      } catch {
        return null;
      }
    },
    { ...defaults, ...config },
  );
}

// ============================== INSTAGRAM ==============================

export function useInstagramProfile(config?: SWRConfiguration<InstagramProfileData | null>) {
  return useSWR<InstagramProfileData | null>(
    "public-instagram",
    () => apiFetch<InstagramProfileData | null>("public/instagram"),
    { ...defaults, ...config },
  );
}

// ============================== DASHBOARD ==============================

export function usePublicDashboard(config?: SWRConfiguration<PublicDashboard>) {
  return useSWR<PublicDashboard>(
    "public-dashboard",
    () => apiFetch<PublicDashboard>("public/dashboard"),
    { ...defaults, ...config },
  );
}

export function useAdminDashboard(config?: SWRConfiguration<AdminDashboard>) {
  return useSWR<AdminDashboard>(
    "admin-dashboard",
    () => apiFetch<AdminDashboard>("admin/dashboard", { withCredentials: true }),
    { ...defaults, ...config },
  );
}

// ============================== MUTATIONS (admin) ==============================

export function useAdminUpdate<TBody, TResult>(
  path: string,
  config?: Parameters<typeof useSWRMutation<TResult, unknown, string, TBody>>[2],
) {
  return useSWRMutation<TResult, unknown, string, TBody>(
    path,
    async (url, { arg }) =>
      apiFetch<TResult>(url, {
        method: "PATCH",
        body: arg as unknown,
        withCredentials: true,
      }),
    config,
  );
}

export function useAdminDelete<TResult = unknown>(
  path: string,
  config?: Parameters<typeof useSWRMutation<TResult, unknown, string, void>>[2],
) {
  return useSWRMutation<TResult, unknown, string, void>(
    path,
    async (url) =>
      apiFetch<TResult>(url, { method: "DELETE", withCredentials: true }),
    config,
  );
}
