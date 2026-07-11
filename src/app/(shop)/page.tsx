import { HeroSection } from "@/components/shop/HeroSection";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { PromoBanner } from "@/components/shop/PromoBanner";
import { getProducts, getCategories } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <>
      <HeroSection />
      <ProductGrid
        products={featured}
        title="محصولات ویژه"
        subtitle="گلچینی از بهترین‌های کالکشن جدید"
      />
      <CategoryGrid categories={categories} />
      <ProductGrid
        products={newArrivals}
        title="جدیدترین‌ها"
        subtitle="استایل‌های تازه واردشده"
      />
      <PromoBanner />
      <ProductGrid
        products={bestSellers}
        title="پرفروش‌ترین‌ها"
        subtitle="محبوب‌ترین انتخاب‌های مشتریان"
      />
    </>
  );
}
