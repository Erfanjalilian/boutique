"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ContactInfo } from "@/types";

export function ContactAdminClient({
  initialContact,
}: {
  initialContact: ContactInfo;
}) {
  const [form, setForm] = useState(initialContact);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.success ? "اطلاعات تماس به‌روزرسانی شد!" : data.error);
  }

  return (
    <div className="animate-fade-in max-w-lg">
      <h1 className="text-2xl font-bold mb-6">مدیریت تماس با ما</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="تلفن" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="ایمیل" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="آدرس" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="لینک اینستاگرام" value={form.socialMedia.instagram || ""} onChange={(e) => setForm({ ...form, socialMedia: { ...form.socialMedia, instagram: e.target.value } })} />
          <Input label="لینک توییتر" value={form.socialMedia.twitter || ""} onChange={(e) => setForm({ ...form, socialMedia: { ...form.socialMedia, twitter: e.target.value } })} />
          <Input label="لینک فیسبوک" value={form.socialMedia.facebook || ""} onChange={(e) => setForm({ ...form, socialMedia: { ...form.socialMedia, facebook: e.target.value } })} />
          <Input label="لینک تلگرام" value={form.socialMedia.telegram || ""} onChange={(e) => setForm({ ...form, socialMedia: { ...form.socialMedia, telegram: e.target.value } })} />
          {message && <p className="text-sm text-green-400">{message}</p>}
          <Button type="submit" loading={loading}>ذخیره تغییرات</Button>
        </form>
      </Card>
    </div>
  );
}
