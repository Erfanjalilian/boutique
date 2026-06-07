import type { OrderStatus } from "@/types";

export const orderStatusLabels: Record<OrderStatus, string> = {
  Pending: "در انتظار تأیید",
  Processing: "در حال پردازش",
  Shipped: "ارسال‌شده",
  Delivered: "تحویل‌شده",
  Cancelled: "لغوشده",
};

export function getOrderStatusLabel(status: OrderStatus | string): string {
  return orderStatusLabels[status as OrderStatus] || status;
}
