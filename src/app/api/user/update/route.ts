import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

const schema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const { firstName = "", lastName = "" } = parsed.data;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    const users = await getUsers();
    const idx = users.findIndex((u) => u.id === session.userId);
    if (idx === -1) return apiError("User not found", 404);

    users[idx] = { ...users[idx], name: fullName };
    await saveUsers(users);

    return apiSuccess({ message: "پروفایل با موفقیت به‌روز شد", user: users[idx] });
  } catch (err) {
    return apiError("خطای سرور", 500);
  }
}
