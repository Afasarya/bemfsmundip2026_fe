"use client";

import { SWRConfig } from "swr";
import { apiFetch } from "@/lib/api";

type Props = {
  children: React.ReactNode;
};

// Global SWR configuration. The fetcher accepts SWR's tuple key (path + args).
export default function SwrProvider({ children }: Props) {
  return (
    <SWRConfig
      value={{
        fetcher: async (input: unknown) => {
          // Inject access token if available so SWR-managed requests can auth.
          const token = typeof window !== "undefined" ? localStorage.getItem("bemfsm_access_token") : null;
          const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
          const withCred = !token; // cookie-based for public, token-based for admin

          // SWR passes either a string path or a [path, args] tuple.
          if (typeof input === "string") {
            return apiFetch(input, { withCredentials: withCred, headers });
          }
          if (Array.isArray(input) && typeof input[0] === "string") {
            const [path, args] = input as [string, Record<string, unknown>?];
            return apiFetch(path, {
              query: args as Record<string, string | number | boolean | undefined | null>,
              withCredentials: withCred,
              headers,
            });
          }
          throw new Error("Invalid SWR fetcher key");
        },
        revalidateOnFocus: false,
        dedupingInterval: 30_000,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}