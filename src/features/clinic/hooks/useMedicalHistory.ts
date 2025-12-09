// frontend/src/features/clinic/hooks/useMedicalHistory.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { MedicalHistory, Animal } from "@/types";
import { toast } from "react-hot-toast";

/**
 * Hook para obtener lista de animales (para dashboard de clínica)
 */
export function useClinicAnimals() {
  return useQuery({
    queryKey: ["clinic", "animals"],
    queryFn: async () => {
      const res = await apiClient.getClinicAnimals();
      return res.data.animals;
    },
  });
}

/**
 * Hook para obtener historial médico de un animal (solo para clínica)
 */
export function useMedicalHistory(animalId: string) {
  return useQuery({
    queryKey: ["clinic", "medical-history", animalId],
    queryFn: async () => {
      const res = await apiClient.getMedicalHistory(animalId);
      // El backend ahora retorna null si no existe, no lanza error 404
      return res.data;
    },
    enabled: !!animalId,
    staleTime: 60000, // Los datos se consideran frescos por 1 minuto
    cacheTime: 300000, // Mantener en caché por 5 minutos
    refetchOnWindowFocus: false, // No refetch al cambiar de ventana
    refetchOnMount: false, // No refetch si ya hay datos en caché
    retry: false, // No reintentar si falla (evita delays innecesarios)
  });
}

/**
 * Hook para guardar/actualizar historial médico
 */
export function useSaveMedicalHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      animalId,
      data,
    }: {
      animalId: string;
      data: Partial<MedicalHistory>;
    }) => {
      const res = await apiClient.saveMedicalHistory(animalId, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["clinic", "medical-history", variables.animalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["public", "medical-history", variables.animalId],
      });
      toast.success("Historial médico guardado correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al guardar historial médico");
    },
  });
}

/**
 * Hook para obtener historial médico público (para página de detalle del animal)
 */
export function usePublicMedicalHistory(animalId: string) {
  return useQuery({
    queryKey: ["public", "medical-history", animalId],
    queryFn: async () => {
      const res = await apiClient.getPublicMedicalHistory(animalId);
      return res.data;
    },
    enabled: !!animalId,
  });
}

