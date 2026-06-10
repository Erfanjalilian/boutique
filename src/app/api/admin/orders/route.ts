import { getSession } from "@/lib/auth";
import { getOrders } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    // Check if user is authenticated and is admin
    if (!session) {
      return apiError("Unauthorized - Please login first", 401);
    }
    
    if (session.role !== "admin") {
      return apiError("Forbidden - Admin access required", 403);
    }
    
    const orders = await getOrders();
    
    // Return orders sorted by newest first
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return apiSuccess({
      orders: sortedOrders,
      total: sortedOrders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return apiError("Internal server error", 500);
  }
}