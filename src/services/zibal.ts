import { getSettings } from "@/lib/repositories";

const ZIBAL_BASE_URL = "https://gateway.zibal.ir/v1";
const ZIBAL_REQUEST_URL = `${ZIBAL_BASE_URL}/request`;
const ZIBAL_VERIFY_URL = `${ZIBAL_BASE_URL}/verify`;

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

async function getMerchantKey(): Promise<string> {
  const merchantKey = process.env.ZIBAL_MERCHANT?.trim();
  console.log("[Zibal] Merchant lookup", {
    source: "env",
    hasMerchant: Boolean(merchantKey),
    length: merchantKey?.length || 0,
  });

  if (merchantKey) {
    return merchantKey;
  }

  const settings = await getSettings();
  const settingsMerchant = settings.zibalMerchant?.trim();

  console.log("[Zibal] Merchant lookup", {
    source: "settings",
    hasMerchant: Boolean(settingsMerchant),
    length: settingsMerchant?.length || 0,
  });

  if (settingsMerchant) {
    return settingsMerchant;
  }

  throw new Error(
    "Merchant برای درگاه زیبال یافت نشد. لطفاً متغیر محیطی ZIBAL_MERCHANT را تنظیم کنید یا فیلد zibalMerchant را در data/settings.json تکمیل کنید."
  );
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

function getZibalErrorMessage(
  code: number,
  fallback: string,
  detail?: string
): string {
  const messages: Record<number, string> = {
    100: "تراکنش با موفقیت انجام شد.",
    102: "شناسه پذیرنده زیبال نامعتبر است.",
    103: "پذیرنده زیبال غیرفعال است.",
    104: "مبلغ درخواستی نامعتبر است.",
    105: "آدرس callback نامعتبر است.",
    106: "شناسه سفارش نامعتبر است.",
    113: "شماره موبایل نامعتبر است.",
    201: "تراکنش یافت نشد.",
    202: "تراکنش ناموفق یا لغو شده است.",
    203: "تراکنش قبلاً تأیید شده است.",
    204: "تراکنش قبلاً لغو شده است.",
  };

  const mapped = messages[code] || fallback;
  return detail ? `${mapped} (${detail})`.trim() : mapped;
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

async function parseJsonResponse(response: Response): Promise<unknown> {
  const rawText = await response.text();
  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText) as unknown;
  } catch (error) {
    console.error("[Zibal] Failed to parse response body", {
      rawText,
      error,
    });
    return {};
  }
}

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
  const merchantKey = await getMerchantKey();

  console.log("========== ZIBAL REQUEST START ==========");
  console.log("[Zibal][request] payload", {
    merchant: merchantKey,
    amount,
    callbackUrl,
    description,
    orderId,
    mobile,
  });

  try {
        console.log("========== CALLBACK DEBUG ==========");
console.log("callbackUrl =", callbackUrl);
console.log("merchant =", merchantKey);
console.log("====================================");
    const response = await fetch(ZIBAL_REQUEST_URL, {
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


    console.log("[Zibal][request] status", response.status);
    const data = (await parseJsonResponse(response)) as ZibalRequestResponse;
    console.log("[Zibal][request] raw response", data);

    const resultCode = normalizeResultCode(data.result);
    console.log("[Zibal][request] result", {
      status: response.status,
      result: resultCode,
      trackId: data.trackId,
      message: data.message,
    });

    if (resultCode === 100) {
      if (!data.trackId) {
        throw new ZibalApiError(
          "trackId از پاسخ زیبال دریافت نشد",
          resultCode,
          resultCode
        );
      }

      console.log("========== ZIBAL REQUEST END ==========");
      return {
        trackId: data.trackId,
        message: data.message || "",
        result: resultCode,
        raw: data,
      };
    }

    const errorMessage = getZibalErrorMessage(
      resultCode,
      "درخواست درگاه پرداخت با خطا مواجه شد",
      data.message
    );

    console.error("[Zibal][request] failed", {
      resultCode,
      message: errorMessage,
      raw: data,
    });

    throw new ZibalApiError(errorMessage, resultCode, resultCode);
  } catch (error) {
    if (error instanceof ZibalApiError) {
      throw error;
    }

    console.error("[Zibal][request] exception", error);
    throw new ZibalApiError(
      error instanceof Error
        ? error.message
        : "ارتباط با درگاه زیبال برقرار نشد. لطفاً دوباره تلاش کنید.",
      0,
      0
    );
  }
}

export async function verifyZibalPayment(trackId: string) {
  const merchantKey = await getMerchantKey();

  console.log("========== ZIBAL VERIFY START ==========");
  console.log("[Zibal][verify] payload", {
    merchant: merchantKey,
    trackId,
  });

  try {
    const response = await fetch(ZIBAL_VERIFY_URL, {
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

    console.log("[Zibal][verify] status", response.status);
    const data = (await parseJsonResponse(response)) as ZibalVerifyResponse;
    console.log("[Zibal][verify] raw response", data);

    const resultCode = normalizeResultCode(data.result);
    console.log("[Zibal][verify] result", {
      status: response.status,
      result: resultCode,
      message: data.message,
    });

    if (resultCode === 100) {
      console.log("========== ZIBAL VERIFY END ==========");
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

    const errorMessage = getZibalErrorMessage(
      resultCode,
      "تأیید تراکنش ناموفق بود",
      data.message
    );

    console.error("[Zibal][verify] failed", {
      resultCode,
      message: errorMessage,
      raw: data,
    });

    throw new ZibalApiError(errorMessage, resultCode, resultCode);
  } catch (error) {
    if (error instanceof ZibalApiError) {
      throw error;
    }

    console.error("[Zibal][verify] exception", error);
    throw new ZibalApiError(
      error instanceof Error
        ? error.message
        : "تأیید تراکنش با خطا مواجه شد.",
      0,
      0
    );
  }
}