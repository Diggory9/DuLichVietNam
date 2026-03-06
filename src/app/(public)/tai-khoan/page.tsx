"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import BadgeDisplay from "@/components/badges/BadgeDisplay";
import { useAuth } from "@/components/auth/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AccountPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
      return;
    }
    setDisplayName(user?.displayName || "");
    setBio(user?.bio || "");
    setAvatar(user?.avatar || "");
    setIsPublicProfile(user?.isPublicProfile || false);

    // Fetch favorites
    fetch(`${API_URL}/api/users/me/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setFavorites(json.data);
      })
      .catch(() => {});

    // Fetch badges
    fetch(`${API_URL}/api/users/me/badges`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBadges(json.data.map((b: { id: string }) => b.id));
      })
      .catch(() => {});
  }, [isAuthenticated, user, token, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/users/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName, bio, avatar, isPublicProfile }),
      });
      const json = await res.json();
      if (res.ok) {
        updateProfile({ displayName, bio, avatar, isPublicProfile });
        setMessage("Đã cập nhật thành công!");
      } else {
        setMessage(json.message || "Cập nhật thất bại");
      }
    } catch {
      setMessage("Lỗi kết nối");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
            Tài khoản
          </h1>

          {/* Profile info */}
          <div className="rounded-xl border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin cá nhân</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Tên đăng nhập</span>
                <span className="font-medium text-gray-900">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vai trò</span>
                <span className="font-medium text-gray-900">
                  {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hiển thị
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="Nhập tên hiển thị"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Giới thiệu bản thân
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow resize-none"
                  placeholder="Viết vài dòng giới thiệu..."
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                  URL ảnh đại diện
                </label>
                <input
                  id="avatar"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="https://..."
                />
                {avatar && (
                  <img
                    src={avatar}
                    alt="Avatar preview"
                    className="mt-2 w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPublicProfile(!isPublicProfile)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isPublicProfile ? "bg-primary-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                      isPublicProfile ? "translate-x-5" : ""
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">
                  Hiện profile công khai
                </span>
              </div>

              {isPublicProfile && (
                <Link
                  href={`/nguoi-dung/${user?.username}`}
                  className="inline-block text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Xem profile công khai
                </Link>
              )}

              {message && (
                <p className={`text-sm ${message.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </form>
          </div>

          {/* Badges */}
          <div className="rounded-xl border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Huy hiệu ({badges.length})
            </h2>
            <BadgeDisplay badges={badges} />
          </div>

          {/* Favorites */}
          <div className="rounded-xl border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Yêu thích ({favorites.length})
            </h2>
            {favorites.length === 0 ? (
              <p className="text-sm text-gray-500">Bạn chưa yêu thích địa danh nào.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {favorites.map((slug) => (
                  <Link
                    key={slug}
                    href={`/dia-danh/${slug}`}
                    className="px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                  >
                    {slug}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </Container>
    </section>
  );
}
