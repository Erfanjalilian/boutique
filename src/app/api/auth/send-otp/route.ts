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
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const otps = await getOtps();
    const filtered = otps.filter((o) => o.phone !== phone);
    filtered.push({ phone, code, expiresAt });
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
