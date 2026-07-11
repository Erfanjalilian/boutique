import { getOrders } from "@/lib/repositories";
import { OrdersAdminClient } from "@/features/admin/OrdersAdminClient";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersAdminClient initialOrders={orders} />;
}
