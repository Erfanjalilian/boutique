import { getSession } from "@/lib/auth";
import { getOrderById } from "@/lib/repositories";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { formatDate, formatPrice } from "@/utils/helpers";
import { Badge } from "@/components/ui/Badge";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const order = await getOrderById(params.id);
  if (!order) redirect("/dashboard/orders");
  if (session.role !== "admin" && order.userId !== session.userId) redirect("/dashboard");

  const paymentStatus = order.status === "Pending" ? "پرداخت‌نشده" : "پرداخت شده";
  const shippingStatus = order.status;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">سفارش {order.id.slice(0, 10)}...</h1>
        <div className="text-sm text-muted">{formatDate(order.createdAt)}</div>
      </div>

      <Card className="p-4">
        <div className="mb-3">
          <h3 className="font-medium">وضعیت سفارش</h3>
          <Badge status={order.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">آدرس گیرنده</h4>
            <p className="text-sm">{order.fullName}</p>
            <p className="text-sm">{order.phone}</p>
            <p className="text-sm">{order.address}</p>
            <p className="text-sm">کد پستی: {order.postalCode}</p>
          </div>
          <div>
            <h4 className="font-medium">جزئیات پرداخت</h4>
            <p className="text-sm">وضعیت پرداخت: {paymentStatus}</p>
            <p className="text-sm">قیمت نهایی: {formatPrice(order.total)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-3">محصولات خریداری‌شده</h3>
        <div className="space-y-3">
          {order.items.map((it) => (
            <div key={it.productId} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{it.name}</p>
                <p className="text-xs text-muted">تعداد: {it.quantity}</p>
              </div>
              <div className="text-sm font-medium">{formatPrice(it.price * it.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right font-semibold">جمع نهایی: {formatPrice(order.total)}</div>
      </Card>
    </div>
  );
}
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