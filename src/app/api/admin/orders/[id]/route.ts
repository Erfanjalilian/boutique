import { z } from "zod";
import { getOrders, getOrderById, saveOrders } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

const statusSchema = z.object({
  status: z.enum([
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Paid",
    "Failed",
  ]),
});

// GET - Fetch a single order by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    
    if (!order) {
      return apiError("Order not found", 404);
    }
    
    return apiSuccess(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return apiError("Internal server error", 500);
  }
}

// PUT - Update order status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const orders = await getOrders();
    const idx = orders.findIndex((o) => o.id === id);
    
    if (idx === -1) {
      return apiError("Order not found", 404);
    }

    // Update the order status
    orders[idx] = {
      ...orders[idx],
      status: parsed.data.status,
    };
    
    await saveOrders(orders);
    return apiSuccess(orders[idx]);
  } catch (error) {
    console.error("Error updating order:", error);
    return apiError("Internal server error", 500);
  }
}