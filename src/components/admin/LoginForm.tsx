"use client";

import { useState } from "react";
import { Lock, Mail, ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ApiClientError } from "@/lib/api";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // AuthProvider updates state; the page re-renders with the dashboard.
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.status === 401) setError("Email atau kata sandi salah.");
        else if (err.status === 429) setError("Terlalu banyak percobaan. Coba lagi nanti.");
        else setError(err.message || "Gagal masuk.");
      } else {
        setError("Gagal masuk. Periksa koneksi Anda.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 backdrop-blur-sm">
      <div className="admin-panel w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-orange-400/20 bg-orange-400/[0.08] text-orange-300">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <h1 className="font-display text-2xl text-white/90">Bara Command</h1>
            <p className="text-xs text-white/45">Masuk untuk mengelola konten kabinet.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/55">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bemfsmundip.com"
                className="admin-input pl-10"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/55">Kata sandi</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="admin-input"
            />
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-400/[0.08] px-3 py-2 text-xs text-red-200">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="admin-primary-button w-full justify-center"
          >
            {submitting ? "Memproses…" : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-[11px] leading-relaxed text-white/35">
          Akses terbatas untuk管理员 kabinet. Aktivitas tercatat di audit log.
        </p>
      </div>
    </div>
  );
}