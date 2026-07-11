import { getAbout } from "@/lib/repositories";
import { AboutAdminClient } from "@/features/admin/AboutAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const about = await getAbout();
  return <AboutAdminClient initialAbout={about} />;
}
