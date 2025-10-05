// src/features/foundation/AnimalsCrud/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit, Trash2, Dog } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api";
import type { Animal } from "@/types";

type FormState = {
  _id?: string;
  name: string;
  clinicalSummary: string;
  photo: string;
  attributes: {
    age: number | string;
    size: "SMALL" | "MEDIUM" | "LARGE";
    breed: string;
    gender: "MALE" | "FEMALE";
    energy: "LOW" | "MEDIUM" | "HIGH";
    coexistence: { children: boolean; cats: boolean; dogs: boolean };
  };
  state: "AVAILABLE" | "RESERVED" | "ADOPTED" | "RESCUED" | "QUARANTINE";
};

const toForm = (a?: Animal): FormState =>
  a
    ? {
        _id: (a as any)._id || (a as any).id,
        name: a.name,
        clinicalSummary: a.clinicalSummary || "",
        photo: a.photos?.[0] || "",
        attributes: {
          age: a.attributes.age,
          size: a.attributes.size,
          breed: a.attributes.breed,
          gender: a.attributes.gender,
          energy: a.attributes.energy,
          coexistence: {
            children: a.attributes.coexistence.children,
            cats: a.attributes.coexistence.cats,
            dogs: a.attributes.coexistence.dogs,
          },
        },
        state: a.state,
      }
    : {
        name: "",
        clinicalSummary: "",
        photo: "",
        attributes: {
          age: "",
          size: "MEDIUM",
          breed: "",
          gender: "MALE",
          energy: "MEDIUM",
          coexistence: { children: false, cats: false, dogs: false },
        },
        state: "AVAILABLE",
      };

const sizeLabel = (s: Animal["attributes"]["size"]) =>
  s === "SMALL" ? "Pequeño" : s === "MEDIUM" ? "Mediano" : "Grande";

const energyLabel = (e: Animal["attributes"]["energy"]) =>
  e === "LOW" ? "Tranquilo" : e === "MEDIUM" ? "Moderado" : "Activo";

const stateBadge = (s: Animal["state"]) => {
  switch (s) {
    case "AVAILABLE":
      return { label: "Disponible", variant: "success" as const };
    case "RESERVED":
      return { label: "Reservado", variant: "warning" as const };
    case "ADOPTED":
      return { label: "Adoptado", variant: "neutral" as const };
    case "RESCUED":
      return { label: "Rescatado", variant: "secondary" as const };
    case "QUARANTINE":
      return { label: "Cuarentena", variant: "error" as const };
    default:
      return { label: s, variant: "neutral" as const };
  }
};

