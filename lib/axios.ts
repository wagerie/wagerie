import axios from "axios";
import { mockApiInterceptor } from "./mock-api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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

export default api;
