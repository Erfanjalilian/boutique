import { z } from "zod";
import { getColors, saveColors } from "@/lib/repositories";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const colorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export async function GET() {
  const colors = await getColors();
  return apiSuccess(colors);
}

export async function POST(request: Request) {
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
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Color ID required");

  const colors = await getColors();
  await saveColors(colors.filter((c) => c.id !== id));
  return apiSuccess({ message: "Color deleted" });
}
