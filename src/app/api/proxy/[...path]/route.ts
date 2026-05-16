import { NextRequest, NextResponse } from "next/server";

/**
 * Catch-all API proxy route.
 *
 * The .NET backend serves HTTP on port 5246 (HTTPS on a different port).
 * The browser cannot directly call the backend because of CORS/SSL issues.
 *
 * This route proxies all requests from the browser through the Next.js server,
 * which can call the backend's HTTP endpoint directly.
 *
 * Browser flow:
 *   http://localhost:3000/api/proxy/Authentication/register-company
 *   → Next.js server
 *   → http://localhost:5246/api/Authentication/register-company
 *   → response back to browser
 *
 * The apiClient uses NEXT_PUBLIC_API_BASE_URL="/api/proxy" so all client-side
 * requests automatically go through this proxy.
 */

const BACKEND_URL = process.env.BACKEND_API_URL ?? "http://localhost:5246/api";

async function proxyRequest(request: NextRequest, method: string) {
  // In Next.js 15+, params is a Promise
  const url = new URL(request.url);
  // Extract the path after /api/proxy/
  const proxyPath = url.pathname.replace(/^\/api\/proxy/, "");
  const backendUrl = `${BACKEND_URL}${proxyPath}${url.search}`;

  // Forward relevant headers
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  const authorization = request.headers.get("authorization");
  if (authorization) {
    headers.set("Authorization", authorization);
  }

  // Forward request body for non-GET methods
  let body: BodyInit | null = null;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  try {
    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    // Build the response, preserving status code
    const responseHeaders = new Headers();
    const respContentType = backendResponse.headers.get("content-type");
    if (respContentType) {
      responseHeaders.set("Content-Type", respContentType);
    }

    // HTTP 204/205 must not include a response body — NextResponse constructor
    // rejects these status codes when a body (even empty) is provided.
    const NO_BODY_STATUS_CODES = new Set([204, 205]);

    if (NO_BODY_STATUS_CODES.has(backendResponse.status)) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[API Proxy] No-content response:", {
          method,
          backendUrl,
          status: backendResponse.status,
        });
      }
      return new NextResponse(null, {
        status: backendResponse.status,
        headers: responseHeaders,
      });
    }

    const responseBody = await backendResponse.arrayBuffer();

    if (!backendResponse.ok && process.env.NODE_ENV !== "production") {
      const bodyText = new TextDecoder().decode(responseBody);
      console.error("[API Proxy] Backend error response:", {
        method,
        backendUrl,
        status: backendResponse.status,
        body: bodyText.slice(0, 2000),
      });
    }

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[API Proxy] Error forwarding request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Backend request failed. Check that the .NET server is running.",
      },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, "PUT");
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, "PATCH");
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, "DELETE");
}
