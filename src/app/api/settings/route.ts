import { getSettings } from "@/lib/repositories";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const settings = await getSettings();
  return apiSuccess(settings);
}
