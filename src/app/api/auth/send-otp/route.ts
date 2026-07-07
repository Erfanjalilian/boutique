import { z } from "zod";
import { sendOtp } from "@/services/sms";
import { getOtps, saveOtps } from "@/lib/repositories";
import { generateOtp } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";

const schema = z.object({
  phone: z.string().min(10, "شماره موبایل نامعتبر است").max(15),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { phone } = parsed.data;

    const otps = await getOtps();
    const existing = otps.find((o) => o.phone === phone);

    const now = Date.now();

    // Rate limiting: block if last send was less than 30s ago
    if (existing && existing.sentAt) {
      const lastSent = new Date(existing.sentAt).getTime();
      if (now - lastSent < 30 * 1000) {
        return apiError("لطفاً چند ثانیه صبر کنید و دوباره تلاش کنید.");
      }
      // Prevent more than 5 sends within 1 hour
      const hourAgo = now - 60 * 60 * 1000;
      const recentResends = existing.resendCount ?? 0;
      const lastSentWithinHour = lastSent >= hourAgo;
      if (lastSentWithinHour && recentResends >= 5) {
        return apiError("حد ارسال کد به این شماره فراتر از حد مجاز است.");
      }
    }

    const code = generateOtp();
    const expiresAt = new Date(now + 2 * 60 * 1000).toISOString(); // 2 minutes expiry

    // Build new record
    const newRecord = {
      phone,
      code,
      expiresAt,
      sentAt: new Date(now).toISOString(),
      attempts: 0,
      resendCount: existing ? (existing.resendCount ?? 0) + 1 : 1,
    };

    const filtered = otps.filter((o) => o.phone !== phone);
    filtered.push(newRecord);
    await saveOtps(filtered);

    const result = await sendOtp(phone, code);

    if (!result.success) {
      return apiError(result.message, 500);
    }

    return apiSuccess({ message: "کد تأیید ارسال شد" });
  } catch {
    return apiError("خطای سرور", 500);
  }
}
