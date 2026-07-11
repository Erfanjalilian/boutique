"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/utils/helpers";
import type { Product, Category } from "@/types";

export function ProductsAdminClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  async function refreshProducts() {
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data.data || []);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      await refreshProducts();
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
        <Link href="/admin1383/products/new">
          <Button>افزودن محصول</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((product) => {
          const category = categories.find((c) => c.id === product.categoryId);
          return (
            <Card key={product.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-background">
                  <Image
                    src={product.images[0] || "/Image/placeholder-product.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{product.name}</h3>
                  <p className="text-sm text-muted">
                    {category?.name} · موجودی: {product.stock.toLocaleString("fa-IR")}
                  </p>
                </div>
                <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
                <div className="flex gap-2">
                  <Link href={`/admin1383/products/${product.id}`}>
                    <Button variant="secondary" size="sm">ویرایش</Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                    حذف
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
