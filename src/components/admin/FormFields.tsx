"use client";

import { Plus, Trash2 } from "lucide-react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
};

export function Field({ label, hint, error, children, required }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-medium text-white/55">
        <span>
          {label}
          {required && <span className="ml-1 text-bara-orange">*</span>}
        </span>
        {hint && <span className="text-[10px] font-normal text-white/30">{hint}</span>}
      </span>
      {children}
      {error && <p className="mt-1 text-[10px] text-red-300">{error}</p>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`admin-input ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`admin-input min-h-[96px] resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`admin-input ${props.className ?? ""}`} />;
}

export function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border-t border-white/[0.06] pt-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{title}</h3>
      {hint && <p className="mt-1 text-[10px] text-white/30">{hint}</p>}
    </div>
  );
}

type ArrayFieldProps<T> = {
  title: string;
  items: T[];
  onChange: (next: T[]) => void;
  emptyLabel: string;
  addLabel: string;
  renderItem: (item: T, idx: number, setItem: (next: T) => void, remove: () => void) => ReactNode;
  newItem: () => T;
};

export function ArrayField<T>({
  title,
  items,
  onChange,
  emptyLabel,
  addLabel,
  renderItem,
  newItem,
}: ArrayFieldProps<T>) {
  const update = (idx: number, next: T) => {
    const copy = items.slice();
    copy[idx] = next;
    onChange(copy);
  };
  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };
  const add = () => {
    onChange([...items, newItem()]);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-medium text-white/55">{title}</p>
        <button type="button" onClick={add} className="admin-text-button">
          <Plus className="h-3 w-3" />
          {addLabel}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-[10px] text-white/30">
          {emptyLabel}
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-white/30 hover:text-red-300"
                  aria-label="Hapus"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {renderItem(it, idx, (next) => update(idx, next), () => remove(idx))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}