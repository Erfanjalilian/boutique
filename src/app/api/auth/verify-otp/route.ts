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

    const now = Date.now();
    const expiresAt = new Date(otpRecord.expiresAt).getTime();

    // Expiry check
    if (now > expiresAt) {
      await saveOtps(otps.filter((o) => o.phone !== phone));
      return apiError("کد تأیید منقضی شده است. لطفاً دوباره درخواست دهید.");
    }

    const MAX_ATTEMPTS = 5;
    const currentAttempts = otpRecord.attempts ?? 0;

    if (currentAttempts >= MAX_ATTEMPTS) {
      await saveOtps(otps.filter((o) => o.phone !== phone));
      return apiError("تعداد تلاش‌ها بیشتر از حد مجاز است. لطفاً دوباره درخواست دهید.");
    }

    if (otpRecord.code !== code) {
      // increment attempts
      const updated = otps.map((o) =>
        o.phone === phone ? { ...o, attempts: (o.attempts ?? 0) + 1 } : o
      );
      await saveOtps(updated);

      const attemptsLeft = MAX_ATTEMPTS - (currentAttempts + 1);
      if (attemptsLeft <= 0) {
        await saveOtps(otps.filter((o) => o.phone !== phone));
        return apiError("تعداد تلاش‌ها بیشتر از حد مجاز است. لطفاً دوباره درخواست دهید.");
      }

      return apiError(`کد تأیید نامعتبر است. ${attemptsLeft} تلاش باقی مانده.`);
    }

    // Success: clean up
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
