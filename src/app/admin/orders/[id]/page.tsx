import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/repositories";
import { formatPrice } from "@/utils/helpers";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const statusColors = {
  Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusTranslations = {
  Pending: "در انتظار",
  Processing: "در حال پردازش",
  Shipped: "ارسال شده",
  Delivered: "تحویل داده شده",
  Cancelled: "لغو شده",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">جزئیات سفارش</h1>
        <Badge className={statusColors[order.status]}>
          {statusTranslations[order.status]}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Order Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">اطلاعات سفارش</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted">شماره سفارش:</span>
              <span className="mr-2 font-medium">{order.id}</span>
            </div>
            <div>
              <span className="text-muted">تاریخ ثبت:</span>
              <span className="mr-2 font-medium">
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
            <div>
              <span className="text-muted">نام کامل:</span>
              <span className="mr-2 font-medium">{order.fullName}</span>
            </div>
            <div>
              <span className="text-muted">شماره تماس:</span>
              <span className="mr-2 font-medium">{order.phone}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted">آدرس:</span>
              <span className="mr-2 font-medium">{order.address}</span>
            </div>
            <div>
              <span className="text-muted">کد پستی:</span>
              <span className="mr-2 font-medium">{order.postalCode}</span>
            </div>
          </div>
        </Card>

        {/* Order Items - FIXED: Removed size and color */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">محصولات سفارش</h2>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0"
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

          <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold">مجموع</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(order.total)}
            </span>
          </div>
        </Card>

        {/* Notes */}
        {order.notes && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">یادداشت</h2>
            <p className="text-muted text-sm">{order.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}