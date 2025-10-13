// src/app/roleHome.ts
export type AppRole = "ADOPTANTE" | "FUNDACION" | "CLINICA" | "ADMIN";

export const roleHome: Record<AppRole, string> = {
  ADOPTANTE: "/catalog",
  FUNDACION: "/fundacion",
  CLINICA: "/clinica",
  ADMIN: "/admin",
};
