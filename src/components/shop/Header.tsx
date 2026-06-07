"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

export function Header({
  websiteName = "بوتیک",
  logo = "/Image/logo.svg",
}: {
  websiteName?: string;
  logo?: string;
}) {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "خانه" },
    { href: "/products", label: "فروشگاه" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-card">
              <Image
                src={logo}
                alt={websiteName}
                fill
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <span className="text-xl font-bold tracking-tight">{websiteName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 rounded-xl hover:bg-card transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -start-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover transition-colors"
            >
              ورود
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="منو"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-muted hover:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="block py-2 text-primary"
              onClick={() => setMenuOpen(false)}
            >
              ورود
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
