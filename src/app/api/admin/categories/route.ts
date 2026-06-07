import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getCategories, saveCategories } from "@/lib/repositories";
import { generateId, slugify } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const categorySchema = z.object({
  name: z.string().min(1),
  image: z.string().optional(),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  const categories = await getCategories();
  return apiSuccess(categories);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const categories = await getCategories();
  const category = {
    id: generateId(),
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    image: parsed.data.image,
  };
  categories.push(category);
  await saveCategories(categories);
  return apiSuccess(category, 201);
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return apiError("Category ID required");

  const categories = await getCategories();
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return apiError("Category not found", 404);

  categories[idx] = {
    ...categories[idx],
    ...data,
    slug: data.name ? slugify(data.name) : categories[idx].slug,
  };
  await saveCategories(categories);
  return apiSuccess(categories[idx]);
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Category ID required");

  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  await saveCategories(filtered);
  return apiSuccess({ message: "Category deleted" });
}
