// src/features/foundation/FoundationAnalytics.tsx
import {
  TrendingUp,
  Users,
  Calendar,
  Award,
  Activity,
  PieChart,
  BarChart3,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useFoundationAnalytics } from "./useFoundationAnalytics";
import { urlFromBackend } from "@/lib/api";
import FoundationHeader from "@/components/admin/FoundationHeader";

// Función para formatear edad
const formatAge = (ageMonths: number | undefined): string => {
  const months = ageMonths || 0;
  if (months < 12) {
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'año' : 'años'}`;
  }
  return `${years} ${years === 1 ? 'año' : 'años'} y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
};

function FoundationAnalytics() {
  const { data, isLoading, isError } = useFoundationAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <FoundationHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <FoundationHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <p className="text-red-600">
              No se pudieron cargar las estadísticas. Intenta nuevamente.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const {
    adoptionsTimeline,
    topAnimalsWithApplications,
    stateDistribution,
    adoptionRate,
    applicationsByStatus,
    avgDaysToAdoption,
    recentAdoptions,
    dogsBySize,
    dogsByEnergy,
    registrationTimeline,
    summary,
  } = data;

  // Mapeo de estados para etiquetas en español
  const stateLabels: Record<string, string> = {
    AVAILABLE: "Disponible",
    RESERVED: "Reservado",
    ADOPTED: "Adoptado",
    RESCUED: "Rescatado",
    QUARANTINE: "Cuarentena",
  };

  const statusLabels: Record<string, string> = {
    RECEIVED: "Recibidas",
    IN_REVIEW: "En revisión",
    HOME_VISIT: "Visita domiciliaria",
    APPROVED: "Aprobadas",
    REJECTED: "Rechazadas",
  };

  const sizeLabels: Record<string, string> = {
    SMALL: "Pequeño",
    MEDIUM: "Mediano",
    LARGE: "Grande",
  };

  const energyLabels: Record<string, string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <FoundationHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📊 Estadísticas y Análisis
          </h1>
          <p className="text-base text-gray-600">
            Análisis completo del desempeño y métricas clave de la fundación
          </p>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tasa de Adopción
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {adoptionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Solicitudes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.totalApplications}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 bg-gradient-to-br from-white to-purple-50">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Award className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Perros Adoptados
                </p>
                <p className="text-3xl font-extrabold text-purple-600">
                  {summary.adoptedDogs}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-200 bg-gradient-to-br from-white to-orange-50">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Tiempo Promedio
                </p>
                <p className="text-3xl font-extrabold text-orange-600">
                  {avgDaysToAdoption} días
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Gráficos y Tablas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Adopciones por mes */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 mr-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                📅 Adopciones por Mes
              </h3>
            </div>
            <div className="space-y-4">
              {adoptionsTimeline.length === 0 ? (
                <p className="text-sm text-gray-500 font-semibold">
                  📭 No hay datos de adopciones en los últimos 6 meses
                </p>
              ) : (
                adoptionsTimeline.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">{item.month}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-40 h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (item.count / Math.max(...adoptionsTimeline.map((a) => a.count), 1)) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-base font-bold text-gray-900 w-10 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Registro de perros por mes */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mr-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                📈 Registro de Perros por Mes
              </h3>
            </div>
            <div className="space-y-4">
              {registrationTimeline.length === 0 ? (
                <p className="text-sm text-gray-500 font-semibold">
                  📋 No hay datos de registros en los últimos 6 meses
                </p>
              ) : (
                registrationTimeline.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">{item.month}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-40 h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (item.count / Math.max(...registrationTimeline.map((r) => r.count), 1)) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-base font-bold text-gray-900 w-10 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Top Perros con Más Solicitudes */}
        <Card className="p-6 mb-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 mr-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              🏆 Perros con Más Solicitudes de Adopción
            </h3>
          </div>
          {topAnimalsWithApplications.length === 0 ? (
            <p className="text-sm text-gray-500 font-semibold">📊 No hay datos disponibles</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      🐶 Perro
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      🧒 Raza
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      🎂 Edad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      📊 Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      📝 Solicitudes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topAnimalsWithApplications.map((animal) => (
                    <tr key={animal.animalId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={urlFromBackend(animal.photos[0] || "")}
                            alt={animal.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {animal.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {animal.breed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatAge(animal.ageMonths)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            animal.state === "ADOPTED"
                              ? "success"
                              : animal.state === "RESERVED"
                              ? "warning"
                              : "info"
                          }
                          size="sm"
                        >
                          {stateLabels[animal.state] || animal.state}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-primary-600">
                          {animal.applicationCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Grid inferior */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Distribución por Estado */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <PieChart className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Distribución por Estado
              </h3>
            </div>
            <div className="space-y-2">
              {stateDistribution.map((state) => (
                <div
                  key={state._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-700">
                    {stateLabels[state._id] || state._id}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {state.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Distribución por Tamaño */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Activity className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Perros por Tamaño
              </h3>
            </div>
            <div className="space-y-2">
              {dogsBySize.map((size) => (
                <div
                  key={size._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-700">
                    {sizeLabels[size._id] || size._id}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {size.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Distribución por Energía */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Activity className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Perros por Energía
              </h3>
            </div>
            <div className="space-y-2">
              {dogsByEnergy.map((energy) => (
                <div
                  key={energy._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-700">
                    {energyLabels[energy._id] || energy._id}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {energy.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Solicitudes por Estado */}
        <Card className="p-6 mb-8">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Solicitudes por Estado
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {applicationsByStatus.map((status) => (
              <div
                key={status._id}
                className="bg-gray-50 rounded-lg p-4 text-center"
              >
                <p className="text-2xl font-bold text-gray-900">
                  {status.count}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {statusLabels[status._id] || status._id}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Adopciones Recientes */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Adopciones Recientes
            </h3>
          </div>
          {recentAdoptions.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay adopciones recientes registradas
            </p>
          ) : (
            <div className="space-y-3">
              {recentAdoptions.map((adoption) => (
                <div
                  key={adoption._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={urlFromBackend(adoption.photos[0] || "")}
                      alt={adoption.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {adoption.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {adoption.attributes.breed} •{" "}
                        {formatAge(adoption.ageMonths)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(adoption.updatedAt).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <Badge variant="success" size="sm">
                      Adoptado
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default FoundationAnalytics;
