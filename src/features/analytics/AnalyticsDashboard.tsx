import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { http } from '@/lib/http';

interface Metricas {
  totalSolicitudes: number;
  cambioSolicitudes: string;
  adopcionesCompletadas: number;
  cambioAdopciones: string;
  tiempoPromedio: number;
  cambioTiempo: string;
  fundacionActiva: string;
  adopcionesFundacion: number;
}

interface DatoKNN {
  categoria: string;
  valor: number;
  color: string;
}

interface DatoAbandono {
  razon: string;
  porcentaje: number;
}

interface PerfilReciente {
  iniciales: string;
  nombre: string;
  ubicacion: string;
  compatibilidad: number;
  perro: string;
  descripcion: string;
  estado: string;
  fecha: string;
  colorInicial: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedFoundation, setSelectedFoundation] = useState('todas');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [selectedAge, setSelectedAge] = useState('todas');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metricas, setMetricas] = useState<Metricas>({
    totalSolicitudes: 0,
    cambioSolicitudes: '0%',
    adopcionesCompletadas: 0,
    cambioAdopciones: '0%',
    tiempoPromedio: 0,
    cambioTiempo: '0 días',
    fundacionActiva: 'N/A',
    adopcionesFundacion: 0
  });
  const [datosKNN, setDatosKNN] = useState<DatoKNN[]>([]);
  const [datosAbandono, setDatosAbandono] = useState<DatoAbandono[]>([]);
  const [perfilesRecientes, setPerfilesRecientes] = useState<PerfilReciente[]>([]);
  const [topRazones, setTopRazones] = useState<string[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await http.get("/admin/analytics");
        
        if (response.data.ok) {
          const { data } = response.data;
          setMetricas(data.metricas);
          setDatosKNN(data.datosKNN);
          setDatosAbandono(data.datosAbandono);
          setPerfilesRecientes(data.perfilesRecientes);
          setTopRazones(data.topRazones);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("No se pudieron cargar los datos de analítica");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await http.get("/admin/analytics");
      if (response.data.ok) {
        const { data } = response.data;
        setMetricas(data.metricas);
        setDatosKNN(data.datosKNN);
        setDatosAbandono(data.datosAbandono);
        setPerfilesRecientes(data.perfilesRecientes);
        setTopRazones(data.topRazones);
      }
    } catch (err) {
      console.error("Error refreshing analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Cargando datos de analítica...</div>
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analítica de Adopciones</h1>
              <p className="text-gray-600 mt-2">
                Vista general del estado y estadísticas de adopciones
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar datos
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Los datos mostrados aquí se basan en información anónima y clasificada mediante técnicas de ML (K-NN).
            </p>
          </div>
        </div>
        {/* Filtros */}
        <Card className="p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="30">Últimos 30 días</option>
                <option value="60">Últimos 60 días</option>
                <option value="90">Últimos 90 días</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fundación</label>
              <select 
                value={selectedFoundation}
                onChange={(e) => setSelectedFoundation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="todas">Todas</option>
                <option value="pae">Fundación PAE</option>
                <option value="patitas">Patitas Felices</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado del perro</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="todos">Todos</option>
                <option value="disponible">Disponible</option>
                <option value="adoptado">Adoptado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
              <select 
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="todas">Todas</option>
                <option value="cachorro">Cachorro</option>
                <option value="adulto">Adulto</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white">
              Aplicar filtros
            </Button>
          </div>
        </Card>

        {/* Métricas generales */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Métricas Generales de Adopciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total de solicitudes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metricas.totalSolicitudes}</p>
                  <p className="text-sm text-green-600 mt-1">{metricas.cambioSolicitudes} vs mes anterior</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Adopciones completadas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metricas.adopcionesCompletadas}%</p>
                  <p className="text-sm text-green-600 mt-1">{metricas.cambioAdopciones} vs mes anterior</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Tiempo promedio</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metricas.tiempoPromedio} días</p>
                  <p className="text-sm text-red-600 mt-1">{metricas.cambioTiempo} vs mes anterior</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Fundación más activa</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{metricas.fundacionActiva}</p>
                  <p className="text-sm text-gray-600 mt-1">{metricas.adopcionesFundacion} adopciones</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Clasificación K-NN */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Clasificación de usuarios con K-NN</h3>
              <div className="text-gray-400 hover:text-gray-600 cursor-help" title="Clasificación basada en machine learning">
                <Info className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8"
                    strokeDasharray={`${datosKNN[0].valor * 2.51} 251.2`} strokeLinecap="round"
                  />
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke="#14b8a6" strokeWidth="8"
                    strokeDasharray={`${datosKNN[1].valor * 2.51} 251.2`}
                    strokeDashoffset={`-${datosKNN[0].valor * 2.51}`} strokeLinecap="round"
                  />
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke="#f87171" strokeWidth="8"
                    strokeDasharray={`${datosKNN[2].valor * 2.51} 251.2`}
                    strokeDashoffset={`-${(datosKNN[0].valor + datosKNN[1].valor) * 2.51}`} strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              {datosKNN.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${item.color}`}></div>
                    <span className="text-sm text-gray-700">{item.categoria}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.valor}%</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Insight:</strong> El 62% de los usuarios clasificados como "Alta probabilidad" completaron la adopción en menos de 7 días.
              </p>
            </div>
          </Card>

          {/* Análisis de abandono */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Análisis de abandono / rechazo</h3>
              <div className="text-gray-400 hover:text-gray-600 cursor-help" title="Razones por las que se abandonan solicitudes">
                <Info className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {datosAbandono.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{item.razon}</span>
                    <span className="text-sm font-medium text-gray-900">{item.porcentaje}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-400 h-2 rounded-full" 
                      style={{ width: `${item.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Top 3 razones de rechazo clínico:</h4>
              <ul className="space-y-1">
                {topRazones.map((razon, index) => (
                  <li key={index} className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-2" />
                    {razon}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Perfiles de adoptantes recientes */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Perfiles de Adoptantes Recientes</h3>
            <Button variant="outline" size="sm" className="text-primary-600 border-primary-600 hover:bg-primary-50">
              Ver todos
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">USUARIO</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">COMPATIBILIDAD</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">PERRO</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ESTADO</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">FECHA</th>
                </tr>
              </thead>
              <tbody>
                {perfilesRecientes.map((perfil, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${perfil.colorInicial} flex items-center justify-center text-white text-sm font-medium mr-3`}>
                          {perfil.iniciales}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{perfil.nombre}</p>
                          <p className="text-sm text-gray-500">{perfil.ubicacion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${perfil.compatibilidad}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{perfil.compatibilidad}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{perfil.perro}</p>
                        <p className="text-sm text-gray-500">{perfil.descripcion}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          perfil.estado === 'Completado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {perfil.estado}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {perfil.fecha}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tendencias por filtros */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Tendencias por Filtros</h3>
          
          <div className="flex space-x-8 mb-6 border-b">
            <button className="text-primary-600 border-b-2 border-primary-600 pb-3 px-2 font-medium text-sm hover:text-primary-700 transition-colors">
              Por edad
            </button>
            <button className="text-gray-500 pb-3 px-2 font-medium text-sm hover:text-gray-700 transition-colors">
              Por raza
            </button>
            <button className="text-gray-500 pb-3 px-2 font-medium text-sm hover:text-gray-700 transition-colors">
              Por ubicación
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Cachorros (0-1 año)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Adultos (1-7 años)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Senior (7+ años)</span>
            </div>
          </div>

          <div className="h-64 flex items-end space-x-2">
            {/* Simulación de gráfico de líneas */}
            <div className="flex-1 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Gráfico de tendencias</p>
                <p className="text-xs text-gray-500">Los datos muestran mayor adopción en cachorros</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
