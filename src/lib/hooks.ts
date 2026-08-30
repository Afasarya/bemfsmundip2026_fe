import useSWR, { type SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { apiFetch } from "./api";
import type {
  AdminDashboard,
  Article,
  ArticleCategory,
  ArticleRevision,
  CreateArticleInput,
  CreateCategoryInput,
  CreateInstagramPostInput,
  CreateUnitInput,
  InstagramPlacementType,
  InstagramPost,
  InstagramPostListItem,
  InstagramPostListResponse,
  InstagramProfileData,
  Media,
  MediaVariant,
  PaginatedArticles,
  PublicDashboard,
  UnitDetail,
  UnitListItem,
  UnitListResponse,
  UpdateArticleInput,
  UpdateCategoryInput,
  UpdateInstagramPostInput,
  UpdateUnitInput,
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
        return await apiFetch<Media>(`media/${mid}`, {
          withCredentials: true,
        });
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
    async ([, aid]) =>
      apiFetch<ArticleRevision[]>(`admin/articles/${aid}/revisions`, {
        withCredentials: true,
      }),
    { ...defaults },
  );
}

export function usePublicArticleCategories(
  config?: SWRConfiguration<ArticleCategory[]>,
) {
  return useSWR<ArticleCategory[]>(
    "public-article-categories",
    () => apiFetch<ArticleCategory[]>("public/article-categories"),
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
      apiFetch<Article>(`admin/articles/${id}/featured`, {
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
      // apiFetch unwraps { data: T } -> T.
      return apiFetch<Media>("media", {
        method: "POST",
        body: form,
        withCredentials: true,
      });
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

// Highlighted published posts for a placement (HOME | INFORMATION).
// Returns the raw array — backend does not wrap it in {data, meta} for this endpoint.
export function usePublicInstagramPosts(
  placement: InstagramPlacementType = "HOME",
  config?: SWRConfiguration<InstagramPostListItem[]>,
) {
  return useSWR<InstagramPostListItem[]>(
    ["public-instagram-posts", placement] as const,
    ([, p]) => apiFetch<InstagramPostListItem[]>(`public/instagram-posts?placement=${p}`),
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

// ============================== ADMIN UNITS ==============================

type AdminUnitsParams = {
  page?: number;
  pageSize?: number;
  type?: "TEAM" | "BUREAU" | "DIVISION";
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  search?: string;
};

export function useAdminUnits(
  params?: AdminUnitsParams,
  config?: SWRConfiguration<UnitListResponse>,
) {
  return useSWR<UnitListResponse>(
    ["admin-units", params ?? null] as const,
    async ([, q]) =>
      apiFetch<UnitListResponse>("admin/organization-units", {
        query: q as Record<string, string | number | undefined>,
        withCredentials: true,
      }),
    { ...defaults, ...config },
  );
}

export function useAdminUnit(id: string | null, config?: SWRConfiguration<UnitDetail>) {
  return useSWR<UnitDetail>(
    id ? ["admin-unit", id] as const : null,
    async ([, uid]) =>
      apiFetch<UnitDetail>(`admin/organization-units/${uid}`, {
        withCredentials: true,
      }),
    { ...defaults, ...config },
  );
}

export function useAdminUnitMutations() {
  return {
    create: (input: CreateUnitInput) =>
      apiFetch<UnitDetail>("admin/organization-units", {
        method: "POST",
        body: input,
        withCredentials: true,
      }),
    update: (id: string, input: UpdateUnitInput) =>
      apiFetch<UnitDetail>(`admin/organization-units/${id}`, {
        method: "PATCH",
        body: input,
        withCredentials: true,
      }),
    remove: (id: string) =>
      apiFetch<void>(`admin/organization-units/${id}`, {
        method: "DELETE",
        withCredentials: true,
      }),
    publish: (id: string) =>
      apiFetch<UnitDetail>(`admin/organization-units/${id}/publish`, {
        method: "POST",
        withCredentials: true,
      }),
    archive: (id: string) =>
      apiFetch<UnitDetail>(`admin/organization-units/${id}/archive`, {
        method: "POST",
        withCredentials: true,
      }),
    reorder: (orderedIds: string[]) =>
      apiFetch<void>("admin/organization-units/reorder", {
        method: "PATCH",
        body: { orderedIds },
        withCredentials: true,
      }),
  };
}

// ============================== ADMIN INSTAGRAM POSTS ==============================

type AdminInstagramParams = {
  page?: number;
  pageSize?: number;
  placement?: InstagramPlacementType;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export function useAdminInstagramPosts(
  params?: AdminInstagramParams,
  config?: SWRConfiguration<InstagramPostListResponse>,
) {
  return useSWR<InstagramPostListResponse>(
    ["admin-instagram-posts", params ?? null] as const,
    async ([, q]) =>
      apiFetch<InstagramPostListResponse>("admin/instagram-posts", {
        query: q as Record<string, string | number | undefined>,
        withCredentials: true,
      }),
    { ...defaults, ...config },
  );
}

export function useAdminInstagramPost(id: string | null, config?: SWRConfiguration<InstagramPost>) {
  return useSWR<InstagramPost>(
    id ? ["admin-instagram-post", id] as const : null,
    async ([, pid]) =>
      apiFetch<InstagramPost>(`admin/instagram-posts/${pid}`, {
        withCredentials: true,
      }),
    { ...defaults, ...config },
  );
}

export function useAdminInstagramMutations() {
  return {
    create: (input: CreateInstagramPostInput) =>
      apiFetch<InstagramPost>("admin/instagram-posts", {
        method: "POST",
        body: input,
        withCredentials: true,
      }),
    update: (id: string, input: UpdateInstagramPostInput) =>
      apiFetch<InstagramPost>(`admin/instagram-posts/${id}`, {
        method: "PATCH",
        body: input,
        withCredentials: true,
      }),
    remove: (id: string) =>
      apiFetch<void>(`admin/instagram-posts/${id}`, {
        method: "DELETE",
        withCredentials: true,
      }),
    toggleHighlight: (
      id: string,
      placement: InstagramPlacementType,
    ) =>
      apiFetch<InstagramPost>(`admin/instagram-posts/${id}/highlight`, {
        method: "PATCH",
        body: { placement },
        withCredentials: true,
      }),
    reorder: (placement: InstagramPlacementType, orderedIds: string[]) =>
      apiFetch<void>("admin/instagram-posts/reorder", {
        method: "PATCH",
        body: { placement, orderedIds },
        withCredentials: true,
      }),
  };
}

// ============================== ADMIN ARTICLE CATEGORIES ==============================

export function useAdminArticleCategories(
  config?: SWRConfiguration<ArticleCategory[]>,
) {
  return useSWR<ArticleCategory[]>(
    "admin-article-categories",
    () =>
      apiFetch<ArticleCategory[]>("admin/article-categories", {
        withCredentials: true,
      }),
    { ...defaults, ...config },
  );
}

export function useAdminArticleCategoryMutations() {
  return {
    create: (input: CreateCategoryInput) =>
      apiFetch<ArticleCategory>("admin/article-categories", {
        method: "POST",
        body: input,
        withCredentials: true,
      }),
    update: (id: string, input: UpdateCategoryInput) =>
      apiFetch<ArticleCategory>(`admin/article-categories/${id}`, {
        method: "PUT",
        body: input,
        withCredentials: true,
      }),
    remove: (id: string) =>
      apiFetch<void>(`admin/article-categories/${id}`, {
        method: "DELETE",
        withCredentials: true,
      }),
  };
}
