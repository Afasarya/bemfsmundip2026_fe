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
          // SWR passes either a string path or a [path, args] tuple.
          if (typeof input === "string") {
            return apiFetch(input);
          }
          if (Array.isArray(input) && typeof input[0] === "string") {
            const [path, args] = input as [string, Record<string, unknown>?];
            return apiFetch(path, { query: args as Record<string, string | number | boolean | undefined | null> });
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
