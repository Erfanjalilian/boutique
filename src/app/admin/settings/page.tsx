import { getSettings } from "@/lib/repositories";
import { SettingsAdminClient } from "@/features/admin/SettingsAdminClient";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <SettingsAdminClient initialSettings={settings} />;
}
