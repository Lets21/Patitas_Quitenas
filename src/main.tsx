import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { router } from "./app/routes";
import { queryClient } from "./app/queryClient";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { setupGlobalErrorReporting } from "./lib/errorReporter";
import "./index.css";

// Configurar reporte automático de errores globales
if (import.meta.env.PROD) {
  setupGlobalErrorReporting();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: "12px", background: "#333", color: "#fff" },
          success: { style: { background: "#2E7D32" } },
          error: { style: { background: "#d32f2f" } },
        }}
      />
    </QueryClientProvider>
  </ErrorBoundary>
);
