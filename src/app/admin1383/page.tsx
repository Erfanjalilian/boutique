import { getDashboardStats } from "@/lib/repositories";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/utils/helpers";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: "کل محصولات", value: stats.totalProducts, icon: "👕" },
    { label: "کل سفارش‌ها", value: stats.totalOrders, icon: "📦" },
    { label: "کل کاربران", value: stats.totalUsers, icon: "👥" },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">نمای کلی داشبورد</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value.toLocaleString("fa-IR")}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">سفارش‌های اخیر</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-muted text-sm">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted border-b border-border">
                  <th className="text-start py-3">شناسه</th>
                  <th className="text-start py-3">مشتری</th>
                  <th className="text-start py-3">تاریخ</th>
                  <th className="text-start py-3">وضعیت</th>
                  <th className="text-end py-3">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/30">
                    <td className="py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="py-3">{order.fullName}</td>
                    <td className="py-3 text-muted">{formatDate(order.createdAt)}</td>
                    <td className="py-3">
                      <Badge status={order.status} />
                    </td>
                    <td className="py-3 text-end font-medium">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
