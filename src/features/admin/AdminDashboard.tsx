import { useState } from 'react';
import { 
  Settings, 
  Users, 
  BarChart3, 
  Bell, 
  Stethoscope, 
  Building, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  Calendar,
  FileText,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos mock para el dashboard de admin
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalAnimals: 156,
    adoptionsThisMonth: 23,
    pendingApplications: 45,
    activeFundations: 8
  };

  const recentUsers = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', role: 'ADOPTANTE', status: 'active', joinDate: '2025-01-15' },
    { id: 2, name: 'María García', email: 'maria@fundacion.com', role: 'FUNDACION', status: 'active', joinDate: '2025-01-14' },
    { id: 3, name: 'Dr. Carlos López', email: 'carlos@clinica.com', role: 'CLINICA', status: 'pending', joinDate: '2025-01-13' },
    { id: 4, name: 'Ana Martínez', email: 'ana@email.com', role: 'ADOPTANTE', status: 'inactive', joinDate: '2025-01-12' }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Servidor de base de datos al 85% de capacidad', time: '2 horas' },
    { id: 2, type: 'info', message: 'Actualización programada para el domingo', time: '1 día' },
    { id: 3, type: 'error', message: 'Fallo en el servicio de notificaciones', time: '30 min' }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'FUNDACION': return 'info';
      case 'CLINICA': return 'warning';
      case 'ADOPTANTE': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'danger';
      default: return 'default';
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
              <p className="text-sm text-gray-600">Panel Administrador</p>
            </div>
          </div>
        </div>

        {/* Navigation para ADMIN - Todas las opciones */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/fundacion')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Building className="w-5 h-5 mr-3 text-gray-400" />
              Fundación
            </button>
            
            <button 
              onClick={() => navigate('/clinica')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Stethoscope className="w-5 h-5 mr-3 text-gray-400" />
              Clínica
            </button>
            
            <button 
              onClick={() => navigate('/analitica')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5 mr-3 text-gray-400" />
              Analítica
            </button>
            
            <button 
              onClick={() => navigate('/notificaciones')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 mr-3 text-gray-400" />
              Notificaciones
            </button>
            
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg">
              <Settings className="w-5 h-5 mr-3" />
              Administración
            </button>
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Administrador</p>
              <p className="text-xs text-gray-500">Sistema Principal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-sm text-gray-600">Gestión completa del sistema AdoptaConCausa</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Reportes
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`border-b-2 py-2 px-1 text-sm font-medium flex items-center ${
                  activeTab === 'overview' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Resumen
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`border-b-2 py-2 px-1 text-sm font-medium flex items-center ${
                  activeTab === 'users' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Usuarios
              </button>
              <button 
                onClick={() => setActiveTab('system')}
                className={`border-b-2 py-2 px-1 text-sm font-medium flex items-center ${
                  activeTab === 'system' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Sistema
              </button>
            </nav>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Usuarios</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                      <p className="text-sm text-green-600">+12% este mes</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Usuarios Activos</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                      <p className="text-sm text-green-600">+8% este mes</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <UserCheck className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Adopciones este mes</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.adoptionsThisMonth}</p>
                      <p className="text-sm text-green-600">+15% vs mes anterior</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* System Alerts */}
              <Card className="p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas del Sistema</h3>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.type === 'error' ? 'text-red-500' : 
                          alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <span className="text-sm text-gray-700">{alert.message}</span>
                      </div>
                      <span className="text-xs text-gray-500">Hace {alert.time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="">Todos los roles</option>
                  <option value="ADOPTANTE">Adoptantes</option>
                  <option value="FUNDACION">Fundaciones</option>
                  <option value="CLINICA">Clínicas</option>
                  <option value="ADMIN">Administradores</option>
                </select>
              </div>

              {/* Users Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">USUARIO</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">ROL</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">ESTADO</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">FECHA REGISTRO</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant={getRoleColor(user.role)} size="sm">
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant={getStatusColor(user.status)} size="sm">
                              {user.status === 'active' ? 'Activo' : 
                               user.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" className="p-2">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="p-2">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="p-2 text-red-600 border-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Sistema
                      </label>
                      <Input defaultValue="AdoptaConCausa" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de Contacto
                      </label>
                      <Input defaultValue="admin@adoptaconcausa.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Límite de Usuarios
                      </label>
                      <Input defaultValue="5000" type="number" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Modo de Mantenimiento
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="false">Desactivado</option>
                        <option value="true">Activado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup Automático
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nivel de Log
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="error">Error</option>
                        <option value="warn">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline">Cancelar</Button>
                  <Button className="bg-green-600 hover:bg-green-700">Guardar Cambios</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;