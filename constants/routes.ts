export const API_ROUTES = {
  CHECK_USERNAME: "/auth/check-username",
  SIGNUP: "/auth/signup",
  SIGNIN: "/auth/signin",
  SIGNOUT: "/auth/signout",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_FORGOT_PASSWORD_OTP: "/auth/verify-forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  ADMIN_SIGNIN: "/auth/signin",

  WALLET: "/wallet",
  WALLET_DEPOSIT: "/wallet/deposit",
  WALLET_WITHDRAW: "/wallet/withdraw",
  WALLET_TRANSACTIONS: "/wallet/transactions",

  PRODUCT_CATEGORIES: "/catalog/categories",
  PRODUCTS: "/catalog/products",
  PRODUCT_DETAIL: "/catalog/products/:id",
  PRODUCTS_BY_CATEGORY: "/catalog/categories/:id/products",
  CATEGORY_STATS: "/catalog/categories/:categoryId/stats",
  DRAW_STATS: "/catalog/draws/stats",
  ENROLL_PRODUCT: "/catalog/products/enroll",
  MY_DRAWS: "/catalog/draws/joined",
  WON_DRAWS: "/catalog/draws/won",
  CLAIM_DRAW: "/catalog/draws/:id/claim",

  ADMIN_POLLS: "/admin/polls",
  ADMIN_POLL_BY_ID: "/admin/polls/:id",
  ADMIN_USERS: "/admin/users",
  ADMIN_TRANSACTIONS: "/admin/transactions",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_CATEGORY_BY_ID: "/admin/categories/:id",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCT_BY_ID: "/admin/products/:id",
  ADMIN_PRODUCT_DUPLICATE: "/admin/products/:id/duplicate",
  ADMIN_PRODUCT_SHIPMENT: "/admin/products/:id/shipment",
  ADMIN_PRODUCT_SHIP: "/admin/products/:id/ship",
} as const;

export const APP_ROUTES = {
  HOME: "/",
  HOME_HOW_IT_WORKS: "/#how-it-works",
  HOME_FAQ: "/#faq",
  AUTH_ROOT: "/auth",
  ADMIN_ROOT: "/admin",
  ADMIN_AUTH_ROOT: "/admin/auth",
  ADMIN_LOGIN: "/admin/auth/login",
  ADMIN_PRODUCTS: "/admin/products",
  DRAWS: "/draws",
  DRAW_DETAIL: "/draws/:id",
  CATEGORY_DETAIL: "/categories/:slug",
  WINNERS: "/winners",
  SUPPORT: "/support",
  ABOUT: "/about",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  LOGIN: "/auth/login",
  OTP_VERIFICATION: "/auth/otp-verification",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_FORGOT_PASSWORD: "/auth/verify-forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  POLLS: "/polls",
  POLL_DETAIL: "/polls/:id",
  MY_ENTRIES: "/my-entries",
  TRANSACTIONS: "/transactions",
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

/** Matches a route root without treating similarly prefixed paths as children. */
export function isRouteWithin(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`);
}

/** Matches a concrete pathname against a central :parameter route template. */
export function matchesAppRoute(pathname: string, template: string): boolean {
  const segments = pathname.split("/");
  const expected = template.split("/");
  return (
    segments.length === expected.length &&
    expected.every((segment, index) =>
      segment.startsWith(":")
        ? /^[^/?#]+$/.test(segments[index])
        : segment === segments[index],
    )
  );
}
