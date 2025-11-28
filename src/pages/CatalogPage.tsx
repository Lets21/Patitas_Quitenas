// src/pages/CatalogPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  MapPin,
  Calendar,
  Eye,
  SlidersHorizontal,
  Ruler,
  Cake,
  Stethoscope,
  Users,
  Zap,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { apiClient, urlFromBackend } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";

// ========= Tipos “seguros para UI” =========
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
  personality?: { sociability?: number; energy?: number; training?: number; adaptability?: number };
  compatibility?: { kids?: boolean; cats?: boolean; dogs?: boolean; apartment?: boolean };
  clinicalHistory?: { lastVaccination?: string | null; sterilized?: boolean; conditions?: string | null };
};

type LocalFilters = {
  size?: Size[];
  energy?: Energy[];
  q?: string;
  ageGroup?: string[];
  sterilized?: boolean;
  hasConditions?: boolean;
  compatibility?: string[];
  personalityMin?: { sociability?: number; adaptability?: number; training?: number };
};

// ========= Utilidades de UI =========
const SIZE_OPTIONS: Size[] = ["SMALL", "MEDIUM", "LARGE"];
const ENERGY_OPTIONS: Energy[] = ["LOW", "MEDIUM", "HIGH"];
const AGE_GROUPS = [
  { value: "PUPPY", label: "Cachorro (< 1 año)", min: 0, max: 0.99 },
  { value: "YOUNG", label: "Joven (1-2 años)", min: 1, max: 2.99 },
  { value: "ADULT", label: "Adulto (3-6 años)", min: 3, max: 6.99 },
  { value: "SENIOR", label: "Senior (7+ años)", min: 7, max: 100 },
];
const COMPATIBILITY_OPTIONS = [
  { value: "kids", label: "Niños" },
  { value: "cats", label: "Gatos" },
  { value: "dogs", label: "Otros perros" },
  { value: "apartment", label: "Apartamento" },
];

const sizeLabel = (s: Size) => (s === "SMALL" ? "Pequeño" : s === "MEDIUM" ? "Mediano" : "Grande");
const energyLabel = (e: Energy) => (e === "LOW" ? "Tranquilo" : e === "MEDIUM" ? "Moderado" : "Activo");
const ageBucket = (years: number) => (years < 1 ? "Cachorro" : years < 3 ? "Joven" : years < 7 ? "Adulto" : "Senior");

const stateBadge = (state: AState) => {
  switch (state) {
    case "AVAILABLE":
      return { label: "Disponible", variant: "success" as const };
    case "RESERVED":
      return { label: "Reservado", variant: "warning" as const };
    case "ADOPTED":
      return { label: "Adoptado", variant: "default" as const };
    default:
      return { label: state, variant: "info" as const };
  }
};

// ========= Normalizador para UI =========
const PLACEHOLDER =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200";

