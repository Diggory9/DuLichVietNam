"use client";

import { useEffect, useState } from "react";
import { fetchBookings, fetchBookingStats, updateBookingStatus } from "@/lib/admin-api";
import Skeleton from "@/components/ui/Skeleton";

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  revenue: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchBookings(page, statusFilter || undefined, typeFilter || undefined),
      fetchBookingStats(),
    ])
      .then(([bookingData, statsData]) => {
        setBookings(bookingData.bookings as Record<string, unknown>[]);
        setTotalPages(bookingData.pagination.totalPages);
        setStats(statsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter, typeFilter]);

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id || (b._id as string) === id ? { ...b, status } : b))
      );
      // Refresh stats
      fetchBookingStats().then(setStats).catch(() => {});
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi");
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    cancelled: "Đã huỷ",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý đặt chỗ</h1>

      {/* Stats cards */}
      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Tổng", value: stats.total, color: "text-gray-900" },
            { label: "Chờ xác nhận", value: stats.pending, color: "text-yellow-600" },
            { label: "Đã xác nhận", value: stats.confirmed, color: "text-green-600" },
            { label: "Đã huỷ", value: stats.cancelled, color: "text-red-600" },
            { label: "Doanh thu", value: `${stats.revenue.toLocaleString("vi-VN")}₫`, color: "text-primary-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="cancelled">Đã huỷ</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">Tất cả loại</option>
          <option value="hotel">Khách sạn</option>
          <option value="tour">Tour</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Đang tải...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Không có đặt chỗ nào
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Mã</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Loại</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Khách hàng</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Ngày</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Giá</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Trạng thái</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((b) => {
                const id = (b.id || b._id) as string;
                const contact = b.contactInfo as { fullName: string; email: string; phone: string } | undefined;
                return (
                  <tr key={id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{b.bookingCode as string}</td>
                    <td className="px-4 py-3">
                      {b.type === "hotel" ? "🏨 Khách sạn" : "🗺️ Tour"}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{contact?.fullName}</p>
                      <p className="text-xs text-gray-500">{contact?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(b.createdAt as string).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {((b.totalPrice as number) || 0).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[b.status as string] || ""}`}>
                        {statusLabels[b.status as string] || (b.status as string)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(id, "confirmed")}
                            className="text-green-600 hover:underline mr-2"
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => handleStatusChange(id, "cancelled")}
                            className="text-red-500 hover:underline"
                          >
                            Huỷ
                          </button>
                        </>
                      )}
                      {b.status === "confirmed" && (
                        <button
                          onClick={() => handleStatusChange(id, "cancelled")}
                          className="text-red-500 hover:underline"
                        >
                          Huỷ
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded text-sm ${
                page === i + 1 ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
