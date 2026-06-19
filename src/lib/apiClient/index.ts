import { API_BASE_URL, API_WITH_CREDENTIALS } from "./config";
import { ApiError } from "./error";
import type { ApiClientOptions, ApiResponse, HttpMethod } from "./types";

let cachedToken: string | null = null;
let tokenFetchPromise: Promise<string | null> | null = null;
const TOKEN_CACHE_MS = 4 * 60 * 1000;
let tokenCachedAt = 0;

const getAuthToken = async (): Promise<string | null> => {
  if (cachedToken && Date.now() - tokenCachedAt < TOKEN_CACHE_MS) {
    return cachedToken;
  }
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }
  tokenFetchPromise = (async () => {
    try {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      const token = (session as { accessToken?: string } | null)?.accessToken ?? null;
      cachedToken = token;
      tokenCachedAt = Date.now();
      return token;
    } catch {
      cachedToken = null;
      tokenCachedAt = 0;
      return null;
    } finally {
      tokenFetchPromise = null;
    }
  })();
  return tokenFetchPromise;
};

export const invalidateAuthTokenCache = () => {
  cachedToken = null;
  tokenCachedAt = 0;
};

const normalizeBody = (
  body: ApiClientOptions["body"],
  headers: HeadersInit | undefined,
) => {
  if (!body) {
    return { body: undefined, headers };
  }

  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return { body, headers };
  }

  if (typeof body === "string" || body instanceof Blob) {
    return { body: body as BodyInit, headers };
  }

  const nextHeaders = new Headers(headers);
  if (!nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  return {
    body: JSON.stringify(body),
    headers: nextHeaders,
  };
};

const request = async <T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<ApiResponse<T>> => {
  const method = (options.method ?? "GET") as HttpMethod;

  // ─── External .NET backend ───────────────────────────────────────
  const normalized = normalizeBody(options.body, options.headers);

  // Attach auth token
  const requestHeaders = new Headers(normalized.headers);
  if (options.auth !== false) {
    const token = await getAuthToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: normalized.body,
    credentials: API_WITH_CREDENTIALS ? "include" : "same-origin",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const rawPayload = contentType.includes("application/json")
    ? await response.json()
    : null;

  // ─── Error responses (enveloped or flat) ──────────────────────────
  if (!response.ok) {
    const message =
      rawPayload?.detail ||
      rawPayload?.title ||
      rawPayload?.error ||
      rawPayload?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (rawPayload === null) {
    return { success: true, data: undefined as T };
  }

  // ─── Normalize response format ────────────────────────────────────
  // The .NET backend may return either:
  //   1. Enveloped: { success: boolean, data: T, message?: string }
  //   2. Flat:      the response body IS the data (no wrapper)
  //
  // We auto-wrap flat responses so every caller always receives
  // ApiResponse<T> regardless of backend format.
  let payload: ApiResponse<T>;

  if (typeof rawPayload.success === "boolean") {
    // Already enveloped — validate the success flag
    if (!rawPayload.success) {
      throw new ApiError(
        rawPayload.error || rawPayload.message || "Request failed.",
      );
    }
    payload = rawPayload as ApiResponse<T>;
  } else {
    // Flat response — auto-wrap into ApiResponse envelope
    payload = { success: true, data: rawPayload as T };
  }

  return payload;
};

export const apiClient = {
  get: <T>(path: string, options?: ApiClientOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(
    path: string,
    body?: ApiClientOptions["body"],
    options?: ApiClientOptions,
  ) => request<T>(path, { ...options, method: "POST", body }),
  put: <T>(
    path: string,
    body?: ApiClientOptions["body"],
    options?: ApiClientOptions,
  ) => request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(
    path: string,
    body?: ApiClientOptions["body"],
    options?: ApiClientOptions,
  ) => request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: ApiClientOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export type { ApiResponse };
