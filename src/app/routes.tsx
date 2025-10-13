// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Público
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import AnimalDetailPage from "@/features/animals/AnimalDetailPage";
import LoginPublicPage from "@/pages/LoginPublic";   // ⬅️ nuevo
import LoginAdminPage from "@/pages/LoginAdmin";     // ⬅️ nuevo
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
import { ProtectedRoute } from "@/app/ProtectedRoute";

// Error Element simple (usa el tuyo si ya tienes uno)
const ErrorStub = () => <div style={{ padding: 24 }}>Ocurrió un error 😿</div>;

export const router = createBrowserRouter([
  // Rutas públicas
  {
    element: <MainLayout />,
    errorElement: <ErrorStub />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/catalog", element: <CatalogPage /> },
      { path: "/adoptar", element: <CatalogPage /> },
      { path: "/adoptar/:animalId", element: <AnimalDetailPage /> },

      // ⬇️ Logins separados
      { path: "/login", element: <LoginPublicPage /> },  // Adoptantes
      { path: "/admin/login", element: <LoginAdminPage /> }, // Fundación / Clínica / Admin

      { path: "/register", element: <RegisterPage /> },
      { path: "/sobre-nosotros", element: <AboutPage /> },
      { path: "/about", element: <AboutPage /> }, // alias
    ],
  },

  // Área Fundación (sidebar de dashboard)
  {
    element: (
      <ProtectedRoute allowed={["FUNDACION"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorStub />,
    children: [
      { path: "/fundacion", element: <FoundationDashboard /> },
      { path: "/fundacion/animales", element: <AnimalsCrud /> },
    ],
  },

  // Clínica (cada dashboard pinta su propio layout)
  {
    path: "/clinica",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["CLINICA"]}>
        <ClinicDashboard />
      </ProtectedRoute>
    ),
  },

  // Analítica (ADMIN)
  {
    path: "/analitica",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["ADMIN"]}>
        <AnalyticsDashboard />
      </ProtectedRoute>
    ),
  },

  // Admin
  {
    path: "/admin",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["ADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

  // Notificaciones (logueado en cualquier rol)
  {
    path: "/notificaciones",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["ADOPTANTE", "FUNDACION", "CLINICA", "ADMIN"]}>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <NotFoundPage /> },
]);
