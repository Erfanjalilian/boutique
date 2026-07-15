const ZIBAL_BASE_URL = "https://gateway.zibal.ir/v1";

export class ZibalApiError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly result: number
  ) {
    super(message);
    this.name = "ZibalApiError";
  }
}

function getMerchantKey() {
  const merchantKey = process.env.ZIBAL_MERCHANT?.trim();
  if (!merchantKey) {
    throw new Error("Missing ZIBAL_MERCHANT environment variable");
  }
  return merchantKey;
}

function normalizeResultCode(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function maskCardNumber(cardNumber?: string): string | undefined {
  if (!cardNumber) return undefined;
  const cleaned = cardNumber.replace(/\s+/g, "");
  if (cleaned.length <= 4) return cleaned;
  return `****${cleaned.slice(-4)}`;
}

function getZibalErrorMessage(code: number, fallback: string, detail?: string): string {
  const messages: Record<number, string> = {
    102: "شناسه پذیرنده زیبال نامعتبر است.",
    103: "پذیرنده زیبال غیرفعال است.",
    104: "مبلغ درخواستی نامعتبر است.",
    105: "آدرس callback نامعتبر است.",
    106: "شناسه سفارش نامعتبر است.",
    113: "شماره موبایل نامعتبر است.",
    201: "تراکنش یافت نشد.",
    202: "تراکنش ناموفق یا لغو شده است.",
    203: "تراکنش قبلاً تأیید شده است.",
  };

  const mapped = messages[code] || fallback;
  return detail ? `${mapped} ${detail}`.trim() : mapped;
}

type ZibalRequestResponse = {
  result?: number;
  trackId?: string;
  message?: string;
  orderId?: string;
  status?: number | string;
};

type ZibalVerifyResponse = {
  result?: number;
  amount?: number;
  refNumber?: string;
  referenceNumber?: string;
  cardNumber?: string;
  message?: string;
  status?: number | string;
};

export async function requestZibalPayment({
  amount,
  callbackUrl,
  description,
  orderId,
  mobile,
}: {
  amount: number;
  callbackUrl: string;
  description?: string;
  orderId?: string;
  mobile?: string;
}) {
  const merchantKey = getMerchantKey();

  const response = await fetch(`${ZIBAL_BASE_URL}/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      merchant: merchantKey,
      amount,
      callbackUrl,
      description,
      orderId,
      mobile,
    }),
  });

  const data = (await response.json()) as ZibalRequestResponse;
  const resultCode = normalizeResultCode(data.result);

  console.log("[Zibal][request]", {
    status: response.status,
    result: resultCode,
    trackId: data.trackId,
    message: data.message,
  });

  if (resultCode === 100) {
    if (!data.trackId) {
      throw new ZibalApiError("trackId از پاسخ زیبال دریافت نشد", resultCode, resultCode);
    }

    return {
      trackId: data.trackId,
      message: data.message || "",
      result: resultCode,
      raw: data,
    };
  }

  throw new ZibalApiError(
    getZibalErrorMessage(resultCode, "درخواست درگاه پرداخت با خطا مواجه شد", data.message),
    resultCode,
    resultCode
  );
}

export async function verifyZibalPayment(trackId: string) {
  const merchantKey = getMerchantKey();

  const response = await fetch(`${ZIBAL_BASE_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      merchant: merchantKey,
      trackId,
    }),
  });

  const data = (await response.json()) as ZibalVerifyResponse;
  const resultCode = normalizeResultCode(data.result);

  console.log("[Zibal][verify]", {
    status: response.status,
    trackId,
    result: resultCode,
    message: data.message,
  });

  if (resultCode === 100) {
    return {
      success: true,
      result: resultCode,
      amount: data.amount,
      referenceNumber: data.refNumber || data.referenceNumber,
      cardNumber: maskCardNumber(data.cardNumber),
      message: data.message || "",
      raw: data,
    };
  }

  throw new ZibalApiError(
    getZibalErrorMessage(resultCode, "تأیید تراکنش ناموفق بود", data.message),
    resultCode,
    resultCode
  );
}
