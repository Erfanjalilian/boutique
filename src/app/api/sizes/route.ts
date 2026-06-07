import { getSizes } from "@/lib/repositories";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const sizes = await getSizes();
  return apiSuccess(sizes);
}
