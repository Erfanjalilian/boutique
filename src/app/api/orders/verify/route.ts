import { z } from "zod";
import { getOrderByTrackId, saveOrders, getOrders } from "@/lib/repositories";
import { verifyZibalPayment } from "@/services/zibal";
import { apiSuccess, apiError } from "@/utils/api";

const verifyPayloadSchema = z.object({
  trackId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = verifyPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { trackId } = parsed.data;
    const order = await getOrderByTrackId(trackId);
    if (!order) {
      return apiError("سفارش مربوط به این تراکنش یافت نشد", 404);
    }

    if (order.status === "Paid") {
      return apiSuccess({ message: "تراکنش پیش‌تر تایید شده است" });
    }

    if (order.status === "Failed" || order.status === "Cancelled") {
      return apiError("این سفارش قبلاً ناموفق شده است", 400);
    }

    const result = await verifyZibalPayment(trackId);
    const orders = await getOrders();
    const idx = orders.findIndex((o) => o.id === order.id);

    if (idx === -1) {
      return apiError("سفارش معتبر یافت نشد", 404);
    }

    if (!result.success) {
      orders[idx] = {
        ...orders[idx],
        status: "Failed",
        paymentMessage: result.message,
        paymentDate: new Date().toISOString(),
      };
      await saveOrders(orders);
      return apiError("تأیید تراکنش ناموفق بود", 402);
    }

    if (typeof result.amount === "number" && result.amount !== order.total) {
      orders[idx] = {
        ...orders[idx],
        status: "Failed",
        paymentMessage: `مبلغ پرداخت شده با مبلغ سفارش مطابقت ندارد: ${result.amount}`,
        paymentReferenceId: result.referenceId,
        paymentCardNumber: result.cardNumber,
        paymentDate: new Date().toISOString(),
      };
      await saveOrders(orders);
      return apiError("مبلغ تراکنش با سفارش مطابقت ندارد", 400);
    }

    orders[idx] = {
      ...orders[idx],
      status: "Paid",
      paymentReferenceId: result.referenceId,
      paymentCardNumber: result.cardNumber,
      paymentMessage: result.message,
      paymentDate: new Date().toISOString(),
    };

    await saveOrders(orders);
    return apiSuccess({ message: "تراکنش با موفقیت تأیید شد" });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return apiError("خطای سرور در تأیید پرداخت", 500);
  }
}
