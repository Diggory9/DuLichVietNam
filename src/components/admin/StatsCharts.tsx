"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import { CATEGORY_LABELS, type Category } from "@/types";

interface DetailedStats {
  topDestinations: { name: string; slug: string; reviewCount: number; averageRating: number }[];
  topPosts: { title: string; slug: string; views: number }[];
  usersByMonth: { month: string; count: number }[];
  postsByMonth: { month: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
}

const PIE_COLORS = ["#3b82f6", "#f97316", "#22c55e", "#a855f7", "#ec4899", "#14b8a6"];

export default function StatsCharts({ data }: { data: DetailedStats }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Users & Posts by month */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Người dùng mới theo tháng</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.usersByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Người dùng" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Phân bố danh mục</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data.categoryDistribution.map((c) => ({
                name: CATEGORY_LABELS[c.category as Category] || c.category,
                value: c.count,
              }))}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
            >
              {data.categoryDistribution.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top destinations */}
      <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
        <h3 className="font-semibold text-gray-900 mb-4">Top 5 địa danh phổ biến</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.topDestinations.slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="reviewCount" fill="#3b82f6" name="Đánh giá" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
