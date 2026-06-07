"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { formatPrice, formatDate } from "@/utils/helpers";
import { orderStatusLabels } from "@/utils/labels";
import type { Order, OrderStatus } from "@/types";

const statuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export function OrdersAdminClient({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);

  async function updateStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setOrders(orders.map((o) => (o.id === id ? data.data : o)));
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">مدیریت سفارش‌ها</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{order.fullName}</p>
                <p className="text-sm text-muted">
                  {formatDate(order.createdAt)} · {order.items.length.toLocaleString("fa-IR")} قلم
                </p>
              </div>
              <p className="font-semibold text-primary">{formatPrice(order.total)}</p>
              <div className="w-44">
                <Select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                  options={statuses.map((s) => ({ value: s, label: orderStatusLabels[s] }))}
                />
              </div>
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-sm text-primary hover:underline"
              >
                جزئیات
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
