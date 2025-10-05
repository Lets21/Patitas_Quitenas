import { useState } from 'react';
import { Search, Filter, FileText, Stethoscope, User, CheckCircle, AlertTriangle, Clock, BarChart3, Bell } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';

function ClinicDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Datos mock de fichas clínicas
  const clinicalRecords = [
    {
      id: '1',
      name: 'Max',
      age: 2,
      breed: 'Mestizo',
      foundation: 'Patitas Felices',
      status: 'Disponible',
      statusColor: 'success',
      lastCheckup: '2025-01-15'
    },
    {
      id: '2',
      name: 'Luna',
      age: 1,
      breed: 'Labrador',
      foundation: 'Huellitas de Amor',
      status: 'En tratamiento',
      statusColor: 'warning',
      lastCheckup: '2025-01-10'
    },
    {
      id: '3',
      name: 'Rocky',
      age: 3,
      breed: 'Pastor Alemán',
      foundation: 'Rescate Animal',
      status: 'Requiere observación',
      statusColor: 'danger',
      lastCheckup: '2025-01-05'
    },
    {
      id: '4',
      name: 'Bella',
      age: 4,
      breed: 'Mestizo',
      foundation: 'Patitas Felices',
      status: 'Disponible',
      statusColor: 'success',
      lastCheckup: '2025-01-12'
    },
    {
      id: '5',
      name: 'Toby',
      age: 2,
      breed: 'Beagle',
      foundation: 'Huellitas de Amor',
      status: 'En tratamiento',
      statusColor: 'warning',
      lastCheckup: '2025-01-08'
    },
    {
      id: '6',
      name: 'Coco',
      age: 1,
      breed: 'Mestizo',
      foundation: 'Rescate Animal',
      status: 'Requiere observación',
      statusColor: 'danger',
      lastCheckup: '2025-01-03'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Disponible':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'En tratamiento':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Requiere observación':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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
              <p className="text-sm text-gray-600">Panel Clínica Veterinaria UDLA</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {/* Solo mostrar Analítica y Notificaciones para usuarios CLINICA */}
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
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dr. María Sánchez</p>
              <p className="text-xs text-gray-500">Veterinaria Principal</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Panel Clínica Veterinaria</h1>
              <p className="text-sm text-gray-600">Gestión de fichas clínicas y evaluaciones</p>
            </div>
          </div>
        </div>

        <div className="p-6">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button className="border-b-2 border-green-500 py-2 px-1 text-sm font-medium text-green-600 flex items-center">
              <Stethoscope className="h-4 w-4 mr-2" />
              Fichas Clínicas
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center">
              <span className="h-4 w-4 mr-2">📄</span>
              Solicitudes de Adopción
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center">
              <span className="h-4 w-4 mr-2">💡</span>
              Recomendaciones
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Fichas clínicas pendientes de evaluación
          </h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar perro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="en-tratamiento">En tratamiento</option>
              <option value="requiere-observacion">Requiere observación</option>
            </select>
          </div>

          {/* Clinical Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicalRecords.map((record) => (
              <Card key={record.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">😊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.name}</h3>
                      <p className="text-sm text-gray-600">
                        {record.age} {record.age === 1 ? 'año' : 'años'} • {record.breed}
                      </p>
                    </div>
                  </div>
                  <Badge variant={record.statusColor as any} size="sm">
                    {record.status}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Fundación:</strong> {record.foundation}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Última revisión:</strong> {new Date(record.lastCheckup).toLocaleDateString()}
                  </p>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver ficha clínica
                </Button>
              </Card>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicDashboard;