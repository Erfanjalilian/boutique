import { getDashboardStats } from "@/lib/repositories";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const stats = await getDashboardStats();
  return apiSuccess(stats);
}