export default function AnimalsCrud() {
  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [q, setQ] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(toForm());

  // Cargar animales
  const load = async () => {
    setLoading(true);
    const res = await apiClient.getAnimals();
    // Respuesta esperada: { animals, total }
    const data = (res as any)?.animals || [];
    setAnimals(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return animals;
    const s = q.toLowerCase();
    return animals.filter(
      a =>
        a.name.toLowerCase().includes(s) ||
        a.attributes.breed.toLowerCase().includes(s)
    );
  }, [animals, q]);

  const openCreate = () => {
    setForm(toForm());
    setShowModal(true);
  };

  const openEdit = (a: Animal) => {
    setForm(toForm(a));
    setShowModal(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<Animal> = {
        name: form.name.trim(),
        photos: form.photo ? [form.photo.trim()] : [],
        clinicalSummary: form.clinicalSummary.trim(),
        attributes: {
          age: Number(form.attributes.age) || 0,
          size: form.attributes.size,
          breed: form.attributes.breed.trim(),
          gender: form.attributes.gender,
          energy: form.attributes.energy,
          coexistence: { ...form.attributes.coexistence },
        },
        state: form.state,
      } as any;

      if (form._id) {
        await apiClient.updateAnimal(form._id, payload);
      } else {
        await apiClient.createAnimal(payload);
      }
      setShowModal(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  // Nota: eliminar requiere endpoint DELETE /animals/:id (cuando lo tengas).
  const onDelete = async (a: Animal) => {
    // Placeholder hasta que implementes DELETE en backend.
    // Puedes reemplazar con confirm + llamada real.
    console.warn("Implementa DELETE /animals/:id en el backend antes de usar esto.", a);
    alert("Eliminar aún no está implementado en el backend.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-xl">
                <Dog className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fundación · Animales</h1>
                <p className="text-sm text-gray-600">Gestión de perros publicados</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={openCreate} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo perro
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o raza…"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Perro</Th>
                  <Th>Edad</Th>
                  <Th>Raza / Tamaño</Th>
                  <Th>Convivencia</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Cargando…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Sin resultados
                    </td>
                  </tr>
                ) : (
                  filtered.map(a => {
                    const badge = stateBadge(a.state);
                    return (
                      <tr key={(a as any)._id || (a as any).id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden mr-3">
                              {a.photos?.[0] ? (
                                <img className="w-10 h-10 object-cover" src={a.photos[0]} alt={a.name} />
                              ) : (
                                <div className="w-10 h-10 flex items-center justify-center text-gray-400">🐶</div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{a.name}</div>
                              <div className="text-xs text-gray-500">{a.clinicalSummary || "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {a.attributes.age} {a.attributes.age === 1 ? "año" : "años"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {a.attributes.breed} / {sizeLabel(a.attributes.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-1">
                            {a.attributes.coexistence.children && <Badge size="sm">Niños</Badge>}
                            {a.attributes.coexistence.dogs && <Badge size="sm">Perros</Badge>}
                            {a.attributes.coexistence.cats && <Badge size="sm">Gatos</Badge>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={badge.variant as any} size="sm">
                            {badge.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              className="text-green-600 hover:text-green-800"
                              onClick={() => openEdit(a)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => onDelete(a)}
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden">
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold">
                {form._id ? "Editar perro" : "Nuevo perro"}
              </h3>
            </div>
            <form onSubmit={submit}>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                <Input
                  label="Raza"
                  value={form.attributes.breed}
                  onChange={e =>
                    setForm(f => ({ ...f, attributes: { ...f.attributes, breed: e.target.value } }))
                  }
                  required
                />
                <Input
                  type="number"
                  label="Edad (años)"
                  value={String(form.attributes.age)}
                  onChange={e =>
                    setForm(f => ({ ...f, attributes: { ...f.attributes, age: e.target.value } }))
                  }
                  min={0}
                  required
                />
                <Input
                  label="Foto (URL)"
                  value={form.photo}
                  onChange={e => setForm(f => ({ ...f, photo: e.target.value }))}
                  placeholder="https://…"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.attributes.size}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        attributes: { ...f.attributes, size: e.target.value as any },
                      }))
                    }
                  >
                    <option value="SMALL">Pequeño</option>
                    <option value="MEDIUM">Mediano</option>
                    <option value="LARGE">Grande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Energía</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.attributes.energy}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        attributes: { ...f.attributes, energy: e.target.value as any },
                      }))
                    }
                  >
                    <option value="LOW">Tranquilo</option>
                    <option value="MEDIUM">Moderado</option>
                    <option value="HIGH">Activo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.attributes.gender}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        attributes: { ...f.attributes, gender: e.target.value as any },
                      }))
                    }
                  >
                    <option value="MALE">Macho</option>
                    <option value="FEMALE">Hembra</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Convivencia
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {(["children", "dogs", "cats"] as const).map(key => (
                      <label key={key} className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.attributes.coexistence[key]}
                          onChange={e =>
                            setForm(f => ({
                              ...f,
                              attributes: {
                                ...f.attributes,
                                coexistence: {
                                  ...f.attributes.coexistence,
                                  [key]: e.target.checked,
                                },
                              },
                            }))
                          }
                        />
                        <span className="text-sm">
                          {key === "children" ? "Niños" : key === "dogs" ? "Perros" : "Gatos"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value as any }))}
                  >
                    <option value="AVAILABLE">Disponible</option>
                    <option value="RESERVED">Reservado</option>
                    <option value="ADOPTED">Adoptado</option>
                    <option value="RESCUED">Rescatado</option>
                    <option value="QUARANTINE">Cuarentena</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resumen clínico
                  </label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 min-h-[80px]"
                    value={form.clinicalSummary}
                    onChange={e => setForm(f => ({ ...f, clinicalSummary: e.target.value }))}
                  />
                </div>
              </div>

              <div className="p-5 border-t flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" loading={saving}>
                  {form._id ? "Guardar cambios" : "Crear"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}
