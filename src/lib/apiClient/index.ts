import { API_BASE_URL, USE_MOCK, API_WITH_CREDENTIALS } from "./config";
import { ApiError } from "./error";
import { mockRouter } from "./mockRouter";
import type { ApiClientOptions, ApiResponse, HttpMethod } from "./types";

/**
 * Retrieve the current auth token so it can be attached to requests
 * going to the external .NET backend.
 *
 * The token is read on every request so it's always fresh.
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    return (session as { accessToken?: string } | null)?.accessToken ?? null;
  } catch {
    return null;
  }
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

  // ─── Mock mode ───────────────────────────────────────────────────
  if (USE_MOCK) {
    const payload = await mockRouter<T>(path, { ...options, method });
    if (!payload.success) {
      throw new ApiError(payload.error || payload.message || "Request failed.");
    }
    return payload;
  }

  // ─── External .NET backend ───────────────────────────────────────
  const normalized = normalizeBody(options.body, options.headers);

  // Attach auth token
  const requestHeaders = new Headers(normalized.headers);
  const token = await getAuthToken();
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: normalized.body,
    credentials: API_WITH_CREDENTIALS ? "include" : "same-origin",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as ApiResponse<T>)
    : null;

  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (!payload) {
    throw new ApiError("Empty response from server.", response.status);
  }

  if (!payload.success) {
    throw new ApiError(payload.error || payload.message || "Request failed.");
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
