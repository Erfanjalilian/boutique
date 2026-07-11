import { getProductById, getProducts, getCategories } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return apiError("Product not found", 404);
  }

  const allProducts = await getProducts();
  const related = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const categories = await getCategories();

  return apiSuccess({ product, related, categories });
}
