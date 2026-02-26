"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

interface DestinationImage {
  src: string;
  alt: string;
  caption?: string;
}

interface DestinationFormProps {
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<unknown>;
  isEdit?: boolean;
}

export default function DestinationForm({ initialData, onSubmit, isEdit }: DestinationFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: (initialData?.name as string) || "",
    nameVi: (initialData?.nameVi as string) || "",
    slug: (initialData?.slug as string) || "",
    provinceSlug: (initialData?.provinceSlug as string) || "",
    category: (initialData?.category as string) || "thien-nhien",
    description: (initialData?.description as string) || "",
    longDescription: (initialData?.longDescription as string) || "",
    address: (initialData?.address as string) || "",
    lat: ((initialData?.coordinates as { lat?: number })?.lat || "").toString(),
    lng: ((initialData?.coordinates as { lng?: number })?.lng || "").toString(),
    openingHours: (initialData?.openingHours as string) || "",
    entryFee: (initialData?.entryFee as string) || "",
    bestTimeToVisit: (initialData?.bestTimeToVisit as string) || "",
    tips: ((initialData?.tips as string[]) || []).join("\n"),
    tags: ((initialData?.tags as string[]) || []).join(", "),
    featured: (initialData?.featured as boolean) || false,
    order: (initialData?.order as number) || 0,
  });

  const [images, setImages] = useState<DestinationImage[]>(
    (initialData?.images as DestinationImage[]) || [{ src: "", alt: "", caption: "" }]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function updateImage(index: number, field: keyof DestinationImage, value: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, [field]: value } : img)));
  }

  function addImage() {
    setImages((prev) => [...prev, { src: "", alt: "", caption: "" }]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const coordinates = form.lat && form.lng ? { lat: Number(form.lat), lng: Number(form.lng) } : undefined;
      const data = {
        ...form,
        order: Number(form.order),
        coordinates,
        images: images.filter((img) => img.src),
        tips: form.tips.split("\n").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      };
      // Remove lat/lng from top level
      const { lat: _lat, lng: _lng, ...submitData } = data;
      await onSubmit(submitData);
      router.push("/admin/destinations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b pb-3">Thông tin cơ bản</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên địa danh</label>
            <input
              name="name"
              value={form.name}
              onChange={(e) => {
                handleChange(e);
                if (!isEdit) setForm((prev) => ({ ...prev, name: e.target.value, slug: generateSlug(e.target.value) }));
              }}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên tiếng Việt</label>
            <input name="nameVi" value={form.nameVi} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none" required readOnly={isEdit} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug tỉnh</label>
            <input name="provinceSlug" value={form.provinceSlug} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none">
              <option value="thien-nhien">Thiên nhiên</option>
              <option value="lich-su">Lịch sử</option>
              <option value="van-hoa">Văn hoá</option>
              <option value="am-thuc">Ẩm thực</option>
              <option value="giai-tri">Giải trí</option>
              <option value="tam-linh">Tâm linh</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
          <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={5} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold">Hình ảnh</h2>
          <button type="button" onClick={addImage} className="text-sm text-primary-600 hover:underline">+ Thêm ảnh</button>
        </div>

        {images.map((img, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Ảnh {i + 1}</span>
              {images.length > 1 && (
                <button type="button" onClick={() => removeImage(i)} className="text-xs text-red-500 hover:underline">Xoá</button>
              )}
            </div>
            <ImageUploader value={img.src} onChange={(url) => updateImage(i, "src", url)} />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={img.alt}
                onChange={(e) => updateImage(i, "alt", e.target.value)}
                placeholder="Alt text"
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <input
                value={img.caption || ""}
                onChange={(e) => updateImage(i, "caption", e.target.value)}
                placeholder="Caption (tuỳ chọn)"
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b pb-3">Thông tin chi tiết</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
          <input name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (lat)</label>
            <input name="lat" value={form.lat} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (lng)</label>
            <input name="lng" value={form.lng} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ mở cửa</label>
            <input name="openingHours" value={form.openingHours} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phí vào cửa</label>
            <input name="entryFee" value={form.entryFee} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian tốt nhất</label>
            <input name="bestTimeToVisit" value={form.bestTimeToVisit} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mẹo du lịch (mỗi dòng 1 mục)</label>
          <textarea name="tips" value={form.tips} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bằng dấu phẩy)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div className="flex items-center pt-6">
            <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="h-4 w-4 text-primary-600 rounded" />
            <label className="ml-2 text-sm text-gray-700">Địa danh nổi bật</label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
          {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </button>
        <button type="button" onClick={() => router.push("/admin/destinations")} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
          Huỷ
        </button>
      </div>
    </form>
  );
}
