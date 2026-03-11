import type { Booking, PaginatedResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken(): string {
  return localStorage.getItem("dulichvietnam_token") || "";
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function createBooking(data: {
  type: "hotel" | "tour";
  hotelSlug?: string;
  roomName?: string;
  tourSlug?: string;
  checkIn?: string;
  checkOut?: string;
  tourDate?: string;
  guests: number;
  contactInfo: { fullName: string; email: string; phone: string };
  notes?: string;
}): Promise<Booking> {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Lỗi tạo đặt chỗ");
  return json.data;
}

export async function getMyBookings(page = 1): Promise<PaginatedResponse<Booking>> {
  const res = await fetch(`${API_URL}/api/bookings/my?page=${page}`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Lỗi tải đặt chỗ");
  return { data: json.data, pagination: json.pagination };
}

export async function getBookingByCode(code: string): Promise<Booking> {
  const res = await fetch(`${API_URL}/api/bookings/my/${code}`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Không tìm thấy đặt chỗ");
  return json.data;
}

export async function cancelBooking(code: string, reason?: string): Promise<Booking> {
  const res = await fetch(`${API_URL}/api/bookings/my/${code}/cancel`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Lỗi huỷ đặt chỗ");
  return json.data;
}
