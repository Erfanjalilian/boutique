"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  prefix?: string;
}

export function ImageUpload({
  images,
  onChange,
  multiple = true,
  prefix = "product",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const newImages = [...images];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", prefix);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        if (multiple) {
          newImages.push(data.data.path);
        } else {
          onChange([data.data.path]);
          setUploading(false);
          return;
        }
      }
    }

    onChange(newImages);
    setUploading(false);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-background border border-border">
            <Image src={img} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 end-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleUpload}
          className="hidden"
        />
        <span className="inline-flex px-4 py-2 rounded-xl bg-card border border-border text-sm cursor-pointer hover:border-primary/50 transition-colors">
          {uploading ? "در حال آپلود..." : "آپلود تصویر"}
        </span>
      </label>
    </div>
  );
}
