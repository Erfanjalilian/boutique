"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApi } from "@/hooks/useApi";

interface CrudItem {
  id: string;
  name: string;
  hex?: string;
}

interface SimpleCrudAdminProps {
  title: string;
  apiPath: string;
  initialItems: CrudItem[];
  showHex?: boolean;
}

export function SimpleCrudAdmin({
  title,
  apiPath,
  initialItems,
  showHex,
}: SimpleCrudAdminProps) {
  const { data: itemsData, loading: fetching, refetch } = useApi<CrudItem[]>(
    apiPath,
    { revalidateInterval: 3000 } // ۳ ثانیه auto-refetch
  );
  const items = itemsData ?? initialItems;

  const [name, setName] = useState("");
  const [hex, setHex] = useState("#000000");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const body = showHex ? { name, hex } : { name };
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success || res.ok) {
        setName("");
        setHex("#000000");
        // خودکار refetch پس از افزودن
        await refetch();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف اطمینان دارید؟")) return;
    const res = await fetch(`${apiPath}?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      // خودکار refetch پس از حذف
      await refetch();
    }
  }

  return (
    <div className="animate-fade-in max-w-lg">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <Card className="p-5 mb-6">
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[150px]">
            <Input
              label="نام"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام را وارد کنید"
            />
          </div>
          {showHex && (
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">رنگ</label>
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-12 h-10 rounded-lg cursor-pointer"
              />
            </div>
          )}
          <Button type="submit" loading={loading}>افزودن</Button>
        </form>
      </Card>

      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {item.hex && (
                <span
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: item.hex }}
                />
              )}
              <span>{item.name}</span>
            </div>
            <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
              حذف
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
