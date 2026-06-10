"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export function Header({
  websiteName = "بوتیک",
  logo = "/Image/logo.svg",
}: {
  websiteName?: string;
  logo?: string;
}) {
  const { totalItems } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Refs for dropdown to manage hover behavior
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Fetch categories from the database (API)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        
        // Handle both response formats
        let categoriesData = Array.isArray(data) ? data : data.categories;
        
        if (data.categories && Array.isArray(data.categories)) {
          categoriesData = data.categories;
        }
        
        if (!Array.isArray(categoriesData)) {
          console.error("Categories data is not an array:", categoriesData);
          setCategories([]);
          return;
        }
        
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle category click - navigate to products page with category filter
  const handleCategoryClick = (categoryId: string) => {
    setCategoriesOpen(false);
    router.push(`/products?category=${categoryId}`);
  };

  // Handle mouse enter on trigger or dropdown
  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setCategoriesOpen(true);
  };

  // Handle mouse leave on trigger or dropdown
  const handleMouseLeave = () => {
    // Set timeout to close dropdown, giving user time to move to dropdown
    dropdownTimeoutRef.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const links = [
    { href: "/", label: "خانه" },
    { href: "/products", label: "فروشگاه", hasDropdown: true },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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
            <span className="text-xl font-bold tracking-tight">جواهرکده آریامهر</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <div
                key={link.href}
                ref={link.hasDropdown ? dropdownContainerRef : null}
                className="relative"
                onMouseEnter={link.hasDropdown ? handleMouseEnter : undefined}
                onMouseLeave={link.hasDropdown ? handleMouseLeave : undefined}
              >
                <Link
                  href={link.href}
                  className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Categories Dropdown */}
                {link.hasDropdown && categoriesOpen && (
                  <div 
                    className="absolute top-full right-0 mt-1 w-64 bg-background border border-border/50 rounded-2xl shadow-xl py-2 animate-fade-in z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-3 py-2 border-b border-border/50">
                      <span className="text-xs text-muted">دسته‌بندی محصولات</span>
                    </div>
                    
                    {loading ? (
                      <div className="px-4 py-3 text-sm text-muted">
                        در حال بارگذاری...
                      </div>
                    ) : !Array.isArray(categories) || categories.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-muted">
                        دسته‌بندی وجود ندارد
                      </div>
                    ) : (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.id)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-card transition-colors text-right"
                        >
                          {category.image && (
                            <div className="relative w-6 h-6 rounded-md overflow-hidden bg-gray-100">
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          {category.name}
                        </button>
                      ))
                    )}
                    
                    <div className="border-t border-border/50 mt-2 pt-2">
                      <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        <span>مشاهده همه محصولات</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Icons */}
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

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            {links.map((link) => (
              <div key={link.href}>
                {link.hasDropdown ? (
                  <>
                    <div className="py-2 text-muted font-medium">فروشگاه</div>
                    <div className="pr-4 space-y-1 mb-2">
                      {loading ? (
                        <div className="py-1.5 text-sm text-muted">
                          در حال بارگذاری...
                        </div>
                      ) : !Array.isArray(categories) || categories.length === 0 ? (
                        <div className="py-1.5 text-sm text-muted">
                          دسته‌بندی وجود ندارد
                        </div>
                      ) : (
                        categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              handleCategoryClick(category.id);
                              setMenuOpen(false);
                            }}
                            className="w-full text-right block py-1.5 text-sm text-muted hover:text-foreground"
                          >
                            {category.name}
                          </button>
                        ))
                      )}
                      <Link
                        href="/products"
                        className="block py-1.5 text-sm text-primary"
                        onClick={() => setMenuOpen(false)}
                      >
                        همه محصولات
                      </Link>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block py-2 text-muted hover:text-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
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