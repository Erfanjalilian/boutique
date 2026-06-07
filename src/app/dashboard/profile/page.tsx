"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", phone: "", address: "", postalCode: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setForm({
            name: data.data.name || "",
            phone: data.data.phone || "",
            address: data.data.address || "",
            postalCode: data.data.postalCode || "",
          });
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        address: form.address,
        postalCode: form.postalCode,
      }),
    });

    const data = await res.json();
    setLoading(false);
    setMessage(data.success ? "پروفایل با موفقیت به‌روزرسانی شد!" : data.error);
  }

  return (
    <div className="animate-fade-in max-w-lg">
      <h1 className="text-2xl font-bold mb-6">تنظیمات پروفایل</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="نام و نام خانوادگی"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input label="شماره موبایل" value={form.phone} disabled />
          <Input
            label="آدرس"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Input
            label="کد پستی"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
          {message && (
            <p className={`text-sm ${message.includes("موفقیت") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
          <Button type="submit" loading={loading}>
            ذخیره تغییرات
          </Button>
        </form>
      </Card>
    </div>
  );
}
