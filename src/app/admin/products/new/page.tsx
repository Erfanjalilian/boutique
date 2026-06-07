import { getCategories, getSizes, getColors } from "@/lib/repositories";
import { ProductForm } from "@/features/admin/ProductForm";

export default async function NewProductPage() {
  const [categories, sizes, colors] = await Promise.all([
    getCategories(),
    getSizes(),
    getColors(),
  ]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">افزودن محصول جدید</h1>
      <ProductForm categories={categories} sizes={sizes} colors={colors} />
    </div>
  );
}
