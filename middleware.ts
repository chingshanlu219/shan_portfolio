import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_VALUE = "authenticated";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin") {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE);
  if (session?.value !== ADMIN_SESSION_VALUE) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
