import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

export function ProductGrid({
  products,
  title,
  subtitle,
}: {
  products: Product[];
  title?: string;
  subtitle?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          )}
          {subtitle && (
            <p className="text-muted mt-2">{subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
