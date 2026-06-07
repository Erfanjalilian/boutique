import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/utils/helpers";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
        <div className="relative aspect-[3/4] bg-background overflow-hidden">
          <Image
            src={product.images[0] || "/Image/placeholder-product.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.newArrival && (
            <span className="absolute top-3 start-3 bg-primary text-white text-xs px-2.5 py-1 rounded-full font-medium">
              جدید
            </span>
          )}
          {product.bestSeller && (
            <span className="absolute top-3 end-3 bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
              پرفروش
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-semibold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
