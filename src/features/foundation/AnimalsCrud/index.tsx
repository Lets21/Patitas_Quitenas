// src/features/foundation/AnimalsCrud/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import FoundationHeader from "@/components/admin/FoundationHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Plus, Trash2, Edit, Upload, Search } from "lucide-react";
import { apiClient, urlFromBackend } from "@/lib/api";
import type { Animal } from "@/types";

type Draft = {
  id?: string;
  name: string;
  age: number;
  size: "SMALL" | "MEDIUM" | "LARGE";
  breed: string;
  gender: "MALE" | "FEMALE";
  energy: "LOW" | "MEDIUM" | "HIGH";
  coexistence: { children: boolean; cats: boolean; dogs: boolean };
  clinicalSummary: string;
  state: "AVAILABLE" | "RESERVED" | "ADOPTED";
  photos: File[];
  existingPhoto?: string;
  // Nuevos campos
  personality: { sociability?: number; energy?: number; training?: number; adaptability?: number };
  compatibility: { kids?: boolean; cats?: boolean; dogs?: boolean; apartment?: boolean };
  clinicalHistory: { lastVaccination?: string; sterilized?: boolean; conditions?: string };
};

const emptyDraft: Draft = {
  name: "",
  age: 1,
  size: "MEDIUM",
  breed: "",
  gender: "FEMALE",
  energy: "MEDIUM",
  coexistence: { children: true, cats: false, dogs: true },
  clinicalSummary: "",
  state: "AVAILABLE",
  photos: [],
  existingPhoto: undefined,
  personality: {},
  compatibility: {},
  clinicalHistory: {},
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

  // Carga usando apiClient (ya envía Authorization Bearer desde auth-storage)
  async function load() {
    try {
      setLoading(true);
      const { animals } = await apiClient.foundationListAnimals();
      setItems(animals ?? []);
    } catch (err: any) {
      console.error("[FOUND LIST] error:", err);
      alert(err?.message || "Error cargando animales");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
      age: a?.attributes?.age ?? 1,
      size: a?.attributes?.size ?? "MEDIUM",
      breed: a?.attributes?.breed ?? "",
      gender: a?.attributes?.gender ?? "FEMALE",
      energy: a?.attributes?.energy ?? "MEDIUM",
      coexistence: a?.attributes?.coexistence ?? {
        children: true,
        cats: false,
        dogs: true,
      },
      clinicalSummary: a?.clinicalSummary ?? "",
      state: a?.state ?? "AVAILABLE",
      photos: [],
      existingPhoto: a?.photos?.[0],
      personality: a?.personality ?? {},
      compatibility: a?.compatibility ?? {},
      clinicalHistory: a?.clinicalHistory ?? {},
    });
    setShowForm(true);
  }

  async function onDelete(id?: string) {
    if (!id) return alert("No se pudo determinar el id del registro.");
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      setDeletingId(id);
      await apiClient.foundationDeleteAnimal(id);
      await load();
    } catch (err: any) {
      alert(err?.message || "Error eliminando");
    } finally {
      setDeletingId(null);
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
      fd.append(
        "attributes",
        JSON.stringify({
          age: Number(draft.age) || 0,
          size: draft.size,
          breed: draft.breed.trim(),
          gender: draft.gender,
          energy: draft.energy,
          coexistence: draft.coexistence,
        })
      );

      if (draft.photos.length) {
        draft.photos.forEach((f) => fd.append("photos", f));
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

      if (draft.id) await apiClient.foundationUpdateAnimal(draft.id, fd);
      else await apiClient.foundationCreateAnimal(fd);

      setShowForm(false);
      setDraft({ ...emptyDraft });
      await load();
    } catch (err: any) {
      alert(err?.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  // Previews de nuevas fotos
  const photoPreviews = useMemo(
    () => draft.photos.map((f) => URL.createObjectURL(f)),
    [draft.photos]
  );

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
                      {a?.photos?.[0] ? (
                        <img
                          src={urlFromBackend(a.photos[0])}
                          alt={a?.name || "Foto"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin foto
                        </div>
                      )}
                    </div>

                    <div className="font-semibold">{a?.name}</div>
                    <div className="text-sm text-gray-600">{a?.attributes?.breed}</div>
                    <div className="text-sm text-gray-600">
                      {a?.attributes?.age} años • {a?.attributes?.size}
                    </div>

                    <div className="my-2">
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

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" onClick={() => openEdit(a)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onDelete(id)}
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
                      label="Raza"
                      value={draft.breed}
                      onChange={(e) => setDraft({ ...draft, breed: e.target.value })}
                    />
                    <Input
                      label="Edad (años)"
                      type="number"
                      value={draft.age}
                      onChange={(e) =>
                        setDraft({ ...draft, age: Number(e.target.value) || 0 })
                      }
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.coexistence.children}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            coexistence: {
                              ...draft.coexistence,
                              children: e.target.checked,
                            },
                          })
                        }
                      />
                      Con niños
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.coexistence.cats}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            coexistence: { ...draft.coexistence, cats: e.target.checked },
                          })
                        }
                      />
                      Con gatos
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.coexistence.dogs}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            coexistence: { ...draft.coexistence, dogs: e.target.checked },
                          })
                        }
                      />
                      Con perros
                    </label>
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
                        {draft.photos.length
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

                    {draft.id && draft.existingPhoto && draft.photos.length === 0 && (
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
    </>
  );
}
