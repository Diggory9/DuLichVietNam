const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken(): string {
  return localStorage.getItem("dulichvietnam_token") || "";
}

export async function createPaymentUrl(
  bookingCode: string
): Promise<{ paymentUrl: string }> {
  const res = await fetch(`${API_URL}/api/payments/create-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ bookingCode }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Lỗi tạo thanh toán");
  return json.data;
}

export async function checkRoomAvailability(
  hotelSlug: string,
  roomName: string,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean; minAvailable: number }> {
  const params = new URLSearchParams({
    hotelSlug,
    roomName,
    checkIn,
    checkOut,
  });
  const res = await fetch(`${API_URL}/api/room-inventory/check?${params}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Lỗi kiểm tra phòng trống");
  return json.data;
}
