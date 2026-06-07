import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getOrders, saveOrders } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

const statusSchema = z.object({
  status: z.enum([
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") return apiError("Unauthorized", 401);

  const { id } = await params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return apiError("Order not found", 404);

  orders[idx].status = parsed.data.status;
  await saveOrders(orders);
  return apiSuccess(orders[idx]);
}
