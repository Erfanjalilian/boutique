import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getSizes, saveSizes } from "@/lib/repositories";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const sizeSchema = z.object({ name: z.string().min(1) });

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  const sizes = await getSizes();
  return apiSuccess(sizes);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = sizeSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const sizes = await getSizes();
  const size = { id: generateId(), name: parsed.data.name };
  sizes.push(size);
  await saveSizes(sizes);
  return apiSuccess(size, 201);
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Size ID required");

  const sizes = await getSizes();
  await saveSizes(sizes.filter((s) => s.id !== id));
  return apiSuccess({ message: "Size deleted" });
}
