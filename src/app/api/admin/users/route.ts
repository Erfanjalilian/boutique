import { getUsers } from "@/lib/repositories";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const users = await getUsers();
  return apiSuccess(users);
}
