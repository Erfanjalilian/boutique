"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/utils/helpers";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setForm((f) => ({
            ...f,
            fullName: data.data.name || f.fullName,
            phone: data.data.phone || f.phone,
            address: data.data.address || f.address,
            postalCode: data.data.postalCode || f.postalCode,
          }));
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, ...form }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      clearCart();
      window.location.assign(data.data.redirectUrl);
      return;
    }

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    setError(data.error || "ثبت سفارش با خطا مواجه شد");
  }

  if (items.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">تسویه حساب</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">اطلاعات ارسال</h2>
          <Input
            label="نام و نام خانوادگی"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <Input
            label="شماره موبایل"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="آدرس"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Input
            label="کد پستی"
            required
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
          <Textarea
            label="توضیحات (اختیاری)"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">مبلغ کل</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            ثبت سفارش
          </Button>
        </Card>
      </form>
    </div>
  );
}
