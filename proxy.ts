import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("wagerie_token")?.value;
  const adminToken = request.cookies.get("wagerie_admin_token")?.value;
  const isAuthenticated = !!token;
  const isAdmin = !!adminToken;
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // ========== ADMIN ROUTES ==========
  if (isAdminRoute) {
    // If admin route but not authenticated as admin, redirect to admin login
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
    // Admin is authenticated, allow access
    return NextResponse.next();
  }

  // ========== AUTH ROUTES ==========
  // If authenticated and on auth page, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ========== DASHBOARD/CLIENT ROUTES ==========
  // If not authenticated and not on auth page, redirect to login
  if (!isAuthenticated && !isAuthRoute && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Match all routes except static files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
