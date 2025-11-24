import React, { useState } from "react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

  // Filtrar motivos según si es cachorro
  const availableReasons = REJECTION_REASONS.filter((reason) => {
    if (reason === "No acepta la esterilización obligatoria del cachorro.") {
      return animalIsPuppy;
    }
    return true;
  });

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
      <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
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

