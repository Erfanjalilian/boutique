import { getSession } from "@/lib/auth";
import { getOrderById } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) return apiError("Order not found", 404);

  if (session.role !== "admin" && order.userId !== session.userId) {
    return apiError("Forbidden", 403);
  }

  return apiSuccess(order);
}
