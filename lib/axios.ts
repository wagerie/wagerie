import { APP_ROUTES, isRouteWithin } from "@/constants/routes";
import { getCookie, removeCookie } from "@/hooks/use-cookies";
import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = getCookie("wagerie_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Allow browser to automatically set Content-Type with boundary for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    delete config.headers.common?.["Content-Type"];
  }
  return config;
});

export default client;

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      const isAdminRoute = isRouteWithin(path, APP_ROUTES.ADMIN_ROOT);
      const isProtected =
        [
          APP_ROUTES.DASHBOARD,
          APP_ROUTES.POLLS,
          APP_ROUTES.MY_ENTRIES,
          APP_ROUTES.TRANSACTIONS,
          APP_ROUTES.PROFILE,
        ].some((route) => isRouteWithin(path, route)) ||
        (isAdminRoute && !isRouteWithin(path, APP_ROUTES.ADMIN_AUTH_ROOT));
      if (isProtected) {
        removeCookie("wagerie_token");
        const login = isAdminRoute ? APP_ROUTES.ADMIN_LOGIN : APP_ROUTES.LOGIN;
        window.location.replace(
          `${login}?expired=1&next=${encodeURIComponent(path)}`,
        );
      }
    }
    return Promise.reject(error);
  },
);
