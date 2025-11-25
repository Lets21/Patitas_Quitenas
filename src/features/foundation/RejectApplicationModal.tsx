import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { collectSuggestionEntries } from "./applicationSuggestions";
import { scoreApplication } from "@/utils/evaluationUtils";

interface RejectApplicationModalProps {
  applicationId: string;
  animalIsPuppy: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const REJECTION_REASONS = [
  "La familia no está completamente de acuerdo con la adopción.",
  "El entorno familiar no parece adecuado para recibir un perro.",
  "El tipo de vivienda no es adecuado para las necesidades del perro.",
  "El espacio disponible es insuficiente para el animal.",
  "El presupuesto mensual es insuficiente para cubrir los cuidados del perro.",
  "La experiencia previa con animales no es suficiente.",
  "El plan para cuidar al perro durante viajes no garantiza su bienestar.",
  "Manejo inadecuado ante problemas de comportamiento.",
  "El nivel de cuidados ofrecido es insuficiente.",
  "El adoptante no acepta visitas de seguimiento.",
  "Se seleccionó un adoptante más adecuado.",
  "No acepta la esterilización obligatoria del cachorro.",
  "Otro (especificar)…",
];

export default function RejectApplicationModal({
  applicationId,
  animalIsPuppy,
  onClose,
  onSuccess,
}: RejectApplicationModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<any | null>(null);
  const [loadingHints, setLoadingHints] = useState(false);
  const [hintsError, setHintsError] = useState<string | null>(null);

  // Filtrar motivos según si es cachorro
  const availableReasons = REJECTION_REASONS.filter((reason) => {
    if (reason === "No acepta la esterilización obligatoria del cachorro.") {
      return animalIsPuppy;
    }
    return true;
  });

  useEffect(() => {
    if (!applicationId) return;
    let isMounted = true;
    setLoadingHints(true);
    setHintsError(null);
    setApplication(null);

    apiClient
      .getApplication(applicationId)
      .then((data) => {
        if (!isMounted) return;
        setApplication(data);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setHintsError(err?.message || "No se pudo analizar la solicitud.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingHints(false);
      });

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  const form = application?.form ?? null;
  const evaluation = useMemo(
    () => scoreApplication(form ?? {}, application?.animalId),
    [form, application?.animalId]
  );
  const suggestionEntries = useMemo(() => collectSuggestionEntries(form), [form]);
  const rejectionSuggestions = suggestionEntries.map((entry) => entry.message);
  const showSuggestions =
    !loadingHints && (evaluation?.pct ?? 0) < 100 && rejectionSuggestions.length > 0;
  const suggestedReasons = useMemo(() => {
    const unique = new Set<string>();
    suggestionEntries.forEach((entry) => {
      if (entry.reason && availableReasons.includes(entry.reason)) {
        unique.add(entry.reason);
      }
    });
    return Array.from(unique);
  }, [suggestionEntries, availableReasons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedReason) {
      setError("Por favor selecciona un motivo de rechazo");
      return;
    }

    if (selectedReason === "Otro (especificar)…" && !customReason.trim()) {
      setError("Por favor especifica el motivo de rechazo");
      return;
    }

    const finalReason =
      selectedReason === "Otro (especificar)…"
        ? customReason.trim()
        : selectedReason;

    setIsSubmitting(true);
    try {
      await apiClient.rejectApplication(applicationId, { reason: finalReason });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Error al rechazar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Rechazar solicitud
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Motivo del rechazo <span className="text-red-500">*</span>
            </label>
            <select
              id="reason"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Selecciona un motivo...</option>
              {availableReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {suggestedReasons.length > 0 && (
              <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <p className="font-semibold">Motivos sugeridos según el cuestionario:</p>
                <p className="text-amber-800 mt-1">
                  Selecciona uno de los siguientes para justificar con mayor contexto.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedReasons.map((reason) => (
                    <button
                      type="button"
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        selectedReason === reason
                          ? "border-amber-500 bg-white text-amber-900"
                          : "border-amber-300 bg-amber-100 hover:bg-white"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedReason === "Otro (especificar)…" && (
            <div>
              <label
                htmlFor="customReason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Especifica el motivo <span className="text-red-500">*</span>
              </label>
              <textarea
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Describe el motivo del rechazo..."
                required
              />
            </div>
          )}

          {loadingHints && (
            <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded p-3">
              Analizando respuestas del cuestionario…
            </div>
          )}

          {showSuggestions && (
            <div className="flex gap-3 rounded-lg border border-[#ffcaca] bg-[#fff7f7] p-4">
              <span className="text-2xl" role="img" aria-label="Advertencia">
                ⚠️
              </span>
              <div className="space-y-2 text-sm text-gray-800">
                <div className="font-medium">
                  Sugerencias basadas en el cuestionario (score {evaluation?.pct ?? 0}%)
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {rejectionSuggestions.map((suggestion, idx) => (
                    <li key={`${suggestion}-${idx}`}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {hintsError && (
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
              No se pudieron cargar sugerencias automáticas: {hintsError}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Rechazando..." : "Rechazar solicitud"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

