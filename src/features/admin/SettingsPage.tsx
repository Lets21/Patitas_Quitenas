import { useState, useEffect } from "react";
import { 
  Save, 
  Server, 
  Database, 
  Shield, 
  Bell, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  HardDrive, 
  Clock, 
  Users, 
  Mail,
  TrendingUp,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { http } from "@/lib/http";
import toast from "react-hot-toast";

interface SystemStats {
  status: string;
  uptime: number;
  lastBackup: string;
  version: string;
  lastUpdate: string;
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  currentUsers: number;
}

interface SystemSettings {
  systemName: string;
  contactEmail: string;
  maxUsers: number;
  sessionTimeout: number;
  maintenanceMode: boolean;
  autoBackup: string;
  logLevel: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maxFileSize: number;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: "",
    contactEmail: "",
    maxUsers: 5000,
    maintenanceMode: false,
    autoBackup: "daily",
    logLevel: "info",
    emailNotifications: true,
    smsNotifications: false,
    maxFileSize: 10,
    sessionTimeout: 30,
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await http.get("/admin/settings");
      
      if (response.data.ok) {
        setSettings(response.data.settings);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Error al cargar la configuración del sistema");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await http.put("/admin/settings", settings);
      
      if (response.data.ok) {
        toast.success("Configuración guardada exitosamente");
        loadSettings(); // Recargar para obtener los valores actualizados
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else {
      return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Cargando configuración...</div>
        </div>
      </div>
    );
  }

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
            <p className="text-gray-600 mt-2">
              Administra la configuración general de la plataforma
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 shadow-md"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estado del Sistema</p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {stats?.status === "operational" ? "Operacional" : stats?.status}
                  </p>
                </div>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {stats?.uptime.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Último Backup</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {stats?.lastBackup && formatTimeAgo(stats.lastBackup)}
                </p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Versión</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {stats?.version || "N/A"}
                </p>
              </div>
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
          </Card>
        </div>

        {/* General Configuration */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Configuración General</h3>
              <p className="text-sm text-gray-500">Información básica del sistema</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Sistema
              </label>
              <Input
                value={settings.systemName}
                onChange={(e) => handleChange("systemName", e.target.value)}
                placeholder="Nombre de tu plataforma"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contacto
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  placeholder="contacto@ejemplo.com"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Límite de Usuarios
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="number"
                  value={settings.maxUsers}
                  onChange={(e) => handleChange("maxUsers", parseInt(e.target.value))}
                  placeholder="5000"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usuarios actuales: {stats?.currentUsers || 0}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de Sesión (minutos)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
                  placeholder="30"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Server and Maintenance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Server className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Servidor y Mantenimiento</h3>
              <p className="text-sm text-gray-500">Configuración de servidor y backups</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Server className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Modo de Mantenimiento</p>
                  <p className="text-sm text-gray-600">
                    Desactivar el acceso público al sistema
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.maintenanceMode}
                onChange={() => handleChange("maintenanceMode", !settings.maintenanceMode)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia de Backup
                </label>
                <select
                  value={settings.autoBackup}
                  onChange={(e) => handleChange("autoBackup", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="hourly">Cada hora</option>
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                  <option value="disabled">Desactivado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Logs
                </label>
                <select
                  value={settings.logLevel}
                  onChange={(e) => handleChange("logLevel", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                  <option value="verbose">Verbose</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Bell className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Notificaciones</h3>
              <p className="text-sm text-gray-500">Gestiona las alertas del sistema</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Mail className="h-5 w-5 text-blue-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Notificaciones por Email</p>
                  <p className="text-sm text-gray-600">Recibir alertas importantes por correo</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.emailNotifications}
                onChange={() => handleChange("emailNotifications", !settings.emailNotifications)}
              />
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Bell className="h-5 w-5 text-green-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Notificaciones por SMS</p>
                  <p className="text-sm text-gray-600">Alertas críticas vía mensaje de texto</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.smsNotifications}
                onChange={() => handleChange("smsNotifications", !settings.smsNotifications)}
              />
            </div>
          </div>
        </Card>

        {/* Storage */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Almacenamiento</h3>
              <p className="text-sm text-gray-500">Gestión de archivos y espacio en disco</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño Máximo de Archivo (MB)
              </label>
              <div className="relative">
                <HardDrive className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleChange("maxFileSize", parseInt(e.target.value))}
                  placeholder="10"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Para imágenes y documentos subidos por usuarios
              </p>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-blue-900">Uso de Almacenamiento</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {stats?.storage.used.toFixed(1)} GB
                  </p>
                </div>
                <Badge variant="info" className="text-base px-3 py-1">
                  {stats?.storage.percentage}%
                </Badge>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all" 
                  style={{ width: `${stats?.storage.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-700">
                {stats?.storage.used.toFixed(1)} GB de {stats?.storage.total} GB disponibles
              </p>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Seguridad</h3>
              <p className="text-sm text-gray-500">Estado de seguridad y actualizaciones</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Security Alert */}
            <div className="p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900">
                    Actualización de seguridad disponible
                  </p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Se recomienda actualizar a la versión más reciente para mantener la
                    seguridad del sistema y acceder a las últimas mejoras.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                      Ver detalles
                    </Button>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Actualizar ahora
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-600">Última Actualización</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats?.lastUpdate && formatTimeAgo(stats.lastUpdate)}
                </p>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-600">Versión del Sistema</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats?.version || "N/A"}
                </p>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <p className="text-sm font-medium text-green-700">Estado de Seguridad</p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <p className="text-xl font-bold text-green-900">
                    {stats?.uptime && stats.uptime > 99 ? "Protegido" : "Alerta"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
