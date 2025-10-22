import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Calendar, 
  User, 
  Heart as HeartIcon,
  MapPin,
  Activity,
  Shield,
  Users,
  Home,
  Syringe,
  Zap,
  CheckCircle,
  Clock,
  Stethoscope
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { apiClient, urlFromBackend } from "@/lib/api";

// Tipos
type Size = "SMALL" | "MEDIUM" | "LARGE";
type Energy = "LOW" | "MEDIUM" | "HIGH";
type AState = "AVAILABLE" | "RESERVED" | "ADOPTED" | "RESCUED" | "QUARANTINE";

type DisplayAnimal = {
  id: string;
  name: string;
  photos: string[];
  clinicalSummary: string;
  state: AState;
  attributes: {
    age: number;
    size: Size;
    breed: string;
    gender: "MALE" | "FEMALE";
    energy: Energy;
    coexistence: { children: boolean; cats: boolean; dogs: boolean };
  };
  foundationId?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Utilidades
const sizeLabel = (s: Size) => (s === "SMALL" ? "Pequeño" : s === "MEDIUM" ? "Mediano" : "Grande");
const energyLabel = (e: Energy) => (e === "LOW" ? "Tranquilo" : e === "MEDIUM" ? "Moderado" : "Activo");
const ageBucket = (years: number) => (years < 1 ? "Cachorro" : years < 3 ? "Joven" : years < 7 ? "Adulto" : "Senior");
const genderLabel = (g: "MALE" | "FEMALE") => g === "MALE" ? "Macho" : "Hembra";

const stateBadge = (state: AState) => {
  switch (state) {
    case "AVAILABLE":
      return { label: "Disponible para adopción", variant: "success" as const };
    case "RESERVED":
      return { label: "Reservado", variant: "warning" as const };
    case "ADOPTED":
      return { label: "Adoptado", variant: "neutral" as const };
    default:
      return { label: state, variant: "info" as const };
  }
};

// Componente de barra de progreso
const ProgressBar: React.FC<{ label: string; value: number; max?: number }> = ({ 
  label, 
  value, 
  max = 5 
}) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="flex space-x-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i < value ? "bg-primary-500" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  </div>
);

// Componente de compatibilidad
const CompatibilityItem: React.FC<{ 
  label: string; 
  status: "excellent" | "good" | "moderate" | "poor";
  icon: React.ReactNode;
}> = ({ label, status, icon }) => {
  const statusConfig = {
    excellent: { color: "text-green-600", bg: "bg-green-50", icon: "✓" },
    good: { color: "text-green-600", bg: "bg-green-50", icon: "✓" },
    moderate: { color: "text-orange-600", bg: "bg-orange-50", icon: "○" },
    poor: { color: "text-red-600", bg: "bg-red-50", icon: "✗" }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        {icon}
        <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        {config.icon} {status === "excellent" ? "Excelente" : 
                      status === "good" ? "Buena" : 
                      status === "moderate" ? "Moderada" : "Baja"}
      </div>
    </div>
  );
};

const AnimalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<DisplayAnimal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID de animal no válido");
      setLoading(false);
      return;
    }

    const fetchAnimal = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Llamar a la API real
        const animalData = await apiClient.getAnimal(id);
        
        // Convertir los datos de la API al formato que espera la página
        const displayAnimal: DisplayAnimal = {
          id: animalData.id || animalData._id,
          name: animalData.name || "Sin nombre",
          photos: animalData.photos || [],
          clinicalSummary: animalData.clinicalSummary || "",
          state: animalData.state || "AVAILABLE",
          attributes: {
            age: animalData.attributes?.age || 0,
            size: animalData.attributes?.size || "MEDIUM",
            breed: animalData.attributes?.breed || "Mestizo",
            gender: animalData.attributes?.gender || "FEMALE",
            energy: animalData.attributes?.energy || "MEDIUM",
            coexistence: {
              children: animalData.attributes?.coexistence?.children || false,
              cats: animalData.attributes?.coexistence?.cats || false,
              dogs: animalData.attributes?.coexistence?.dogs || false
            }
          },
          foundationId: animalData.foundationId,
          createdAt: animalData.createdAt,
          updatedAt: animalData.updatedAt
        };

        setAnimal(displayAnimal);
      } catch (err: any) {
        setError(err?.message || "Error cargando el animal");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando detalles del animal...</div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-600 font-medium mb-2">No se pudo cargar el animal</p>
          <p className="text-gray-600 mb-4">{error || "Animal no encontrado"}</p>
          <Button onClick={() => navigate("/catalogo")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </Card>
      </div>
    );
  }

  const { attributes } = animal;
  const stateInfo = stateBadge(animal.state);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navegación superior */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/catalogo" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al catálogo
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Inicio</span>
              <span className="text-gray-600">Catálogo</span>
              <span className="text-gray-600">Sobre Nosotros</span>
              <span className="text-gray-600">Contacto</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjeta principal del animal */}
        <Card className="overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Imagen del animal */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={urlFromBackend(animal.photos[0])}
                  alt={`Foto de ${animal.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Overlay "ADÓPTAME" */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-bold text-primary-600">ADÓPTAME</span>
              </div>
            </div>

            {/* Información del animal */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{animal.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {attributes.age} {attributes.age === 1 ? "año" : "años"}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {sizeLabel(attributes.size)}
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1 text-purple-600" />
                      <span className="text-purple-600">{attributes.breed}</span>
                    </div>
                  </div>
                </div>
                <Heart className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer" />
              </div>

              {/* Estado de adopción */}
              <div className="mb-6">
                <Badge variant={stateInfo.variant} className="text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {stateInfo.label}
                </Badge>
              </div>

              {/* Detalles de salud */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Estado de salud</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center text-sm">
                    <Syringe className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-gray-700">Vacunado</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Zap className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-gray-700">Desparasitado</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <HeartIcon className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-gray-700">Esterilizado</span>
                  </div>
                </div>
              </div>

              {/* Fundación */}
              <div className="mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">Fundación Patitas Felices</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-4">
                <Button size="lg" className="flex-1">
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Adoptar a {animal.name}
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/catalogo")}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver al catálogo
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tarjetas de detalles adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personalidad */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Personalidad</h3>
            </div>
            <div className="space-y-3">
              <ProgressBar label="Sociabilidad" value={4} />
              <ProgressBar label="Energía" value={3} />
              <ProgressBar label="Entrenamiento" value={3} />
              <ProgressBar label="Adaptabilidad" value={5} />
            </div>
          </Card>

          {/* Compatibilidad */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 mr-2 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Compatibilidad</h3>
            </div>
            <div className="space-y-2">
              <CompatibilityItem
                label="Niños"
                status="excellent"
                icon={<Users className="h-4 w-4 text-gray-500" />}
              />
              <CompatibilityItem
                label="Otros perros"
                status="excellent"
                icon={<Users className="h-4 w-4 text-gray-500" />}
              />
              <CompatibilityItem
                label="Gatos"
                status="moderate"
                icon={<Users className="h-4 w-4 text-gray-500" />}
              />
              <CompatibilityItem
                label="Apartamento"
                status="good"
                icon={<Home className="h-4 w-4 text-gray-500" />}
              />
            </div>
          </Card>

          {/* Historial clínico */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Stethoscope className="h-5 w-5 mr-2 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Historial clínico</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fecha de rescate:</span>
                <span className="text-gray-900">15/03/2023</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Última vacuna:</span>
                <span className="text-gray-900">10/07/2023</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Esterilización:</span>
                <span className="text-gray-900">Sí (05/04/2023)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Condiciones:</span>
                <span className="text-gray-900">Ninguna</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailPage;
