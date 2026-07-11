import { getOrders } from "@/lib/repositories";
import { OrdersAdminClient } from "@/features/admin/OrdersAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersAdminClient initialOrders={orders} />;
}
