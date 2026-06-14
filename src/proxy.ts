import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authProxy = withAuth(
  function proxyHandler(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Explicitly handle public routes FIRST
    if (path === "/company/home") {
      return NextResponse.next();
    }

    // 2. Safely verify token existence BEFORE any role-based access
    if (!token) {
      if (path.startsWith("/company")) {
        return NextResponse.redirect(new URL("/login/company", req.url));
      }
      if (path.startsWith("/job-seeker")) {
        return NextResponse.redirect(new URL("/login/job-seeker", req.url));
      }
      // Safe fallback to prevent hanging routes
      return NextResponse.next();
    }

    // 3. Token is guaranteed to exist. Process role-based authorization safely.
    if (path.startsWith("/company") && token?.role !== "Company") {
      const redirectTarget = token.role === "Seeker" ? "/job-seeker/home" : "/";
      return NextResponse.redirect(new URL(redirectTarget, req.url));
    }

    if (path.startsWith("/job-seeker") && token?.role !== "Seeker") {
      const redirectTarget = token.role === "Company" ? "/company/home" : "/";
      return NextResponse.redirect(new URL(redirectTarget, req.url));
    }

    // 4. Authorized request. Allow pass-through.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

// Cast to Next.js 16 compatible signature (NextFetchEvent was removed in Next.js 15+).
// withAuth internally does not meaningfully use the event parameter, so this cast is safe.
export const proxy = authProxy as (
  req: NextRequest,
) => NextResponse | Promise<NextResponse>;

export const config = {
  matcher: ["/company/:path*", "/job-seeker/:path*"],
};