"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/lib/admin-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi upload");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const fullUrl = value && value.startsWith("/uploads") ? `${API_URL}${value}` : value;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL ảnh hoặc upload bên dưới"
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
        />
        <label className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${uploading ? "bg-gray-300 text-gray-500" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          {uploading ? "Đang tải..." : "Upload"}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {value && (
        <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-gray-100 border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fullUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
