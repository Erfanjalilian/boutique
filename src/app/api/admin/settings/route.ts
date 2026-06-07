import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

const settingsSchema = z.object({
  websiteName: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  favicon: z.string().optional(),
  logo: z.string().optional(),
  footerText: z.string().optional(),
  footerLinks: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .optional(),
});

export async function GET() {
  const settings = await getSettings();
  return apiSuccess(settings);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const current = await getSettings();
  const updated = { ...current, ...parsed.data };
  await saveSettings(updated);
  return apiSuccess(updated);
}
