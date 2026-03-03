"use client";

import { useEffect, useState } from "react";
import { fetchUsers, updateUserRole, deleteUser } from "@/lib/admin-api";
import { useToast } from "@/components/ui/ToastProvider";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  displayName?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await fetchUsers(1, filterRole || undefined, search || undefined);
      setUsers((data as { users: User[] }).users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRole]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadUsers();
  }

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as "admin" | "user" } : u))
      );
      toast("Đã cập nhật vai trò", { variant: "success" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi", { variant: "error" });
    }
  }

  async function handleDelete(userId: string, username: string) {
    if (!confirm(`Xoá người dùng "${username}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast("Đã xoá người dùng", { variant: "success" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi", { variant: "error" });
    }
  }

  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý người dùng</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm username/email..."
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 w-64"
          />
          <button type="submit" className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Tìm
          </button>
        </form>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tất cả role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Username</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="text-center px-6 py-3 font-medium text-gray-500">Role</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Ngày tạo</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.displayName || user.username}
                    {user.displayName && (
                      <span className="text-gray-400 text-xs ml-1">({user.username})</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">Không tìm thấy người dùng</p>
          )}
        </div>
      )}
    </div>
  );
}
