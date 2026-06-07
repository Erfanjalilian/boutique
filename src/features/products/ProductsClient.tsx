"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import type { Product, Category } from "@/types";

const ITEMS_PER_PAGE = 12;

export function ProductsClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...initialProducts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((p) => p.categoryId === category);
    }

    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    result = result.filter((p) => p.price >= min && p.price <= max);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "fa"));
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [initialProducts, search, category, minPrice, maxPrice, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">همه محصولات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-4">
          <Input
            label="جستجو"
            placeholder="جستجوی محصول..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <Select
            label="دسته‌بندی"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            options={[
              { value: "", label: "همه دسته‌ها" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="حداقل قیمت"
              type="number"
              placeholder="۰"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
            />
            <Input
              label="حداکثر قیمت"
              type="number"
              placeholder="۹۹۹۹۹۹۹"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
            />
          </div>
          <Select
            label="مرتب‌سازی"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={[
              { value: "newest", label: "جدیدترین" },
              { value: "price-asc", label: "ارزان‌ترین" },
              { value: "price-desc", label: "گران‌ترین" },
              { value: "name", label: "نام" },
            ]}
          />
        </aside>

        <div className="lg:col-span-3">
          {paginated.length === 0 ? (
            <EmptyState
              title="محصولی یافت نشد"
              description="فیلترها یا عبارت جستجو را تغییر دهید."
            />
          ) : (
            <>
              <p className="text-sm text-muted mb-4">
                نمایش {paginated.length} از {filtered.length} محصول
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    قبلی
                  </Button>
                  <span className="text-sm text-muted px-4">
                    صفحه {page} از {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    بعدی
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
