"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import SearchBar from "@/components/shared/SearchBar";
import { useAuth } from "@/components/auth/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MobileNavProps {
  links: { href: string; label: string }[];
}

export default function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.data) setUnreadCount(json.data.count);
    } catch {}
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) fetchUnread();
  }, [isAuthenticated, fetchUnread]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
        aria-label={open ? "Đóng menu" : "Mở menu"}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <nav className="flex flex-col p-4 gap-1">
              <div className="mb-3">
                <SearchBar />
              </div>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/yeu-thich"
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Yêu thích
              </Link>

              <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/tai-khoan"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {user?.displayName || user?.username}
                    </Link>
                    <Link
                      href="/lo-trinh"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Lộ trình của tôi
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        fetchUnread();
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Thông báo
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        logout();
                        router.push("/");
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link
                    href="/dang-nhap"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Đăng nhập
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
