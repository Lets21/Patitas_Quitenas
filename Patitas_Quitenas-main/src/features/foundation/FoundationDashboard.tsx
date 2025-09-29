import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Dog, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

function FoundationDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Datos mock de perros de la fundación
  const dogs = [
    {
      id: '1',
      name: 'Max',
      age: 2,
      breed: 'Mestizo',
      size: 'Mediano',
      health: ['Vacunado', 'Esterilizado'],
      status: 'Disponible',
      statusColor: 'success'
    },
    {
      id: '2', 
      name: 'Luna',
      age: 1,
      breed: 'Labrador',
      size: 'Grande',
      health: ['Vacunado', 'Esterilizado'],
      status: 'En proceso',
      statusColor: 'warning'
    },
    {
      id: '3',
      name: 'Rocky',
      age: 3,
      breed: 'Pastor Alemán',
      size: 'Grande',
      health: ['Vacunado', 'En tratamiento'],
      status: 'Adoptado',
      statusColor: 'info'
    }
  ];

  const stats = [
    { label: 'Perros Registrados', value: 24, icon: Dog, color: 'text-green-600' },
    { label: 'Solicitudes Activas', value: 8, icon: Activity, color: 'text-yellow-600' },
    { label: 'Adopciones Completadas', value: 16, icon: CheckCircle, color: 'text-blue-600' },
    { label: 'Perros en Espera', value: 8, icon: AlertCircle, color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-xl">
                <Dog className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AdoptaConCausa</h1>
                <p className="text-sm text-gray-600">Panel de Administración</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Fundación PAE</p>
                <p className="text-xs text-gray-500">Panel de Administración</p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button className="border-b-2 border-green-500 py-2 px-1 text-sm font-medium text-green-600 flex items-center">
              <Dog className="h-4 w-4 mr-2" />
              Perros Registrados
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center">
              <span className="h-4 w-4 mr-2">📄</span>
              Solicitudes de Adopción
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Perros registrados por la fundación
            </h2>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Añadir nuevo perro
              </Button>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos los estados</option>
                <option value="disponible">Disponible</option>
                <option value="en-proceso">En proceso</option>
                <option value="adoptado">Adoptado</option>
              </select>
            </div>

            {/* Dogs Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raza / Tamaño</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado de salud</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibilidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dogs.map((dog) => (
                    <tr key={dog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                            <Dog className="h-4 w-4 text-yellow-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{dog.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dog.age} {dog.age === 1 ? 'año' : 'años'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dog.breed} / {dog.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {dog.health.map((health, index) => (
                            <Badge key={index} variant="info" size="sm">
                              {health}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={dog.statusColor as any} size="sm">
                          {dog.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Mostrando 3 de 24 perros
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Anterior</Button>
                <Button size="sm" className="bg-green-600">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Siguiente</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default FoundationDashboard;
