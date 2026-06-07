import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getAbout, saveAbout } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

const aboutSchema = z.object({
  description: z.string().optional(),
  story: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  additionalContent: z.string().optional(),
});

export async function GET() {
  const about = await getAbout();
  return apiSuccess(about);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = aboutSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const current = await getAbout();
  const updated = { ...current, ...parsed.data };
  await saveAbout(updated);
  return apiSuccess(updated);
}
