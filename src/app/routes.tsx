// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Público
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import AnimalDetailPage from "@/pages/AnimalDetailPage";
import LoginPublicPage from "@/pages/LoginPublic";
import LoginAdminPage from "@/pages/LoginAdmin";
import RegisterPage from "@/pages/RegisterPage";
import AboutPage from "@/pages/AboutPage";
// Legal
import TermsPage from "@/features/legal/TermsPage";
import PrivacyPage from "@/features/legal/PrivacyPage";
// Info
import ProcessPage from "@/pages/ProcessPage";
import FAQPage from "@/pages/FAQPage";
// Adoptante
import AdoptApplyPage from "@/pages/AdoptApplyPage";
import MyApplicationsPage from "@/pages/MyApplicationsPage";

// Fundación
import FoundationDashboard from "@/features/foundation/FoundationDashboard";
import AnimalsCrud from "@/features/foundation/AnimalsCrud";
import FoundationApplicationsPage from "@/features/foundation/Applications"; // ⬅️ NUEVO
import FoundationAnalytics from "@/features/foundation/FoundationAnalytics";

// Clínica / Analítica / Admin
import ClinicDashboard from "@/features/clinic/ClinicDashboard";
import AnalyticsDashboard from "@/features/analytics/AnalyticsDashboard";
import AdminDashboard from "@/features/admin/AdminDashboard";
import AdminOverview from "@/features/admin/AdminOverview";
import UsersPage from "@/features/admin/UsersPage";
import SettingsPage from "@/features/admin/SettingsPage";
import AdminLayout from "@/layouts/AdminLayout";

// Notificaciones
import NotificationsPage from "@/features/notifications/NotificationsPage";
import ClinicNotificationsPage from "@/features/clinic/ClinicNotificationsPage";

import NotFoundPage from "@/features/errors/NotFoundPage";

// Protecciones
import { ProtectedRoute } from "@/app/ProtectedRoute";

const ErrorStub = () => <div style={{ padding: 24 }}>Ocurrió un error 😿</div>;

export const router = createBrowserRouter([
  // =========================
  // Rutas públicas
  // =========================
  {
    element: <MainLayout />,
    errorElement: <ErrorStub />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/catalog", element: <CatalogPage /> },
      { path: "/catalogo", element: <CatalogPage /> },
      { path: "/adoptar", element: <CatalogPage /> },
      { path: "/adoptar/:animalId", element: <AnimalDetailPage /> },

      // Adoptante
      {
        path: "/adoptar/:animalId/aplicar",
        element: (
          <ProtectedRoute allowed={["ADOPTANTE"]}>
            <AdoptApplyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mis-solicitudes",
        element: (
          <ProtectedRoute allowed={["ADOPTANTE"]}>
            <MyApplicationsPage />
          </ProtectedRoute>
        ),
      },

      // Logins / registro / info
      { path: "/login", element: <LoginPublicPage /> },
      { path: "/admin/login", element: <LoginAdminPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/sobre-nosotros", element: <AboutPage /> },
      { path: "/about", element: <AboutPage /> },
      
      // Legal
      { path: "/terminos", element: <TermsPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/privacidad", element: <PrivacyPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      
      // Info
      { path: "/process", element: <ProcessPage /> },
      { path: "/proceso", element: <ProcessPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/preguntas", element: <FAQPage /> },
    ],
  },

  // =========================
  // Fundación (usa DashboardLayout con <Outlet/>)
  // ADMIN también puede acceder
  // =========================
  {
    element: (
      <ProtectedRoute allowed={["FUNDACION", "ADMIN"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorStub />,
    children: [
      { path: "/fundacion", element: <FoundationDashboard /> },             // resumen
      { path: "/fundacion/animales", element: <AnimalsCrud /> },            // perros
      { path: "/fundacion/solicitudes", element: <FoundationApplicationsPage /> }, // solicitudes
      { path: "/fundacion/estadisticas", element: <FoundationAnalytics /> }, // estadísticas
    ],
  },

  // =========================
  // Clínica
  // ADMIN también puede acceder
  // =========================
  {
    path: "/clinica",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["CLINICA", "ADMIN"]}>
        <ClinicDashboard />
      </ProtectedRoute>
    ),
  },

  // =========================
  // Analítica (Admin)
  // =========================
  {
    path: "/analitica",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AnalyticsDashboard />,
      },
    ],
  },

  // =========================
  // Admin
  // =========================
  {
    path: "/admin",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminOverview /> },
      { path: "usuarios", element: <UsersPage /> },
      { path: "sistema", element: <SettingsPage /> },
    ],
  },

  // =========================
  // Notificaciones
  // =========================
  {
    path: "/notificaciones",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["FUNDACION"]}>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/clinica/notificaciones",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["CLINICA"]}>
        <ClinicNotificationsPage />
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <NotFoundPage /> },
]);
