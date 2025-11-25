import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";

export default function AdoptApplyPage() {
  const nav = useNavigate();
  const { animalId = "" } = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [animal, setAnimal] = useState<any>(null);
  const [loadingAnimal, setLoadingAnimal] = useState(true);

  const [form, setForm] = useState({
    familyDecision: "" as "agree" | "accept" | "indifferent" | "disagree" | "",
    monthlyBudget: "" as "high" | "medium" | "low" | "",
    allowVisits: "" as "yes" | "no" | "",
    acceptSterilization: "" as "yes" | "no" | "",
    housing: "" as "Casa urbana" | "Casa de campo" | "Departamento" | "Quinta" | "Hacienda" | "Otro" | "",
    relationAnimals: "" as "positive" | "neutral" | "negative" | "",
    travelPlans: "" as "withOwner" | "withFamily" | "withFriend" | "paidCaretaker" | "hotel" | "other" | "",
    behaviorResponse: "" as "trainOrAccept" | "seekHelp" | "punish" | "abandon" | "",
    careCommitment: "" as "fullCare" | "mediumCare" | "lowCare" | "",
  });

  // Cargar información del animal para saber si es cachorro
  useEffect(() => {
    if (!animalId) return;
    (async () => {
      try {
        setLoadingAnimal(true);
        const animalData = await apiClient.getAnimal(animalId);
        setAnimal(animalData);
      } catch (e: any) {
        const errorMsg = e?.message || "Error cargando información del animal";
        setErr(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoadingAnimal(false);
      }
    })();
  }, [animalId]);

  // Determinar si es cachorro (<= 1 año)
  const isPuppy = animal?.attributes?.age !== undefined && animal.attributes.age <= 1;

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
      const { acceptSterilization, ...formWithoutSterilization } = form;
      const payloadForm = isPuppy ? form : formWithoutSterilization;
      await apiClient.createApplication({ animalId, form: payloadForm });
      // Mostrar mensaje de éxito
      toast.success(
        `¡Solicitud enviada exitosamente! ${animal?.name ? `Tu solicitud para adoptar a ${animal.name} será evaluada por la fundación.` : 'Tu puntuación será evaluada por la fundación.'}`,
        { duration: 5000 }
      );
      nav("/mis-solicitudes", { replace: true });
    } catch (e: any) {
      const errorMsg = e?.message || "Error al enviar la solicitud. Por favor, intenta nuevamente.";
      setErr(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  if (loadingAnimal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-500">Cargando información del animal...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to={`/adoptar/${animalId}`} className="inline-flex items-center text-gray-600 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Link>

        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-1">Solicitud de adopción</h1>
          <p className="text-sm text-gray-600 mb-6">
            Responde todas las preguntas. Estas respuestas serán evaluadas por la fundación.
          </p>

          {err && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{err}</div>}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* 1. Acuerdo familiar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Todos en la familia están de acuerdo con la adopción?
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.familyDecision}
                onChange={(e) => setForm({ ...form, familyDecision: e.target.value as any })}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="agree">Totalmente de acuerdo</option>
                <option value="accept">Aceptan</option>
                <option value="indifferent">Indiferentes</option>
                <option value="disagree">En desacuerdo</option>
              </select>
            </div>

            {/* 2. Tipo de vivienda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de vivienda
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.housing}
                onChange={(e) => setForm({ ...form, housing: e.target.value as any })}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="Casa urbana">Casa urbana</option>
                <option value="Casa de campo">Casa de campo</option>
                <option value="Departamento">Departamento</option>
                <option value="Quinta">Quinta</option>
                <option value="Hacienda">Hacienda</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* 3. Presupuesto mensual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto mensual estimado para el cuidado del perro
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.monthlyBudget}
                onChange={(e) => setForm({ ...form, monthlyBudget: e.target.value as any })}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="high">Alto (más de $100)</option>
                <option value="medium">Medio ($50 - $100)</option>
                <option value="low">Bajo (menos de $50)</option>
              </select>
            </div>

            {/* 4. Relación con animales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cómo describirías tu relación previa con animales?
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.relationAnimals}
                onChange={(e) => setForm({ ...form, relationAnimals: e.target.value as any })}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="positive">Muy positiva</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negativa</option>
              </select>
            </div>

            {/* 5. Planes de viaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Si necesitas viajar, ¿qué harías con el perro?
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.travelPlans}
                onChange={(e) => setForm({ ...form, travelPlans: e.target.value as any })}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="withOwner">Viajaría conmigo</option>
                <option value="withFamily">Lo dejaría con familia</option>
                <option value="withFriend">Lo dejaría con un amigo</option>
                <option value="paidCaretaker">Contrataría un cuidador</option>
                <option value="hotel">Lo dejaría en un hotel para perros</option>
                <option value="other">Otra opción</option>
              </select>
            </div>

            {/* 6. Actitud ante problemas de comportamiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Si el perro presenta problemas de comportamiento, ¿qué harías?
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.behaviorResponse}
                onChange={(e) => setForm({ ...form, behaviorResponse: e.target.value as any })}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="trainOrAccept">Lo entrenaría o lo aceptaría como es</option>
                <option value="seekHelp">Buscaría ayuda profesional</option>
                <option value="punish">Lo castigaría</option>
                <option value="abandon">Lo abandonaría o devolvería</option>
              </select>
            </div>

            {/* 7. Cuidados dispuestos a ofrecer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de cuidados que estás dispuesto a ofrecer
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.careCommitment}
                onChange={(e) => setForm({ ...form, careCommitment: e.target.value as any })}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="fullCare">Cuidados completos (veterinaria, alimentación premium, ejercicio diario)</option>
                <option value="mediumCare">Cuidados moderados (veterinaria básica, alimentación estándar)</option>
                <option value="lowCare">Cuidados básicos (solo lo esencial)</option>
              </select>
            </div>

            {/* 8. Acepta visitas periódicas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Aceptas que la fundación realice visitas periódicas para verificar el bienestar del perro?
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.allowVisits}
                onChange={(e) => setForm({ ...form, allowVisits: e.target.value as any })}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="yes">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* 9. Acepta esterilización (solo si es cachorro) */}
            {isPuppy && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Aceptas que el perro sea esterilizado?
                </label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.acceptSterilization}
                  onChange={(e) => setForm({ ...form, acceptSterilization: e.target.value as any })}
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => nav(-1)} type="button">
                Cancelar
              </Button>
              <Button type="submit" loading={loading} disabled={loading}>
                Enviar solicitud
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
