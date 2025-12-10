// frontend/src/features/clinic/hooks/useClinicApplications.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Application } from "@/types";

/**
 * Hook para obtener todas las solicitudes de adopción (para clínica - solo lectura)
 */
export function useClinicApplications() {
  return useQuery({
    queryKey: ["clinic-adoption-requests"],
    queryFn: async () => {
      const res = await apiClient.getClinicApplications();
      return res.applications || [];
    },
    staleTime: 30000, // 30 segundos
    cacheTime: 300000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

