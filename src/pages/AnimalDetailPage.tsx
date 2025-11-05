// src/pages/AnimalDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Calendar,
  User,
  Heart as HeartIcon,
  Users,
  Home,
  Syringe,
  Zap,
  CheckCircle,
  Stethoscope,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { apiClient, urlFromBackend } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";

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
  // Campos opcionales
  personality?: { sociability?: number; energy?: number; training?: number; adaptability?: number };
  compatibility?: { kids?: boolean; cats?: boolean; dogs?: boolean; apartment?: boolean };
  clinicalHistory?: { lastVaccination?: string | null; sterilized?: boolean; conditions?: string | null };
};

// Utilidades
const clamp5 = (n: number | undefined) => Math.max(0, Math.min(5, Number(n ?? 0)));
const toBool = (v: any) => {
  if (v === true || v === 1 || String(v).toLowerCase() === "true") return true;
  if (v === false || v === 0 || String(v).toLowerCase() === "false") return false;
  return undefined;
};

const sizeLabel = (s: Size) => (s === "SMALL" ? "Pequeño" : s === "MEDIUM" ? "Mediano" : "Grande");
const genderLabel = (g: "MALE" | "FEMALE") => (g === "MALE" ? "Macho" : "Hembra");

type BadgeVariant = "success" | "warning" | "info" | "default" | "danger";

const stateBadge = (state: AState): { label: string; variant: BadgeVariant } => {
  switch (state) {
    case "AVAILABLE":
      return { label: "Disponible para adopción", variant: "success" };
    case "RESERVED":
      return { label: "Reservado", variant: "warning" };
    case "ADOPTED":
      // En tu UI no existe "neutral". Usamos "default" para estado neutro.
      return { label: "Adoptado", variant: "default" };
    default:
      return { label: state, variant: "info" };
  }
};

const ProgressBar: React.FC<{ label: string; value: number; max?: number }> = ({ label, value, max = 5 }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="flex space-x-1">
      {Array.from({ length: max }, (_, i) => (
        <div key={i} className={`w-3 h-3 rounded-full ${i < value ? "bg-primary-500" : "bg-gray-200"}`} />
      ))}
    </div>
  </div>
);

const CompatibilityItem: React.FC<{
  label: string;
  value: boolean | undefined;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => {
  if (value === undefined) {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">— No especificado</div>
      </div>
    );
  }
  const good = value === true;
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        {icon}
        <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${good ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
        {good ? "✓ Excelente" : "✗ Baja"}
      </div>
    </div>
  );
};

