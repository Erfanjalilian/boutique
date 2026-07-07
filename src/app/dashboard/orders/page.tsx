import { getSession } from "@/lib/auth";
import { getOrdersByUserId } from "@/lib/repositories";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice } from "@/utils/helpers";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await getOrdersByUserId(session.userId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">سفارش‌ها</h1>

      {orders.length === 0 ? (
        <Card className="p-6">هنوز سفارش ثبت نکرده‌اید.</Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="p-4 flex items-center justify-between">
              <div>
                <Link href={`/dashboard/orders/${order.id}`} className="font-medium">
                  {order.id.slice(0, 10)}...
                </Link>
                <div className="text-xs text-muted">{formatDate(order.createdAt)}</div>
              </div>
              <div className="flex items-center gap-4">
                <Badge status={order.status} />
                <div className="font-medium">{formatPrice(order.total)}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
import { getSession } from "@/lib/auth";
import { getOrdersByUserId } from "@/lib/repositories";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, formatDate } from "@/utils/helpers";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await getOrdersByUserId(session.userId);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">تاریخچه سفارش‌ها</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="هنوز سفارشی ندارید"
          description="سفارش‌های شما اینجا نمایش داده می‌شوند."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
              <Card hover className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">سفارش #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge status={order.status} />
                    <span className="font-semibold text-primary">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
