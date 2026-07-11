import { notFound } from "next/navigation";
import {
  getProductById,
  getCategories,
  getSizes,
  getColors,
} from "@/lib/repositories";
import { ProductForm } from "@/features/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, sizes, colors] = await Promise.all([
    getProductById(id),
    getCategories(),
    getSizes(),
    getColors(),
  ]);

  if (!product) notFound();

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">ویرایش محصول</h1>
      <ProductForm
        product={product}
        categories={categories}
        sizes={sizes}
        colors={colors}
      />
    </div>
  );
}
