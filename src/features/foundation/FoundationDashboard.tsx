import React, { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Dog,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import FoundationHeader from "@/components/admin/FoundationHeader";
import { useNavigate } from "react-router-dom";

// 🔽 IMPORTAMOS EL HOOK NUEVO
import { useFoundationStats } from "./useFoundationStats";

function FoundationDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const navigate = useNavigate();

  // 📊 1) Traemos las estadísticas reales desde el backend
  const { data, isLoading, isError } = useFoundationStats();

  // 🐶 datos mock de perros (esto todavía es estático, lo integraremos luego)
  const dogs = [
    {
      id: "1",
      name: "Max",
      age: 2,
      breed: "Mestizo",
      size: "Mediano",
      health: ["Vacunado", "Esterilizado"],
      status: "Disponible",
      statusColor: "success",
    },
    {
      id: "2",
      name: "Luna",
      age: 1,
      breed: "Labrador",
      size: "Grande",
      health: ["Vacunado", "Esterilizado"],
      status: "En proceso",
      statusColor: "warning",
    },
    {
      id: "3",
      name: "Rocky",
      age: 3,
      breed: "Pastor Alemán",
      size: "Grande",
      health: ["Vacunado", "En tratamiento"],
      status: "Adoptado",
      statusColor: "info",
    },
  ];

  // ⏳ 2) Mientras cargan stats mostramos algo visualmente limpio
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <FoundationHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-500">
          Cargando estadísticas...
        </div>
      </div>
    );
  }

  // ❌ 3) Si hubo error (por ejemplo token inválido / no hay token)
  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <FoundationHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-red-600">
          No se pudieron cargar las estadísticas de la fundación.
          {/* futuro: aquí podríamos redirigir al login si es 401 */}
        </div>
      </div>
    );
  }

  // ✅ 4) Si llegamos aquí, tenemos data real del backend:
  // data.totalDogs
  // data.activeRequests
  // data.adoptedDogs
  // data.waitingDogs

  return (
    // Corto cualquier overflow horizontal para que no aparezca el “bloque blanco”
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <FoundationHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Perros Registrados */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gray-100 text-green-600`}>
                <Dog className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Perros Registrados
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.totalDogs}
                </p>
              </div>
            </div>
          </Card>

          {/* Solicitudes Activas */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gray-100 text-yellow-600`}>
                <Activity className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Solicitudes Activas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.activeRequests}
                </p>
              </div>
            </div>
          </Card>

          {/* Adopciones Completadas */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gray-100 text-blue-600`}>
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Adopciones Completadas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.adoptedDogs}
                </p>
              </div>
            </div>
          </Card>

          {/* Perros en Espera */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gray-100 text-red-600`}>
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Perros en Espera
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.waitingDogs}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="p-6 overflow-x-clip">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Perros registrados por la fundación
            </h2>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Botón que navega a /fundacion/animales */}
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate("/fundacion/animales")}
              >
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
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perro
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Edad
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Raza / Tamaño
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Estado de salud
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disponibilidad
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dogs.map((dog) => (
                    <tr key={dog.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                            <Dog className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium text-gray-900 block">
                              {dog.name}
                            </span>
                            <span className="text-xs text-gray-500 sm:hidden">
                              {dog.age} {dog.age === 1 ? "año" : "años"} •{" "}
                              {dog.breed}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {dog.age} {dog.age === 1 ? "año" : "años"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        {dog.breed} / {dog.size}
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {dog.health.map((health, index) => (
                            <Badge key={index} variant="info" size="sm">
                              {health}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <Badge variant={dog.statusColor as any} size="sm">
                          {dog.status}
                        </Badge>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1 sm:space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
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
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-700">
                Mostrando 3 de {data.totalDogs} perros
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                <Button variant="outline" size="sm">
                  Anterior
                </Button>
                <Button size="sm" className="bg-green-600">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default FoundationDashboard;
