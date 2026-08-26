const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ua-engineering-pte-ltd-backend-production.up.railway.app";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function fetchAPI<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // Read token from localStorage on client-side
  let token = options.token;
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `সার্ভার ভুল উত্তর দিয়েছে (Status ${response.status}): ${text.substring(0, 120)}`
    );
  }

  if (!response.ok) {
    throw new Error(data?.message || `API Error (${response.status})`);
  }

  return data;
}

export const getApiUrl = () => API_URL;
