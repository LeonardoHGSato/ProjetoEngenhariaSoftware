import axios from "axios";

import { STORAGE_KEYS } from "@/context/AuthContext";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const tinhaToken =
        localStorage.getItem(STORAGE_KEYS.token) ??
        sessionStorage.getItem(STORAGE_KEYS.token);

      if (tinhaToken) {
        [localStorage, sessionStorage].forEach((storage) =>
          Object.values(STORAGE_KEYS).forEach((chave) =>
            storage.removeItem(chave),
          ),
        );
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