const AnimalDetailPage: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [animal, setAnimal] = useState<DisplayAnimal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!animalId) {
      setError("ID de animal no válido");
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const dto: any = await apiClient.getAnimal(animalId); // GET /animals/:id

        const mapped: DisplayAnimal = {
          id: dto.id ?? dto._id,
          name: dto.name ?? "Sin nombre",
          photos: Array.isArray(dto.photos) ? dto.photos : [],
          clinicalSummary: dto.clinicalSummary ?? "",
          state: (dto.state as AState) ?? "AVAILABLE",
          attributes: {
            age: Number(dto.attributes?.age ?? 0),
            size: (dto.attributes?.size as Size) ?? "MEDIUM",
            breed: dto.attributes?.breed ?? "Mestizo",
            gender: dto.attributes?.gender ?? "FEMALE",
            energy: (dto.attributes?.energy as Energy) ?? "MEDIUM",
            coexistence: {
              children: !!dto.attributes?.coexistence?.children,
              cats: !!dto.attributes?.coexistence?.cats,
              dogs: !!dto.attributes?.coexistence?.dogs,
            },
          },
          foundationId: dto.foundationId,
          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt,
          // Normalización de opcionales
          personality: dto.personality
            ? {
                sociability: clamp5(dto.personality.sociability),
                energy: clamp5(dto.personality.energy),
                training: clamp5(dto.personality.training),
                adaptability: clamp5(dto.personality.adaptability),
              }
            : undefined,
          compatibility: dto.compatibility
            ? {
                kids: toBool(dto.compatibility.kids),
                cats: toBool(dto.compatibility.cats),
                dogs: toBool(dto.compatibility.dogs),
                apartment: toBool(dto.compatibility.apartment),
              }
            : undefined,
          clinicalHistory: dto.clinicalHistory
            ? {
                lastVaccination: dto.clinicalHistory.lastVaccination ?? null,
                sterilized: toBool(dto.clinicalHistory.sterilized),
                conditions: dto.clinicalHistory.conditions ?? null,
              }
            : undefined,
        };

        setAnimal(mapped);
      } catch (e: any) {
        setError(e?.message || "Error cargando el animal");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [animalId]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando detalles del animal…</div>
      </div>
    );
  }

  // Error
  if (error || !animal) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-600 font-medium mb-2">No se pudo cargar el animal</p>
          <p className="text-gray-600 mb-4">{error || "Animal no encontrado"}</p>
          <Button onClick={() => navigate("/catalog")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </Card>
      </div>
    );
  }

  const { attributes } = animal;
  const stateInfo = stateBadge(animal.state);
  const mainPhoto = animal.photos[0] ? urlFromBackend(animal.photos[0]) : undefined;

  // CTA Adoptar -> login con next si no es ADOPTANTE, si lo es -> aplicar
  function goApply() {
    const nextPath = `/adoptar/${animal.id}/aplicar`;
    // Ajusta si tu store no expone role así
    // @ts-expect-error depende de tu modelo de usuario
    if (!user || user.role !== "ADOPTANTE") {
      navigate(`/login?next=${encodeURIComponent(nextPath)}`, { replace: true });
    } else {
      navigate(nextPath);
    }
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/catalog" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al catálogo
            </Link>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Inicio</span>
              <span>Catálogo</span>
              <span>Sobre Nosotros</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjeta principal */}
        <Card className="overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Imagen */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                {mainPhoto ? (
                  <img src={mainPhoto} alt={`Foto de ${animal.name}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Sin foto</div>
                )}
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-bold text-primary-600">ADÓPTAME</span>
              </div>
            </div>

            {/* Info */}
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
                      {sizeLabel(attributes.size)} • {genderLabel(attributes.gender)}
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1 text-purple-600" />
                      <span className="text-purple-600">{attributes.breed}</span>
                    </div>
                  </div>
                </div>
                <Heart className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer" />
              </div>

              {/* Estado */}
              <div className="mb-6">
                {/* No pasamos className directo al Badge para evitar romper su API */}
                <div className="inline-flex text-sm">
                  <Badge variant={stateInfo.variant}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {stateInfo.label}
                  </Badge>
                </div>
              </div>

              {/* Salud (placeholder estático por ahora) */}
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
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                  <span className="text-gray-700">Fundación PAE</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex space-x-4">
                <Button size="lg" className="flex-1" onClick={goApply}>
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Adoptar a {animal.name}
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/catalog")}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver al catálogo
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Otras tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personalidad */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Personalidad</h3>
            </div>
            <div className="space-y-3">
              <ProgressBar label="Sociabilidad" value={clamp5(animal.personality?.sociability)} />
              <ProgressBar label="Energía" value={clamp5(animal.personality?.energy)} />
              <ProgressBar label="Entrenamiento" value={clamp5(animal.personality?.training)} />
              <ProgressBar label="Adaptabilidad" value={clamp5(animal.personality?.adaptability)} />
            </div>
          </Card>

          {/* Compatibilidad */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 mr-2 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Compatibilidad</h3>
            </div>
            <div className="space-y-2">
              <CompatibilityItem label="Niños" value={animal.compatibility?.kids} icon={<Users className="h-4 w-4 text-gray-500" />} />
              <CompatibilityItem label="Otros perros" value={animal.compatibility?.dogs} icon={<Users className="h-4 w-4 text-gray-500" />} />
              <CompatibilityItem label="Gatos" value={animal.compatibility?.cats} icon={<Users className="h-4 w-4 text-gray-500" />} />
              <CompatibilityItem label="Apartamento" value={animal.compatibility?.apartment} icon={<Home className="h-4 w-4 text-gray-500" />} />
            </div>
          </Card>

          {/* Historial clínico */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Stethoscope className="h-5 w-5 mr-2 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Historial clínico</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Última vacunación:</span>
                <span className="text-gray-900">{animal.clinicalHistory?.lastVaccination || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Esterilización:</span>
                <span className="text-gray-900">
                  {animal.clinicalHistory?.sterilized === true ? "Sí" : animal.clinicalHistory?.sterilized === false ? "No" : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Condiciones:</span>
                <span className="text-gray-900">{animal.clinicalHistory?.conditions || "—"}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailPage;
