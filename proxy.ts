import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Session = {
  authenticated: boolean;
  user?: { role: "user" | "admin" };
};

async function getSession(request: NextRequest): Promise<Session | null> {
  const configuredApiBaseUrl =
    process.env.WAGERIE_API_INTERNAL_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8080/api"
      : "/api");
  const apiBaseUrl = /^https?:\/\//.test(configuredApiBaseUrl)
    ? configuredApiBaseUrl
    : new URL(configuredApiBaseUrl, request.url).toString().replace(/\/$/, "");

  try {
    const response = await fetch(`${apiBaseUrl}/auth/session`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as Session;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const session = await getSession(request);
  const isAuthenticated = session?.authenticated === true;
  const isAdmin = session?.user?.role === "admin";
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminAuthRoute = request.nextUrl.pathname.startsWith("/admin/auth");

  if (isAdminRoute && !isAdminAuthRoute) {
    return isAdmin
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};