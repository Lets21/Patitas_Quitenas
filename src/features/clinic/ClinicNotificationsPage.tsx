import { useState } from 'react';
import { 
  Bell, 
  Check, 
  X, 
  Stethoscope, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Clock,
  Filter,
  FileText,
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import ClinicHeader from '@/components/admin/ClinicHeader';

interface ClinicNotification {
  id: string;
  type: 'clinical' | 'appointment' | 'treatment' | 'system' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    animalName?: string;
    patientId?: string;
    appointmentDate?: string;
    treatmentType?: string;
  };
}

function ClinicNotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'clinical' | 'appointment' | 'treatment'>('all');
  const [notifications, setNotifications] = useState<ClinicNotification[]>([
    {
      id: '1',
      type: 'clinical',
      title: 'Nueva ficha clínica pendiente',
      message: 'Max requiere evaluación médica completa - Ficha clínica pendiente de revisión',
      timestamp: '2025-01-15T10:30:00Z',
      isRead: false,
      priority: 'high',
      actionUrl: '/clinica/ficha/1',
      metadata: {
        animalName: 'Max',
        patientId: 'PAT-001'
      }
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Cita programada para mañana',
      message: 'Luna tiene cita de seguimiento programada para el 16 de enero a las 10:00 AM',
      timestamp: '2025-01-15T09:15:00Z',
      isRead: false,
      priority: 'medium',
      actionUrl: '/clinica/cita/2',
      metadata: {
        animalName: 'Luna',
        appointmentDate: '2025-01-16T10:00:00Z'
      }
    },
    {
      id: '3',
      type: 'treatment',
      title: 'Tratamiento completado',
      message: 'Rocky ha completado exitosamente su tratamiento de desparasitación',
      timestamp: '2025-01-14T16:45:00Z',
      isRead: true,
      priority: 'medium',
      metadata: {
        animalName: 'Rocky',
        treatmentType: 'Desparasitación'
      }
    },
    {
      id: '4',
      type: 'system',
      title: 'Actualización del sistema clínico',
      message: 'El sistema de gestión clínica se actualizará el próximo domingo a las 2:00 AM',
      timestamp: '2025-01-14T14:20:00Z',
      isRead: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'alert',
      title: 'Recordatorio de vacunación',
      message: 'Bella necesita completar su esquema de vacunación - Segunda dosis pendiente',
      timestamp: '2025-01-14T11:30:00Z',
      isRead: false,
      priority: 'high',
      actionUrl: '/clinica/vacunacion/5',
      metadata: {
        animalName: 'Bella'
      }
    },
    {
      id: '6',
      type: 'clinical',
      title: 'Resultados de laboratorio disponibles',
      message: 'Los resultados de laboratorio de Toby están listos para revisión',
      timestamp: '2025-01-13T15:10:00Z',
      isRead: true,
      priority: 'medium',
      metadata: {
        animalName: 'Toby'
      }
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'clinical':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-green-600" />;
      case 'treatment':
        return <Stethoscope className="w-5 h-5 text-purple-600" />;
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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.isRead;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de Clínica */}
      <ClinicHeader />

      {/* Contenido Principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header de Notificaciones */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notificaciones Clínicas</h1>
              <p className="text-sm text-gray-600">
                {unreadCount > 0
                  ? `${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                  : 'Todas las notificaciones están al día'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Sin leer ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('clinical')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'clinical' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Fichas Clínicas
                </button>
                <button
                  onClick={() => setFilter('appointment')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'appointment' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Citas
                </button>
                <button
                  onClick={() => setFilter('treatment')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'treatment' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Tratamientos
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
                className={`p-4 transition-all hover:shadow-md ${!notification.isRead ? 'border-l-4 border-l-green-500 bg-green-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        <Badge size="sm" variant={getPriorityVariant(notification.priority)}>
                          {notification.priority === 'high' ? 'Alta' : notification.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.metadata?.animalName && <span>Paciente: {notification.metadata.animalName}</span>}
                        {notification.metadata?.appointmentDate && <span>Cita: {new Date(notification.metadata.appointmentDate).toLocaleDateString()}</span>}
                        {notification.metadata?.treatmentType && <span>Tratamiento: {notification.metadata.treatmentType}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {notification.actionUrl && (
                      <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                        Ver detalles
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

export default ClinicNotificationsPage;
