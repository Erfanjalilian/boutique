import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/features/products/ProductDetailClient";
import {
  getProductById,
  getProducts,
  getCategories,
} from "@/lib/repositories";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const related = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      related={related}
      categories={categories}
    />
  );
}