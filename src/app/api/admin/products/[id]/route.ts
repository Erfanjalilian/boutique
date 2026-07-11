import { z } from "zod";
import { getProducts, saveProducts } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

const productSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  newArrival: z.boolean().optional(),
  stock: z.number().min(0).optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return apiError("Product not found", 404);

  products[idx] = { ...products[idx], ...parsed.data };
  await saveProducts(products);
  return apiSuccess(products[idx]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) {
    return apiError("Product not found", 404);
  }
  await saveProducts(filtered);
  return apiSuccess({ message: "Product deleted" });
}
