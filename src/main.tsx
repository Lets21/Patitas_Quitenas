import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
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
    </QueryClientProvider>
  </ErrorBoundary>
);
