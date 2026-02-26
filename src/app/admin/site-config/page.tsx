"use client";

import { useEffect, useState } from "react";
import { fetchSiteConfig, updateSiteConfig } from "@/lib/admin-api";

export default function AdminSiteConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    url: "",
    ogImage: "",
    github: "",
  });

  useEffect(() => {
    fetchSiteConfig()
      .then((data) => {
        const d = data as Record<string, unknown>;
        const links = (d.links as Record<string, string>) || {};
        setForm({
          name: (d.name as string) || "",
          description: (d.description as string) || "",
          url: (d.url as string) || "",
          ogImage: (d.ogImage as string) || "",
          github: links.github || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateSiteConfig({
        name: form.name,
        description: form.description,
        url: form.url,
        ogImage: form.ogImage,
        links: { github: form.github },
      });
      setSuccess("Cập nhật thành công!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-gray-500">Đang tải...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Cấu hình website</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">{success}</div>}

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên website</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL website</label>
            <input name="url" value={form.url} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
            <input name="ogImage" value={form.ogImage} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
            <input name="github" value={form.github} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
          {saving ? "Đang lưu..." : "Cập nhật cấu hình"}
        </button>
      </form>
    </div>
  );
}
