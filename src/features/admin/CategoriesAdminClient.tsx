"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useApi } from "@/hooks/useApi";
import type { Category } from "@/types";

export function CategoriesAdminClient({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const { data: categoriesData, refetch } = useApi<Category[]>(
    "/api/admin/categories",
    { revalidateInterval: 3000 } // ۳ ثانیه auto-refetch
  );
  const categories = categoriesData ?? initialCategories;

  const [name, setName] = useState("");
  const [image, setImage] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAddImageUrl() {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) {
      setImageUrlError("لطفاً لینک تصویر را وارد کنید.");
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      setImageUrlError("لینک تصویر معتبر نیست.");
      return;
    }

    setImageUrlError("");
    setImage([trimmed]);
    setImageUrlInput("");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const selectedImage = image[0] || imageUrlInput.trim() || undefined;

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: selectedImage }),
      });
      const data = await res.json();

      if (data.success) {
        setName("");
        setImage([]);
        // خودکار refetch پس از افزودن
        await refetch();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      // خودکار refetch پس از حذف
      await refetch();
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
            <div className="mt-3 space-y-2">
              <label className="block text-sm font-medium text-muted">یا لینک تصویر را وارد کنید</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={imageUrlInput}
                  onChange={(e) => {
                    setImageUrlInput(e.target.value);
                    if (imageUrlError) setImageUrlError("");
                  }}
                  placeholder="https://example.com/category.jpg"
                />
                <Button type="button" variant="secondary" onClick={handleAddImageUrl}>
                  افزودن لینک
                </Button>
              </div>
              {imageUrlError && <p className="text-sm text-red-400">{imageUrlError}</p>}
            </div>
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
