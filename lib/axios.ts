import { getCookie } from "@/hooks/use-cookies";
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
