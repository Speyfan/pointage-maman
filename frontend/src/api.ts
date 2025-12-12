// src/api.ts

// Si VITE_API_BASE_URL n'est pas défini, on utilise "/api" (pratique en prod derrière Nginx)
const RAW_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api";

// on enlève les / à la fin pour éviter "//api"
const API_BASE_URL = RAW_BASE.replace(/\/+$/, "");

const API_KEY = (import.meta.env.VITE_API_KEY as string | undefined) || "pointage-maman-secret";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const message = text || res.statusText || "Erreur API";
    throw new Error(`Erreur API (${res.status}): ${message}`);
  }

  if (res.status === 204) {
    // @ts-expect-error
    return null;
  }

  return (await res.json()) as T;
}

export const api = {
  get:  <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    apiFetch<T>(path, { method: "DELETE" }),
};
