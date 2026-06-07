import { getColors } from "@/lib/repositories";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const colors = await getColors();
  return apiSuccess(colors);
}
