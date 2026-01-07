import { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  X, 
  Heart, 
  Stethoscope, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import FoundationHeader from '@/components/admin/FoundationHeader';
import { apiClient } from '@/lib/api';

interface Notification {
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

function NotificationsPage() {
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'adoption' | 'clinical' | 'system'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await apiClient.getNotifications();
        console.log('[NotificationsPage] Fetched notifications:', data);
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications.map((n: any) => ({
            id: n._id,
            type: n.type,
            title: n.title,
            message: n.message,
            timestamp: n.timestamp,
            isRead: n.isRead,
            priority: n.priority,
            actionUrl: n.actionUrl,
            metadata: n.metadata
          })));
        }
      } catch (err) {
        console.error('[NotificationsPage] Error fetching notifications:', err);
      }
    }
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'adoption':
        return <Heart className="w-5 h-5 text-green-600" />;
      case 'clinical':
        return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'system':
        return <Info className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityVariant = (priority: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error('[NotificationsPage] Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error('[NotificationsPage] Error marking all as read:', err);
    }
  };

  const deleteNotification = (id: string) => {
    // Esta funcionalidad no está implementada en el backend, solo actualiza el estado local
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.isRead;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header de Fundación */}
      <FoundationHeader />

      {/* Contenido Principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header de Notificaciones */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notificaciones</h1>
              <p className="text-sm text-gray-600">
                {unreadCount > 0
                  ? `${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                  : 'Todas las notificaciones están al día'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Marcar todas como leídas</span>
                  <span className="sm:hidden">Marcar todas</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <div className="flex overflow-x-auto space-x-2 pb-2 sm:pb-0">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === 'unread' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Sin leer ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('adoption')}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === 'adoption' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Adopciones
                </button>
                <button
                  onClick={() => setFilter('clinical')}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === 'clinical' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Clínicas
                </button>
                <button
                  onClick={() => setFilter('system')}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === 'system' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Sistema
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Notificaciones */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
              <p className="text-gray-600">
                {filter === 'unread' ? 'Todas las notificaciones están marcadas como leídas' : 'No tienes notificaciones en este momento'}
              </p>
            </Card>
          ) : (
            filteredNotifications.map(notification => (
              <Card
                key={notification.id}
                className={`p-3 sm:p-4 transition-all hover:shadow-md ${!notification.isRead ? 'border-l-4 border-l-green-500 bg-green-50' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-sm font-medium truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>}
                        </div>
                        <div className="self-start sm:self-center">
                          <Badge size="sm" variant={getPriorityVariant(notification.priority)}>
                            {notification.priority === 'high' ? 'Alta' : notification.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notification.message}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.metadata?.animalName && <span className="truncate">Animal: {notification.metadata.animalName}</span>}
                        {notification.metadata?.userName && <span className="truncate">Usuario: {notification.metadata.userName}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:justify-start space-x-2 sm:ml-4">
                    {notification.actionUrl && (
                      <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 text-xs sm:text-sm">
                        <span className="hidden sm:inline">Ver detalles</span>
                        <span className="sm:hidden">Ver</span>
                      </Button>
                    )}

                    {!notification.isRead && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)} className="p-2">
                        <Check className="w-4 h-4" />
                      </Button>
                    )}

                    <Button variant="outline" size="sm" onClick={() => deleteNotification(notification.id)} className="p-2 text-red-600 border-red-600 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
