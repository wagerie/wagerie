import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("wagerie_token")?.value;
  const isAuthenticated = Boolean(token);
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminAuthRoute = request.nextUrl.pathname.startsWith("/admin/auth");

  if (isAdminRoute && !isAdminAuthRoute) {
    return isAuthenticated
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    !isAuthenticated &&
    !isAuthRoute &&
    !isAdminAuthRoute &&
    request.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|assets|_next/static|_next/image|favicon.ico).*)"],
};
