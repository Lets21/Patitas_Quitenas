import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

/**
 * Hook para obtener estadísticas avanzadas y analytics de la fundación.
 */
export function useFoundationAnalytics() {
  return useQuery({
    queryKey: ["foundation-analytics"],
    queryFn: async () => {
      return apiClient.getFoundationAnalytics();
    },
    staleTime: 60_000, // 1 minuto
    retry: 1,
  });
}
