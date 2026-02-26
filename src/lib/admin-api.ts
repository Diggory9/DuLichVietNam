const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
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

// --- Stats ---

export async function fetchStats() {
  const res = await fetch(`${API_URL}/api/stats`);
  return handleResponse<{
    provinces: number;
    destinations: number;
    categories: number;
    regions: number;
  }>(res);
}
