import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { 
  Home, 
  Users, 
  Zap, 
  Ruler, 
  Heart, 
  Clock, 
  Scissors,
  PawPrint,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

type PreferenceState = {
  preferredSize: "SMALL" | "MEDIUM" | "LARGE";
  preferredEnergy: "LOW" | "MEDIUM" | "HIGH";
  hasChildren: boolean;
  otherPets: "none" | "dog" | "cat" | "both";
  dwelling: string;
  experienceLevel: "NONE" | "BEGINNER" | "INTERMEDIATE" | "EXPERT";
  activityLevel: "LOW" | "MEDIUM" | "HIGH";
  spaceSize: "SMALL" | "MEDIUM" | "LARGE";
  timeAvailable: "LOW" | "MEDIUM" | "HIGH";
  groomingCommitment: "LOW" | "MEDIUM" | "HIGH";
};

export default function OnboardingPreferencesPage() {
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [pref, setPref] = useState<PreferenceState>({
    preferredSize: "MEDIUM",
    preferredEnergy: "MEDIUM",
    hasChildren: false,
    otherPets: "none",
    dwelling: "apartment",
    experienceLevel: "BEGINNER",
    activityLevel: "MEDIUM",
    spaceSize: "MEDIUM",
    timeAvailable: "MEDIUM",
    groomingCommitment: "MEDIUM",
  });

  const updatePref = <K extends keyof PreferenceState>(key: K, value: PreferenceState[K]) => {
    setPref((p) => ({ ...p, [key]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.updateProfile({
        preferences: { ...pref, completed: true },
      } as any);
      toast.success("¡Preferencias guardadas! Conoce a tus mejores matches 🐾");
      nav("/recommendations", { replace: true });
    } catch (error: any) {
      toast.error(error?.message || "Error al guardar preferencias");
    } finally {
      setSaving(false);
    }
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Paso {step} de {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round((step / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-surface-50 to-secondary-50 py-12 px-4">
      <Card className="p-8 w-full max-w-3xl shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 shadow-lg">
            <PawPrint className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Encuentra tu compañero ideal
          </h1>
          <p className="text-gray-600">
            Responde estas preguntas para que podamos recomendarte los mejores matches
          </p>
        </div>

        <ProgressBar />

        <form onSubmit={onSubmit}>
          {/* Paso 1: Características básicas */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary-600" />
                Preferencias básicas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tamaño preferido */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Ruler className="h-4 w-4 text-primary-600" />
                    Tamaño preferido
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={pref.preferredSize}
                    onChange={(e) => updatePref("preferredSize", e.target.value as any)}
                  >
                    <option value="SMALL">Pequeño (hasta 10 kg)</option>
                    <option value="MEDIUM">Mediano (10-25 kg)</option>
                    <option value="LARGE">Grande (más de 25 kg)</option>
                  </select>
                </label>

                {/* Energía preferida */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Zap className="h-4 w-4 text-primary-600" />
                    Nivel de energía
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={pref.preferredEnergy}
                    onChange={(e) => updatePref("preferredEnergy", e.target.value as any)}
                  >
                    <option value="LOW">Tranquilo - Prefiere descansar</option>
                    <option value="MEDIUM">Moderado - Equilibrado</option>
                    <option value="HIGH">Activo - Necesita mucho ejercicio</option>
                  </select>
                </label>

                {/* Tu nivel de actividad */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Zap className="h-4 w-4 text-primary-600" />
                    Tu nivel de actividad
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={pref.activityLevel}
                    onChange={(e) => updatePref("activityLevel", e.target.value as any)}
                  >
                    <option value="LOW">Sedentario - Poco ejercicio</option>
                    <option value="MEDIUM">Moderado - Paseos regulares</option>
                    <option value="HIGH">Muy activo - Deportes/montañismo</option>
                  </select>
                </label>

                {/* Experiencia */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-primary-600" />
                    Experiencia con perros
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={pref.experienceLevel}
                    onChange={(e) => updatePref("experienceLevel", e.target.value as any)}
                  >
                    <option value="NONE">Ninguna - Primera vez</option>
                    <option value="BEGINNER">Principiante - Poca experiencia</option>
                    <option value="INTERMEDIATE">Intermedio - Experiencia moderada</option>
                    <option value="EXPERT">Experto - Mucha experiencia</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {/* Paso 2: Hogar y convivencia */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Home className="h-5 w-5 text-primary-600" />
                Tu hogar y familia
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de vivienda */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Home className="h-4 w-4 text-primary-600" />
                    Tipo de vivienda
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={pref.dwelling}
                    onChange={(e) => updatePref("dwelling", e.target.value)}
                  >
                    <option value="apartment">Departamento</option>
                    <option value="house">Casa</option>
                    <option value="house_with_yard">Casa con jardín</option>
                    <option value="other">Otro</option>
                  </select>
                </label>

                {/* Tamaño del espacio */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Ruler className="h-4 w-4 text-primary-600" />
                    Tamaño del espacio
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={pref.spaceSize}
                    onChange={(e) => updatePref("spaceSize", e.target.value as any)}
                  >
                    <option value="SMALL">Pequeño - Menos de 50 m²</option>
                    <option value="MEDIUM">Mediano - 50-100 m²</option>
                    <option value="LARGE">Grande - Más de 100 m²</option>
                  </select>
                </label>

                {/* Niños en casa */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Users className="h-4 w-4 text-primary-600" />
                    ¿Hay niños en casa?
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={String(pref.hasChildren)}
                    onChange={(e) => updatePref("hasChildren", e.target.value === "true")}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </label>

                {/* Otras mascotas */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <PawPrint className="h-4 w-4 text-primary-600" />
                    Otras mascotas
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={pref.otherPets}
                    onChange={(e) => updatePref("otherPets", e.target.value as any)}
                  >
                    <option value="none">Ninguna</option>
                    <option value="dog">Perro(s)</option>
                    <option value="cat">Gato(s)</option>
                    <option value="both">Perros y gatos</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {/* Paso 3: Compromiso y cuidados */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary-600" />
                Compromiso y disponibilidad
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tiempo disponible */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4 text-primary-600" />
                    Tiempo disponible diario
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={pref.timeAvailable}
                    onChange={(e) => updatePref("timeAvailable", e.target.value as any)}
                  >
                    <option value="LOW">Poco - Menos de 1 hora</option>
                    <option value="MEDIUM">Moderado - 1-3 horas</option>
                    <option value="HIGH">Mucho - Más de 3 horas</option>
                  </select>
                </label>

                {/* Compromiso de grooming */}
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Scissors className="h-4 w-4 text-primary-600" />
                    Cuidado del pelaje
                  </div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={pref.groomingCommitment}
                    onChange={(e) => updatePref("groomingCommitment", e.target.value as any)}
                  >
                    <option value="LOW">Bajo - Pelo corto, fácil</option>
                    <option value="MEDIUM">Moderado - Cepillado regular</option>
                    <option value="HIGH">Alto - Grooming frecuente</option>
                  </select>
                </label>
              </div>

              {/* Mensaje motivacional */}
              <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <p className="text-sm text-primary-800">
                  <strong>¡Casi listo!</strong> Con esta información, podremos recomendarte 
                  los caninos más compatibles con tu estilo de vida. ¡Prepárate para conocer 
                  a tu nuevo mejor amigo! 🐕❤️
                </p>
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="px-6"
            >
              Anterior
            </Button>

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="px-6 flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                loading={saving}
                disabled={saving}
                className="px-6 flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                <CheckCircle2 className="h-4 w-4" />
                Guardar y ver recomendaciones
              </Button>
            )}
          </div>
        </form>
      </Card>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
