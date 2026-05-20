// Tiny API client. Calls relative paths (/api, /auth) — same origin in production
// (nginx routes them to the Java backend), proxied by Next rewrites in standalone.

const TOKEN_KEY = "uni_token";
const ME_KEY = "uni_me";

export type Me = { userName: string; role: string };

export const tokenStore = {
  get: (): string | null =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ME_KEY);
  },
};

export const meStore = {
  get: (): Me | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(ME_KEY);
    return raw ? (JSON.parse(raw) as Me) : null;
  },
  set: (m: Me) => localStorage.setItem(ME_KEY, JSON.stringify(m)),
};

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers, cache: "no-store" });

  if (res.status === 401 && typeof window !== "undefined") {
    tokenStore.clear();
    if (!window.location.pathname.startsWith("/login")) window.location.href = "/login";
    throw new ApiError(401, "Session expired — please log in again.");
  }

  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const b = body as { message?: string; validationErrors?: Record<string, string> } | null;
    throw new ApiError(res.status, b?.message || `Request failed (${res.status})`, b?.validationErrors);
  }
  return body as T;
}
