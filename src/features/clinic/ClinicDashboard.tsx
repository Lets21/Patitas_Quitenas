import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import ClinicHeader from '@/components/admin/ClinicHeader';

function ClinicDashboard() {
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


  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header de Clínica */}
      <ClinicHeader />

      {/* Contenido Principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Main Content */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Fichas clínicas pendientes de evaluación
          </h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="en-tratamiento">En tratamiento</option>
              <option value="requiere-observacion">Requiere observación</option>
            </select>
          </div>

          {/* Clinical Records Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {clinicalRecords.map((record) => (
              <Card key={record.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl sm:text-2xl">😊</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{record.name}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {record.age} {record.age === 1 ? 'año' : 'años'} • {record.breed}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <Badge variant={record.statusColor as any} size="sm">
                      {record.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-4 space-y-2">
                  <p className="text-sm text-gray-600 truncate">
                    <strong>Fundación:</strong> {record.foundation}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Última revisión:</strong> {new Date(record.lastCheckup).toLocaleDateString()}
                  </p>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-sm sm:text-base">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver ficha clínica
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicDashboard;