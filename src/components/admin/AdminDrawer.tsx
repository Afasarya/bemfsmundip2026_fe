"use client";

import { Check, X } from "lucide-react";
import type { ReactNode } from "react";

export type DrawerShellProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
  children: ReactNode;
  footerNote?: string;
};

export default function AdminDrawer({
  eyebrow,
  title,
  subtitle,
  onClose,
  onSubmit,
  submitDisabled,
  submitLabel = "Simpan",
  children,
  footerNote = "Periksa kembali sebelum menyimpan.",
}: DrawerShellProps) {
  return (
    <div
      className="fixed inset-0 z-[180] bg-black/65 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-[760px] flex-col border-l border-white/[0.08] bg-[#12100e] shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/[0.07] bg-[#12100e]/95 px-6 py-5 backdrop-blur-xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-bara-orange">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-2xl">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-xs text-white/35">{subtitle}</p>
            )}
          </div>
          <button onClick={onClose} className="admin-icon-button" aria-label="Tutup">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!submitDisabled) onSubmit();
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-white/[0.07] bg-[#12100e]/95 px-6 py-4 backdrop-blur-xl">
            <p className="hidden text-[10px] text-white/25 sm:block">{footerNote}</p>
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={onClose} className="admin-secondary-button">
                Batal
              </button>
              <button
                type="submit"
                disabled={submitDisabled}
                className="admin-primary-button"
              >
                <Check className="h-4 w-4" />
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </aside>
    </div>
  );
}