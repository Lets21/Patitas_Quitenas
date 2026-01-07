// src/features/foundation/AnimalsCrud/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import FoundationHeader from "@/components/admin/FoundationHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Plus, Trash2, Edit, Upload, Search, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { apiClient, urlFromBackend } from "@/lib/api";
import type { Animal } from "@/types";
import toast from "react-hot-toast";
import { getBreedLabelByCode } from "@/utils/breedCodes";

type Draft = {
  id?: string;
  name: string;
  ageMonths: number; // Edad en MESES (como el dataset)
  size: "SMALL" | "MEDIUM" | "LARGE";
  gender: "MALE" | "FEMALE";
  energy: "LOW" | "MEDIUM" | "HIGH";
  clinicalSummary: string;
  state: "AVAILABLE" | "RESERVED" | "ADOPTED";
  photos: File[];
  existingPhoto?: string;
  // Nuevos campos
  personality: { sociability?: number; energy?: number; training?: number; adaptability?: number };
  compatibility: { kids?: boolean; cats?: boolean; dogs?: boolean; apartment?: boolean };
  clinicalHistory: { lastVaccination?: string; sterilized?: boolean; conditions?: string };
  // Campos ML
  breed1Code?: number; // Código de raza principal (para ML)
  breed2Code?: number; // Código de raza secundaria (para mestizos)
  color1?: string;
  color2?: string;
  color3?: string;
  maturitySize?: "Small" | "Medium" | "Large" | "Extra Large";
  furLength?: "Short" | "Medium" | "Long";
  vaccinated?: "Yes" | "No" | "Not Sure";
  dewormed?: "Yes" | "No" | "Not Sure";
  sterilized?: "Yes" | "No" | "Not Sure";
  health?: "Healthy" | "Minor Injury" | "Serious Injury";
  fee?: number;
};

const emptyDraft: Draft = {
  name: "",
  ageMonths: 12, // 12 meses = 1 año por defecto
  size: "MEDIUM",
  gender: "FEMALE",
  energy: "MEDIUM",
  clinicalSummary: "",
  state: "AVAILABLE",
  photos: [],
  existingPhoto: undefined,
  personality: {},
  compatibility: {},
  clinicalHistory: {},
  // Campos ML
  breed1Code: 307, // Mestizo por defecto
  breed2Code: 0,   // Sin segunda raza por defecto
  color1: "Brown",
  color2: "",
  color3: "",
  maturitySize: "Medium",
  furLength: "Short",
  vaccinated: "Not Sure",
  dewormed: "Not Sure",
  sterilized: "Not Sure",
  health: "Healthy",
  fee: 0,
};

// Normaliza id para documentos que vienen con id o _id
function normId(a: any): string | undefined {
  return (a && (a.id || a._id)) ?? undefined;
}

