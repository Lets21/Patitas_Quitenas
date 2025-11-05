import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";

export default function OnboardingPreferencesPage() {
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);
  const [pref, setPref] = useState({
    preferredSize: "MEDIUM",
    preferredEnergy: "MEDIUM",
    hasChildren: false,
    otherPets: "none",
    dwelling: "apartment",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.updateProfile({
        preferences: { ...pref, completed: true },
      } as any);
      nav("/catalog?personalized=1", { replace: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <Card className="p-6 w-full max-w-xl">
        <h1 className="text-2xl font-semibold mb-2">Cuéntanos tus preferencias</h1>
        <p className="text-gray-600 mb-4">Personalizaremos el catálogo para ti.</p>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            Tamaño preferido
            <select className="mt-1 w-full border rounded px-3 py-2"
              value={pref.preferredSize}
              onChange={(e)=>setPref(p=>({...p, preferredSize:e.target.value}))}>
              <option value="SMALL">Pequeño</option>
              <option value="MEDIUM">Mediano</option>
              <option value="LARGE">Grande</option>
            </select>
          </label>

          <label className="text-sm">
            Energía preferida
            <select className="mt-1 w-full border rounded px-3 py-2"
              value={pref.preferredEnergy}
              onChange={(e)=>setPref(p=>({...p, preferredEnergy:e.target.value}))}>
              <option value="LOW">Tranquilo</option>
              <option value="MEDIUM">Moderado</option>
              <option value="HIGH">Activo</option>
            </select>
          </label>

          <label className="text-sm">
            ¿Hay niños?
            <select className="mt-1 w-full border rounded px-3 py-2"
              value={String(pref.hasChildren)}
              onChange={(e)=>setPref(p=>({...p, hasChildren: e.target.value==="true"}))}>
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </label>

          <label className="text-sm">
            Otras mascotas
            <select className="mt-1 w-full border rounded px-3 py-2"
              value={pref.otherPets}
              onChange={(e)=>setPref(p=>({...p, otherPets:e.target.value}))}>
              <option value="none">Ninguna</option>
              <option value="dog">Perro(s)</option>
              <option value="cat">Gato(s)</option>
              <option value="both">Perros y gatos</option>
            </select>
          </label>

          <label className="text-sm md:col-span-2">
            Tipo de vivienda
            <select className="mt-1 w-full border rounded px-3 py-2"
              value={pref.dwelling}
              onChange={(e)=>setPref(p=>({...p, dwelling:e.target.value}))}>
              <option value="house">Casa</option>
              <option value="apartment">Departamento</option>
              <option value="other">Otro</option>
            </select>
          </label>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" loading={saving}>Guardar y ver catálogo</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
