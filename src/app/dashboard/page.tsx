import { getSession } from "@/lib/auth";
import { getUserById, getOrdersByUserId } from "@/lib/repositories";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/utils/helpers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.userId);
  const orders = await getOrdersByUserId(session.userId);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">
        خوش آمدید{user?.name ? `، ${user.name}` : ""}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5">
          <p className="text-sm text-muted">تعداد سفارش‌ها</p>
          <p className="text-3xl font-bold mt-1">{orders.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">شماره موبایل</p>
          <p className="text-lg font-medium mt-1">{user?.phone}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">عضویت از</p>
          <p className="text-lg font-medium mt-1">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("fa-IR")
              : "—"}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">سفارش‌های اخیر</h2>
          <Link href="/dashboard/orders" className="text-sm text-primary hover:underline">
            مشاهده همه
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-muted text-sm">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{order.id.slice(0, 8)}...</p>
                  <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={order.status} />
                  <span className="font-medium">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
