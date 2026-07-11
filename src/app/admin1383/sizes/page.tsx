import { getSizes } from "@/lib/repositories";
import { SimpleCrudAdmin } from "@/features/admin/SimpleCrudAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSizesPage() {
  const sizes = await getSizes();
  return (
    <SimpleCrudAdmin
      title="مدیریت سایزها"
      apiPath="/api/admin/sizes"
      initialItems={sizes}
    />
  );
}
