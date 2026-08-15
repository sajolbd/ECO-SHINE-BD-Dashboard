const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong with the request.");
  }

  return data;
}

export const getApiUrl = () => API_URL;
