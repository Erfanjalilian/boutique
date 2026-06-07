import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
});

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const users = await getUsers();
  const idx = users.findIndex((u) => u.id === session.userId);
  if (idx === -1) return apiError("User not found", 404);

  users[idx] = { ...users[idx], ...parsed.data };
  await saveUsers(users);
  return apiSuccess(users[idx]);
}
