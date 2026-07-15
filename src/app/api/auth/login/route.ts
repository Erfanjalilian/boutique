import { z } from "zod";
import { getUserByUsername, getUsers, saveUsers } from "@/lib/repositories";
import { createSession, setSessionCookie } from "@/lib/auth";
import { apiSuccess, apiError } from "@/utils/api";
import { hashPassword, verifyPassword } from "@/lib/password";
import { generateId } from "@/utils/helpers";

const schema = z.object({
  username: z.string().min(3, "نام کاربری حداقل ۳ کاراکتر است"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر است"),
  register: z.boolean().optional(),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { username, password, register, name } = parsed.data;

    const users = await getUsers();
    const existingUser = await getUserByUsername(username);

    if (register) {
      if (existingUser) {
        return apiError("این نام کاربری قبلاً ثبت شده است");
      }

      const newUser = {
        id: generateId(),
        phone: "",
        username,
        passwordHash: await hashPassword(password),
        name: name?.trim() || username,
        address: "",
        postalCode: "",
        role: "user" as const,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await saveUsers(users);

      const token = await createSession({
        userId: newUser.id,
        role: newUser.role,
        phone: newUser.phone,
      });
      await setSessionCookie(token);

      return apiSuccess({
        user: {
          id: newUser.id,
          phone: newUser.phone,
          name: newUser.name,
          role: newUser.role,
        },
        redirectTo: "/dashboard",
      });
    }

    if (!existingUser?.passwordHash) {
      return apiError("این حساب کاربری با رمز عبور پشتیبانی نمی‌شود");
    }

    const validPassword = await verifyPassword(password, existingUser.passwordHash);
    if (!validPassword) {
      return apiError("نام کاربری یا رمز عبور اشتباه است");
    }

    const token = await createSession({
      userId: existingUser.id,
      role: existingUser.role,
      phone: existingUser.phone,
    });
    await setSessionCookie(token);

    return apiSuccess({
      user: {
        id: existingUser.id,
        phone: existingUser.phone,
        name: existingUser.name,
        role: existingUser.role,
      },
      redirectTo: existingUser.role === "admin" ? "/admin1383" : "/dashboard",
    });
  } catch {
    return apiError("خطای سرور", 500);
  }
}