function normalizeAnimal(raw: any): DisplayAnimal | null {
  const realId = raw?.id ?? raw?._id;
  if (!realId) return null; // sin id, no mostramos esta tarjeta

  const attrs = raw?.attributes ?? {};
  const ageNumber = Number(attrs?.age ?? raw?.age ?? (raw?.health?.age as any) ?? 0);
  if (!Number.isFinite(ageNumber) || ageNumber < 0) return null;

  const photos: string[] =
    Array.isArray(raw?.photos) && raw.photos.length ? raw.photos : [PLACEHOLDER];

  const clamp5 = (n: number | undefined) => Math.max(0, Math.min(5, Number(n ?? 0)));
  const toBool = (v: any) => {
    if (v === true || v === 1 || String(v).toLowerCase() === "true") return true;
    if (v === false || v === 0 || String(v).toLowerCase() === "false") return false;
    return undefined;
  };

  return {
    id: String(realId),
    name: String(raw?.name ?? "Sin nombre"),
    photos,
    clinicalSummary: String(raw?.clinicalSummary ?? ""),
    state: (raw?.state ?? "AVAILABLE") as AState,
    attributes: {
      age: ageNumber,
      size: (attrs?.size ?? raw?.size ?? "MEDIUM") as Size,
      breed: String(attrs?.breed ?? raw?.breed ?? "Mestizo"),
      gender: (attrs?.gender ?? raw?.gender ?? "FEMALE") as "MALE" | "FEMALE",
      energy: (attrs?.energy ?? raw?.energy ?? "MEDIUM") as Energy,
      coexistence: {
        children: Boolean(attrs?.coexistence?.children ?? raw?.goodWith?.children ?? false),
        cats: Boolean(attrs?.coexistence?.cats ?? raw?.goodWith?.cats ?? false),
        dogs: Boolean(attrs?.coexistence?.dogs ?? raw?.goodWith?.dogs ?? false),
      },
    },
    personality: raw.personality
      ? {
          sociability: clamp5(raw.personality.sociability),
          energy: clamp5(raw.personality.energy),
          training: clamp5(raw.personality.training),
          adaptability: clamp5(raw.personality.adaptability),
        }
      : undefined,
    compatibility: raw.compatibility
      ? {
          kids: toBool(raw.compatibility.kids),
          cats: toBool(raw.compatibility.cats),
          dogs: toBool(raw.compatibility.dogs),
          apartment: toBool(raw.compatibility.apartment),
        }
      : undefined,
    clinicalHistory: raw.clinicalHistory
      ? {
          lastVaccination: raw.clinicalHistory.lastVaccination ?? null,
          sterilized: toBool(raw.clinicalHistory.sterilized),
          conditions: raw.clinicalHistory.conditions ?? null,
        }
      : undefined,
  };
}

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<LocalFilters>({});

  const [animals, setAnimals] = useState<DisplayAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(0);

  // Estados para secciones colapsables
  const [openSections, setOpenSections] = useState({
    size: true,
    age: true,
    health: true,
    compatibility: true,
    energy: true,
  });

  // Estado para bottom sheet móvil
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Función para manejar el click en "Adoptar"
  function handleAdoptClick(animalId: string) {
    const nextPath = `/adoptar/${animalId}/aplicar`;
    if (!user || user.role !== "ADOPTANTE") {
      navigate(`/login?next=${encodeURIComponent(nextPath)}`, { replace: true });
    } else {
      navigate(nextPath);
    }
  }

  // Carga desde API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiClient.getAnimals();
        const list = (res as any)?.animals ?? (res as any)?.data?.animals ?? res;

        if (!Array.isArray(list)) {
          throw new Error("Respuesta inesperada del servidor.");
        }

        const normalized: DisplayAnimal[] = [];
        let skippedCount = 0;

        for (const item of list) {
          const n = normalizeAnimal(item);
          if (n) normalized.push(n);
          else skippedCount++;
        }

        if (mounted) {
          setAnimals(normalized);
          setSkipped(skippedCount);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || "Error cargando catálogo");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Prefiltrar catálogo con las preferencias del usuario (si completó onboarding)
  useEffect(() => {
    (async () => {
      try {
        const me = await apiClient.getProfile().catch(() => null);
        const prefs = (me as any)?.profile?.preferences;
        if (prefs?.completed) {
          setFilters({
            size: [prefs.preferredSize as Size],
            energy: [prefs.preferredEnergy as Energy],
          });
        }
      } catch {
        // si hay error, no pasa nada: mostramos el catálogo general
      }
    })();
  }, []);

  // Filtro en memoria
  const filteredAnimals = useMemo(() => {
    let list = [...animals];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.attributes.breed.toLowerCase().includes(q)
      );
    }

    if (filters.size?.length) {
      list = list.filter((a) => filters.size!.includes(a.attributes.size));
    }

    if (filters.energy?.length) {
      list = list.filter((a) => filters.energy!.includes(a.attributes.energy));
    }

    // Filtro por grupo de edad
    if (filters.ageGroup?.length) {
      list = list.filter((a) => {
        return filters.ageGroup!.some((groupValue) => {
          const group = AGE_GROUPS.find((g) => g.value === groupValue);
          if (!group) return false;
          return a.attributes.age >= group.min && a.attributes.age <= group.max;
        });
      });
    }

    // Filtro por esterilización
    if (filters.sterilized !== undefined) {
      list = list.filter((a) => a.clinicalHistory?.sterilized === filters.sterilized);
    }

    // Filtro por condiciones médicas
    if (filters.hasConditions !== undefined) {
      list = list.filter((a) => {
        const hasConditions = !!a.clinicalHistory?.conditions && a.clinicalHistory.conditions.trim() !== "";
        return filters.hasConditions ? hasConditions : !hasConditions;
      });
    }

    // Filtro por compatibilidad
    if (filters.compatibility?.length) {
      list = list.filter((a) => {
        return filters.compatibility!.every((comp) => {
          if (comp === "kids") return a.compatibility?.kids === true;
          if (comp === "cats") return a.compatibility?.cats === true;
          if (comp === "dogs") return a.compatibility?.dogs === true;
          if (comp === "apartment") return a.compatibility?.apartment === true;
          return true;
        });
      });
    }

    // (personalityMin existe en el tipo, pero todavía no lo usas visualmente)

    return list;
  }, [animals, searchTerm, filters]);

  const toggleFilter = <T extends string>(key: keyof LocalFilters, value: T) => {
    setFilters((prev) => {
      const arr = (prev[key] as T[] | undefined) ?? [];
      const exists = arr.includes(value);
      const next = exists ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next.length ? next : undefined };
    });
  };

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.size?.length) count += filters.size.length;
    if (filters.energy?.length) count += filters.energy.length;
    if (filters.ageGroup?.length) count += filters.ageGroup.length;
    if (filters.sterilized !== undefined) count++;
    if (filters.hasConditions !== undefined) count++;
    if (filters.compatibility?.length) count += filters.compatibility.length;
    return count;
  }, [filters]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({});
  };

  // Render común del contenido de filtros (se reutiliza en desktop y móvil)
  const renderFiltersContent = (isMobile = false) => (
    <div className="p-5 space-y-4">
      {/* Tamaño */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("size")}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-primary-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Tamaño</h3>
          </div>
          {openSections.size ? (
            <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          )}
        </button>
        {openSections.size && (
          <div className="space-y-2 pl-6">
            {SIZE_OPTIONS.map((size) => (
              <label
                key={size}
                className="flex items-center cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!!filters.size?.includes(size)}
                    onChange={() => toggleFilter("size", size)}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-primary-600 peer-checked:bg-primary-600 transition-all flex items-center justify-center">
                    {filters.size?.includes(size) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {sizeLabel(size)}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Grupo de edad */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("age")}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <div className="flex items-center gap-2">
            <Cake className="h-4 w-4 text-primary-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Edad</h3>
          </div>
          {openSections.age ? (
            <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          )}
        </button>
        {openSections.age && (
          <div className="space-y-2 pl-6">
            {AGE_GROUPS.map((group) => (
              <label
                key={group.value}
                className="flex items-center cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!!filters.ageGroup?.includes(group.value)}
                    onChange={() => toggleFilter("ageGroup", group.value)}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-primary-600 peer-checked:bg-primary-600 transition-all flex items-center justify-center">
                    {filters.ageGroup?.includes(group.value) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {group.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Estado de salud */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("health")}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Estado de salud</h3>
          </div>
          {openSections.health ? (
            <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          )}
        </button>
        {openSections.health && (
          <div className="space-y-2 pl-6">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={filters.sterilized === true}
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      sterilized: e.target.checked ? true : undefined,
                    }));
                  }}
                />
                <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-primary-600 peer-checked:bg-primary-600 transition-all flex items-center justify-center">
                  {filters.sterilized === true && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                Esterilizado
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={filters.hasConditions === false}
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      hasConditions: e.target.checked ? false : undefined,
                    }));
                  }}
                />
                <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-primary-600 peer-checked:bg-primary-600 transition-all flex items-center justify-center">
                  {filters.hasConditions === false && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                Sin condiciones médicas
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Compatibilidad */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("compatibility")}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Compatibilidad</h3>
          </div>
          {openSections.compatibility ? (
            <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          )}
        </button>
        {openSections.compatibility && (
          <div className="space-y-2 pl-6">
            {COMPATIBILITY_OPTIONS.map((comp) => (
              <label
                key={comp.value}
                className="flex items-center cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!!filters.compatibility?.includes(comp.value)}
                    onChange={() => toggleFilter("compatibility", comp.value)}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-primary-600 peer-checked:bg-primary-600 transition-all flex items-center justify-center">
                    {filters.compatibility?.includes(comp.value) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {comp.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Energía */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection("energy")}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Nivel de energía</h3>
          </div>
          {openSections.energy ? (
            <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          )}
        </button>
        {openSections.energy && (
          <div className="space-y-2 pl-6">
            {ENERGY_OPTIONS.map((energy) => (
              <label
                key={energy}
                className="flex items-center cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!!filters.energy?.includes(energy)}
                    onChange={() => toggleFilter("energy", energy)}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-primary-600 peer-checked:bg-primary-600 transition-all flex items-center justify-center">
                    {filters.energy?.includes(energy) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {energyLabel(energy)}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Botones finales */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium"
          onClick={clearAllFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar todos los filtros
        </Button>
      )}

      {isMobile && (
        <Button
          className="w-full mt-2"
          onClick={() => setMobileFiltersOpen(false)}
        >
          Aplicar filtros
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando catálogo…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-red-600 font-medium mb-2">No se pudo cargar el catálogo</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Animación para el bottom sheet */}
      <style>
        {`
          @keyframes slide-up {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.28s ease-out;
          }
        `}
      </style>

      {/* Bottom sheet de filtros en móvil */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end lg:hidden">
          <div className="w-full bg-white rounded-t-3xl shadow-xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary-600" />
                <h2 className="font-semibold text-lg">Filtros</h2>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {renderFiltersContent(true)}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Encabezado */}
          <div className="mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Encuentra tu compañero perfecto
            </h1>

            <p className="text-xl text-gray-600 mb-1">
              {filteredAnimals.length} caninos esperando un hogar lleno de amor
            </p>

            {skipped > 0 && (
              <p className="text-sm text-amber-600">
                Nota: {skipped} registro{skipped === 1 ? "" : "s"} se omitieron por datos incompletos.
              </p>
            )}
          </div>

          {/* Botón de filtros en móvil */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-2"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o raza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Layout principal con filtros a la izquierda y contenido a la derecha */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Panel de filtros - solo desktop */}
            <div className="hidden lg:block lg:w-72 flex-shrink-0">
              <div className="sticky top-6">
                <Card className="overflow-hidden shadow-md">
                  {/* Encabezado del panel de filtros */}
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-white" />
                        <h2 className="text-lg font-bold text-white">Filtros</h2>
                      </div>
                      {activeFiltersCount > 0 && (
                        <Badge className="bg-white text-primary-700 font-semibold">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </div>
                    {activeFiltersCount > 0 && (
                      <p className="text-primary-100 text-xs mt-1">
                        {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""} activo{activeFiltersCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {renderFiltersContent(false)}
                </Card>
              </div>
            </div>

            {/* Contenido principal - Grid de perritos */}
            <div className="flex-1 min-w-0">
              {filteredAnimals.length === 0 ? (
                <Card className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No encontramos resultados</h3>
                  <p className="text-gray-600 mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Limpiar filtros
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAnimals.map((animal) => {
                    const b = stateBadge(animal.state);
                    const { age, breed, size, energy } = animal.attributes;

                    return (
                      <Card
                        key={animal.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="aspect-square overflow-hidden rounded-t-2xl">
                          <img
                            src={urlFromBackend(animal.photos?.[0] || "")}
                            alt={`Foto de ${animal.name}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {animal.name}
                              </h3>
                              <p className="text-gray-600">{breed}</p>
                            </div>
                            <Badge variant={b.variant}>{b.label}</Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {age} {age === 1 ? "año" : "años"} • {ageBucket(age)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              {sizeLabel(size)} • {energyLabel(energy)}
                            </div>
                          </div>

                          {/* Badges de características destacadas */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {animal.clinicalHistory?.sterilized && (
                              <Badge size="sm" variant="success">Esterilizado</Badge>
                            )}
                            {animal.compatibility?.kids && <Badge size="sm">Con niños</Badge>}
                            {animal.compatibility?.cats && <Badge size="sm">Con gatos</Badge>}
                            {animal.compatibility?.dogs && <Badge size="sm">Con perros</Badge>}
                            {animal.compatibility?.apartment && <Badge size="sm">Apto depto</Badge>}
                          </div>

                          {/* Personalidad (si existe) */}
                          {animal.personality && (
                            <div className="mb-3 text-xs text-gray-600 space-y-0.5">
                              {animal.personality.sociability !== undefined && (
                                <div className="flex items-center justify-between">
                                  <span>Sociabilidad:</span>
                                  <div className="flex space-x-0.5">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full ${
                                          i < (animal.personality!.sociability ?? 0) ? "bg-primary-500" : "bg-gray-200"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                              {animal.personality.adaptability !== undefined && (
                                <div className="flex items-center justify-between">
                                  <span>Adaptabilidad:</span>
                                  <div className="flex space-x-0.5">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full ${
                                          i < (animal.personality!.adaptability ?? 0) ? "bg-primary-500" : "bg-gray-200"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {animal.clinicalSummary || "Salud validada y lista para adopción"}
                          </p>

                          <div className="flex gap-2">
                            <Link to={`/adoptar/${animal.id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full h-9 text-xs">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver más
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              className="flex-1 h-9 text-xs"
                              onClick={() => handleAdoptClick(animal.id)}
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Adoptar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogPage;
