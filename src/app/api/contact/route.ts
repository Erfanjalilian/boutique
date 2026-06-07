import { getContact } from "@/lib/repositories";
import { apiSuccess } from "@/utils/api";

export async function GET() {
  const contact = await getContact();
  return apiSuccess(contact);
}
