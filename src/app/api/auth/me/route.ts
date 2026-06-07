import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/repositories";
import { apiSuccess, apiError } from "@/utils/api";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return apiError("Unauthorized", 401);
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return apiError("User not found", 404);
  }

  return apiSuccess({
    id: user.id,
    phone: user.phone,
    name: user.name,
    address: user.address,
    postalCode: user.postalCode,
    role: user.role,
  });
}
