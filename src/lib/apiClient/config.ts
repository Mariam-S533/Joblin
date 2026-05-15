/**
 * API Client Configuration
 *
 * Two modes of operation:
 *
 * 1. MOCK mode (NEXT_PUBLIC_USE_MOCK=true)
 *    - All requests are intercepted by the mock router
 *    - No real HTTP requests are made
 *    - Useful for frontend development without any backend
 *
 * 2. External .NET backend mode (NEXT_PUBLIC_USE_MOCK=false)
 *    - Requests go directly to the .NET API at NEXT_PUBLIC_API_BASE_URL
 *    - Auth token is automatically attached from the NextAuth session
 *    - Example: NEXT_PUBLIC_API_BASE_URL=https://localhost:5001/api
 *      Then a call to /CompanyProfile becomes https://localhost:5001/api/CompanyProfile
 */

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/** Base URL for the .NET backend API (e.g. https://localhost:5001/api) */
const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const serverBackendApiBaseUrl =
  process.env.BACKEND_API_URL ??
  (process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")}/api`
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
