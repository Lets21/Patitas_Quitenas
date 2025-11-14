import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface FoundationAnimal {
  id: string;
  name: string;
  age: number;
  breed: string;
  size: string;
  gender: string;
  energy: string;
  health: string[];
  status: string;
  statusLabel: string;
  statusColor: string;
  photo: string | null;
  clinicalSummary: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseFoundationAnimalsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

/**
 * Hook para obtener la lista de animales de la fundación
 */
export function useFoundationAnimals(params: UseFoundationAnimalsParams = {}) {
  const { page = 1, limit = 10, search = "", status = "todos" } = params;

  return useQuery<{
    animals: FoundationAnimal[];
    pagination: Pagination;
  }>({
    queryKey: ["foundation-animals", page, limit, search, status],
    queryFn: async () => {
      try {
        console.log("[useFoundationAnimals] Fetching with params:", { page, limit, search, status });
        const data = await apiClient.getFoundationAnimals({
          page,
          limit,
          search,
          status,
        });
        console.log("[useFoundationAnimals] Response data:", data);

        // Asegurarse de que siempre devolvemos un objeto válido
        if (!data) {
          console.warn("[useFoundationAnimals] No data received, returning empty structure");
          return {
            animals: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
          };
        }

        return data;
      } catch (error) {
        console.error("[useFoundationAnimals] Error fetching animals:", error);
        // En caso de error, devolver estructura vacía en lugar de undefined
        return {
          animals: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
        };
      }
    },
    staleTime: 30000, // 30 segundos
    retry: 1, // Solo reintentar una vez
  });
}
