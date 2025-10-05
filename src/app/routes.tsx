// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Público
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import AnimalDetailPage from "@/features/animals/AnimalDetailPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AboutPage from "@/pages/AboutPage";

// Dashboards / features
import FoundationDashboard from "@/features/foundation/FoundationDashboard";
import AnimalsCrud from "@/features/foundation/AnimalsCrud";

import ClinicDashboard from "@/features/clinic/ClinicDashboard";

import AnalyticsDashboard from "@/features/analytics/AnalyticsDashboard";
import AdminDashboard from "@/features/admin/AdminDashboard";
import NotificationsPage from "@/features/notifications/NotificationsPage";

import NotFoundPage from "@/features/errors/NotFoundPage";


// Protecciones
import { ProtectedRoute } from "./ProtectedRoute";


export const router = createBrowserRouter([
  // Rutas públicas
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/catalog", element: <CatalogPage /> },
      { path: "/adoptar", element: <CatalogPage /> },
      { path: "/adoptar/:animalId", element: <AnimalDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/sobre-nosotros", element: <AboutPage /> },
      { path: "/about", element: <AboutPage /> },   // <— alias
      // NADA de /fundacion/animales aquí. Eso es privado.
    ],
  },

  // Área Fundación (sidebar de dashboard)
  {
    element: (
      <ProtectedRoute allowed={["FUNDACION"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/fundacion", element: <FoundationDashboard /> },
      { path: "/fundacion/animales", element: <AnimalsCrud /> },
      // más rutas privadas de fundación aquí...
    ],
  },

  // Clínica (cada dashboard ya pinta su propio layout, así que sin DashboardLayout)
  {
    path: "/clinica",
    element: (
      <ProtectedRoute allowed={["CLINICA"]}>
        <ClinicDashboard />
      </ProtectedRoute>
    ),
  },

  // Analítica (ajusta allowed según política; aquí solo ADMIN para no llorar luego)
  {
    path: "/analitica",
    element: (
      <ProtectedRoute allowed={["ADMIN"]}>
        <AnalyticsDashboard />
      </ProtectedRoute>
    ),
  },

  // Admin
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowed={["ADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

  // Notificaciones: si es global, protégelo al menos para usuarios logeados;
  // si es solo para rol X, cámbialo en allowed
  {
    path: "/notificaciones",
    element: (
      <ProtectedRoute allowed={["ADOPTANTE", "FUNDACION", "CLINICA", "ADMIN"]}>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <NotFoundPage /> },
]);
