"use client";

import { useEffect, useState } from "react";
import { fetchContacts, markContactRead, markContactUnread, deleteContact } from "@/lib/admin-api";
import { useToast } from "@/components/ui/ToastProvider";

type Filter = "all" | "unread" | "read";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { toast } = useToast();

  function load() {
    setLoading(true);
    const readParam = filter === "unread" ? false : filter === "read" ? true : undefined;
    fetchContacts(readParam)
      .then((data) => setContacts(data as Record<string, unknown>[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Lỗi"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filter]);

  async function handleToggleRead(id: string, currentRead: boolean) {
    try {
      if (currentRead) {
        await markContactUnread(id);
      } else {
        await markContactRead(id);
      }
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, read: !currentRead } : c))
      );
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi", { variant: "error" });
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Xoá liên hệ từ "${name}"?`)) return;
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast("Đã xoá liên hệ", { variant: "success" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi xoá", { variant: "error" });
    }
  }

  if (loading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "unread", label: "Chưa đọc" },
    { key: "read", label: "Đã đọc" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý liên hệ</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Họ tên</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Chủ đề</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Ngày</th>
              <th className="text-center px-6 py-3 font-medium text-gray-500">Trạng thái</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contacts.map((c) => (
              <tr
                key={c.id as string}
                className={`hover:bg-gray-50 ${!(c.read as boolean) ? "bg-blue-50/50" : ""}`}
              >
                <td className={`px-6 py-4 ${!(c.read as boolean) ? "font-bold text-gray-900" : "text-gray-700"}`}>
                  {c.name as string}
                </td>
                <td className="px-6 py-4 text-gray-500">{c.email as string}</td>
                <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{c.subject as string}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(c.createdAt as string).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-center">
                  {c.read ? (
                    <span className="text-xs text-gray-500">Đã đọc</span>
                  ) : (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Chưa đọc</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleToggleRead(c.id as string, c.read as boolean)}
                    className="text-primary-600 hover:underline"
                  >
                    {c.read ? "Đánh chưa đọc" : "Đánh đã đọc"}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id as string, c.name as string)}
                    className="text-red-600 hover:underline"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <p className="text-center text-gray-500 py-8">Không có liên hệ nào</p>
        )}
      </div>
    </div>
  );
}
