import { clearSessionCookie } from "@/lib/auth";
import { apiSuccess } from "@/utils/api";

export async function POST() {
  await clearSessionCookie();
  return apiSuccess({ message: "Logged out successfully" });
}
