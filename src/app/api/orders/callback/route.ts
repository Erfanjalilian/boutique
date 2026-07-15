import { getOrderByTrackId, getOrders, saveOrders } from "@/lib/repositories";
import { verifyZibalPayment } from "@/services/zibal";
import { apiError, apiSuccess } from "@/utils/api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const trackId = url.searchParams.get("trackId");
    const resultParam = url.searchParams.get("result")?.toLowerCase();

    if (!trackId) {
      return apiError("پارامتر trackId ارسال نشده است", 400);
    }

    const order = await getOrderByTrackId(trackId);
    if (!order) {
      return apiError("سفارش مرتبط با این تراکنش یافت نشد", 404);
    }

    const orders = await getOrders();
    const idx = orders.findIndex((o) => o.id === order.id);
    if (idx === -1) {
      return apiError("سفارش معتبر یافت نشد", 404);
    }

    if (orders[idx].status === "Paid") {
      return apiSuccess({ message: "این تراکنش قبلاً تایید شده است" });
    }

    if (orders[idx].status === "Cancelled") {
      return apiSuccess({ message: "این سفارش قبلاً لغو شده است" });
    }

    if (resultParam === "cancelled" || resultParam === "canceled") {
      orders[idx] = {
        ...orders[idx],
        status: "Cancelled",
        paymentMessage: "کاربر پرداخت را لغو کرد",
        paymentDate: new Date().toISOString(),
      };
      await saveOrders(orders);
      const redirectUrl = new URL(
        `/order-success?id=${orders[idx].id}`,
        process.env.APP_URL || "http://localhost:3000"
      );
      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl.toString() },
      });
    }

    const verifyResult = await verifyZibalPayment(trackId);

    if (!verifyResult.success) {
      orders[idx] = {
        ...orders[idx],
        status: "Failed",
        paymentMessage: verifyResult.message,
        paymentReferenceId: verifyResult.referenceId,
        paymentCardNumber: verifyResult.cardNumber,
        paymentDate: new Date().toISOString(),
      };
      await saveOrders(orders);
      const redirectUrl = new URL(
        `/order-success?id=${orders[idx].id}`,
        process.env.APP_URL || "http://localhost:3000"
      );
      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl.toString() },
      });
    }

    if (
      typeof verifyResult.amount === "number" &&
      verifyResult.amount !== orders[idx].total
    ) {
      orders[idx] = {
        ...orders[idx],
        status: "Failed",
        paymentMessage: `مبلغ تایید شده با مبلغ سفارش مطابقت ندارد: ${verifyResult.amount}`,
        paymentReferenceId: verifyResult.referenceId,
        paymentCardNumber: verifyResult.cardNumber,
        paymentDate: new Date().toISOString(),
      };
      await saveOrders(orders);
      const redirectUrl = new URL(
        `/order-success?id=${orders[idx].id}`,
        process.env.APP_URL || "http://localhost:3000"
      );
      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl.toString() },
      });
    }

    orders[idx] = {
      ...orders[idx],
      status: "Paid",
      paymentReferenceId: verifyResult.referenceId,
      paymentCardNumber: verifyResult.cardNumber,
      paymentMessage: verifyResult.message,
      paymentDate: new Date().toISOString(),
    };

    await saveOrders(orders);

    const redirectUrl = new URL(
      `/order-success?id=${orders[idx].id}`,
      process.env.APP_URL || "http://localhost:3000"
    );

    return new Response(null, {
      status: 302,
      headers: { Location: redirectUrl.toString() },
    });
  } catch (error) {
    console.error("Zibal callback handling failed:", error);
    return apiError("خطا در پردازش بازگشت پرداخت", 500);
  }
}
