import React, { useState, useEffect } from "react";
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
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import FoundationHeader from "@/components/admin/FoundationHeader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// 🔽 IMPORTAMOS LOS HOOKS
import { useFoundationStats } from "./useFoundationStats";
import { useFoundationAnimals } from "./useFoundationAnimals";
import { urlFromBackend, apiClient } from "@/lib/api";

function FoundationDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  // Estado para confirmación de eliminación
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    animalId?: string;
    animalName?: string;
  }>({ isOpen: false });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Estado para modal de vista rápida
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    animal?: any;
  }>({ isOpen: false });

  // Debounce del search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset a página 1 cuando se busca
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset página cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  // 📊 1) Traemos las estadísticas reales desde el backend
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useFoundationStats();

  // 🐶 2) Traemos los animales reales con paginación y filtros
  const { 
    data: animalsData, 
    isLoading: animalsLoading, 
    isError: animalsError 
  } = useFoundationAnimals({
    page: currentPage,
    limit: 10,
    search: debouncedSearch,
    status: filterStatus,
  });

  // ⏳ 2) Mientras cargan stats mostramos algo visualmente limpio
  if (statsLoading) {
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
  if (statsError || !statsData) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <FoundationHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-red-600">
          No se pudieron cargar las estadísticas de la fundación.
        </div>
      </div>
    );
  }

  // Datos de animales (con loading y error handling)
  const animals = animalsData?.animals || [];
  const pagination = animalsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  // Funciones para manejar acciones
  const handleViewAnimal = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (animal) {
      setViewModal({ isOpen: true, animal });
    }
  };

  const handleEditAnimal = (animalId: string) => {
    // Navegar al CRUD de animales con scroll al animal específico
    navigate(`/fundacion/animales`, { state: { editAnimalId: animalId } });
  };

  const handleDeleteAnimal = (animalId: string, animalName: string) => {
    setConfirmDialog({ isOpen: true, animalId, animalName });
  };

  const confirmDelete = async () => {
    const { animalId, animalName } = confirmDialog;
    if (!animalId) return;
    
    try {
      setDeletingId(animalId);
      await apiClient.foundationDeleteAnimal(animalId);
      toast.success(`${animalName || "El animal"} ha sido eliminado correctamente`);
      setConfirmDialog({ isOpen: false });
      // Recargar la lista
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message || "Error al eliminar el animal");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <FoundationHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Perros Registrados */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-green-200 bg-gradient-to-br from-white to-green-50">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <Dog className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Caninos Registrados
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {statsData.totalDogs}
                </p>
              </div>
            </div>
          </Card>

          {/* Solicitudes Activas */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-yellow-200 bg-gradient-to-br from-white to-yellow-50">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Solicitudes Activas
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {statsData.activeRequests}
                </p>
              </div>
            </div>
          </Card>

          {/* Adopciones Completadas */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 bg-gradient-to-br from-white to-blue-50">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Adopciones Completadas
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {statsData.adoptedDogs}
                </p>
              </div>
            </div>
          </Card>

          {/* Perros en Espera */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-red-200 bg-gradient-to-br from-white to-red-50">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                <AlertCircle className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Caninos en Espera
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {statsData.waitingDogs}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="p-8 overflow-x-clip shadow-lg border-2 border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 mb-6">
              🐾 Caninos registrados por la fundación
            </h2>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-12 text-base border-2 focus:border-primary-400"
                  />
                </div>
              </div>

              {/* Botón que navega a /fundacion/animales */}
              <Button
                type="button"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-xl transition-all font-bold h-12 text-base"
                onClick={() => navigate("/fundacion/animales")}
              >
                <Plus className="h-5 w-5 mr-2" />
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
                  {animalsLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Cargando animales...
                      </td>
                    </tr>
                  ) : animalsError ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                        Error al cargar los animales
                      </td>
                    </tr>
                  ) : animals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No hay animales registrados
                      </td>
                    </tr>
                  ) : (
                    animals.map((dog) => (
                      <tr key={dog.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center">
                            {dog.photo ? (
                              <img
                                src={urlFromBackend(dog.photo)}
                                alt={dog.name}
                                className="w-8 h-8 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                <Dog className="h-4 w-4 text-yellow-600" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium text-gray-900 block">
                                {dog.name}
                              </span>
                              <span className="text-xs text-gray-500 sm:hidden">
                                {dog.ageDisplay} •{" "}
                                {dog.breed}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                          {dog.ageDisplay}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                          {dog.breed} / {dog.size}
                        </td>
                        <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {dog.health && Array.isArray(dog.health) && dog.health.length > 0 ? (
                              dog.health.map((health, index) => (
                                <Badge key={index} variant="info" size="sm">
                                  {health}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">Sin datos</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <Badge variant={dog.statusColor as any} size="sm">
                            {dog.statusLabel}
                          </Badge>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-1 sm:space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900 p-1"
                              onClick={() => handleViewAnimal(dog.id)}
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-green-600 hover:text-green-900 p-1"
                              onClick={() => handleEditAnimal(dog.id)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 p-1"
                              onClick={() => handleDeleteAnimal(dog.id, dog.name)}
                              title="Eliminar"
                              disabled={!!deletingId}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!animalsLoading && !animalsError && pagination.total > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700">
                  Mostrando {animals.length} de {pagination.total} perros
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={pagination.page === 1}
                  >
                    Anterior
                  </Button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        size="sm"
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        className={pagination.page === pageNum ? "bg-green-600" : ""}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modal de vista rápida del animal */}
      {viewModal.isOpen && viewModal.animal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewModal({ isOpen: false })}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewModal.animal.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{viewModal.animal.breed}</p>
                </div>
                <button
                  onClick={() => setViewModal({ isOpen: false })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Foto */}
              {viewModal.animal.photo && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={urlFromBackend(viewModal.animal.photo)}
                    alt={viewModal.animal.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Edad</p>
                  <p className="font-semibold text-gray-900">{viewModal.animal.ageDisplay}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Tamaño</p>
                  <p className="font-semibold text-gray-900">{viewModal.animal.size}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Género</p>
                  <p className="font-semibold text-gray-900">{viewModal.animal.gender === 'MALE' ? 'Macho' : 'Hembra'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Energía</p>
                  <p className="font-semibold text-gray-900">{viewModal.animal.energy}</p>
                </div>
              </div>

              {/* Estado de salud */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Estado de salud</h3>
                <div className="flex flex-wrap gap-2">
                  {viewModal.animal.health && Array.isArray(viewModal.animal.health) && viewModal.animal.health.length > 0 ? (
                    viewModal.animal.health.map((h: string, i: number) => (
                      <Badge key={i} variant="info" size="sm">{h}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Sin datos</span>
                  )}
                </div>
              </div>

              {/* Estado */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Disponibilidad</h3>
                <Badge variant={viewModal.animal.statusColor as any} size="sm">
                  {viewModal.animal.statusLabel}
                </Badge>
              </div>

              {/* Resumen clínico */}
              {viewModal.animal.clinicalSummary && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Resumen clínico</h3>
                  <p className="text-sm text-gray-700">{viewModal.animal.clinicalSummary}</p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setViewModal({ isOpen: false });
                    handleEditAnimal(viewModal.animal.id);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewModal({ isOpen: false })}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Eliminar animal"
        message={`¿Estás seguro de que deseas eliminar a ${confirmDialog.animalName || "este animal"}? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={!!deletingId}
      />
    </div>
  );
}

export default FoundationDashboard;
