"use client";

import PostForm from "@/components/admin/PostForm";
import { createPost } from "@/lib/admin-api";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Thêm bài viết mới
      </h1>
      <PostForm onSubmit={createPost} />
    </div>
  );
}