export default function AnimalsCrud() {
  const [items, setItems] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>({ ...emptyDraft });
  
  // Estado para diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    animalId?: string;
    animalName?: string;
  }>({ isOpen: false });

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnimals, setTotalAnimals] = useState(0);
  const itemsPerPage = 12; // Mostrar 12 animales por página

  // Carga usando apiClient (ya envía Authorization Bearer desde auth-storage)
  async function load(page: number = 1) {
    try {
      setLoading(true);
      // Cargar con paginación desde el backend usando apiClient
      const result = await apiClient.getFoundationAnimals({
        page,
        limit: itemsPerPage,
        search: '',
        status: 'todos'
      });
      
      if (result && result.animals) {
        const animals = result.animals || [];
        const pagination = result.pagination || {};
        
        setItems(animals as any);
        setTotalAnimals(pagination.total || 0);
        setTotalPages(pagination.totalPages || 1);
        setCurrentPage(page);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error("[FOUND LIST] error:", err);
      toast.error(err?.message || "Error al cargar los animales");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("[AnimalsCrud] Component mounted, loading animals...");
    load(currentPage);
    
    return () => {
      console.log("[AnimalsCrud] Component unmounting...");
    };
  }, []);

  // Funciones de navegación
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      load(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      load(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      load(currentPage - 1);
    }
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((a: any) => {
      const name = String(a?.name || "").toLowerCase();
      const breed = String(a?.attributes?.breed || "").toLowerCase();
      return name.includes(q) || breed.includes(q);
    });
  }, [items, query]);

  function openNew() {
    setDraft({ ...emptyDraft });
    setShowForm(true);
  }

  function openEdit(a: any) {
    const id = normId(a);
    setDraft({
      id,
      name: a?.name ?? "",
      ageMonths: a?.ageMonths ?? 12,
      size: a?.attributes?.size ?? "MEDIUM",
      gender: a?.attributes?.gender ?? "FEMALE",
      energy: a?.attributes?.energy ?? "MEDIUM",
      clinicalSummary: a?.clinicalSummary ?? "",
      state: a?.state ?? "AVAILABLE",
      photos: [],
      existingPhoto: a?.photos?.[0],
      personality: a?.personality ?? {},
      compatibility: a?.compatibility ?? {},
      clinicalHistory: a?.clinicalHistory ?? {},
      // Campos ML
      breed1Code: a?.breed1Code ?? 307, // Mestizo por defecto
      breed2Code: a?.breed2Code ?? 0,
      color1: a?.attributes?.color1 ?? "Brown",
      color2: a?.attributes?.color2 ?? "",
      color3: a?.attributes?.color3 ?? "",
      maturitySize: a?.attributes?.maturitySize ?? "Medium",
      furLength: a?.attributes?.furLength ?? "Short",
      vaccinated: a?.attributes?.vaccinated ?? "Not Sure",
      dewormed: a?.attributes?.dewormed ?? "Not Sure",
      sterilized: a?.attributes?.sterilized ?? "Not Sure",
      health: a?.attributes?.health ?? "Healthy",
      fee: a?.attributes?.fee ?? 0,
    });
    setShowForm(true);
  }

  function onDelete(id?: string, name?: string) {
    if (!id) {
      toast.error("No se pudo determinar el ID del animal");
      return;
    }
    setConfirmDialog({ isOpen: true, animalId: id, animalName: name });
  }

  async function handleConfirmDelete() {
    const { animalId, animalName } = confirmDialog;
    if (!animalId) return;
    
    try {
      setDeletingId(animalId);
      await apiClient.foundationDeleteAnimal(animalId);
      toast.success(`${animalName || "El animal"} ha sido eliminado correctamente`);
      setConfirmDialog({ isOpen: false });
      await load(currentPage);
    } catch (err: any) {
      toast.error(err?.message || "Error al eliminar el animal");
    } finally {
      setDeletingId(null);
    }
  }

  // Función para cambiar el estado del animal (ADOPTED <-> AVAILABLE)
  async function toggleAnimalState(animalId: string | undefined, currentState: string, animalName?: string) {
    if (!animalId) return;
    
    const newState = currentState === "ADOPTED" ? "AVAILABLE" : "ADOPTED";
    const stateLabel = newState === "ADOPTED" ? "adoptado" : "disponible";
    
    try {
      // Crear FormData para actualizar solo el estado
      const fd = new FormData();
      fd.append("state", newState);
      
      await apiClient.foundationUpdateAnimal(animalId, fd);
      toast.success(`${animalName || "Animal"} marcado como ${stateLabel}`);
      await load(currentPage);
    } catch (err: any) {
      toast.error(err?.message || "Error al actualizar el estado del animal");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", draft.name.trim());
      fd.append("clinicalSummary", draft.clinicalSummary.trim());
      fd.append("state", draft.state);
      // Calcular edad en años para compatibilidad
      const ageInYears = Math.floor((draft.ageMonths || 0) / 12);
      
      fd.append("ageMonths", String(draft.ageMonths || 0));
      
      // Enviar códigos de raza directamente
      fd.append("breed1Code", String(draft.breed1Code || 0));
      fd.append("breed2Code", String(draft.breed2Code || 0));
      
      // Generar nombre de raza basado en los códigos
      const breedName = draft.breed2Code && draft.breed2Code !== 0
        ? `${getBreedLabelByCode(draft.breed1Code || 307)} + ${getBreedLabelByCode(draft.breed2Code)}`
        : getBreedLabelByCode(draft.breed1Code || 307);
      
      fd.append(
        "attributes",
        JSON.stringify({
          age: ageInYears,
          size: draft.size,
          breed: breedName,
          gender: draft.gender,
          energy: draft.energy,
          // Campos ML
          color1: draft.color1 || "Brown",
          color2: draft.color2 || null,
          color3: draft.color3 || null,
          maturitySize: draft.maturitySize || "Medium",
          furLength: draft.furLength || "Short",
          vaccinated: draft.vaccinated || "Not Sure",
          dewormed: draft.dewormed || "Not Sure",
          sterilized: draft.sterilized || "Not Sure",
          health: draft.health || "Healthy",
          fee: Number(draft.fee) || 0,
        })
      );

      if (draft.photos && draft.photos.length) {
        // Subir nuevas fotos
        draft.photos.forEach((f) => fd.append("photos", f));
        // En modo edición, si hay nuevas fotos, NO mantener las anteriores (reemplazar)
        if (draft.id) {
          fd.append("keepPhotos", JSON.stringify([]));
        }
      } else if (draft.id && draft.existingPhoto) {
        // Conservar fotos actuales si no subimos nuevas
        fd.append("keepPhotos", JSON.stringify([draft.existingPhoto]));
      }

      // Serializar los nuevos campos como JSON string en el campo "extra"
      const extra: any = {};
      if (Object.keys(draft.personality).length > 0) {
        extra.personality = draft.personality;
      }
      if (Object.keys(draft.compatibility).length > 0) {
        extra.compatibility = draft.compatibility;
      }
      if (Object.keys(draft.clinicalHistory).length > 0) {
        extra.clinicalHistory = draft.clinicalHistory;
      }
      if (Object.keys(extra).length > 0) {
        fd.append("extra", JSON.stringify(extra));
      }

      if (draft.id) {
        await apiClient.foundationUpdateAnimal(draft.id, fd);
        toast.success(`${draft.name} ha sido actualizado correctamente`);
      } else {
        await apiClient.foundationCreateAnimal(fd);
        toast.success(`${draft.name} ha sido creado exitosamente`);
      }

      setShowForm(false);
      setDraft({ ...emptyDraft });
      await load(currentPage);
    } catch (err: any) {
      toast.error(err?.message || "Error al guardar el animal");
    } finally {
      setSaving(false);
    }
  }

  // Previews de nuevas fotos
  const photoPreviews = useMemo(() => {
    if (!draft.photos || draft.photos.length === 0) return [];
    return draft.photos.map((f) => URL.createObjectURL(f));
  }, [draft.photos]);

  return (
    <>
      <FoundationHeader />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Perros de la fundación</h1>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  className="pl-9 pr-3 py-2 border rounded-lg w-64"
                  placeholder="Buscar por nombre o raza…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <Button onClick={openNew}>
                <Plus className="w-4 h-4 mr-2" /> Nuevo
              </Button>
            </div>
          </div>

          {loading ? (
            <Card className="p-6">Cargando…</Card>
          ) : filtered.length === 0 ? (
            <Card className="p-6">No hay registros</Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a: any) => {
                const id = normId(a);
                return (
                  <Card key={id ?? `${a?.name}-${a?.createdAt || Math.random()}`} className="p-4">
                    <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100">
                      {(a?.photo || a?.photos?.[0]) ? (
                        <img
                          src={urlFromBackend(a.photo || a.photos[0])}
                          alt={a?.name || "Foto"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin foto
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">{a?.name}</h3>
                        <Badge
                          variant={
                            a?.state === "AVAILABLE"
                              ? "success"
                              : a?.state === "RESERVED"
                              ? "warning"
                              : "default"
                          }
                        >
                          {a?.state === "AVAILABLE"
                            ? "Disponible"
                            : a?.state === "RESERVED"
                            ? "Reservado"
                            : "Adoptado"}
                        </Badge>
                      </div>

                      <div className="text-sm font-medium text-primary-600">
                        {a?.attributes?.breed || a?.breed || "Mestizo"}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
                          🎂 {(() => {
                            const months = a?.ageMonths || 0;
                            if (months < 12) {
                              return `${months} ${months === 1 ? 'mes' : 'meses'}`;
                            }
                            const years = Math.floor(months / 12);
                            const remainingMonths = months % 12;
                            if (remainingMonths === 0) {
                              return `${years} ${years === 1 ? 'año' : 'años'}`;
                            }
                            return `${years} ${years === 1 ? 'año' : 'años'} y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
                          })()}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
                          📏 {a?.attributes?.size === "SMALL" ? "Pequeño" : a?.attributes?.size === "MEDIUM" ? "Mediano" : a?.attributes?.size === "LARGE" ? "Grande" : "Mediano"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
                          ⚡ {a?.attributes?.energy === "LOW" ? "Tranquilo" : a?.attributes?.energy === "MEDIUM" ? "Moderado" : a?.attributes?.energy === "HIGH" ? "Energético" : "Moderado"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
                          {a?.attributes?.gender === "MALE" || a?.gender === "MALE" ? "♂️ Macho" : "♀️ Hembra"}
                        </span>
                      </div>

                      {(a?.clinicalSummary || a?.health) && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {a?.clinicalSummary || (Array.isArray(a?.health) ? a.health.join(", ") : "")}
                        </p>
                      )}

                      {/* Compatibilidad */}
                      {a?.compatibility && (
                        <div className="flex flex-wrap gap-1 text-xs">
                          {a.compatibility.kids && (
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded">👶 Niños</span>
                          )}
                          {a.compatibility.dogs && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">🐕 Perros</span>
                          )}
                          {a.compatibility.cats && (
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded">🐈 Gatos</span>
                          )}
                          {a.compatibility.apartment && (
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded">🏢 Apartamento</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" onClick={() => openEdit(a)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant={a?.state === "ADOPTED" ? "outline" : "default"}
                        onClick={() => toggleAnimalState(id, a?.state || "AVAILABLE", a?.name)}
                        className={a?.state === "ADOPTED" ? "" : "bg-green-600 hover:bg-green-700 text-white"}
                        title={a?.state === "ADOPTED" ? "Marcar como disponible" : "Marcar como adoptado"}
                      >
                        {a?.state === "ADOPTED" ? (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Disponible
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Adoptado
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onDelete(id, a?.name)}
                        disabled={!!deletingId && deletingId === id}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {deletingId === id ? "Eliminando…" : "Borrar"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Controles de paginación */}
          {!loading && filtered.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalAnimals)} de {totalAnimals} animales
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1 rounded ${
                        pageNum === currentPage
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {showForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col p-6 my-4">
                <div className="text-lg font-semibold mb-4 flex-shrink-0">
                  {draft.id ? "Editar perro" : "Nuevo perro"}
                </div>

                <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Nombre"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    />
                    <Input
                      label="Edad (meses)"
                      type="number"
                      min="1"
                      value={draft.ageMonths}
                      onChange={(e) =>
                        setDraft({ ...draft, ageMonths: Number(e.target.value) || 1 })
                      }
                      placeholder="Ej: 12 meses = 1 año"
                    />
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Tamaño</label>
                      <select
                        value={draft.size}
                        onChange={(e) =>
                          setDraft({ ...draft, size: e.target.value as Draft["size"] })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="SMALL">Pequeño</option>
                        <option value="MEDIUM">Mediano</option>
                        <option value="LARGE">Grande</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Género</label>
                      <select
                        value={draft.gender}
                        onChange={(e) =>
                          setDraft({ ...draft, gender: e.target.value as Draft["gender"] })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="FEMALE">Hembra</option>
                        <option value="MALE">Macho</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Energía</label>
                      <select
                        value={draft.energy}
                        onChange={(e) =>
                          setDraft({ ...draft, energy: e.target.value as Draft["energy"] })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="LOW">Tranquilo</option>
                        <option value="MEDIUM">Moderado</option>
                        <option value="HIGH">Activo</option>
                      </select>
                    </div>
                  </div>

                  {/* Características Físicas ML */}
                  <div className="border-t pt-3">
                    <h3 className="text-sm font-semibold mb-2">🎨 Características Físicas (ML)</h3>
                    
                    {/* RAZAS - IMPORTANTE PARA ML */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="md:col-span-2">
                        <p className="text-xs text-yellow-800 mb-2">
                          ⚠️ <strong>Importante:</strong> Aunque sea mestizo, selecciona las razas que lo componen (ej: Labrador + Beagle). 
                          Esto mejora significativamente la predicción del modelo ML.
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-semibold">
                          Raza principal *
                        </label>
                        <select
                          value={draft.breed1Code || 307}
                          onChange={(e) => setDraft({ ...draft, breed1Code: Number(e.target.value) })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                          required
                        >
                          <option value={307}>Mestizo (Mixed Breed)</option>
                          <option value={265}>Labrador Retriever</option>
                          <option value={232}>Golden Retriever</option>
                          <option value={94}>Pastor Alemán (German Shepherd)</option>
                          <option value={158}>Chihuahua</option>
                          <option value={76}>Beagle</option>
                          <option value={125}>Bulldog</option>
                          <option value={173}>Dachshund/Salchicha</option>
                          <option value={103}>Boxer</option>
                          <option value={250}>Husky</option>
                          <option value={287}>Rottweiler</option>
                          <option value={294}>Schnauzer</option>
                          <option value={174}>Dálmata</option>
                          <option value={295}>Shih Tzu</option>
                          <option value={273}>Pomerania</option>
                          <option value={277}>Pug/Carlino</option>
                          <option value={162}>Cocker Spaniel</option>
                          <option value={218}>Maltés</option>
                          <option value={268}>Pitbull</option>
                          <option value={99}>Border Collie</option>
                          <option value={178}>Doberman</option>
                          <option value={234}>Gran Danés</option>
                          <option value={91}>Terrier</option>
                          <option value={0}>Desconocida</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Raza secundaria (para mestizos)
                        </label>
                        <select
                          value={draft.breed2Code || 0}
                          onChange={(e) => setDraft({ ...draft, breed2Code: Number(e.target.value) })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        >
                          <option value={0}>Ninguna / Desconocida</option>
                          <option value={307}>Mestizo</option>
                          <option value={265}>Labrador Retriever</option>
                          <option value={232}>Golden Retriever</option>
                          <option value={94}>Pastor Alemán</option>
                          <option value={158}>Chihuahua</option>
                          <option value={76}>Beagle</option>
                          <option value={125}>Bulldog</option>
                          <option value={173}>Dachshund/Salchicha</option>
                          <option value={103}>Boxer</option>
                          <option value={250}>Husky</option>
                          <option value={287}>Rottweiler</option>
                          <option value={294}>Schnauzer</option>
                          <option value={174}>Dálmata</option>
                          <option value={295}>Shih Tzu</option>
                          <option value={273}>Pomerania</option>
                          <option value={277}>Pug/Carlino</option>
                          <option value={162}>Cocker Spaniel</option>
                          <option value={218}>Maltés</option>
                          <option value={268}>Pitbull</option>
                          <option value={99}>Border Collie</option>
                          <option value={178}>Doberman</option>
                          <option value={234}>Gran Danés</option>
                          <option value={91}>Terrier</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Color principal</label>
                        <select
                          value={draft.color1 || "Brown"}
                          onChange={(e) => setDraft({ ...draft, color1: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Black">Negro</option>
                          <option value="Brown">Marrón</option>
                          <option value="White">Blanco</option>
                          <option value="Yellow">Amarillo</option>
                          <option value="Gray">Gris</option>
                          <option value="Cream">Crema</option>
                          <option value="Golden">Dorado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Color secundario (opcional)</label>
                        <select
                          value={draft.color2 || ""}
                          onChange={(e) => setDraft({ ...draft, color2: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="">Ninguno</option>
                          <option value="Black">Negro</option>
                          <option value="Brown">Marrón</option>
                          <option value="White">Blanco</option>
                          <option value="Yellow">Amarillo</option>
                          <option value="Gray">Gris</option>
                          <option value="Cream">Crema</option>
                          <option value="Golden">Dorado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Color terciario (opcional)</label>
                        <select
                          value={draft.color3 || ""}
                          onChange={(e) => setDraft({ ...draft, color3: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="">Ninguno</option>
                          <option value="Black">Negro</option>
                          <option value="Brown">Marrón</option>
                          <option value="White">Blanco</option>
                          <option value="Yellow">Amarillo</option>
                          <option value="Gray">Gris</option>
                          <option value="Cream">Crema</option>
                          <option value="Golden">Dorado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Tamaño adulto</label>
                        <select
                          value={draft.maturitySize || "Medium"}
                          onChange={(e) => setDraft({ ...draft, maturitySize: e.target.value as any })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Small">Pequeño</option>
                          <option value="Medium">Mediano</option>
                          <option value="Large">Grande</option>
                          <option value="Extra Large">Extra Grande</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Largo de pelo</label>
                        <select
                          value={draft.furLength || "Short"}
                          onChange={(e) => setDraft({ ...draft, furLength: e.target.value as any })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Short">Corto</option>
                          <option value="Medium">Mediano</option>
                          <option value="Long">Largo</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Estado de Salud ML */}
                  <div className="border-t pt-3">
                    <h3 className="text-sm font-semibold mb-2">🏥 Estado de Salud (ML)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Vacunado</label>
                        <select
                          value={draft.vaccinated || "Not Sure"}
                          onChange={(e) => setDraft({ ...draft, vaccinated: e.target.value as any })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Yes">Sí</option>
                          <option value="No">No</option>
                          <option value="Not Sure">No seguro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Desparasitado</label>
                        <select
                          value={draft.dewormed || "Not Sure"}
                          onChange={(e) => setDraft({ ...draft, dewormed: e.target.value as any })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Yes">Sí</option>
                          <option value="No">No</option>
                          <option value="Not Sure">No seguro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Esterilizado</label>
                        <select
                          value={draft.sterilized || "Not Sure"}
                          onChange={(e) => setDraft({ ...draft, sterilized: e.target.value as any })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Yes">Sí</option>
                          <option value="No">No</option>
                          <option value="Not Sure">No seguro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Estado de salud</label>
                        <select
                          value={draft.health || "Healthy"}
                          onChange={(e) => setDraft({ ...draft, health: e.target.value as any })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Healthy">Saludable</option>
                          <option value="Minor Injury">Lesión menor</option>
                          <option value="Serious Injury">Lesión grave</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Resumen clínico</label>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      placeholder="Resumen clínico"
                      value={draft.clinicalSummary}
                      onChange={(e) =>
                        setDraft({ ...draft, clinicalSummary: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  {/* Personalidad */}
                  <div className="border-t pt-3">
                    <h3 className="text-sm font-semibold mb-2">Personalidad (1-5)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600">Sociabilidad</label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={draft.personality.sociability ?? 3}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              personality: { ...draft.personality, sociability: Number(e.target.value) },
                            })
                          }
                          className="w-full"
                        />
                        <span className="text-xs text-gray-500">{draft.personality.sociability ?? 3}/5</span>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Energía</label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={draft.personality.energy ?? 3}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              personality: { ...draft.personality, energy: Number(e.target.value) },
                            })
                          }
                          className="w-full"
                        />
                        <span className="text-xs text-gray-500">{draft.personality.energy ?? 3}/5</span>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Entrenamiento</label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={draft.personality.training ?? 3}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              personality: { ...draft.personality, training: Number(e.target.value) },
                            })
                          }
                          className="w-full"
                        />
                        <span className="text-xs text-gray-500">{draft.personality.training ?? 3}/5</span>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Adaptabilidad</label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={draft.personality.adaptability ?? 3}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              personality: { ...draft.personality, adaptability: Number(e.target.value) },
                            })
                          }
                          className="w-full"
                        />
                        <span className="text-xs text-gray-500">{draft.personality.adaptability ?? 3}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Compatibilidad */}
                  <div className="border-t pt-3">
                    <h3 className="text-sm font-semibold mb-2">Compatibilidad</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.compatibility.kids ?? false}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              compatibility: { ...draft.compatibility, kids: e.target.checked },
                            })
                          }
                        />
                        Con niños
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.compatibility.cats ?? false}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              compatibility: { ...draft.compatibility, cats: e.target.checked },
                            })
                          }
                        />
                        Con gatos
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.compatibility.dogs ?? false}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              compatibility: { ...draft.compatibility, dogs: e.target.checked },
                            })
                          }
                        />
                        Con perros
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.compatibility.apartment ?? false}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              compatibility: { ...draft.compatibility, apartment: e.target.checked },
                            })
                          }
                        />
                        Apartamento
                      </label>
                    </div>
                  </div>

                  {/* Historial clínico */}
                  <div className="border-t pt-3">
                    <h3 className="text-sm font-semibold mb-2">Historial clínico</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Última vacunación</label>
                        <input
                          type="text"
                          placeholder="Fecha o texto (ej: 2025-01-10)"
                          value={draft.clinicalHistory.lastVaccination ?? ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              clinicalHistory: { ...draft.clinicalHistory, lastVaccination: e.target.value },
                            })
                          }
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.clinicalHistory.sterilized ?? false}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              clinicalHistory: { ...draft.clinicalHistory, sterilized: e.target.checked },
                            })
                          }
                        />
                        Esterilizado
                      </label>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Condiciones</label>
                        <textarea
                          placeholder="Condiciones médicas (opcional)"
                          value={draft.clinicalHistory.conditions ?? ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              clinicalHistory: { ...draft.clinicalHistory, conditions: e.target.value },
                            })
                          }
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm hover:bg-gray-50">
                        <Upload className="w-4 h-4" />
                        Subir fotos
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              photos: Array.from(e.target.files || []),
                            })
                          }
                        />
                      </label>
                      <span className="text-xs text-gray-600">
                        {draft.photos && draft.photos.length
                          ? `${draft.photos.length} seleccionada(s)`
                          : "Sin archivos"}
                      </span>
                    </div>

                    {photoPreviews.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {photoPreviews.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            className="h-16 w-16 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}

                    {draft.id && draft.existingPhoto && (!draft.photos || draft.photos.length === 0) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Foto actual:</span>
                        <img
                          src={urlFromBackend(draft.existingPhoto)}
                          className="h-16 w-16 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  </div>

                  {/* Botones fijos en la parte inferior */}
                  <div className="flex justify-end gap-2 pt-4 border-t mt-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      type="button"
                      disabled={saving}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Guardando…" : draft.id ? "Guardar" : "Crear"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar este perrito?"
        message={`¿Estás seguro de que deseas eliminar a ${confirmDialog.animalName || "este animal"}? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={!!deletingId}
      />
    </>
  );
}
