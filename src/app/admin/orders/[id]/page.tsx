import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/repositories";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/utils/helpers";
import Link from "next/link";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/admin/orders" className="text-sm text-primary hover:underline mb-4 inline-block">
        → بازگشت به سفارش‌ها
      </Link>
      <h1 className="text-2xl font-bold mb-6">جزئیات سفارش</h1>
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <span className="font-mono text-sm">{order.id}</span>
          <Badge status={order.status} />
        </div>
        <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-2 border-b border-border/30">
              <span>{item.name} ({item.size}، {item.color}) × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
        <div className="text-sm space-y-1">
          <p><strong>{order.fullName}</strong></p>
          <p className="text-muted">{order.address}</p>
          <p className="text-muted">{order.postalCode} · {order.phone}</p>
          {order.notes && <p className="text-muted">توضیحات: {order.notes}</p>}
        </div>
      </Card>
    </div>
  );
}
