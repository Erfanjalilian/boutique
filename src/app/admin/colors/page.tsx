import { getColors } from "@/lib/repositories";
import { SimpleCrudAdmin } from "@/features/admin/SimpleCrudAdmin";

export default async function AdminColorsPage() {
  const colors = await getColors();
  return (
    <SimpleCrudAdmin
      title="مدیریت رنگ‌ها"
      apiPath="/api/admin/colors"
      initialItems={colors}
      showHex
    />
  );
}
