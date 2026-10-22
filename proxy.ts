import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ROUTES, isRouteWithin, matchesAppRoute } from "@/constants/routes";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("wagerie_token")?.value;
  const isAuthenticated = Boolean(token);
  const pathname = request.nextUrl.pathname;
  const isPublicRoute =
    [
      APP_ROUTES.HOME,
      APP_ROUTES.DRAWS,
      APP_ROUTES.WINNERS,
      APP_ROUTES.SUPPORT,
      APP_ROUTES.ABOUT,
      APP_ROUTES.TERMS,
      APP_ROUTES.PRIVACY,
    ].some((route) => route === pathname) ||
    matchesAppRoute(pathname, APP_ROUTES.DRAW_DETAIL) ||
    matchesAppRoute(pathname, APP_ROUTES.CATEGORY_DETAIL);
  const isAuthRoute = isRouteWithin(pathname, APP_ROUTES.AUTH_ROOT);
  const isAdminRoute = isRouteWithin(pathname, APP_ROUTES.ADMIN_ROOT);
  const isAdminAuthRoute = isRouteWithin(pathname, APP_ROUTES.ADMIN_AUTH_ROOT);

  if (isAdminRoute && !isAdminAuthRoute) {
    return isAuthenticated
      ? NextResponse.next()
      : NextResponse.redirect(new URL(APP_ROUTES.ADMIN_LOGIN, request.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
  }

  if (!isAuthenticated && !isAuthRoute && !isAdminAuthRoute && !isPublicRoute) {
    const loginUrl = new URL(APP_ROUTES.LOGIN, request.url);
    if (matchesAppRoute(pathname, APP_ROUTES.POLL_DETAIL)) {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|assets|_next/static|_next/image|favicon.ico).*)"],
};
