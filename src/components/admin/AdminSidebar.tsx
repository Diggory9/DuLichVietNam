"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/provinces", label: "Tỉnh thành", icon: "🗺️" },
  { href: "/admin/destinations", label: "Địa danh", icon: "📍" },
  { href: "/admin/posts", label: "Bài viết", icon: "📝" },
  { href: "/admin/contacts", label: "Liên hệ", icon: "📬" },
  { href: "/admin/comments", label: "Bình luận", icon: "💬" },
  { href: "/admin/reviews", label: "Đánh giá", icon: "⭐" },
  { href: "/admin/stories", label: "Câu chuyện", icon: "📖" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "📧" },
  { href: "/admin/users", label: "Người dùng", icon: "👥" },
  { href: "/admin/site-config", label: "Cấu hình", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin" className="text-lg font-bold">
          Admin Panel
        </Link>
        <p className="text-sm text-gray-400 mt-1">Du Lịch Việt Nam</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium">{user?.username}</p>
            <p className="text-gray-400 text-xs">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
        <Link
          href="/"
          className="mt-3 block text-center text-xs text-gray-400 hover:text-white transition-colors py-2 border border-gray-700 rounded"
        >
          Xem trang chủ
        </Link>
      </div>
    </aside>
  );
}
