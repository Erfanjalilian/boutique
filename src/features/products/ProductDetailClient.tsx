"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/helpers";
import type { Product, Category } from "@/types";

export function ProductDetailClient({
  product,
  related,
  categories,
}: {
  product: Product;
  related: Product[];
  categories: Category[];
}) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const category = categories.find((c) => c.id === product.categoryId);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/Image/placeholder-product.svg",
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-card border border-border/50">
            <Image
              src={product.images[selectedImage] || "/Image/placeholder-product.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-primary" : "border-border"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="animate-fade-in">
          {category && (
            <p className="text-sm text-primary font-medium mb-2">{category.name}</p>
          )}
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mb-6">
            {formatPrice(product.price)}
          </p>
          <p className="text-muted leading-relaxed mb-8">{product.description}</p>

          {/* Quantity Selector */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-3">تعداد</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              {added ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <ProductGrid products={related} title="محصولات مرتبط" />
        </div>
      )}
    </div>
  );
}