import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  getOrders,
  saveOrders,
  getOrdersByUserId,
  getUserById,
} from "@/lib/repositories";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";
import { requestZibalPayment } from "@/services/zibal";

const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  quantity: z.number().min(1),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  fullName: z.string().min(2),
  phone: z.string().min(10),
  address: z.string().min(5),
  postalCode: z.string().min(4),
  notes: z.string().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  if (session.role === "admin") {
    const orders = await getOrders();
    return apiSuccess(orders);
  }

  const orders = await getOrdersByUserId(session.userId);
  return apiSuccess(orders);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { items, fullName, phone, address, postalCode, notes } =
      parsed.data;

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orders = await getOrders();
    const order = {
      id: generateId(),
      userId: session.userId,
      items,
      total,
      status: "Pending" as const,
      fullName,
      phone,
      address,
      postalCode,
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    await saveOrders(orders);

    const baseUrl =
      process.env.APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const callbackUrl = new URL("/api/orders/callback", baseUrl).toString();

    let zibalResult;
    try {
      zibalResult = await requestZibalPayment({
        amount: total,
        callbackUrl,
        description: `سفارش ${order.id}`,
        orderId: order.id,
        mobile: phone,
      });
    } catch (error) {
      console.error("Zibal payment request failed:", error);
      const idx = orders.findIndex((o) => o.id === order.id);
      if (idx !== -1) {
        orders[idx] = {
          ...orders[idx],
          status: "Failed",
          paymentMessage:
            error instanceof Error ? error.message : "خطای نامعلوم در درگاه پرداخت",
          paymentDate: new Date().toISOString(),
        };
        await saveOrders(orders);
      }
      return apiError(
        "درخواست درگاه پرداخت انجام نشد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.",
        502
      );
    }

    const idx = orders.findIndex((o) => o.id === order.id);
    if (idx !== -1) {
      orders[idx] = {
        ...orders[idx],
        paymentTrackId: zibalResult.trackId,
      };
      await saveOrders(orders);
    }

    const user = await getUserById(session.userId);
    if (user && !user.name) {
      const { getUsers, saveUsers } = await import("@/lib/repositories");
      const users = await getUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], name: fullName, address, postalCode, phone };
        await saveUsers(users);
      }
    }

    return apiSuccess(
      {
        orderId: order.id,
        redirectUrl: `https://gateway.zibal.ir/start/${zibalResult.trackId}`,
      },
      201
    );
  } catch (error) {
    console.error("Order creation failed:", error);
    return apiError("Internal server error", 500);
  }
}
