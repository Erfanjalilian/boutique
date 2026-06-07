import { cn } from "@/utils/helpers";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card border border-border/50 shadow-xl shadow-black/20",
        hover && "transition-all duration-300 hover:border-primary/30 hover:shadow-primary/5",
        className
      )}
    >
      {children}
    </div>
  );
}
