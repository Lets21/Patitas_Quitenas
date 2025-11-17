import axios from "axios";
import { useAuthStore } from "./auth";

// Normaliza la URL base para incluir /api/v1
const RAW_URL = (import.meta.env.VITE_API_URL || "").trim();
const ORIGIN = (RAW_URL || "http://localhost:4000").replace(/\/+$/, "");
const API_BASE = ORIGIN.endsWith("/api/v1") ? ORIGIN : `${ORIGIN}/api/v1`;

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

// Interceptor para agregar el token a cada request
http.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
