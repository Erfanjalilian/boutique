import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getColors, saveColors } from "@/lib/repositories";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const colorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  const colors = await getColors();
  return apiSuccess(colors);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = colorSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const colors = await getColors();
  const color = { id: generateId(), ...parsed.data };
  colors.push(color);
  await saveColors(colors);
  return apiSuccess(color, 201);
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Color ID required");

  const colors = await getColors();
  await saveColors(colors.filter((c) => c.id !== id));
  return apiSuccess({ message: "Color deleted" });
}
