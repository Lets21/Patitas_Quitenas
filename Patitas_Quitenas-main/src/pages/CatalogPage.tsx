// src/pages/CatalogPage.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Heart, MapPin, Calendar, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { getAnimals } from "@/lib/api"; // usa mock/API unificado
import type { Animal } from "@/lib/api"; // tipo del nuevo modelo

type LocalFilters = {
  size?: Array<"small" | "medium" | "large">;
  energy?: Array<"low" | "medium" | "high">;
  q?: string;
};

const SIZE_OPTIONS: Array<"small" | "medium" | "large"> = ["small", "medium", "large"];
const ENERGY_OPTIONS: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];

const sizeLabel = (s: Animal["size"]) =>
  s === "small" ? "Pequeño" : s === "medium" ? "Mediano" : "Grande";

const energyLabel = (e: Animal["energy"]) =>
  e === "low" ? "Tranquilo" : e === "medium" ? "Activo" : "Muy activo";

const ageBucket = (years: number) =>
  years < 1 ? "Cachorro" : years < 3 ? "Joven" : years < 7 ? "Adulto" : "Senior";

const CatalogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<LocalFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Lista base desde mock/API
  const animals: Animal[] = getAnimals();

  // Filtro en memoria para UI rápida. Si quieres server-side, manda estos filtros a apiClient.getAnimals().
  const filteredAnimals = useMemo(() => {
    let list = [...animals];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        a => a.name.toLowerCase().includes(q) || a.breed.toLowerCase().includes(q)
      );
    }

    if (filters.size?.length) {
      list = list.filter(a => filters.size!.includes(a.size));
    }

    if (filters.energy?.length) {
      list = list.filter(a => filters.energy!.includes(a.energy));
    }

    return list;
  }, [animals, searchTerm, filters]);

  const toggleFilter = <T extends string>(
    key: keyof LocalFilters,
    value: T
  ) => {
    setFilters(prev => {
      const arr = (prev[key] as T[] | undefined) ?? [];
      const exists = arr.includes(value);
      const next = exists ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next.length ? next : undefined };
    });
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Encuentra tu compañero perfecto
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {filteredAnimals.length} caninos esperando un hogar lleno de amor
          </p>

          {/* Search + Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o raza..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(v => !v)} className="md:w-auto">
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
                    {SIZE_OPTIONS.map(size => (
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
                    {ENERGY_OPTIONS.map(energy => (
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

                {/* Convivencia (placeholder UI; con tu API lo conectamos) */}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No encontramos resultados
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
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
            {filteredAnimals.map(animal => (
              <Card key={animal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video overflow-hidden rounded-t-2xl">
                  <img
                    src={animal.photos[0]}
                    alt={`Foto de ${animal.name}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{animal.name}</h3>
                      <p className="text-gray-600">{animal.breed}</p>
                    </div>
                    <Badge variant="success">
                      {animal.status === "available" ? "Disponible" : animal.status === "reserved" ? "Reservado" : "Adoptado"}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {animal.age} {animal.age === 1 ? "año" : "años"} • {ageBucket(animal.age)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {sizeLabel(animal.size)} • {energyLabel(animal.energy)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {animal.goodWith?.children && <Badge size="sm">Con niños</Badge>}
                    {animal.goodWith?.cats && <Badge size="sm">Con gatos</Badge>}
                    {animal.goodWith?.dogs && <Badge size="sm">Con perros</Badge>}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {/* breve resumen con salud/raza */}
                    {animal.breed} • {animal.health.vaccinated ? "Vacunado" : "No vacunado"}
                    {animal.health.sterilized ? " • Esterilizado" : ""}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;