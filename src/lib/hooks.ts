import useSWR, { type SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { apiFetch } from "./api";
import type {
  AdminDashboard,
  Article,
  InstagramProfileData,
  PaginatedArticles,
  PublicDashboard,
  UnitDetail,
  UnitListItem,
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
