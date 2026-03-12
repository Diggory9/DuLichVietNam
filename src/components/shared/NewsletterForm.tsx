"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api-config";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setStatus("success");
      setMessage(json.message || "Đăng ký thành công!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        placeholder="Email của bạn"
        className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {status === "loading" ? "..." : "Đăng ký"}
      </button>
      {status === "success" && (
        <p className="absolute mt-12 text-xs text-green-400">{message}</p>
      )}
      {status === "error" && (
        <p className="absolute mt-12 text-xs text-red-400">{message}</p>
      )}
    </form>
  );
}
