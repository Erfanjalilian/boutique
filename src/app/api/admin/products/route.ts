import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getProducts, saveProducts } from "@/lib/repositories";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().min(0),
  discountPercent: z.number().min(0).max(100).optional(),
  images: z.array(z.string()),
  categoryId: z.string(),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  stock: z.number().min(0),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);
  const products = await getProducts();
  return apiSuccess(products);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const products = await getProducts();
    const product = {
      id: generateId(),
      ...parsed.data,
      createdAt: new Date().toISOString(),
    };
    products.push(product);
    await saveProducts(products);
    return apiSuccess(product, 201);
  } catch {
    return apiError("Internal server error", 500);
  }
}
