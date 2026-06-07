"use client";

import { cn } from "@/utils/helpers";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full rounded-xl bg-card border border-border px-4 py-2.5 text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
          error && "border-red-500 focus:ring-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
