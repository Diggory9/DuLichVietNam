"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tour, TourScheduleDay, TourCategory } from "@/types";
import { TOUR_CATEGORY_LABELS } from "@/types";
import ImageUploader from "./ImageUploader";

interface DestinationImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ScheduleDayFormData {
  dayNumber: number;
  title: string;
  description: string;
  destinationSlugs: string;
}

interface TourFormProps {
  initialData?: Partial<Tour>;
  onSubmit: (data: Record<string, unknown>) => Promise<unknown>;
  isEdit?: boolean;
}

const DIFFICULTY_LABELS: Record<NonNullable<Tour["difficulty"]>, string> = {
  de: "D\u1ec5",
  "trung-binh": "Trung b\u00ecnh",
  kho: "Kh\u00f3",
};

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

export default function TourForm({ initialData, onSubmit, isEdit }: TourFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: initialData?.name || "",
    nameVi: initialData?.nameVi || "",
    slug: initialData?.slug || "",
    provinceSlug: initialData?.provinceSlug || "",
    category: (initialData?.category as TourCategory) || "ket-hop",
    difficulty: initialData?.difficulty || "trung-binh",
    description: initialData?.description || "",
    longDescription: initialData?.longDescription || "",
    days: initialData?.duration?.days?.toString() || "1",
    nights: initialData?.duration?.nights?.toString() || "0",
    price: initialData?.price?.toString() || "",
    discountPrice: initialData?.discountPrice?.toString() || "",
    maxGroupSize: initialData?.maxGroupSize?.toString() || "20",
    includes: initialData?.includes?.join("\n") || "",
    excludes: initialData?.excludes?.join("\n") || "",
    highlights: initialData?.highlights?.join("\n") || "",
    departureLocation: initialData?.departureLocation || "",
    featured: initialData?.featured || false,
    order: initialData?.order?.toString() || "0",
    active: initialData?.active !== undefined ? initialData.active : true,
  });

  const [images, setImages] = useState<DestinationImage[]>(
    initialData?.images || [{ src: "", alt: "", caption: "" }]
  );

  const [schedule, setSchedule] = useState<ScheduleDayFormData[]>(
    initialData?.schedule?.map((s) => ({
      dayNumber: s.dayNumber,
      title: s.title,
      description: s.description,
      destinationSlugs: s.destinationSlugs.join(", "),
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

  // --- Schedule ---
  function updateScheduleDay(
    index: number,
    field: keyof ScheduleDayFormData,
    value: string | number
  ) {
    setSchedule((prev) =>
      prev.map((day, i) => (i === index ? { ...day, [field]: value } : day))
    );
  }

  function addScheduleDay() {
    setSchedule((prev) => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        title: "",
        description: "",
        destinationSlugs: "",
      },
    ]);
  }

  function removeScheduleDay(index: number) {
    setSchedule((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, dayNumber: i + 1 }))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const parsedSchedule: TourScheduleDay[] = schedule.map((s) => ({
        dayNumber: s.dayNumber,
        title: s.title,
        description: s.description,
        destinationSlugs: s.destinationSlugs
          .split(",")
          .map((slug) => slug.trim())
          .filter(Boolean),
      }));

      const allDestinationSlugs = parsedSchedule.flatMap((s) => s.destinationSlugs);
      const uniqueDestinationSlugs = [...new Set(allDestinationSlugs)];

      const data = {
        name: form.name,
        nameVi: form.nameVi,
        slug: form.slug,
        provinceSlug: form.provinceSlug,
        destinationSlugs: uniqueDestinationSlugs,
        category: form.category,
        difficulty: form.difficulty || undefined,
        description: form.description,
        longDescription: form.longDescription,
        images: images.filter((img) => img.src),
        duration: {
          days: Number(form.days),
          nights: Number(form.nights),
        },
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        maxGroupSize: Number(form.maxGroupSize),
        schedule: parsedSchedule,
        includes: form.includes
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        excludes: form.excludes
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        highlights: form.highlights
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        departureLocation: form.departureLocation || undefined,
        featured: form.featured,
        order: Number(form.order),
        active: form.active,
      };

      await onSubmit(data);
      router.push("/admin/tours");
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
            <label className={labelClass}>T\u00ean tour</label>
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
            <label className={labelClass}>Danh m\u1ee5c</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              {(Object.keys(TOUR_CATEGORY_LABELS) as TourCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {TOUR_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>\u0110\u1ed9 kh\u00f3</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className={inputClass}
          >
            {(Object.keys(DIFFICULTY_LABELS) as NonNullable<Tour["difficulty"]>[]).map(
              (d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_LABELS[d]}
                </option>
              )
            )}
          </select>
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

      {/* Duration */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          Th\u1eddi gian
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>S\u1ed1 ng\u00e0y</label>
            <input
              name="days"
              type="number"
              min="1"
              value={form.days}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>S\u1ed1 \u0111\u00eam</label>
            <input
              name="nights"
              type="number"
              min="0"
              value={form.nights}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          Gi\u00e1 c\u1ea3
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Gi\u00e1 (VN\u0110)</label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Gi\u00e1 khuy\u1ebfn m\u00e3i (VN\u0110)</label>
            <input
              name="discountPrice"
              type="number"
              min="0"
              value={form.discountPrice}
              onChange={handleChange}
              placeholder="Tu\u1ef3 ch\u1ecdn"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>S\u1ed1 kh\u00e1ch t\u1ed1i \u0111a</label>
            <input
              name="maxGroupSize"
              type="number"
              min="1"
              value={form.maxGroupSize}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            L\u1ecbch tr\u00ecnh
          </h2>
          <button
            type="button"
            onClick={addScheduleDay}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            + Th\u00eam ng\u00e0y
          </button>
        </div>

        {schedule.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ch\u01b0a c\u00f3 l\u1ecbch tr\u00ecnh. B\u1ea5m &quot;+ Th\u00eam ng\u00e0y&quot; \u0111\u1ec3 th\u00eam.
          </p>
        )}

        {schedule.map((day, i) => (
          <div
            key={i}
            className="border dark:border-gray-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                Ng\u00e0y {day.dayNumber}
              </span>
              <button
                type="button"
                onClick={() => removeScheduleDay(i)}
                className="text-xs text-red-500 hover:underline"
              >
                Xo\u00e1
              </button>
            </div>

            <div>
              <label className={labelClass}>Ti\u00eau \u0111\u1ec1</label>
              <input
                value={day.title}
                onChange={(e) => updateScheduleDay(i, "title", e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>M\u00f4 t\u1ea3</label>
              <textarea
                value={day.description}
                onChange={(e) => updateScheduleDay(i, "description", e.target.value)}
                rows={2}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                \u0110i\u1ec3m \u0111\u1ebfn (slug, ph\u00e2n c\u00e1ch b\u1eb1ng d\u1ea5u ph\u1ea9y)
              </label>
              <input
                value={day.destinationSlugs}
                onChange={(e) =>
                  updateScheduleDay(i, "destinationSlugs", e.target.value)
                }
                placeholder="dia-diem-1, dia-diem-2"
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Includes / Excludes */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          Bao g\u1ed3m / Kh\u00f4ng bao g\u1ed3m
        </h2>

        <div>
          <label className={labelClass}>
            Bao g\u1ed3m (m\u1ed7i d\u00f2ng 1 m\u1ee5c)
          </label>
          <textarea
            name="includes"
            value={form.includes}
            onChange={handleChange}
            rows={4}
            placeholder={"Xe \u0111\u01b0a \u0111\u00f3n\nH\u01b0\u1edbng d\u1eabn vi\u00ean\nB\u1eefa tr\u01b0a"}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Kh\u00f4ng bao g\u1ed3m (m\u1ed7i d\u00f2ng 1 m\u1ee5c)
          </label>
          <textarea
            name="excludes"
            value={form.excludes}
            onChange={handleChange}
            rows={4}
            placeholder={"V\u00e9 m\u00e1y bay\nChi ph\u00ed c\u00e1 nh\u00e2n\nTi\u1ec1n tip"}
            className={inputClass}
          />
        </div>
      </div>

      {/* Highlights */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          \u0110i\u1ec3m n\u1ed5i b\u1eadt
        </h2>

        <div>
          <label className={labelClass}>
            \u0110i\u1ec3m n\u1ed5i b\u1eadt (m\u1ed7i d\u00f2ng 1 m\u1ee5c)
          </label>
          <textarea
            name="highlights"
            value={form.highlights}
            onChange={handleChange}
            rows={4}
            placeholder={"Tham quan di t\u00edch l\u1ecbch s\u1eed\nTh\u01b0\u1edfng th\u1ee9c \u1ea9m th\u1ef1c \u0111\u1ecba ph\u01b0\u01a1ng\nTr\u1ea3i nghi\u1ec7m v\u0103n ho\u00e1 b\u1ea3n \u0111\u1ecba"}
            className={inputClass}
          />
        </div>
      </div>

      {/* Other */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold border-b pb-3 text-gray-900 dark:text-white dark:border-gray-700">
          Kh\u00e1c
        </h2>

        <div>
          <label className={labelClass}>\u0110i\u1ec3m kh\u1edfi h\u00e0nh</label>
          <input
            name="departureLocation"
            value={form.departureLocation}
            onChange={handleChange}
            placeholder="VD: H\u00e0 N\u1ed9i, TP. H\u1ed3 Ch\u00ed Minh"
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
          onClick={() => router.push("/admin/tours")}
          className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Hu\u1ef7
        </button>
      </div>
    </form>
  );
}
