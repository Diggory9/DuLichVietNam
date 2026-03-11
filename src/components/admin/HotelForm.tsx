"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Hotel, HotelRoom } from "@/types";
import ImageUploader from "./ImageUploader";

interface DestinationImage {
  src: string;
  alt: string;
  caption?: string;
}

interface RoomFormData {
  name: string;
  type: "standard" | "deluxe" | "suite" | "family";
  price: string;
  maxGuests: string;
  amenities: string;
  available: boolean;
}

interface HotelFormProps {
  initialData?: Partial<Hotel>;
  onSubmit: (data: Record<string, unknown>) => Promise<unknown>;
  isEdit?: boolean;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const ROOM_TYPE_LABELS: Record<HotelRoom["type"], string> = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  family: "Family",
};

export default function HotelForm({ initialData, onSubmit, isEdit }: HotelFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: initialData?.name || "",
    nameVi: initialData?.nameVi || "",
    slug: initialData?.slug || "",
    provinceSlug: initialData?.provinceSlug || "",
    destinationSlug: initialData?.destinationSlug || "",
    stars: initialData?.stars?.toString() || "3",
    address: initialData?.address || "",
    lat: initialData?.coordinates?.lat?.toString() || "",
    lng: initialData?.coordinates?.lng?.toString() || "",
    description: initialData?.description || "",
    longDescription: initialData?.longDescription || "",
    amenities: initialData?.amenities?.join(", ") || "",
    phone: initialData?.contact?.phone || "",
    email: initialData?.contact?.email || "",
    website: initialData?.contact?.website || "",
    checkInTime: initialData?.checkInTime || "",
    checkOutTime: initialData?.checkOutTime || "",
    policies: initialData?.policies || "",
    featured: initialData?.featured || false,
    order: initialData?.order?.toString() || "0",
    active: initialData?.active !== undefined ? initialData.active : true,
  });

  const [images, setImages] = useState<DestinationImage[]>(
    initialData?.images || [{ src: "", alt: "", caption: "" }]
  );

  const [rooms, setRooms] = useState<RoomFormData[]>(
    initialData?.rooms?.map((r) => ({
      name: r.name,
      type: r.type,
      price: r.price.toString(),
      maxGuests: r.maxGuests.toString(),
      amenities: r.amenities.join(", "),
      available: r.available,
    })) || []
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const value =
      target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  // --- Images ---
  function updateImage(index: number, field: keyof DestinationImage, value: string) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, [field]: value } : img))
    );
  }

  function addImage() {
    setImages((prev) => [...prev, { src: "", alt: "", caption: "" }]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  // --- Rooms ---
  function updateRoom(index: number, field: keyof RoomFormData, value: string | boolean) {
    setRooms((prev) =>
      prev.map((room, i) => (i === index ? { ...room, [field]: value } : room))
    );
  }

  function addRoom() {
    setRooms((prev) => [
      ...prev,
      { name: "", type: "standard" as const, price: "", maxGuests: "2", amenities: "", available: true },
    ]);
  }

  function removeRoom(index: number) {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const coordinates =
        form.lat && form.lng
          ? { lat: Number(form.lat), lng: Number(form.lng) }
          : undefined;

      const parsedRooms: HotelRoom[] = rooms.map((r) => ({
        name: r.name,
        type: r.type,
        price: Number(r.price),
        maxGuests: Number(r.maxGuests),
        amenities: r.amenities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        images: [],
        available: r.available,
      }));

      const prices = parsedRooms.map((r) => r.price).filter((p) => p > 0);
      const priceRange =
        prices.length > 0
          ? { min: Math.min(...prices), max: Math.max(...prices) }
          : { min: 0, max: 0 };

      const data = {
        name: form.name,
        nameVi: form.nameVi,
        slug: form.slug,
        provinceSlug: form.provinceSlug,
        destinationSlug: form.destinationSlug || undefined,
        stars: Number(form.stars),
        address: form.address,
        coordinates,
        description: form.description,
        longDescription: form.longDescription,
        images: images.filter((img) => img.src),
        priceRange,
        amenities: form.amenities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        rooms: parsedRooms,
        contact: {
          phone: form.phone || undefined,
          email: form.email || undefined,
          website: form.website || undefined,
        },
        checkInTime: form.checkInTime || undefined,
        checkOutTime: form.checkOutTime || undefined,
        policies: form.policies || undefined,
        featured: form.featured,
        order: Number(form.order),
        active: form.active,
      };

      await onSubmit(data);
      router.push("/admin/hotels");
    } catch (err) {
      setError(err instanceof Error ? err.message : "L\u1ed7i l\u01b0u d\u1eef li\u1ec7u");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const sectionClass = "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-5";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          Th\u00f4ng tin c\u01a1 b\u1ea3n
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>T\u00ean kh\u00e1ch s\u1ea1n</label>
            <input
              name="name"
              value={form.name}
              onChange={(e) => {
                handleChange(e);
                if (!isEdit)
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  }));
              }}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>T\u00ean ti\u1ebfng Vi\u1ec7t</label>
            <input
              name="nameVi"
              value={form.nameVi}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className={`${inputClass} bg-gray-50 dark:bg-gray-600`}
              required
              readOnly={isEdit}
            />
          </div>
          <div>
            <label className={labelClass}>Slug t\u1ec9nh</label>
            <input
              name="provinceSlug"
              value={form.provinceSlug}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug \u0111i\u1ec3m \u0111\u1ebfn</label>
            <input
              name="destinationSlug"
              value={form.destinationSlug}
              onChange={handleChange}
              className={inputClass}
              placeholder="Tu\u1ef3 ch\u1ecdn"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>S\u1ed1 sao</label>
            <select
              name="stars"
              value={form.stars}
              onChange={handleChange}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>
                  {s} sao
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>\u0110\u1ecba ch\u1ec9</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>V\u0129 \u0111\u1ed9 (lat)</label>
            <input
              name="lat"
              value={form.lat}
              onChange={handleChange}
              className={inputClass}
              type="number"
              step="any"
            />
          </div>
          <div>
            <label className={labelClass}>Kinh \u0111\u1ed9 (lng)</label>
            <input
              name="lng"
              value={form.lng}
              onChange={handleChange}
              className={inputClass}
              type="number"
              step="any"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          M\u00f4 t\u1ea3
        </h2>

        <div>
          <label className={labelClass}>M\u00f4 t\u1ea3 ng\u1eafn</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>M\u00f4 t\u1ea3 chi ti\u1ebft</label>
          <textarea
            name="longDescription"
            value={form.longDescription}
            onChange={handleChange}
            rows={5}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Images */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            H\u00ecnh \u1ea3nh
          </h2>
          <button
            type="button"
            onClick={addImage}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            + Th\u00eam \u1ea3nh
          </button>
        </div>

        {images.map((img, i) => (
          <div key={i} className="border dark:border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                \u1ea2nh {i + 1}
              </span>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Xo\u00e1
                </button>
              )}
            </div>
            <ImageUploader value={img.src} onChange={(url) => updateImage(i, "src", url)} />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={img.alt}
                onChange={(e) => updateImage(i, "alt", e.target.value)}
                placeholder="Alt text"
                className={inputClass}
              />
              <input
                value={img.caption || ""}
                onChange={(e) => updateImage(i, "caption", e.target.value)}
                placeholder="Caption (tu\u1ef3 ch\u1ecdn)"
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Rooms */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ph\u00f2ng
          </h2>
          <button
            type="button"
            onClick={addRoom}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            + Th\u00eam ph\u00f2ng
          </button>
        </div>

        {rooms.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ch\u01b0a c\u00f3 ph\u00f2ng n\u00e0o. B\u1ea5m &quot;+ Th\u00eam ph\u00f2ng&quot; \u0111\u1ec3 th\u00eam.
          </p>
        )}

        {rooms.map((room, i) => (
          <div
            key={i}
            className="border dark:border-gray-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ph\u00f2ng {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeRoom(i)}
                className="text-xs text-red-500 hover:underline"
              >
                Xo\u00e1
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>T\u00ean ph\u00f2ng</label>
                <input
                  value={room.name}
                  onChange={(e) => updateRoom(i, "name", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Lo\u1ea1i ph\u00f2ng</label>
                <select
                  value={room.type}
                  onChange={(e) => updateRoom(i, "type", e.target.value)}
                  className={inputClass}
                >
                  {(Object.keys(ROOM_TYPE_LABELS) as HotelRoom["type"][]).map((t) => (
                    <option key={t} value={t}>
                      {ROOM_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Gi\u00e1 (VN\u0110)</label>
                <input
                  type="number"
                  min="0"
                  value={room.price}
                  onChange={(e) => updateRoom(i, "price", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>S\u1ed1 kh\u00e1ch t\u1ed1i \u0111a</label>
                <input
                  type="number"
                  min="1"
                  value={room.maxGuests}
                  onChange={(e) => updateRoom(i, "maxGuests", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Ti\u1ec7n nghi ph\u00f2ng (ph\u00e2n c\u00e1ch b\u1eb1ng d\u1ea5u ph\u1ea9y)
              </label>
              <input
                value={room.amenities}
                onChange={(e) => updateRoom(i, "amenities", e.target.value)}
                placeholder="WiFi, \u0110i\u1ec1u ho\u00e0, T\u1ee7 l\u1ea1nh..."
                className={inputClass}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={room.available}
                onChange={(e) => updateRoom(i, "available", e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                C\u00f2n ph\u00f2ng
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Amenities */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          Ti\u1ec7n nghi kh\u00e1ch s\u1ea1n
        </h2>

        <div>
          <label className={labelClass}>
            Ti\u1ec7n nghi (ph\u00e2n c\u00e1ch b\u1eb1ng d\u1ea5u ph\u1ea9y)
          </label>
          <input
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
            placeholder="H\u1ed3 b\u01a1i, Spa, Nh\u00e0 h\u00e0ng, Ph\u00f2ng gym..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Contact */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          Li\u00ean h\u1ec7
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>S\u1ed1 \u0111i\u1ec7n tho\u1ea1i</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          Ch\u00ednh s\u00e1ch
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Gi\u1edd nh\u1eadn ph\u00f2ng</label>
            <input
              name="checkInTime"
              value={form.checkInTime}
              onChange={handleChange}
              placeholder="14:00"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Gi\u1edd tr\u1ea3 ph\u00f2ng</label>
            <input
              name="checkOutTime"
              value={form.checkOutTime}
              onChange={handleChange}
              placeholder="12:00"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Ch\u00ednh s\u00e1ch kh\u00e1ch s\u1ea1n</label>
          <textarea
            name="policies"
            value={form.policies}
            onChange={handleChange}
            rows={4}
            placeholder="C\u00e1c quy \u0111\u1ecbnh v\u00e0 ch\u00ednh s\u00e1ch..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Display */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          Hi\u1ec3n th\u1ecb
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Th\u1ee9 t\u1ef1 hi\u1ec3n th\u1ecb</label>
            <input
              name="order"
              type="number"
              value={form.order}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-6 pt-6">
            <div className="flex items-center">
              <input
                name="featured"
                type="checkbox"
                checked={form.featured}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                N\u1ed5i b\u1eadt
              </label>
            </div>
            <div className="flex items-center">
              <input
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Ho\u1ea1t \u0111\u1ed9ng
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? "\u0110ang l\u01b0u..." : isEdit ? "C\u1eadp nh\u1eadt" : "T\u1ea1o m\u1edbi"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/hotels")}
          className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Hu\u1ef7
        </button>
      </div>
    </form>
  );
}
