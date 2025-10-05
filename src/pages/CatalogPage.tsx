// src/pages/CatalogPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Heart, MapPin, Calendar, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api";

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
};

type LocalFilters = {
  size?: Size[];
  energy?: Energy[];
  q?: string;
};

// ========= Utilidades de UI =========
const SIZE_OPTIONS: Size[] = ["SMALL", "MEDIUM", "LARGE"];
const ENERGY_OPTIONS: Energy[] = ["LOW", "MEDIUM", "HIGH"];

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
      return { label: "Adoptado", variant: "neutral" as const };
    default:
      return { label: state, variant: "info" as const };
  }
};

// ========= Normalizador (clave para tu error) =========
const PLACEHOLDER =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200";

function normalizeAnimal(raw: any): DisplayAnimal | null {
  // Acepta estructuras viejas: { age, size, breed } o { attributes:{...} }
  const attrs = raw?.attributes ?? {};

  // Edad: intenta múltiples ubicaciones y convierte a número
  const ageNumber = Number(
    attrs?.age ?? raw?.age ?? (raw?.health?.age as any) ?? 0
  );
  if (!Number.isFinite(ageNumber) || ageNumber < 0) return null; // sin edad válida -> omitir

  const photos: string[] = Array.isArray(raw?.photos) && raw.photos.length ? raw.photos : [PLACEHOLDER];

  return {
    id: String(raw?.id ?? raw?._id ?? crypto.randomUUID()),
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
  };
}

const CatalogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<LocalFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const [animals, setAnimals] = useState<DisplayAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(0); // cuántos documentos omitimos por estar mal formados

  // Carga desde API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiClient.getAnimals(); // puede devolver ApiResponse o lista directa según tu cliente
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

  // Filtro en memoria para UI inmediata
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
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
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

          {/* Search + Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o raza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters((v) => !v)} className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <Card className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tamaño */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tamaño</h3>
                  <div className="space-y-2">
                    {SIZE_OPTIONS.map((size) => (
                      <label key={size} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={!!filters.size?.includes(size)}
                          onChange={() => toggleFilter("size", size)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{sizeLabel(size)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Energía */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Energía</h3>
                  <div className="space-y-2">
                    {ENERGY_OPTIONS.map((energy) => (
                      <label key={energy} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={!!filters.energy?.includes(energy)}
                          onChange={() => toggleFilter("energy", energy)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{energyLabel(energy)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Convivencia (placeholder) */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Convivencia</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" disabled />
                      <span className="ml-2 text-sm text-gray-700">Con niños</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" disabled />
                      <span className="ml-2 text-sm text-gray-700">Con gatos</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" disabled />
                      <span className="ml-2 text-sm text-gray-700">Con otros perros</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Grid de animales */}
        {filteredAnimals.length === 0 ? (
          <Card className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No encontramos resultados</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilters({});
              }}
            >
              Limpiar filtros
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAnimals.map((animal) => {
              const b = stateBadge(animal.state);
              const { age, breed, size, energy, coexistence } = animal.attributes;

              return (
                <Card
                  key={animal.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-video overflow-hidden rounded-t-2xl">
                    <img
                      src={animal.photos[0]}
                      alt={`Foto de ${animal.name}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
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

                    <div className="flex flex-wrap gap-1 mb-4">
                      {coexistence.children && <Badge size="sm">Con niños</Badge>}
                      {coexistence.cats && <Badge size="sm">Con gatos</Badge>}
                      {coexistence.dogs && <Badge size="sm">Con perros</Badge>}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {animal.clinicalSummary || "Salud validada y lista para adopción"}
                    </p>

                    <div className="flex gap-2">
                      <Link to={`/adoptar/${animal.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver más
                        </Button>
                      </Link>
                      <Link to="/login" className="flex-1">
                        <Button size="sm" className="w-full">
                          <Heart className="h-4 w-4 mr-2" />
                          Adoptar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
