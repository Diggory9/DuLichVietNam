"use client";

import { useEffect, useState } from "react";
import { fetchSubscribers, sendNewsletter } from "@/lib/admin-api";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export default function AdminNewsletterPage() {
  const [tab, setTab] = useState<"subscribers" | "send">("subscribers");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Send form
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState("");

  useEffect(() => {
    fetchSubscribers()
      .then((data: unknown) => {
        const d = data as { subscribers: Subscriber[]; activeCount: number };
        setSubscribers(d.subscribers || []);
        setActiveCount(d.activeCount || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSend() {
    if (!subject.trim() || !content.trim()) {
      setSendResult("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }
    if (!confirm(`Gửi newsletter cho ${activeCount} subscribers?`)) return;

    setSending(true);
    setSendResult("");
    try {
      const result = await sendNewsletter(subject, content);
      setSendResult((result as { message: string }).message || "Gửi thành công!");
      setSubject("");
      setContent("");
    } catch (err) {
      setSendResult(err instanceof Error ? err.message : "Lỗi gửi");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Newsletter</h1>

      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setTab("subscribers")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "subscribers" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Danh sách ({activeCount} active)
        </button>
        <button
          onClick={() => setTab("send")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "send" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Gửi Newsletter
        </button>
      </div>

      {tab === "subscribers" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="text-center px-6 py-3 font-medium text-gray-500">Trạng thái</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{s.email}</td>
                  <td className="px-6 py-4 text-center">
                    {s.isActive ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(s.subscribedAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscribers.length === 0 && (
            <p className="text-center text-gray-500 py-8">Chưa có subscriber nào</p>
          )}
        </div>
      )}

      {tab === "send" && (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Tiêu đề email..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung (HTML)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nội dung email (hỗ trợ HTML)..."
                rows={10}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              />
            </div>

            {sendResult && (
              <p className={`text-sm ${sendResult.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
                {sendResult}
              </p>
            )}

            <button
              onClick={handleSend}
              disabled={sending}
              className="bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {sending ? "Đang gửi..." : `Gửi cho ${activeCount} subscribers`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
