"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/dashboard", label: "داشبورد", icon: "🏠" },
  { href: "/dashboard/orders", label: "سفارش‌ها", icon: "📦" },
  { href: "/dashboard/profile", label: "پروفایل", icon: "👤" },
];

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 bg-card border-s border-border/50 min-h-screen p-4">
      <div className="mb-8 px-2">
        <Link href="/dashboard" className="text-xl font-bold">
          حساب کاربری
        </Link>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                active
                  ? "bg-primary/20 text-primary font-medium"
                  : "text-muted hover:text-foreground hover:bg-background"
              )}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 px-2">
        <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full">
          خروج
        </Button>
      </div>
    </aside>
  );
}
