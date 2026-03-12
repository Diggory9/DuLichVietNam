import type { Review, ReviewTargetType } from "@/types";
import { API_URL } from "@/lib/api-config";

function getToken(): string {
  return localStorage.getItem("dulichvietnam_token") || "";
}

export async function getReviews(
  targetType: ReviewTargetType,
  targetSlug: string
): Promise<Review[]> {
  const res = await fetch(
    `${API_URL}/api/reviews/${targetType}/${targetSlug}`
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Lỗi tải đánh giá");
  return json.data;
}

export async function createReview(data: {
  targetType: ReviewTargetType;
  targetSlug: string;
  rating: number;
  content?: string;
}): Promise<Review> {
  const res = await fetch(`${API_URL}/api/reviews/authenticated`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Lỗi gửi đánh giá");
  return json.data;
}
