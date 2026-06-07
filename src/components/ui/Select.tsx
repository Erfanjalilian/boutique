"use client";

import { cn } from "@/utils/helpers";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full rounded-xl bg-card border border-border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
