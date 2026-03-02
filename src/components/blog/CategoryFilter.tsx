"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { POST_CATEGORY_LABELS, type PostCategory } from "@/types";

const categories = Object.entries(POST_CATEGORY_LABELS) as [PostCategory, string][];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  function handleClick(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/bai-viet?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleClick("")}
        className={`px-4 py-2 text-sm rounded-full font-medium transition-colors ${
          !active
            ? "bg-primary-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        Tất cả
      </button>
      {categories.map(([value, label]) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          className={`px-4 py-2 text-sm rounded-full font-medium transition-colors ${
            active === value
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
