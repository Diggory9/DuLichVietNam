"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { API_URL } from "@/lib/api-config";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const { login: setAuthFromToken } = useAuth();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đã có lỗi xảy ra");
      }

      setSuccess(true);

      // Auto-login after 2 seconds
      if (data.data?.token) {
        localStorage.setItem("dulichvietnam_token", data.data.token);
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 2000);
      }
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
            Đặt lại mật khẩu
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>

          {success ? (
            <div className="text-center">
              <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
                Đặt lại mật khẩu thành công! Đang chuyển hướng...
              </div>
              <Link
                href="/dang-nhap"
                className="text-primary-600 hover:underline font-medium text-sm"
              >
                Đăng nhập ngay
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
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Mật khẩu mới
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Ít nhất 6 ký tự"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <Link
                  href="/quen-mat-khau"
                  className="text-primary-600 hover:underline font-medium"
                >
                  Gửi lại link
                </Link>
                {" · "}
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
