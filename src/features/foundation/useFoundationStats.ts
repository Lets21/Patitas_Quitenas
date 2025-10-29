import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

/**
 * Hook para obtener las estadísticas del dashboard de la fundación.
 * Devuelve:
 *  - totalDogs
 *  - waitingDogs
 *  - adoptedDogs
 *  - activeRequests
 */
export function useFoundationStats() {
  return useQuery({
    queryKey: ["foundation-stats"],
    queryFn: async () => {
      return apiClient.getFoundationStats();
    },
    staleTime: 30_000,
    retry: 1,
  });
}
