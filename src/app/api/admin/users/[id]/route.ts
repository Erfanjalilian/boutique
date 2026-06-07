import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getUsers, saveUsers, getUserById } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

const updateSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") return apiError("Unauthorized", 401);

  const { id } = await params;
  const user = await getUserById(id);
  if (!user) return apiError("User not found", 404);
  return apiSuccess(user);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") return apiError("Unauthorized", 401);

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const users = await getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return apiError("User not found", 404);

  users[idx] = { ...users[idx], ...parsed.data };
  await saveUsers(users);
  return apiSuccess(users[idx]);
}
