"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data.success) {
          setPhone(data.data.phone || "");
          const parts = (data.data.name || "").split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
        } else if (data.error && data.error === "Unauthorized") {
          router.push("/login");
        } else {
          setError(data.error || "خطا در دریافت اطلاعات کاربر");
        }
      })
      .catch(() => setError("خطای شبکه"))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("اطلاعات با موفقیت ذخیره شد");
        setTimeout(() => {
          router.refresh();
        }, 800);
      } else {
        setError(data.error || "ذخیره‌سازی ناموفق بود");
      }
    } catch (err) {
      setError("خطای شبکه");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">پروفایل</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <Input label="شماره موبایل" value={phone} readOnly />
        <Input
          label="نام"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          label="نام خانوادگی"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" loading={saving}>ذخیره</Button>
          <Button variant="ghost" onClick={() => router.back()}>بازگشت</Button>
        </div>
      </form>
    </div>
  );
}
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
