"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        href="/dang-nhap"
        className="ml-1 px-3 py-1.5 text-[13px] font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
      >
        Đăng nhập
      </Link>
    );
  }

  const initial = (user?.displayName || user?.username || "U").charAt(0).toUpperCase();

  return (
    <div className="relative ml-1" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center hover:bg-primary-200 transition-colors"
        aria-label="Menu tài khoản"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.displayName || user?.username}
            </p>
            <p className="text-xs text-gray-400">
              {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
            </p>
          </div>
          <Link
            href="/tai-khoan"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Tài khoản
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Quản trị
            </Link>
          )}
          <button
            onClick={() => {
              setOpen(false);
              logout();
              router.push("/");
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
