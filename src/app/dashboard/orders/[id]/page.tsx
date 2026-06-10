import { getSession } from "@/lib/auth";
import { getOrderById } from "@/lib/repositories";
import { redirect, notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/utils/helpers";
import Link from "next/link";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order || order.userId !== session.userId) notFound();

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/dashboard/orders" className="text-sm text-primary hover:underline mb-4 inline-block">
        ← بازگشت به سفارش‌ها
      </Link>
      <h1 className="text-3xl font-bold mb-6">جزئیات سفارش</h1>

      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted">شناسه سفارش</p>
            <p className="font-mono text-sm">{order.id}</p>
          </div>
          <Badge status={order.status} />
        </div>

        <div>
          <p className="text-sm text-muted">تاریخ</p>
          <p>{formatDate(order.createdAt)}</p>
        </div>

        {/* Order Items - FIXED: Removed size and color */}
        <div>
          <p className="text-sm text-muted mb-2">اقلام</p>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div 
                key={i} 
                className="flex justify-between items-center text-sm py-2 border-b border-border/30 last:border-0"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted mr-2">× {item.quantity}</span>
                </div>
                <span className="font-semibold text-primary">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>مجموع</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted mb-2">آدرس ارسال</p>
          <p className="text-sm font-medium">{order.fullName}</p>
          <p className="text-sm text-muted mt-1">{order.address}</p>
          <p className="text-sm text-muted mt-1">کد پستی: {order.postalCode}</p>
          <p className="text-sm text-muted mt-1">شماره تماس: {order.phone}</p>
        </div>
        
        {/* Notes */}
        {order.notes && (
          <div>
            <p className="text-sm text-muted mb-2">یادداشت</p>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
}