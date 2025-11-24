import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X } from "lucide-react";
import TrafficLight from "@/components/TrafficLight";
import { isPuppy, scoreApplication } from "@/utils/evaluationUtils";

interface ApplicationDetailsModalProps {
  applicationId: string;
  onClose: () => void;
}

interface ApplicationForm {
  familyDecision?: "agree" | "accept" | "indifferent" | "disagree";
  housing?: "Casa urbana" | "Casa de campo" | "Departamento" | "Quinta" | "Hacienda" | "Otro";
  monthlyBudget?: "high" | "medium" | "low";
  relationAnimals?: "positive" | "neutral" | "negative";
  travelPlans?: "withOwner" | "withFamily" | "withFriend" | "paidCaretaker" | "hotel" | "other";
  behaviorResponse?: "trainOrAccept" | "seekHelp" | "punish" | "abandon";
  careCommitment?: "fullCare" | "mediumCare" | "lowCare";
  allowVisits?: "yes" | "no";
  acceptSterilization?: "yes" | "no";
}

interface ApplicationData {
  _id: string;
  form?: ApplicationForm;
  animalId?: {
    _id: string;
    name: string;
    attributes?: {
      age?: number;
    };
  };
  adopterId?:
    | {
        _id?: string;
        email?: string;
        profile?: { firstName?: string; lastName?: string };
      }
    | string;
}

// Mapeo de valores a etiquetas legibles
const VALUE_LABELS: Record<string, Record<string, string>> = {
  familyDecision: {
    agree: "Totalmente de acuerdo",
    accept: "Aceptan",
    indifferent: "Indiferentes",
    disagree: "En desacuerdo",
  },
  housing: {
    "Casa urbana": "Casa urbana",
    "Casa de campo": "Casa de campo",
    "Departamento": "Departamento",
    "Quinta": "Quinta",
    "Hacienda": "Hacienda",
    "Otro": "Otro",
  },
  monthlyBudget: {
    high: "Alto (más de $100)",
    medium: "Medio ($50 - $100)",
    low: "Bajo (menos de $50)",
  },
  relationAnimals: {
    positive: "Muy positiva",
    neutral: "Neutral",
    negative: "Negativa",
  },
  travelPlans: {
    withOwner: "Viajaría conmigo",
    withFamily: "Lo dejaría con familia",
    withFriend: "Lo dejaría con un amigo",
    paidCaretaker: "Contrataría un cuidador",
    hotel: "Lo dejaría en un hotel para perros",
    other: "Otra opción",
  },
  behaviorResponse: {
    trainOrAccept: "Lo entrenaría o lo aceptaría como es",
    seekHelp: "Buscaría ayuda profesional",
    punish: "Lo castigaría",
    abandon: "Lo abandonaría o devolvería",
  },
  careCommitment: {
    fullCare: "Cuidados completos (veterinaria, alimentación premium, ejercicio diario)",
    mediumCare: "Cuidados moderados (veterinaria básica, alimentación estándar)",
    lowCare: "Cuidados básicos (solo lo esencial)",
  },
  allowVisits: {
    yes: "Sí",
    no: "No",
  },
  acceptSterilization: {
    yes: "Sí",
    no: "No",
  },
};

// Etiquetas de las preguntas
const QUESTION_LABELS: Record<keyof ApplicationForm, string> = {
  familyDecision: "¿Todos en la familia están de acuerdo con la adopción?",
  housing: "Tipo de vivienda",
  monthlyBudget: "Presupuesto mensual estimado para el cuidado del perro",
  relationAnimals: "¿Cómo describirías tu relación previa con animales?",
  travelPlans: "Si necesitas viajar, ¿qué harías con el perro?",
  behaviorResponse: "Si el perro presenta problemas de comportamiento, ¿qué harías?",
  careCommitment: "Nivel de cuidados que estás dispuesto a ofrecer",
  allowVisits: "¿Aceptas que la fundación realice visitas periódicas para verificar el bienestar del perro?",
  acceptSterilization: "¿Aceptas que el perro sea esterilizado?",
};

function formatValue(key: keyof ApplicationForm, value: any): string {
  if (value === null || value === undefined || value === "") {
    return "No especificado";
  }

  const valueMap = VALUE_LABELS[key];
  if (valueMap && valueMap[value]) {
    return valueMap[value];
  }

  return String(value);
}

function formatAdopterName(adopter?: ApplicationData["adopterId"]): string {
  if (!adopter) return "—";
  if (typeof adopter === "string") return adopter;
  const first = adopter.profile?.firstName ?? "";
  const last = adopter.profile?.lastName ?? "";
  const name = `${first} ${last}`.trim();
  return name || adopter.email || "—";
}

export default function ApplicationDetailsModal({
  applicationId,
  onClose,
}: ApplicationDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getApplication(applicationId);
        setApplication(data as any);
      } catch (err: any) {
        setError(err?.message || "Error al cargar la solicitud");
      } finally {
        setLoading(false);
      }
    }

    if (applicationId) {
      loadApplication();
    }
  }, [applicationId]);

  if (!applicationId) return null;

  const form = application?.form || {};
  const animalIsPuppy = isPuppy(application?.animalId);
  const adopterName = formatAdopterName(application?.adopterId);
  const evaluation = useMemo(
    () => scoreApplication(form, application?.animalId),
    [form, application?.animalId]
  );
  const detail = evaluation?.detail ?? {};

  // Orden de las preguntas según el formulario
  const questionOrder: (keyof ApplicationForm)[] = [
    "familyDecision",
    "housing",
    "monthlyBudget",
    "relationAnimals",
    "travelPlans",
    "behaviorResponse",
    "careCommitment",
    "allowVisits",
    "acceptSterilization", // Solo se muestra si es cachorro
  ];

  // Filtrar preguntas con valores y excluir acceptSterilization si no es cachorro
  const questionsWithValues = questionOrder
    .filter((key) => {
      if (key === "acceptSterilization" && !animalIsPuppy) {
        return false;
      }
      const value = form[key];
      if (value === null || value === undefined) {
        return false;
      }
      if (typeof value === "string") {
        return value.trim().length > 0;
      }
      return true;
    })
    .map((key) => {
      const detailEntry = detail[key];
      const normalizedScore =
        typeof detailEntry?.contribution === "number"
          ? detailEntry.contribution / 100
          : null;
      return {
        key,
        label: QUESTION_LABELS[key],
        value: formatValue(key, form[key]),
        score: normalizedScore,
      };
    });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Respuestas del cuestionario de adopción
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Postulante: <span className="font-medium text-gray-900">{adopterName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando respuestas...</div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        ) : questionsWithValues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay respuestas disponibles para esta solicitud.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionsWithValues.map((item) => (
                <div key={item.key} className="flex flex-col">
                  <label className="text-xs font-medium text-gray-500 mb-1">
                    {item.label}
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 flex items-center gap-2">
                    <TrafficLight value={item.score ?? 0} />
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span>Bueno</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span>Neutro</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span>Riesgoso</span>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </Card>
    </div>
  );
}

