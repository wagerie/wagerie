import { getCookie } from "@/hooks/use-cookies";
import axios from "axios";
import { mockApiInterceptor } from "./mock-api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add mock API interceptor (if USE_MOCK_API is enabled)
api.interceptors.request.use(
  (config) => {
    return mockApiInterceptor(config);
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a request interceptor to add the auth token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = getCookie("wagerie_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
