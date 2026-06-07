import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") return apiError("Unauthorized", 401);
  const stats = await getDashboardStats();
  return apiSuccess(stats);
}
