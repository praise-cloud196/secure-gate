import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimitByKey } from "@/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Rate limit POST /api/auth/callback/credentials (NextAuth signin)
  if (method === "POST" && path === "/api/auth/callback/credentials") {
    const ip = getClientIp(request);
    const { success } = await rateLimitByKey(
      `signin:${ip}`,
      5,
      10 * 60 * 1000
    );
    if (!success) {
      return new NextResponse("Too many requests", { status: 429 });
    }
  }

  const token = await getToken({ req: request });

  if (token && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (path.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/auth/callback/credentials",
  ],
};
