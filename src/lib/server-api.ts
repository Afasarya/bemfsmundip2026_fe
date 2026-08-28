// Server-side fetchers for React Server Components.
// Uses Next.js data cache via revalidate.

import { apiFetchSsr } from "./api";
import type {
  Article,
  InstagramProfileData,
  PaginatedArticles,
  PublicDashboard,
  UnitDetail,
  UnitListItem,
} from "./types";

const REV = 60; // 1 minute

export async function fetchPublicArticles(params?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedArticles> {
  return apiFetchSsr<PaginatedArticles>("public/articles", {
    query: params as Record<string, number | undefined>,
    revalidate: REV,
  });
}

export async function fetchFeaturedArticle(): Promise<Article | null> {
  try {
    return await apiFetchSsr<Article | null>("public/articles/featured", {
      revalidate: REV,
    });
  } catch {
    return null;
  }
}

export async function fetchLatestArticles(pageSize = 4): Promise<Article[]> {
  const res = await fetchPublicArticles({ page: 1, pageSize });
  return res.data;
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await apiFetchSsr<Article>(`public/articles/${slug}`, {
      revalidate: REV,
    });
  } catch {
    return null;
  }
}

export async function fetchPublicUnits(): Promise<UnitListItem[]> {
  return apiFetchSsr<UnitListItem[]>("public/organization-units", {
    revalidate: REV,
  });
}

export async function fetchUnitBySlug(slug: string): Promise<UnitDetail | null> {
  try {
    return await apiFetchSsr<UnitDetail>(`public/organization-units/${slug}`, {
      revalidate: REV,
    });
  } catch {
    return null;
  }
}

export async function fetchAllPublicUnitSlugs(): Promise<string[]> {
  const units = await fetchPublicUnits();
  return units.map((u) => u.slug);
}

export async function fetchInstagramProfile(): Promise<InstagramProfileData | null> {
  try {
    return await apiFetchSsr<InstagramProfileData | null>("public/instagram", {
      revalidate: REV,
    });
  } catch {
    return null;
  }
}

export async function fetchPublicDashboard(): Promise<PublicDashboard | null> {
  try {
    return await apiFetchSsr<PublicDashboard>("public/dashboard", {
      revalidate: REV,
    });
  } catch {
    return null;
  }
}
