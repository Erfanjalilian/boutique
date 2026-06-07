"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Category } from "@/types";

export function CategoriesAdminClient({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image: image[0] }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setCategories([...categories, data.data]);
      setName("");
      setImage([]);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  }

  return (
    <div className="animate-fade-in max-w-lg">
      <h1 className="text-2xl font-bold mb-6">مدیریت دسته‌بندی‌ها</h1>

      <Card className="p-5 mb-6 space-y-4">
        <form onSubmit={handleAdd}>
          <Input
            label="نام دسته‌بندی"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="mt-4">
            <p className="text-sm font-medium text-muted mb-2">تصویر (اختیاری)</p>
            <ImageUpload
              images={image}
              onChange={setImage}
              multiple={false}
              prefix="category"
            />
          </div>
          <Button type="submit" loading={loading} className="mt-4">
            افزودن دسته‌بندی
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-4 flex items-center justify-between">
            <span>{cat.name}</span>
            <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)}>
              حذف
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
