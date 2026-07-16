"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Product, Category, Size, Color } from "@/types";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

export function ProductForm({ product, categories, sizes, colors }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<Category[]>(categories);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryLoading, setNewCategoryLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    discountPercent: product?.discountPercent?.toString() || "",
    categoryId: product?.categoryId || categories[0]?.id || "",
    images: product?.images || [],
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    newArrival: product?.newArrival || false,
    stock: product?.stock?.toString() || "0",
  });

  useEffect(() => {
    setCategoryOptions(categories);
  }, [categories]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const payload = await res.json();
        const data = Array.isArray(payload) ? payload : payload?.data ?? [];
        if (Array.isArray(data)) {
          setCategoryOptions(data);
        }
      } catch {
        setCategoryOptions(categories);
      }
    }

    loadCategories();
  }, [categories]);

  useEffect(() => {
    if (!form.categoryId && categoryOptions.length > 0) {
      setForm((f) => ({ ...f, categoryId: f.categoryId || categoryOptions[0].id }));
    }
  }, [categoryOptions, form.categoryId]);

  function toggleArrayItem(field: "sizes" | "colors", id: string) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(id)
        ? f[field].filter((i) => i !== id)
        : [...f[field], id],
    }));
  }

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
    setForm((f) => ({ ...f, images: [...f.images, trimmed] }));
    setImageUrlInput("");
  }

  async function handleCreateCategory() {
    const name = newCategoryName.trim();
    if (!name) return;

    setNewCategoryLoading(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setNewCategoryLoading(false);

    if (data.success) {
      const newCategory = data.data;
      setNewCategoryName("");
      setCategoryOptions((prev) => [...prev, newCategory]);
      setForm((f) => ({ ...f, categoryId: newCategory.id }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discountPercent: Number(form.discountPercent || 0),
      categoryId: form.categoryId,
      images: form.images,
      sizes: form.sizes,
      colors: form.colors,
      featured: form.featured,
      bestSeller: form.bestSeller,
      newArrival: form.newArrival,
      stock: Number(form.stock),
    };

    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      await router.push("/admin1383/products");
      router.refresh();
    } else {
      setError(data.error || "ذخیره محصول ناموفق بود");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Card className="p-6 space-y-4">
        <Input
          label="نام محصول"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Textarea
          label="توضیحات"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="قیمت (تومان)"
            type="number"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Input
            label="درصد تخفیف"
            type="number"
            min="0"
            max="100"
            value={form.discountPercent}
            onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
          />
          <Input
            label="موجودی"
            type="number"
            required
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
        <Select
          label="دسته‌بندی"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          options={categoryOptions.map((c) => ({ value: c.id, label: c.name }))}
        />
        <div className="rounded-xl border border-dashed border-border p-4 space-y-2">
          <label className="block text-sm font-medium text-muted">افزودن دسته‌بندی جدید</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="مثلاً کت و شلوار"
            />
            <Button type="button" variant="secondary" onClick={handleCreateCategory} loading={newCategoryLoading}>
              ثبت دسته‌بندی
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">تصاویر</h3>
        <ImageUpload
          images={form.images}
          onChange={(images) => setForm({ ...form, images })}
        />
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-muted">یا لینک تصویر را مستقیم وارد کنید</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={imageUrlInput}
              onChange={(e) => {
                setImageUrlInput(e.target.value);
                if (imageUrlError) setImageUrlError("");
              }}
              placeholder="https://example.com/image.jpg"
            />
            <Button type="button" variant="secondary" onClick={handleAddImageUrl}>
              افزودن لینک
            </Button>
          </div>
          {imageUrlError && <p className="text-sm text-red-400">{imageUrlError}</p>}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">سایزها</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => toggleArrayItem("sizes", size.id)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  form.sizes.includes(size.id)
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border"
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">رنگ‌ها</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => toggleArrayItem("colors", color.id)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  form.colors.includes(color.id)
                    ? "border-primary bg-primary/20"
                    : "border-border"
                }`}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {([
            { key: "featured" as const, label: "ویژه" },
            { key: "bestSeller" as const, label: "پرفروش" },
            { key: "newArrival" as const, label: "جدید" },
          ]).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="rounded"
              />
              {label}
            </label>
          ))}
        </div>
      </Card>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {product ? "به‌روزرسانی محصول" : "ایجاد محصول"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
