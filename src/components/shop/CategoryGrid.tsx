import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">خرید بر اساس دسته‌بندی</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className="group relative rounded-2xl overflow-hidden aspect-square bg-card border border-border/50 hover:border-primary/30 transition-all"
          >
            <Image
              src={cat.image || "/Image/placeholder-category.svg"}
              alt={cat.name}
              fill
              className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <span className="absolute bottom-4 start-4 font-semibold text-foreground">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
