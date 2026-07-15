import { z } from "zod";
import { getOrderByTrackId, saveOrders, getOrders } from "@/lib/repositories";
import { verifyZibalPayment, ZibalApiError } from "@/services/zibal";
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

    const orders = await getOrders();
    const idx = orders.findIndex((o) => o.id === order.id);

    if (idx === -1) {
      return apiError("سفارش معتبر یافت نشد", 404);
    }

    try {
      const result = await verifyZibalPayment(trackId);

      if (typeof result.amount === "number" && result.amount !== order.total) {
        orders[idx] = {
          ...orders[idx],
          status: "Failed",
          paymentMessage: `مبلغ پرداخت شده با مبلغ سفارش مطابقت ندارد: ${result.amount}`,
          paymentReferenceId: result.referenceNumber,
          paymentAmount: result.amount,
          paymentCardNumber: result.cardNumber,
          paymentDate: new Date().toISOString(),
        };
        await saveOrders(orders);
        return apiError("مبلغ تراکنش با سفارش مطابقت ندارد", 400);
      }

      orders[idx] = {
        ...orders[idx],
        status: "Paid",
        paymentReferenceId: result.referenceNumber,
        paymentAmount: result.amount,
        paymentCardNumber: result.cardNumber,
        paymentMessage: result.message,
        paymentDate: new Date().toISOString(),
      };

      await saveOrders(orders);
      return apiSuccess({ message: "تراکنش با موفقیت تأیید شد" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "خطای سرور در تأیید پرداخت";
      const code = error instanceof ZibalApiError ? error.code : undefined;

      orders[idx] = {
        ...orders[idx],
        status: code === 203 ? "Paid" : "Failed",
        paymentMessage: code === 203 ? "تراکنش قبلاً تأیید شده است" : message,
        paymentDate: new Date().toISOString(),
      };
      await saveOrders(orders);

      if (code === 203) {
        return apiSuccess({ message: "تراکنش قبلاً تأیید شده است" });
      }

      return apiError(message, 402);
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    return apiError("خطای سرور در تأیید پرداخت", 500);
  }
}
