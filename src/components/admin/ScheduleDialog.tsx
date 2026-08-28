"use client";

import { useState, useMemo } from "react";
import { Calendar, X } from "lucide-react";

export type ScheduleDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (scheduledAt: Date) => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

function toLocalInputValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ScheduleDialog({ open, onClose, onConfirm }: ScheduleDialogProps) {
  // Default: tomorrow 09:00 local
  const defaultValue = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return toLocalInputValue(d);
  }, []);

  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleConfirm = () => {
    const date = new Date(value);
    const nowPlusBuffer = Date.now() + 60_000;
    if (Number.isNaN(date.getTime()) || date.getTime() < nowPlusBuffer) {
      setError("Waktu harus di masa depan (minimal 1 menit dari sekarang).");
      return;
    }
    setError(null);
    onConfirm(date);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#12100e] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-bara-orange">Jadwalkan</p>
            <h3 className="mt-2 font-display text-xl">Pilih waktu publikasi</h3>
            <p className="mt-1 text-xs text-white/40">
              Artikel akan berstatus SCHEDULED dan dipublikasikan otomatis oleh scheduler backend.
            </p>
          </div>
          <button onClick={onClose} className="admin-icon-button">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-6 block">
          <span className="mb-2 block text-[11px] font-semibold text-white/55">Waktu publik</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="datetime-local"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
        </label>

        {error && <p className="mt-3 text-[10px] text-red-300">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="admin-secondary-button">
            Batal
          </button>
          <button onClick={handleConfirm} className="admin-primary-button">
            Jadwalkan
          </button>
        </div>
      </div>
    </div>
  );
}