import { getOrderByTrackId, getOrders, saveOrders } from "@/lib/repositories";
import { verifyZibalPayment, ZibalApiError } from "@/services/zibal";
import { apiError } from "@/utils/api";

function isCancellationLike(value?: string | null): boolean {
  const normalized = value?.toLowerCase();
  return ["0", "false", "cancelled", "canceled", "failed", "2"].includes(normalized || "");
}

function getBaseUrl() {
  const appUrl = process.env.APP_URL?.trim();
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//, "")}`;
  }

  return "http://localhost:3000";
}

function getRedirectUrl(orderId: string) {
  return new URL(`/order-success?id=${orderId}`, getBaseUrl()).toString();
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const trackId = url.searchParams.get("trackId");
    const successParam = url.searchParams.get("success");
    const statusParam = url.searchParams.get("status");
    const orderIdParam = url.searchParams.get("orderId");

    console.log("[Zibal][callback] query", {
      trackId,
      successParam,
      statusParam,
      orderIdParam,
    });

    if (!trackId) {
      return apiError("پارامتر trackId ارسال نشده است", 400);
    }

    const order = await getOrderByTrackId(trackId);
    if (!order) {
      return apiError("سفارش مرتبط با این تراکنش یافت نشد", 404);
    }

    if (orderIdParam && order.id !== orderIdParam) {
      return apiError("شناسه سفارش callback معتبر نیست", 400);
    }

    const orders = await getOrders();
    const idx = orders.findIndex((o) => o.id === order.id);
    if (idx === -1) {
      return apiError("سفارش معتبر یافت نشد", 404);
    }

    if (orders[idx].status === "Paid") {
      return new Response(null, {
        status: 302,
        headers: { Location: getRedirectUrl(orders[idx].id) },
      });
    }

    if (orders[idx].status === "Cancelled" || orders[idx].status === "Failed") {
      return new Response(null, {
        status: 302,
        headers: { Location: getRedirectUrl(orders[idx].id) },
      });
    }

    if (isCancellationLike(successParam) || isCancellationLike(statusParam)) {
      const failureStatus = statusParam?.toLowerCase() === "cancelled" || statusParam?.toLowerCase() === "canceled" ? "Cancelled" : "Failed";
      orders[idx] = {
        ...orders[idx],
        status: failureStatus,
        paymentMessage: "پرداخت لغو یا ناموفق شد",
        paymentDate: new Date().toISOString(),
      };
      await saveOrders(orders);
      return new Response(null, {
        status: 302,
        headers: { Location: getRedirectUrl(orders[idx].id) },
      });
    }

    try {
      const verifyResult = await verifyZibalPayment(trackId);

      if (
        typeof verifyResult.amount === "number" &&
        verifyResult.amount !== orders[idx].total
      ) {
        orders[idx] = {
          ...orders[idx],
          status: "Failed",
          paymentMessage: `مبلغ تایید شده با مبلغ سفارش مطابقت ندارد: ${verifyResult.amount}`,
          paymentReferenceId: verifyResult.referenceNumber,
          paymentAmount: verifyResult.amount,
          paymentCardNumber: verifyResult.cardNumber,
          paymentDate: new Date().toISOString(),
        };
        await saveOrders(orders);
        return new Response(null, {
          status: 302,
          headers: { Location: getRedirectUrl(orders[idx].id) },
        });
      }

      orders[idx] = {
        ...orders[idx],
        status: "Paid",
        paymentReferenceId: verifyResult.referenceNumber,
        paymentAmount: verifyResult.amount,
        paymentCardNumber: verifyResult.cardNumber,
        paymentMessage: verifyResult.message || "پرداخت با موفقیت تایید شد",
        paymentDate: new Date().toISOString(),
      };

      await saveOrders(orders);

      return new Response(null, {
        status: 302,
        headers: { Location: getRedirectUrl(orders[idx].id) },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "خطا در تأیید پرداخت";
      const code = error instanceof ZibalApiError ? error.code : undefined;

      orders[idx] = {
        ...orders[idx],
        status: code === 203 ? "Paid" : "Failed",
        paymentMessage: code === 203 ? "تراکنش قبلاً تأیید شده است" : message,
        paymentDate: new Date().toISOString(),
      };
      await saveOrders(orders);

      return new Response(null, {
        status: 302,
        headers: { Location: getRedirectUrl(orders[idx].id) },
      });
    }
  } catch (error) {
    console.error("[Zibal][callback] failed", error);
    return apiError("خطا در پردازش بازگشت پرداخت", 500);
  }
}
