import { getSettings } from "@/lib/repositories";
import { SettingsAdminClient } from "@/features/admin/SettingsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <SettingsAdminClient initialSettings={settings} />;
}
