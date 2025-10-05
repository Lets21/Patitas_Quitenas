import { useState } from 'react';
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
  Filter,
  ArrowLeft,
  BarChart3,
  Building,
  Settings
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';

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
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userRole = user?.role || 'CLINICA';
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'adoption' | 'clinical' | 'system'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'adoption',
      title: 'Nueva solicitud de adopción',
      message: 'Juan Rodríguez ha enviado una solicitud para adoptar a Max',
      timestamp: '2025-01-15T10:30:00Z',
      isRead: false,
      priority: 'high',
      actionUrl: '/adopciones/solicitud/1',
      metadata: {
        animalName: 'Max',
        userName: 'Juan Rodríguez'
      }
    },
    {
      id: '2',
      type: 'clinical',
      title: 'Ficha clínica completada',
      message: 'La evaluación médica de Luna ha sido completada por Dr. María Sánchez',
      timestamp: '2025-01-15T09:15:00Z',
      isRead: false,
      priority: 'medium',
      actionUrl: '/clinica/ficha/2',
      metadata: {
        animalName: 'Luna',
        clinicName: 'Clínica Veterinaria UDLA'
      }
    },
    {
      id: '3',
      type: 'adoption',
      title: 'Adopción exitosa',
      message: 'Bella ha sido adoptada exitosamente por la familia Méndez',
      timestamp: '2025-01-14T16:45:00Z',
      isRead: true,
      priority: 'medium',
      metadata: {
        animalName: 'Bella',
        userName: 'Familia Méndez'
      }
    },
    {
      id: '4',
      type: 'system',
      title: 'Actualización del sistema',
      message: 'El sistema se actualizará el próximo domingo a las 2:00 AM',
      timestamp: '2025-01-14T14:20:00Z',
      isRead: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'alert',
      title: 'Recordatorio de seguimiento',
      message: 'Rocky requiere una revisión de seguimiento en 3 días',
      timestamp: '2025-01-14T11:30:00Z',
      isRead: false,
      priority: 'high',
      actionUrl: '/clinica/seguimiento/5',
      metadata: {
        animalName: 'Rocky'
      }
    },
    {
      id: '6',
      type: 'clinical',
      title: 'Vacunación pendiente',
      message: 'Toby necesita completar su esquema de vacunación',
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

  // Info de usuario según rol
  const getUserInfo = () => {
    switch (userRole) {
      case 'ADMIN':
        return { initials: 'AD', name: 'Administrador', role: 'Sistema Principal', bgColor: 'bg-red-500' };
      case 'FUNDACION':
        return { initials: 'FP', name: 'Fundación PAE', role: 'Coordinador', bgColor: 'bg-blue-500' };
      case 'CLINICA':
      default:
        return { initials: 'MS', name: 'Dr. María Sánchez', role: 'Veterinaria Principal', bgColor: 'bg-green-500' };
    }
  };

  const userInfo = getUserInfo();

  // Navegación según rol
  const renderNavigation = () => {
    if (userRole === 'ADMIN') {
      return (
        <>
          <button onClick={() => navigate('/fundacion')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Building className="w-5 h-5 mr-3 text-gray-400" />
            Fundación
          </button>
          <button onClick={() => navigate('/clinica')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Stethoscope className="w-5 h-5 mr-3 text-gray-400" />
            Clínica
          </button>
          <button onClick={() => navigate('/analitica')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <BarChart3 className="w-5 h-5 mr-3 text-gray-400" />
            Analítica
          </button>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg">
            <Bell className="w-5 h-5 mr-3" />
            Notificaciones
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button onClick={() => navigate('/admin')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 mr-3 text-gray-400" />
            Administración
          </button>
        </>
      );
    }

    return (
      <>
        {userRole === 'CLINICA' && (
          <button onClick={() => navigate('/clinica')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Stethoscope className="w-5 h-5 mr-3 text-gray-400" />
            Clínica
          </button>
        )}
        {userRole === 'FUNDACION' && (
          <button onClick={() => navigate('/fundacion')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Building className="w-5 h-5 mr-3 text-gray-400" />
            Fundación
          </button>
        )}
        <button onClick={() => navigate('/analitica')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <BarChart3 className="w-5 h-5 mr-3 text-gray-400" />
          Analítica
        </button>
        <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg">
          <Bell className="w-5 h-5 mr-3" />
          Notificaciones
          {unreadCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </button>
      </>
    );
  };

  const getBackRoute = () => {
    switch (userRole) {
      case 'ADMIN': return '/admin';
      case 'FUNDACION': return '/fundacion';
      case 'CLINICA':
      default: return '/clinica';
    }
  };

  const getBackLabel = () => {
    switch (userRole) {
      case 'ADMIN': return 'Volver a Admin';
      case 'FUNDACION': return 'Volver a Fundación';
      case 'CLINICA':
      default: return 'Volver a Clínica';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r flex flex-col">
        {/* Header del Sidebar */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-xl">
              <span className="text-white font-bold text-lg">?</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AdoptaConCausa</h1>
              <p className="text-sm text-gray-600">
                {userRole === 'ADMIN' ? 'Panel Administrador' : userRole === 'FUNDACION' ? 'Panel Fundación' : 'Panel Clínica Veterinaria UDLA'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">{renderNavigation()}</div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${userInfo.bgColor} rounded-full flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{userInfo.initials}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
              <p className="text-xs text-gray-500">{userInfo.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate(getBackRoute())} className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getBackLabel()}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0
                    ? `${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                    : 'Todas las notificaciones están al día'}
                </p>
              </div>
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

        <div className="p-6">
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
                    onClick={() => setFilter('adoption')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'adoption' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Adopciones
                  </button>
                  <button
                    onClick={() => setFilter('clinical')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'clinical' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Clínicas
                  </button>
                  <button
                    onClick={() => setFilter('system')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'system' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                          {notification.metadata?.animalName && <span>Animal: {notification.metadata.animalName}</span>}
                          {notification.metadata?.userName && <span>Usuario: {notification.metadata.userName}</span>}
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
    </div>
  );
}

export default NotificationsPage;
