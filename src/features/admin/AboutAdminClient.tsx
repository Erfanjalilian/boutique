"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { AboutInfo } from "@/types";

export function AboutAdminClient({
  initialAbout,
}: {
  initialAbout: AboutInfo;
}) {
  const [form, setForm] = useState(initialAbout);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.success ? "صفحه درباره ما به‌روزرسانی شد!" : data.error);
  }

  const fields = [
    { key: "description" as const, label: "توضیحات شرکت" },
    { key: "story" as const, label: "داستان شرکت" },
    { key: "mission" as const, label: "مأموریت" },
    { key: "vision" as const, label: "چشم‌انداز" },
    { key: "additionalContent" as const, label: "محتوای تکمیلی" },
  ];

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">مدیریت درباره ما</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <Textarea
              key={field.key}
              label={field.label}
              rows={4}
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            />
          ))}
          {message && <p className="text-sm text-green-400">{message}</p>}
          <Button type="submit" loading={loading}>ذخیره تغییرات</Button>
        </form>
      </Card>
    </div>
  );
}
