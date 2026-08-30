import type { ApiError } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

export const CDN_BASE_URL =
  process.env.NEXT_PUBLIC_CDN_BASE_URL ?? "";

export type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  tags?: string[]; // placeholder for future cache tagging
  revalidate?: number | false;
  cache?: RequestCache;
  // When set, attaches credentials (cookie) for authenticated admin calls.
  withCredentials?: boolean;
  headers?: Record<string, string>;
};

export class ApiClientError extends Error implements ApiError {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function buildUrl(path: string, query?: FetchOptions["query"]): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  let url = `${base}${normalizedPath}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      params.append(k, String(v));
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }
  return url;
}

async function unwrap<T>(res: Response): Promise<T> {
  // 204 or empty body
  if (res.status === 204) return undefined as unknown as T;

  const text = await res.text();
  if (!text) return undefined as unknown as T;

  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ApiClientError(res.status, text.slice(0, 200));
  }

  if (!res.ok) {
    // Backend wraps errors as { error: { message, code, fields? } }.
    const root = json as { error?: { message?: unknown; code?: unknown; fields?: unknown } };
    const err = (root.error ?? root) as { message?: unknown; code?: unknown; details?: unknown };
    const rawMsg = err?.message;
    const message =
      (Array.isArray(rawMsg) ? (rawMsg as string[]).join(", ") : (rawMsg as string)) ||
      `Request failed with status ${res.status}`;
    const fields = (root.error as { fields?: unknown } | undefined)?.fields;
    throw new ApiClientError(
      res.status,
      message,
      (err?.code as string | undefined) ?? undefined,
      fields,
    );
  }

  // Backend wraps responses as { data, meta } via TransformInterceptor.
  // Accept both wrapped and raw responses for forward compatibility.
  if (json && typeof json === "object" && "data" in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    query,
    withCredentials = false,
    headers,
  } = options;

  const url = buildUrl(path, query);

  // Auto-inject access token from localStorage for admin/authenticated calls.
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("bemfsm_access_token") : null;
  const hasAuth = !!(headers && Object.keys(headers).some((k) => k.toLowerCase() === "authorization"));
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(headers ?? {}),
    ...(storedToken && !hasAuth ? { Authorization: `Bearer ${storedToken}` } : {}),
  };

  const init: RequestInit = {
    method,
    headers: finalHeaders,
    credentials: withCredentials ? "include" : "same-origin",
  };

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  let res = await fetch(url, init);

  // Auto-refresh on 401 for non-auth endpoints, then retry once.
  if (res.status === 401 && !path.startsWith("auth/")) {
    try {
      const refreshed = await apiFetch<{ accessToken: string }>("auth/refresh", {
        method: "POST",
        withCredentials: true,
      });
      if (refreshed?.accessToken) {
        localStorage.setItem("bemfsm_access_token", refreshed.accessToken);
        init.headers = {
          ...init.headers,
          Authorization: `Bearer ${refreshed.accessToken}`,
        };
        res = await fetch(url, init);
      }
    } catch {
      // refresh failed; fall through with original 401
    }
  }

  return unwrap<T>(res);
}

// SSR-friendly fetcher for RSC pages: revalidates through Next data cache.
export async function apiFetchSsr<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    query,
    headers,
    revalidate = 60, // 1 minute default for public content
    cache,
  } = options;

  const url = buildUrl(path, query);
  const init: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  if (cache) {
    init.cache = cache;
  } else if (revalidate === false) {
    init.cache = "no-store";
  } else if (typeof revalidate === "number") {
    init.next = { revalidate };
  }

  const res = await fetch(url, init);
  return unwrap<T>(res);
}
