// src/lib/errorReporter.ts
import { apiClient } from "./api";

/**
 * Reporta un error técnico al backend para que los administradores sean notificados
 */
export async function reportTechnicalIssue(
  issueType: string,
  description: string,
  error?: Error | unknown
): Promise<boolean> {
  try {
    let stackTrace = "";
    
    if (error instanceof Error) {
      stackTrace = error.stack || error.message;
    } else if (error) {
      stackTrace = String(error);
    }

    const response = await apiClient.post("/admin/report-issue", {
      issueType,
      description,
      stackTrace,
    });

    console.log("✅ Problema reportado al equipo técnico");
    return response.data?.ok || false;
  } catch (err) {
    console.error("❌ No se pudo reportar el problema:", err);
    return false;
  }
}

/**
 * Manejador global de errores no capturados
 */
export function setupGlobalErrorReporting() {
  // Capturar errores de JavaScript
  window.addEventListener("error", (event) => {
    console.error("Error global capturado:", event.error);
    
    reportTechnicalIssue(
      "Error de JavaScript",
      `Error en ${event.filename}:${event.lineno}:${event.colno}`,
      event.error
    );
  });

  // Capturar promesas rechazadas no manejadas
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Promise rechazada no manejada:", event.reason);
    
    reportTechnicalIssue(
      "Promise Rechazada",
      "Una operación asíncrona falló sin ser manejada",
      event.reason
    );
  });
}

/**
 * Hook de React para reportar errores desde componentes
 */
export function useErrorReporter() {
  const report = (issueType: string, description: string, error?: Error | unknown) => {
    return reportTechnicalIssue(issueType, description, error);
  };

  return { reportError: report };
}
