import { z } from "zod";
import {
  getOtps,
  saveOtps,
  getUserByPhone,
  getUsers,
  saveUsers,
} from "@/lib/repositories";
import { createSession, setSessionCookie } from "@/lib/auth";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const schema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(6, "کد تأیید باید ۶ رقم باشد"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { phone, code } = parsed.data;
    const otps = await getOtps();
    const otpRecord = otps.find((o) => o.phone === phone);

    if (!otpRecord) {
      return apiError("کد تأیید یافت نشد. لطفاً دوباره درخواست دهید.");
    }

    if (new Date(otpRecord.expiresAt) < new Date()) {
      await saveOtps(otps.filter((o) => o.phone !== phone));
      return apiError("کد تأیید منقضی شده است. لطفاً دوباره درخواست دهید.");
    }

    if (otpRecord.code !== code) {
      return apiError("کد تأیید نامعتبر است.");
    }

    await saveOtps(otps.filter((o) => o.phone !== phone));

    let user = await getUserByPhone(phone);

    if (!user) {
      const users = await getUsers();
      user = {
        id: generateId(),
        phone,
        name: "",
        address: "",
        postalCode: "",
        role: "user",
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      await saveUsers(users);
    }

    const token = await createSession({
      userId: user.id,
      role: user.role,
      phone: user.phone,
    });

    await setSessionCookie(token);

    return apiSuccess({
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
      redirectTo: user.role === "admin" ? "/admin" : "/dashboard",
    });
  } catch {
    return apiError("خطای سرور", 500);
  }
}
