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
  
  // ========== CAMPOS ML ==========
  const [breed2, setBreed2] = useState(editing?.attributes.breed2 ?? "");
  const [color1, setColor1] = useState(editing?.attributes.color1 ?? "Brown");
  const [color2, setColor2] = useState(editing?.attributes.color2 ?? "");
  const [color3, setColor3] = useState(editing?.attributes.color3 ?? "");
  const [maturitySize, setMaturitySize] = useState(editing?.attributes.maturitySize ?? "Medium");
  const [furLength, setFurLength] = useState(editing?.attributes.furLength ?? "Short");
  const [vaccinated, setVaccinated] = useState(editing?.attributes.vaccinated ?? "Not Sure");
  const [dewormed, setDewormed] = useState(editing?.attributes.dewormed ?? "Not Sure");
  const [sterilized, setSterilized] = useState(editing?.attributes.sterilized ?? "Not Sure");
  const [health, setHealth] = useState(editing?.attributes.health ?? "Healthy");
  const [fee, setFee] = useState<number>(editing?.attributes.fee ?? 0);
  
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
          // Campos ML
          breed2: breed2 || null,
          color1,
          color2: color2 || null,
          color3: color3 || null,
          maturitySize: maturitySize as any,
          furLength: furLength as any,
          vaccinated: vaccinated as any,
          dewormed: dewormed as any,
          sterilized: sterilized as any,
          health: health as any,
          fee,
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-4xl space-y-4 my-8">
        <h2 className="text-xl font-semibold">{editing ? "Editar perro" : "Nuevo perro"}</h2>

        {/* Información Básica */}
        <div className="border-b pb-3">
          <h3 className="text-md font-semibold mb-2">📋 Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="border rounded p-2" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} required />
            <input className="border rounded p-2" placeholder="Raza principal" value={breed} onChange={e=>setBreed(e.target.value)} required />
            <input className="border rounded p-2" placeholder="Raza secundaria (opcional)" value={breed2} onChange={e=>setBreed2(e.target.value)} />
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
          </div>
        </div>

        {/* Características Físicas (ML) */}
        <div className="border-b pb-3">
          <h3 className="text-md font-semibold mb-2">🎨 Características Físicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select className="border rounded p-2" value={color1} onChange={e=>setColor1(e.target.value)}>
              <option value="">Color principal</option>
              <option value="Black">Negro</option>
              <option value="Brown">Marrón</option>
              <option value="White">Blanco</option>
              <option value="Yellow">Amarillo</option>
              <option value="Gray">Gris</option>
              <option value="Cream">Crema</option>
              <option value="Golden">Dorado</option>
            </select>
            <select className="border rounded p-2" value={color2} onChange={e=>setColor2(e.target.value)}>
              <option value="">Color secundario (opcional)</option>
              <option value="Black">Negro</option>
              <option value="Brown">Marrón</option>
              <option value="White">Blanco</option>
              <option value="Yellow">Amarillo</option>
              <option value="Gray">Gris</option>
              <option value="Cream">Crema</option>
              <option value="Golden">Dorado</option>
            </select>
            <select className="border rounded p-2" value={color3} onChange={e=>setColor3(e.target.value)}>
              <option value="">Color terciario (opcional)</option>
              <option value="Black">Negro</option>
              <option value="Brown">Marrón</option>
              <option value="White">Blanco</option>
              <option value="Yellow">Amarillo</option>
              <option value="Gray">Gris</option>
              <option value="Cream">Crema</option>
              <option value="Golden">Dorado</option>
            </select>
            <select className="border rounded p-2" value={maturitySize} onChange={e=>setMaturitySize(e.target.value)}>
              <option value="Small">Tamaño adulto: Pequeño</option>
              <option value="Medium">Tamaño adulto: Mediano</option>
              <option value="Large">Tamaño adulto: Grande</option>
              <option value="Extra Large">Tamaño adulto: Extra Grande</option>
            </select>
            <select className="border rounded p-2" value={furLength} onChange={e=>setFurLength(e.target.value)}>
              <option value="Short">Pelo: Corto</option>
              <option value="Medium">Pelo: Mediano</option>
              <option value="Long">Pelo: Largo</option>
            </select>
            <input className="border rounded p-2" type="number" min={0} placeholder="Tarifa adopción ($)" value={fee} onChange={e=>setFee(Number(e.target.value))} />
          </div>
        </div>

        {/* Salud y Comportamiento */}
        <div className="border-b pb-3">
          <h3 className="text-md font-semibold mb-2">🏥 Salud y Comportamiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select className="border rounded p-2" value={vaccinated} onChange={e=>setVaccinated(e.target.value)}>
              <option value="Yes">Vacunado: Sí</option>
              <option value="No">Vacunado: No</option>
              <option value="Not Sure">Vacunado: No seguro</option>
            </select>
            <select className="border rounded p-2" value={dewormed} onChange={e=>setDewormed(e.target.value)}>
              <option value="Yes">Desparasitado: Sí</option>
              <option value="No">Desparasitado: No</option>
              <option value="Not Sure">Desparasitado: No seguro</option>
            </select>
            <select className="border rounded p-2" value={sterilized} onChange={e=>setSterilized(e.target.value)}>
              <option value="Yes">Esterilizado: Sí</option>
              <option value="No">Esterilizado: No</option>
              <option value="Not Sure">Esterilizado: No seguro</option>
            </select>
            <select className="border rounded p-2" value={health} onChange={e=>setHealth(e.target.value)}>
              <option value="Healthy">Salud: Saludable</option>
              <option value="Minor Injury">Salud: Lesión menor</option>
              <option value="Serious Injury">Salud: Lesión grave</option>
            </select>
            <select className="border rounded p-2" value={energy} onChange={e=>setEnergy(e.target.value as any)}>
              <option value="LOW">Energía: Tranquilo</option>
              <option value="MEDIUM">Energía: Activo</option>
              <option value="HIGH">Energía: Muy activo</option>
            </select>
          </div>
        </div>

        {/* Compatibilidad */}
        <div className="border-b pb-3">
          <h3 className="text-md font-semibold mb-2">👨‍👩‍👧‍👦 Compatibilidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={children} onChange={e=>setChildren(e.target.checked)} />Con niños</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={cats} onChange={e=>setCats(e.target.checked)} />Con gatos</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={dogs} onChange={e=>setDogs(e.target.checked)} />Con perros</label>
          </div>
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
