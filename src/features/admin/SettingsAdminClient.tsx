"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { SiteSettings } from "@/types";

export function SettingsAdminClient({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const [form, setForm] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.success ? "تنظیمات ذخیره شد!" : data.error);
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">تنظیمات سایت</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">عمومی</h2>
          <Input
            label="نام وب‌سایت"
            value={form.websiteName}
            onChange={(e) => setForm({ ...form, websiteName: e.target.value })}
          />
          <Input
            label="عنوان متا (SEO)"
            value={form.metaTitle}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
          />
          <Textarea
            label="توضیحات متا (SEO)"
            rows={3}
            value={form.metaDescription}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
          />
          <Textarea
            label="متن فوتر"
            rows={2}
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">لوگو و فاویکون</h2>
          <div>
            <p className="text-sm font-medium text-muted mb-2">لوگو</p>
            <ImageUpload
              images={form.logo ? [form.logo] : []}
              onChange={(imgs) => setForm({ ...form, logo: imgs[0] || "" })}
              multiple={false}
              prefix="logo"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-muted mb-2">فاویکون</p>
            <ImageUpload
              images={form.favicon ? [form.favicon] : []}
              onChange={(imgs) => setForm({ ...form, favicon: imgs[0] || "" })}
              multiple={false}
              prefix="favicon"
            />
          </div>
        </Card>

        {message && <p className="text-sm text-green-400">{message}</p>}
        <Button type="submit" loading={loading}>ذخیره تنظیمات</Button>
      </form>
    </div>
  );
}
