import { z } from "zod";
import { getContact, saveContact } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

const contactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  socialMedia: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      telegram: z.string().optional(),
    })
    .optional(),
});

export async function GET() {
  const contact = await getContact();
  return apiSuccess(contact);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const current = await getContact();
  const updated = {
    ...current,
    ...parsed.data,
    socialMedia: { ...current.socialMedia, ...parsed.data.socialMedia },
  };
  await saveContact(updated);
  return apiSuccess(updated);
}
