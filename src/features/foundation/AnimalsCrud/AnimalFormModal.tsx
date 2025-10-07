import React, { useState } from "react";
import { apiClient, uploadAnimalPhoto } from "@/lib/api";
import type { Animal } from "@/types";

type Props = {
  open: boolean;
  onClose: () => void;
  editing?: Animal | null;
  onSaved: (a: Animal) => void;
};

export default function AnimalFormModal({ open, onClose, editing, onSaved }: Props) {
  const [name, setName] = useState(editing?.name ?? "");
  const [breed, setBreed] = useState(editing?.attributes.breed ?? "");
  const [age, setAge] = useState<number>(editing?.attributes.age ?? 1);
  const [size, setSize] = useState<"SMALL"|"MEDIUM"|"LARGE">(editing?.attributes.size ?? "MEDIUM");
  const [gender, setGender] = useState<"MALE"|"FEMALE">(editing?.attributes.gender ?? "FEMALE");
  const [energy, setEnergy] = useState<"LOW"|"MEDIUM"|"HIGH">(editing?.attributes.energy ?? "MEDIUM");
  const [children, setChildren] = useState<boolean>(editing?.attributes.coexistence.children ?? true);
  const [cats, setCats] = useState<boolean>(editing?.attributes.coexistence.cats ?? true);
  const [dogs, setDogs] = useState<boolean>(editing?.attributes.coexistence.dogs ?? true);
  const [clinicalSummary, setClinicalSummary] = useState(editing?.clinicalSummary ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      let photoUrl = editing?.photos?.[0] || "";
      if (photoFile) photoUrl = await uploadAnimalPhoto(photoFile);

      const payload: Partial<Animal> = {
        name,
        photos: photoUrl ? [photoUrl] : [],
        clinicalSummary,
        attributes: {
          age, size, breed, gender, energy,
          coexistence: { children, cats, dogs },
        } as any,
        state: editing?.state ?? "AVAILABLE",
      };

      const saved = editing
        ? await apiClient.updateAnimal(editing.id ?? (editing as any)._id, payload)
        : await apiClient.createAnimal(payload);

      onSaved(saved as any);
      onClose();
    } catch (err: any) {
      alert(err?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-3">
        <h2 className="text-lg font-semibold">{editing ? "Editar perro" : "Nuevo perro"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded p-2" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="border rounded p-2" placeholder="Raza" value={breed} onChange={e=>setBreed(e.target.value)} required />
          <input className="border rounded p-2" type="number" min={0} placeholder="Edad (años)" value={age} onChange={e=>setAge(Number(e.target.value))} required />
          <select className="border rounded p-2" value={size} onChange={e=>setSize(e.target.value as any)}>
            <option value="SMALL">Pequeño</option>
            <option value="MEDIUM">Mediano</option>
            <option value="LARGE">Grande</option>
          </select>
          <select className="border rounded p-2" value={gender} onChange={e=>setGender(e.target.value as any)}>
            <option value="FEMALE">Hembra</option>
            <option value="MALE">Macho</option>
          </select>
          <select className="border rounded p-2" value={energy} onChange={e=>setEnergy(e.target.value as any)}>
            <option value="LOW">Tranquilo</option>
            <option value="MEDIUM">Activo</option>
            <option value="HIGH">Muy activo</option>
          </select>
          <label className="flex items-center gap-2"><input type="checkbox" checked={children} onChange={e=>setChildren(e.target.checked)} />Con niños</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={cats} onChange={e=>setCats(e.target.checked)} />Con gatos</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={dogs} onChange={e=>setDogs(e.target.checked)} />Con perros</label>
        </div>

        <textarea className="border rounded p-2 w-full" rows={3} placeholder="Resumen clínico"
          value={clinicalSummary} onChange={e=>setClinicalSummary(e.target.value)} />

        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={e=>setPhotoFile(e.target.files?.[0] ?? null)} />
          {editing?.photos?.[0] && <img src={editing.photos[0]} className="h-12 rounded" />}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-3 py-2 border rounded" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
