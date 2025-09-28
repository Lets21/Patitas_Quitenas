import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Páginas base (estas ya deberían tener export default)
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// Detalle de animal (si no existe aún, comenta esta línea y su ruta)
import AnimalDetailPage from "@/features/animals/AnimalDetailPage";

// Formularios/estado (los dejaremos comentados por ahora)
// import ApplicationWizard from "@/features/application/ApplicationWizard";
// import ApplicationStatusPage from "@/features/application/ApplicationStatusPage";
// import ApplicationChat from "@/features/application/ApplicationChat";

// Fundacion (comentado hasta que existan TODOS y exporten default)
// import FoundationDashboard from "@/features/foundation/FoundationDashboard";
// import RequestsKanban from "@/features/foundation/RequestsKanban";
// import AnimalsCrud from "@/features/foundation/AnimalsCrud";
// import VisitsCalendar from "@/features/foundation/VisitsCalendar";
// import FollowUps from "@/features/foundation/FollowUps";

// Clínica (comentado)
// import ClinicDashboard from "@/features/clinic/ClinicDashboard";
// import ClinicalList from "@/features/clinic/ClinicalList";
// import ClinicalDetail from "@/features/clinic/ClinicalDetail";

// Contratos / Analítica (comentado)
// import ContractPage from "@/features/contracts/ContractPage";
// import AnalyticsDashboard from "@/features/analytics/AnalyticsDashboard";

// Admin (comentado)
// import AdminDashboard from "@/features/admin/AdminDashboard";
// import UsersPage from "@/features/admin/UsersPage";
// import TemplatesPage from "@/features/admin/TemplatesPage";
// import AuditPage from "@/features/admin/AuditPage";
// import SettingsPage from "@/features/admin/SettingsPage";

// Notificaciones y cuenta (comentado)
// import NotificationsCenter from "@/features/notifications/NotificationsCenter";
// import VerifyEmail from "@/features/account/VerifyEmail";
// import ForgotPassword from "@/features/account/ForgotPassword";
// import ResetPassword from "@/features/account/ResetPassword";
// import ProfilePage from "@/features/account/ProfilePage";

// Legales y errores mínimos
// import PrivacyPage from "@/features/legal/PrivacyPage";
// import TermsPage from "@/features/legal/TermsPage";
// import ForbiddenPage from "@/features/errors/ForbiddenPage";
import NotFoundPage from "@/features/errors/NotFoundPage"; // si no existe, crea un stub con export default
// import ServerErrorPage from "@/features/errors/ServerErrorPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },

      // Alias por si tu Home usa /catalog
      { path: "/catalog", element: <CatalogPage /> },

      // Ruta “oficial” del catálogo
      { path: "/adoptar", element: <CatalogPage /> },

      // Detalle del perro (si no tienes el archivo aún, comenta esta línea)
      { path: "/adoptar/:animalId", element: <AnimalDetailPage /> },

      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      // Deja todo esto para después, cuando existan y exporten default
      // { path: "/verificar", element: <VerifyEmail /> },
      // { path: "/olvide", element: <ForgotPassword /> },
      // { path: "/restablecer", element: <ResetPassword /> },
      // { path: "/mi-perfil", element: <ProfilePage /> },
      // { path: "/privacidad", element: <PrivacyPage /> },
      // { path: "/terminos", element: <TermsPage /> },
      // { path: "/403", element: <ForbiddenPage /> },
      // { path: "/500", element: <ServerErrorPage /> },
    ],
  },

  // Todo el dashboard queda en pausa hasta que tengas sus archivos listos
  {
    element: <DashboardLayout />,
    children: [
      // { path: "/solicitud/nueva/:animalId", element: <ApplicationWizard /> },
      // { path: "/solicitudes/:id", element: <ApplicationStatusPage /> },
      // { path: "/solicitudes/:id/mensajes", element: <ApplicationChat /> },

      // { path: "/fundacion", element: <FoundationDashboard /> },
      // { path: "/fundacion/solicitudes", element: <RequestsKanban /> },
      // { path: "/fundacion/animales", element: <AnimalsCrud /> },
      // { path: "/fundacion/visitas", element: <VisitsCalendar /> },
      // { path: "/fundacion/seguimientos", element: <FollowUps /> },

      // { path: "/clinica", element: <ClinicDashboard /> },
      // { path: "/clinica/pendientes", element: <ClinicalList /> },
      // { path: "/clinica/:animalId", element: <ClinicalDetail /> },

      // { path: "/contratos/:id", element: <ContractPage /> },
      // { path: "/analitica", element: <AnalyticsDashboard /> },

      // { path: "/admin", element: <AdminDashboard /> },
      // { path: "/admin/usuarios", element: <UsersPage /> },
      // { path: "/admin/plantillas", element: <TemplatesPage /> },
      // { path: "/admin/auditoria", element: <AuditPage /> },
      // { path: "/admin/config", element: <SettingsPage /> },

      // { path: "/notificaciones", element: <NotificationsCenter /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
