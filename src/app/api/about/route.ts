import { getAbout } from "@/lib/repositories";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const about = await getAbout();
  return apiSuccess(about);
}
