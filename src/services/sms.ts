/**
 * سرویس یکپارچه‌سازی SMS.IR
 *
 * کلیدهای SMS_IR_API_KEY و SMS_IR_LINE_NUMBER را با اطلاعات واقعی جایگزین کنید.
 * مستندات: https://sms.ir/
 */

const SMS_IR_API_KEY = process.env.SMS_IR_API_KEY || "YOUR_SMS_IR_API_KEY";
const SMS_IR_LINE_NUMBER = process.env.SMS_IR_LINE_NUMBER || "YOUR_LINE_NUMBER";
const SMS_IR_TEMPLATE_ID = process.env.SMS_IR_TEMPLATE_ID || "YOUR_TEMPLATE_ID";

interface SmsIrResponse {
  status: number;
  message: string;
}

export async function sendOtp(
  phoneNumber: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  if (!SMS_IR_API_KEY || SMS_IR_API_KEY === "YOUR_SMS_IR_API_KEY") {
    console.log(`[SMS.IR حالت توسعه] کد تأیید برای ${phoneNumber}: ${code}`);
    return { success: true, message: "کد تأیید ارسال شد (حالت توسعه)" };
  }

  try {
    const response = await fetch(
      "https://api.sms.ir/v1/send/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": SMS_IR_API_KEY,
        },
        body: JSON.stringify({
          mobile: phoneNumber,
          templateId: SMS_IR_TEMPLATE_ID,
          parameters: [{ name: "Code", value: code }],
        }),
      }
    );

    const data = (await response.json()) as SmsIrResponse;

    if (response.ok) {
      return { success: true, message: "کد تأیید با موفقیت ارسال شد" };
    }

    return { success: false, message: data.message || "ارسال کد تأیید ناموفق بود" };
  } catch (error) {
    console.error("[SMS.IR] خطا:", error);
    return { success: false, message: "سرویس پیامک در دسترس نیست" };
  }
}

export async function sendSms(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; message: string }> {
  if (!SMS_IR_API_KEY || SMS_IR_API_KEY === "YOUR_SMS_IR_API_KEY") {
    console.log(`[SMS.IR حالت توسعه] پیامک به ${phoneNumber}: ${message}`);
    return { success: true, message: "پیامک ارسال شد (حالت توسعه)" };
  }

  try {
    const response = await fetch("https://api.sms.ir/v1/send/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": SMS_IR_API_KEY,
      },
      body: JSON.stringify({
        lineNumber: SMS_IR_LINE_NUMBER,
        messageText: message,
        mobiles: [phoneNumber],
      }),
    });

    const data = (await response.json()) as SmsIrResponse;

    if (response.ok) {
      return { success: true, message: "پیامک با موفقیت ارسال شد" };
    }

    return { success: false, message: data.message || "ارسال پیامک ناموفق بود" };
  } catch (error) {
    console.error("[SMS.IR] خطا:", error);
    return { success: false, message: "سرویس پیامک در دسترس نیست" };
  }
}
