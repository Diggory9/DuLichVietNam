import { API_URL } from "@/lib/api-config";
const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || "dulichvietnam-revalidate-2026";

async function revalidateFrontend() {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "x-revalidate-secret": REVALIDATE_SECRET },
    });
  } catch {
    // Ignore revalidation errors
  }
}

function getToken(): string {
  return localStorage.getItem("admin_token") || "";
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi không xác định");
  return data.data;
}

// --- Provinces ---

export async function fetchProvinces() {
  const res = await fetch(`${API_URL}/api/provinces`);
  return handleResponse<unknown[]>(res);
}

export async function fetchProvince(slug: string) {
  const res = await fetch(`${API_URL}/api/provinces/${slug}`);
  return handleResponse(res);
}

export async function createProvince(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/provinces`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateProvince(
  slug: string,
  data: Record<string, unknown>
) {
  const res = await fetch(`${API_URL}/api/provinces/${slug}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteProvince(slug: string) {
  const res = await fetch(`${API_URL}/api/provinces/${slug}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Destinations ---

export async function fetchDestinations() {
  const res = await fetch(`${API_URL}/api/destinations`);
  return handleResponse<unknown[]>(res);
}

export async function fetchDestination(slug: string) {
  const res = await fetch(`${API_URL}/api/destinations/${slug}`);
  return handleResponse(res);
}

export async function createDestination(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/destinations`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateDestination(
  slug: string,
  data: Record<string, unknown>
) {
  const res = await fetch(`${API_URL}/api/destinations/${slug}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteDestination(slug: string) {
  const res = await fetch(`${API_URL}/api/destinations/${slug}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Site Config ---

export async function fetchSiteConfig() {
  const res = await fetch(`${API_URL}/api/site-config`);
  return handleResponse(res);
}

export async function updateSiteConfig(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/site-config`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Upload ---

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/api/upload/single`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse<{ url: string }>(res);
}

export async function uploadImages(
  files: File[]
): Promise<{ url: string }[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/api/upload/multiple`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse<{ url: string }[]>(res);
}

// --- Posts ---

export async function fetchPosts() {
  const res = await fetch(`${API_URL}/api/posts/admin/all`, {
    headers: authHeaders(),
  });
  return handleResponse<unknown[]>(res);
}

export async function fetchPost(slug: string) {
  const res = await fetch(`${API_URL}/api/posts/${slug}`);
  return handleResponse(res);
}

export async function createPost(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updatePost(
  slug: string,
  data: Record<string, unknown>
) {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deletePost(slug: string) {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Contacts ---

export async function fetchContacts(read?: boolean) {
  const query = read !== undefined ? `?read=${read}` : "";
  const res = await fetch(`${API_URL}/api/contacts/admin/all${query}`, {
    headers: authHeaders(),
  });
  return handleResponse<unknown[]>(res);
}

export async function markContactRead(id: string) {
  const res = await fetch(`${API_URL}/api/contacts/${id}/read`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function markContactUnread(id: string) {
  const res = await fetch(`${API_URL}/api/contacts/${id}/unread`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function deleteContact(id: string) {
  const res = await fetch(`${API_URL}/api/contacts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// --- Comments ---

export async function fetchComments(postSlug?: string) {
  const query = postSlug ? `?postSlug=${postSlug}` : "";
  const res = await fetch(`${API_URL}/api/comments/admin/all${query}`, {
    headers: authHeaders(),
  });
  return handleResponse<unknown[]>(res);
}

export async function deleteComment(id: string) {
  const res = await fetch(`${API_URL}/api/comments/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// --- Reviews ---

export async function fetchReviews(destinationSlug?: string) {
  const query = destinationSlug ? `?destinationSlug=${destinationSlug}` : "";
  const res = await fetch(`${API_URL}/api/reviews/admin/all${query}`, {
    headers: authHeaders(),
  });
  return handleResponse<unknown[]>(res);
}

export async function deleteReview(id: string) {
  const res = await fetch(`${API_URL}/api/reviews/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// --- Newsletter ---

export async function fetchSubscribers() {
  const res = await fetch(`${API_URL}/api/newsletter/admin/all`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi");
  return { subscribers: data.data, activeCount: data.activeCount };
}

export async function sendNewsletter(subject: string, content: string) {
  const res = await fetch(`${API_URL}/api/newsletter/admin/send`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ subject, content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi gửi");
  return data;
}

// --- Users ---

export async function fetchUsers(page = 1, role?: string, q?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (role) params.set("role", role);
  if (q) params.set("q", q);
  const res = await fetch(`${API_URL}/api/admin/users?${params}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi");
  return { users: data.data, pagination: data.pagination };
}

export async function updateUserRole(id: string, role: string) {
  const res = await fetch(`${API_URL}/api/admin/users/${id}/role`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ role }),
  });
  return handleResponse(res);
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// --- Bulk Actions ---

export async function bulkUpdatePosts(slugs: string[], action: string) {
  const res = await fetch(`${API_URL}/api/posts/admin/bulk`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ slugs, action }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi");
  await revalidateFrontend();
  return data;
}

export async function bulkDeleteComments(ids: string[]) {
  const res = await fetch(`${API_URL}/api/comments/admin/bulk`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ ids }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi");
  return data;
}

// --- Stories (Admin) ---

export async function fetchAdminStories(page = 1, status?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set("status", status);
  const res = await fetch(`${API_URL}/api/admin/stories?${params}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi");
  return { stories: data.data, pagination: data.pagination };
}

export async function updateStoryStatus(id: string, status: "approved" | "rejected") {
  const res = await fetch(`${API_URL}/api/admin/stories/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Hotels ---

export async function fetchHotels() {
  const res = await fetch(`${API_URL}/api/hotels?limit=100`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi");
  return data.data;
}

export async function fetchHotel(slug: string) {
  const res = await fetch(`${API_URL}/api/hotels/${slug}`);
  return handleResponse(res);
}

export async function createHotel(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/hotels`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateHotel(slug: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/hotels/${slug}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteHotel(slug: string) {
  const res = await fetch(`${API_URL}/api/hotels/${slug}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Tours ---

export async function fetchTours() {
  const res = await fetch(`${API_URL}/api/tours?limit=100`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi");
  return data.data;
}

export async function fetchTour(slug: string) {
  const res = await fetch(`${API_URL}/api/tours/${slug}`);
  return handleResponse(res);
}

export async function createTour(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/tours`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateTour(slug: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/tours/${slug}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteTour(slug: string) {
  const res = await fetch(`${API_URL}/api/tours/${slug}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Bookings (Admin) ---

export async function fetchBookings(page = 1, status?: string, type?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set("status", status);
  if (type) params.set("type", type);
  const res = await fetch(`${API_URL}/api/bookings/admin/all?${params}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi");
  return { bookings: data.data, pagination: data.pagination };
}

export async function updateBookingStatus(id: string, status: string, reason?: string) {
  const res = await fetch(`${API_URL}/api/bookings/admin/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, reason }),
  });
  return handleResponse(res);
}

export async function fetchBookingStats() {
  const res = await fetch(`${API_URL}/api/bookings/admin/stats`, {
    headers: authHeaders(),
  });
  return handleResponse<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    revenue: number;
  }>(res);
}

// --- Stats ---

export async function fetchDetailedStats() {
  const res = await fetch(`${API_URL}/api/stats/detailed`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchStats() {
  const res = await fetch(`${API_URL}/api/stats`);
  return handleResponse<{
    provinces: number;
    destinations: number;
    posts: number;
    categories: number;
    regions: number;
    unreadContacts: number;
    comments: number;
    reviews: number;
    hotels: number;
    tours: number;
    bookings: number;
  }>(res);
}
