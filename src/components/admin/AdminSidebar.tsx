"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/helpers";

const links = [
  { href: "/admin", label: "داشبورد", icon: "📊" },
  { href: "/admin/products", label: "محصولات", icon: "👕" },
  { href: "/admin/orders", label: "سفارش‌ها", icon: "📦" },
  { href: "/admin/users", label: "کاربران", icon: "👥" },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: "🏷️" },
  { href: "/admin/sizes", label: "سایزها", icon: "📏" },
  { href: "/admin/colors", label: "رنگ‌ها", icon: "🎨" },
  { href: "/admin/contact", label: "تماس", icon: "📞" },
  { href: "/admin/about", label: "درباره ما", icon: "📝" },
  { href: "/admin/settings", label: "تنظیمات", icon: "⚙️" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-card border-s border-border/50 min-h-screen p-4">
      <div className="mb-8 px-2">
        <Link href="/admin" className="text-xl font-bold text-primary">
          پنل مدیریت
        </Link>
        <p className="text-xs text-muted mt-1">مدیریت بوتیک</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
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
      <div className="mt-8 px-2 pt-4 border-t border-border/50">
        <Link
          href="/"
          className="text-sm text-muted hover:text-primary transition-colors"
        >
          بازگشت به فروشگاه ←
        </Link>
      </div>
    </aside>
  );
}
