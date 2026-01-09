// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Layout público
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

// Páginas públicas
import { HomePage } from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Admin
import AdminLayout from "./layouts/AdminLayout"; // <- el layout que renderiza <AdminHeader />
import LoginAdmin from "./pages/LoginAdmin";     // si tu login admin es distinto

const queryClient = new QueryClient();

// Shell para envolver las páginas públicas con Header/Footer
function PublicShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Rutas públicas con Header/Footer */}
          <Route element={<PublicShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Recuperación de contraseña (sin Header/Footer) */}
          <Route path="/olvide" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Login del panel admin (sin Header/Footer públicos) */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Rutas del panel admin con header por rol */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Ejemplos; cambia por tus páginas reales */}
            <Route index element={<div>Dashboard</div>} />
            <Route path="mascotas" element={<div>Gestión de mascotas</div>} />
            <Route path="usuarios" element={<div>Usuarios</div>} />
          </Route>
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: "12px", background: "#333", color: "#fff" },
            success: { style: { background: "#2E7D32" } },
            error: { style: { background: "#d32f2f" } },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
