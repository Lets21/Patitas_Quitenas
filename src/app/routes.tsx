// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Guards
import RequireAuth from "@/app/guards/RequireAuth";
import RequireRole from "@/app/guards/RequireRole";

// Páginas públicas
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// Detalle (si aún no existe, comenta import y ruta)
import AnimalDetailPage from "@/features/animals/AnimalDetailPage";

// Dashboards
import FoundationDashboard from "@/features/foundation/FoundationDashboard";
import ClinicDashboard from "@/features/clinic/ClinicDashboard";

// Errores
import NotFoundPage from "@/features/errors/NotFoundPage";
import ForbiddenPage from "@/features/errors/ForbiddenPage"; // crea un stub si no existe

export const router = createBrowserRouter([
  // PÚBLICO
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/catalog", element: <CatalogPage /> },
      { path: "/adoptar", element: <CatalogPage /> },
      { path: "/adoptar/:animalId", element: <AnimalDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/403", element: <ForbiddenPage /> }, // útil para redirecciones del guard
    ],
  },

  // PRIVADO (requiere sesión)
  {
    element: <RequireAuth />, // si no hay user -> /login
    children: [
      {
        element: <DashboardLayout />, // tu layout con sidebar
        children: [
          // CLÍNICA (solo rol CLINICA)
          {
            element: <RequireRole allowed={["CLINICA"]} />,
            children: [
              { path: "/clinica", element: <ClinicDashboard /> },
              // cuando tengas más vistas de clínica, agrégalas aquí
              // { path: "/clinica/pendientes", element: <ClinicalList /> },
              // { path: "/clinica/:animalId", element: <ClinicalDetail /> },
            ],
          },

          // FUNDACIÓN (solo rol FUNDACION)
          {
            element: <RequireRole allowed={["FUNDACION"]} />,
            children: [
              { path: "/fundacion", element: <FoundationDashboard /> },
              // { path: "/fundacion/animales", element: <AnimalsCrud /> },
              // { path: "/fundacion/solicitudes", element: <RequestsKanban /> },
              // { path: "/fundacion/visitas", element: <VisitsCalendar /> },
              // { path: "/fundacion/seguimientos", element: <FollowUps /> },
            ],
          },

          // ADMIN (cuando lo actives)
          // {
          //   element: <RequireRole allowed={["ADMIN"]} />,
          //   children: [
          //     { path: "/admin", element: <AdminDashboard /> },
          //     ...
          //   ],
          // },

          // ANALÍTICA (decide quién entra)
          // {
          //   element: <RequireRole allowed={["ADMIN","FUNDACION","CLINICA"]} />,
          //   children: [{ path: "/analitica", element: <AnalyticsDashboard /> }],
          // },

          // NOTIFICACIONES (si es común a cualquier usuario logueado, puedes ponerla sin RequireRole)
          // { path: "/notificaciones", element: <NotificationsCenter /> },
        ],
      },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);
