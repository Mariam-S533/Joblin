import { NextRequestWithAuth, withAuth } from "next-auth/middleware"; 
import { NextResponse } from "next/server";

export default withAuth(
    function proxy(req: NextRequestWithAuth) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        if (path.startsWith("/company") && token?.role !== "Company") {
            return NextResponse.redirect(new URL(token?.role === "Seeker" ? "/job-seeker/home" : "/", req.url));
        }

        if (path.startsWith("/job-seeker") && token?.role !== "Seeker") {
            return NextResponse.redirect(new URL("/company/home", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token, 
        },
    }
);

export const config = {
    matcher: [
        "/company/:path*",    
        "/job-seeker/:path*",  
    ],
};