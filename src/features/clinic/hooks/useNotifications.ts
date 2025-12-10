// frontend/src/features/clinic/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export interface Notification {
  id: string;
  type: 'adoption' | 'clinical' | 'system' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    animalName?: string;
    userName?: string;
    clinicName?: string;
  };
}

/**
 * Hook para obtener notificaciones (funciona para FUNDACION y CLINICA)
 */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await apiClient.getNotifications();
      // Transformar las notificaciones del backend al formato del frontend
      return (res.notifications || []).map((n: any) => ({
        id: n._id || n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        timestamp: n.timestamp,
        isRead: n.isRead || false,
        priority: n.priority || 'low',
        actionUrl: n.actionUrl,
        metadata: n.metadata || {}
      })) as Notification[];
    },
    staleTime: 30000, // Los datos se consideran frescos por 30 segundos
    refetchOnWindowFocus: true, // Refetch al cambiar de ventana para obtener nuevas notificaciones
  });
}

/**
 * Hook para marcar una notificación como leída
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiClient.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      // Invalidar y refetch las notificaciones para actualizar el estado
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook para marcar todas las notificaciones como leídas
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await apiClient.markAllNotificationsAsRead();
    },
    onSuccess: () => {
      // Invalidar y refetch las notificaciones para actualizar el estado
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

