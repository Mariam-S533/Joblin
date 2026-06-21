/**
 * API Client Configuration
 *
 * All requests go directly to the .NET backend at NEXT_PUBLIC_API_BASE_URL.
 * Auth token is automatically attached from the NextAuth session.
 * Example: NEXT_PUBLIC_API_BASE_URL=/api/proxy
 *   Then a call to /Company is proxied to the .NET backend.
 */

/** Base URL for the .NET backend API (e.g. https://localhost:5001/api) */
const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const serverBackendApiBaseUrl =
  process.env.BACKEND_API_URL ??
  (process.env.NEXTAUTH_URL 
    ? `${process.env.NEXTAUTH_URL .replace(/\/$/, "")}/api`
    : "");

export const API_BASE_URL =
  typeof window === "undefined" && serverBackendApiBaseUrl
    ? serverBackendApiBaseUrl
    : typeof window === "undefined" && rawApiBaseUrl.startsWith("/")
      ? `${process.env.NEXTAUTH_URL ?? ""}${rawApiBaseUrl}`
      : rawApiBaseUrl;

/**
 * Whether to include credentials (cookies) with cross-origin requests.
 * Enable this when using cookie-based auth with the .NET backend.
 */
export const API_WITH_CREDENTIALS =
  process.env.NEXT_PUBLIC_API_WITH_CREDENTIALS === "true";
