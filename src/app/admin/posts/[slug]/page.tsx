"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { fetchPost, updatePost } from "@/lib/admin-api";

export default function EditPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost(slug)
      .then((d) => setData(d as Record<string, unknown>))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-gray-500">Đang tải...</div>;
  if (error)
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
    );
  if (!data) return <div className="text-gray-500">Không tìm thấy</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sửa: {data.title as string}
      </h1>
      <PostForm
        initialData={data}
        onSubmit={(formData) => updatePost(slug, formData)}
        isEdit
      />
    </div>
  );
}
