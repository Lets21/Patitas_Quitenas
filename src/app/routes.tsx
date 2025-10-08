
import { createBrowserRouter } from "react-router-dom";


import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";


import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import AnimalDetailPage from "@/features/animals/AnimalDetailPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AboutPage from "@/pages/AboutPage";


import FoundationDashboard from "@/features/foundation/FoundationDashboard";
import AnimalsCrud from "@/features/foundation/AnimalsCrud";

import ClinicDashboard from "@/features/clinic/ClinicDashboard";

import AnalyticsDashboard from "@/features/analytics/AnalyticsDashboard";
import AdminDashboard from "@/features/admin/AdminDashboard";
import NotificationsPage from "@/features/notifications/NotificationsPage";

import NotFoundPage from "@/features/errors/NotFoundPage";


import { ProtectedRoute } from "@/app/ProtectedRoute";


const ErrorStub = () => <div style={{ padding: 24 }}>Ocurrió un error 😿</div>;

export const router = createBrowserRouter([

  {
    element: <MainLayout />,
    errorElement: <ErrorStub />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/catalog", element: <CatalogPage /> },
      { path: "/adoptar", element: <CatalogPage /> },
      { path: "/adoptar/:animalId", element: <AnimalDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/sobre-nosotros", element: <AboutPage /> },
      { path: "/about", element: <AboutPage /> }, // alias
    ],
  },


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


  {
    path: "/clinica",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["CLINICA"]}>
        <ClinicDashboard />
      </ProtectedRoute>
    ),
  },


  {
    path: "/analitica",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["ADMIN"]}>
        <AnalyticsDashboard />
      </ProtectedRoute>
    ),
  },


  {
    path: "/admin",
    errorElement: <ErrorStub />,
    element: (
      <ProtectedRoute allowed={["ADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },


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
