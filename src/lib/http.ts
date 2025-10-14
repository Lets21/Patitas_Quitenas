import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // <- sale de Vercel
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});
