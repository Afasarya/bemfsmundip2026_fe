"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, ApiClientError } from "@/lib/api";
import type { AuthUser, LoginResponse, MeResponse } from "@/lib/types";

const ACCESS_TOKEN_KEY = "bemfsm_access_token";
const USER_KEY = "bemfsm_user";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount, then validate by fetching /auth/me.
  useEffect(() => {
    let cancelled = false;
    const storedToken = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null;

    if (storedToken && storedUser) {
      try {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    // Always attempt to validate via /auth/me so we refresh stale state.
    if (storedToken && !cancelled) {
      apiFetch<MeResponse>("auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((me) => {
          if (cancelled) return;
          const u: AuthUser = { id: me.id, email: me.email, name: me.name, roleCode: me.roleCode };
          setUser(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
        })
        .catch((err) => {
          if (cancelled) return;
          if (err instanceof ApiClientError && err.status === 401) {
            // Token expired or invalid; try refresh once.
            apiFetch<{ accessToken: string }>("auth/refresh", { method: "POST", withCredentials: true })
              .then((res) => {
                if (cancelled) return;
                setAccessToken(res.accessToken);
                localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
              })
              .catch(() => {
                if (cancelled) return;
                setAccessToken(null);
                setUser(null);
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
              });
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<LoginResponse>("auth/login", {
      method: "POST",
      body: { email, password },
    });
    const u: AuthUser = { id: res.id, email: res.email, name: res.name, roleCode: res.roleCode };
    setAccessToken(res.accessToken);
    setUser(u);
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }, []);

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await apiFetch("auth/logout", {
          method: "POST",
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch {
      // ignore — logout must always clear local state
    }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, [accessToken]);

  const refreshUser = useCallback(async () => {
    if (!accessToken) return;
    try {
      const me = await apiFetch<MeResponse>("auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const u: AuthUser = { id: me.id, email: me.email, name: me.name, roleCode: me.roleCode };
      setUser(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {
      // ignore
    }
  }, [accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, accessToken, loading, login, logout, refreshUser }),
    [user, accessToken, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
