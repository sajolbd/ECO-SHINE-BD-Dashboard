const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-eco-shine-bd.vercel.app";

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

/**
 * Compresses an image file in the browser using HTML5 Canvas to keep uploads ultra fast & small.
 */
export const compressImageFile = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<File> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.size < 150 * 1024) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
