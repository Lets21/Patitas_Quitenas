import { useEffect, useState } from "react";
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Building, 
  Stethoscope, 
  Heart,
  AlertTriangle,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { http } from "@/lib/http";

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  adoptionsThisMonth: number;
  totalAnimals: number;
  availableAnimals: number;
  pendingApplications: number;
  totalApplications: number;
  activeFundations: number;
  activeClinics: number;
}

interface StatsGrowth {
  users: number;
  activeUsers: number;
  adoptions: number;
}

interface SystemAlert {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  time: string;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    adoptionsThisMonth: 0,
    totalAnimals: 0,
    availableAnimals: 0,
    pendingApplications: 0,
    totalApplications: 0,
    activeFundations: 0,
    activeClinics: 0,
  });

  const [growth, setGrowth] = useState<StatsGrowth>({
    users: 0,
    activeUsers: 0,
    adoptions: 0,
  });

  const [alerts] = useState<SystemAlert[]>([
    {
      id: "1",
      type: "warning",
      message: "Actualización de seguridad disponible",
      time: "2 horas",
    },
    {
      id: "2",
      type: "info",
      message: "Backup automático completado exitosamente",
      time: "6 horas",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await http.get("/admin/overview");
        
        if (response.data.ok) {
          setStats(response.data.stats);
          if (response.data.stats.growth) {
            setGrowth(response.data.stats.growth);
          }
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("No se pudieron cargar las estadísticas del sistema");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  const formatGrowth = (value: number) => {
    if (value === 0) return "Sin cambios";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value}%`;
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resumen del Sistema</h1>
        <p className="text-gray-600 mt-2">
          Vista general del estado y estadísticas de AdoptaConCausa
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              <p className={`text-sm mt-1 flex items-center gap-1 ${getGrowthColor(growth.users)}`}>
                <TrendingUp className="h-3 w-3" />
                {formatGrowth(growth.users)} este mes
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Active Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeUsers}</p>
              <p className={`text-sm mt-1 flex items-center gap-1 ${getGrowthColor(growth.activeUsers)}`}>
                <TrendingUp className="h-3 w-3" />
                {formatGrowth(growth.activeUsers)} este mes
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Animals */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Animales Registrados</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAnimals}</p>
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {stats.pendingApplications} solicitudes
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* Adoptions */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Adopciones (mes)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.adoptionsThisMonth}</p>
              <p className={`text-sm mt-1 flex items-center gap-1 ${getGrowthColor(growth.adoptions)}`}>
                <TrendingUp className="h-3 w-3" />
                {formatGrowth(growth.adoptions)} vs anterior
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Organizations Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Foundations */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Fundaciones Activas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeFundations}</p>
              <p className="text-sm text-gray-500 mt-1">Organizaciones registradas</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Building className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        {/* Clinics */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Clínicas Activas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeClinics}</p>
              <p className="text-sm text-gray-500 mt-1">Centros veterinarios</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-xl">
              <Stethoscope className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Alertas del Sistema</h3>
          <Badge variant="info" size="sm">{alerts.length} alertas</Badge>
        </div>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No hay alertas en este momento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle
                    className={`w-5 h-5 mt-0.5 ${
                      alert.type === "error"
                        ? "text-red-500"
                        : alert.type === "warning"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">Hace {alert.time}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    alert.type === "error"
                      ? "danger"
                      : alert.type === "warning"
                      ? "warning"
                      : "info"
                  }
                  size="sm"
                >
                  {alert.type}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group">
            <Users className="h-6 w-6 text-gray-400 group-hover:text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Gestionar Usuarios</p>
            <p className="text-sm text-gray-500">Ver y administrar cuentas</p>
          </button>
          
          <button className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group">
            <Activity className="h-6 w-6 text-gray-400 group-hover:text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Ver Reportes</p>
            <p className="text-sm text-gray-500">Análisis y estadísticas</p>
          </button>
          
          <button className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group">
            <AlertTriangle className="h-6 w-6 text-gray-400 group-hover:text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Configuración</p>
            <p className="text-sm text-gray-500">Ajustes del sistema</p>
          </button>
        </div>
      </Card>
      </div>
    </div>
  );
}
