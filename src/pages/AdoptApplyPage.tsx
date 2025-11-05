import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/auth";

export default function AdoptApplyPage() {
  const nav = useNavigate();
  const { animalId = "" } = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    homeType: "apartment",
    hasYard: false,
    hasChildren: false,
    otherPets: "none", // none/dog/cat/both
    activityLevel: "medium",
    hoursAway: 6,
    budget: "medium",
    experience: "first-time",
    notes: "",
  });

  if (!user || user.role !== "ADOPTANTE") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="mb-4">Debes iniciar sesión como Adoptante para continuar.</p>
          <Link to={`/login?next=/adoptar/${animalId}/aplicar`}>
            <Button>Ir al login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setErr("");
      await apiClient.createApplication({ animalId, form });
      nav("/mis-solicitudes", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Error creando la solicitud");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to={`/adoptar/${animalId}`} className="inline-flex items-center text-gray-600 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Link>

        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-1">Solicitud de adopción</h1>
          <p className="text-sm text-gray-600 mb-4">
            Responde brevemente; estas respuestas llegan a la Fundación.
          </p>

          {err && <div className="mb-4 text-sm text-red-600">{err}</div>}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm">
                Tipo de vivienda
                <select
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={form.homeType}
                  onChange={(e) => setForm({ ...form, homeType: e.target.value })}
                >
                  <option value="house">Casa</option>
                  <option value="apartment">Departamento</option>
                  <option value="other">Otro</option>
                </select>
              </label>

              <label className="text-sm">
                Patio
                <select
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={String(form.hasYard)}
                  onChange={(e) => setForm({ ...form, hasYard: e.target.value === "true" })}
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </label>

              <label className="text-sm">
                ¿Hay niños?
                <select
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={String(form.hasChildren)}
                  onChange={(e) => setForm({ ...form, hasChildren: e.target.value === "true" })}
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </label>

              <label className="text-sm">
                Otras mascotas
                <select
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={form.otherPets}
                  onChange={(e) => setForm({ ...form, otherPets: e.target.value })}
                >
                  <option value="none">Ninguna</option>
                  <option value="dog">Perro(s)</option>
                  <option value="cat">Gato(s)</option>
                  <option value="both">Perros y gatos</option>
                </select>
              </label>

              <label className="text-sm">
                Nivel de actividad
                <select
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={form.activityLevel}
                  onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
                >
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                </select>
              </label>

              <Input
                label="Horas fuera de casa (por día)"
                type="number"
                value={form.hoursAway}
                onChange={(e) => setForm({ ...form, hoursAway: Number(e.target.value) || 0 })}
              />

              <label className="text-sm">
                Presupuesto mensual
                <select
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                >
                  <option value="basic">Básico</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                </select>
              </label>

              <label className="text-sm">
                Experiencia con perros
                <select
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                >
                  <option value="first-time">Primera vez</option>
                  <option value="experienced">Con experiencia</option>
                </select>
              </label>
            </div>

            <textarea
              className="w-full border rounded px-3 py-2"
              rows={4}
              placeholder="Notas adicionales (opcional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => nav(-1)} type="button">Cancelar</Button>
              <Button type="submit" loading={loading} disabled={loading}>Enviar solicitud</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
