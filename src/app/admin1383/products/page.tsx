import { getProducts, getCategories } from "@/lib/repositories";
import { ProductsAdminClient } from "@/features/admin/ProductsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductsAdminClient initialProducts={products} categories={categories} />;
}
