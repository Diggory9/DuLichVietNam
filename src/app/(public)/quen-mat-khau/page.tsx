"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { API_URL } from "@/lib/api-config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đã có lỗi xảy ra");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center mb-2">
            Quên mật khẩu
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Nhập email để nhận link đặt lại mật khẩu
          </p>

          {sent ? (
            <div className="text-center">
              <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
                Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại
                mật khẩu. Vui lòng kiểm tra hộp thư (bao gồm thư rác).
              </div>
              <Link
                href="/dang-nhap"
                className="text-primary-600 hover:underline font-medium text-sm"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Nhập email đã đăng ký"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Nhớ mật khẩu?{" "}
                <Link
                  href="/dang-nhap"
                  className="text-primary-600 hover:underline font-medium"
                >
                  Đăng nhập
                </Link>
              </p>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
