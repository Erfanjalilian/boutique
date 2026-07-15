const ZIBAL_BASE_URL = "https://gateway.zibal.ir/v1";

function getMerchantKey() {
  const merchantKey = process.env.ZIBAL_MERCHANT?.trim();
  if (!merchantKey) {
    throw new Error("Missing ZIBAL_MERCHANT environment variable");
  }
  return merchantKey;
}

type ZibalRequestResponse = {
  success: number;
  trackId?: string;
  message?: string;
};

type ZibalVerifyResponse = {
  success: number;
  amount?: number;
  referenceId?: string;
  cardNumber?: string;
  message?: string;
};

export async function requestZibalPayment({
  amount,
  callbackUrl,
  mobile,
}: {
  amount: number;
  callbackUrl: string;
  mobile?: string;
}) {
  const merchantKey = getMerchantKey();

  const response = await fetch(`${ZIBAL_BASE_URL}/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchant: merchantKey,
      amount,
      callbackUrl,
      mobile,
    }),
  });

  const data = (await response.json()) as ZibalRequestResponse;

  if (response.status !== 200 || data.success !== 1) {
    throw new Error(
      data.message || "درخواست درگاه پرداخت با خطا مواجه شد"
    );
  }

  if (!data.trackId) {
    throw new Error("trackId از زیبال دریافت نشد");
  }

  return {
    trackId: data.trackId,
    message: data.message || "",
    raw: data,
  };
}

export async function verifyZibalPayment(trackId: string) {
  const merchantKey = getMerchantKey();

  const response = await fetch(`${ZIBAL_BASE_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchant: merchantKey,
      trackId,
    }),
  });

  const data = (await response.json()) as ZibalVerifyResponse;

  if (response.status !== 200) {
    throw new Error("خطا در تأیید تراکنش زیبال");
  }

  return {
    success: data.success === 1,
    amount: data.amount,
    referenceId: data.referenceId,
    cardNumber: data.cardNumber,
    message: data.message || "",
    raw: data,
  };
}
