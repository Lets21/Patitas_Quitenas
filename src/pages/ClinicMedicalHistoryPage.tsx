// frontend/src/pages/ClinicMedicalHistoryPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ClinicHeader from "@/components/admin/ClinicHeader";
import { useMedicalHistory, useSaveMedicalHistory } from "@/features/clinic/hooks/useMedicalHistory";
import { apiClient } from "@/lib/api";
import type { MedicalHistory } from "@/types";

export default function ClinicMedicalHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: history, isLoading } = useMedicalHistory(id || "");
  const saveMutation = useSaveMedicalHistory();

  const [formData, setFormData] = useState<Partial<MedicalHistory>>({
    lastVaccinationDate: null,
    sterilized: undefined,
    conditions: "",
    treatments: [],
    vaccines: [],
    surgeries: [],
    nextAppointment: null,
    notes: "",
  });

  const [treatmentsText, setTreatmentsText] = useState("");
  const [vaccinesText, setVaccinesText] = useState("");
  const [surgeriesText, setSurgeriesText] = useState("");

  // Cargar datos cuando el historial esté disponible
  useEffect(() => {
    if (history) {
      setFormData({
        lastVaccinationDate: history.lastVaccinationDate || null,
        sterilized: history.sterilized,
        conditions: history.conditions || "",
        treatments: history.treatments || [],
        vaccines: history.vaccines || [],
        surgeries: history.surgeries || [],
        nextAppointment: history.nextAppointment || null,
        notes: history.notes || "",
      });
      setTreatmentsText((history.treatments || []).join(", "));
      setVaccinesText((history.vaccines || []).join(", "));
      setSurgeriesText((history.surgeries || []).join(", "));
    }
  }, [history]);

  // Cargar información del animal
  const [animalName, setAnimalName] = useState<string>("");
  useEffect(() => {
    if (id) {
      apiClient
        .getAnimal(id)
        .then((animal: any) => {
          setAnimalName(animal.name || "Animal");
        })
        .catch(() => {
          setAnimalName("Animal");
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Convertir textos a arrays
    const treatments = treatmentsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const vaccines = vaccinesText
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    const surgeries = surgeriesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const dataToSave: Partial<MedicalHistory> = {
      ...formData,
      treatments,
      vaccines,
      surgeries,
    };

    saveMutation.mutate(
      { animalId: id, data: dataToSave },
      {
        onSuccess: () => {
          // Redirigir al dashboard de la clínica después de guardar
          navigate("/clinica");
        },
      }
    );
  };

  // Mostrar loading solo si realmente está cargando Y no hay datos en caché
  if (isLoading && !history) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClinicHeader />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Cargando historial médico...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClinicHeader />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/clinica")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al dashboard
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Historial médico - {animalName}
          </h1>
          <p className="text-gray-600 mt-2">
            Registra y actualiza la información médica del animal
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            {/* Última vacunación */}
            <div>
              <Input
                type="date"
                label="Última vacunación"
                value={
                  formData.lastVaccinationDate
                    ? new Date(formData.lastVaccinationDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastVaccinationDate: e.target.value ? e.target.value : null,
                  })
                }
              />
            </div>

            {/* Esterilización */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Esterilización
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sterilized"
                    checked={formData.sterilized === true}
                    onChange={() => setFormData({ ...formData, sterilized: true })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Sí</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sterilized"
                    checked={formData.sterilized === false}
                    onChange={() => setFormData({ ...formData, sterilized: false })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sterilized"
                    checked={formData.sterilized === undefined}
                    onChange={() => setFormData({ ...formData, sterilized: undefined })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">No especificado</span>
                </label>
              </div>
            </div>

            {/* Condiciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condiciones médicas
              </label>
              <textarea
                value={formData.conditions || ""}
                onChange={(e) =>
                  setFormData({ ...formData, conditions: e.target.value })
                }
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                placeholder="Describe las condiciones médicas del animal..."
              />
            </div>

            {/* Tratamientos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tratamientos
              </label>
              <Input
                value={treatmentsText}
                onChange={(e) => setTreatmentsText(e.target.value)}
                placeholder="Separar con comas (ej: Antibióticos, Analgésicos)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separa múltiples tratamientos con comas
              </p>
            </div>

            {/* Vacunas aplicadas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vacunas aplicadas
              </label>
              <Input
                value={vaccinesText}
                onChange={(e) => setVaccinesText(e.target.value)}
                placeholder="Separar con comas (ej: Rabia, Moquillo, Parvovirus)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separa múltiples vacunas con comas
              </p>
            </div>

            {/* Cirugías */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cirugías
              </label>
              <Input
                value={surgeriesText}
                onChange={(e) => setSurgeriesText(e.target.value)}
                placeholder="Separar con comas (ej: Esterilización, Extracción dental)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separa múltiples cirugías con comas
              </p>
            </div>

            {/* Próxima cita */}
            <div>
              <Input
                type="date"
                label="Próxima cita"
                value={
                  formData.nextAppointment
                    ? new Date(formData.nextAppointment).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nextAppointment: e.target.value ? e.target.value : null,
                  })
                }
              />
            </div>

            {/* Notas adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas adicionales
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                placeholder="Notas adicionales sobre el historial médico..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/clinica")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={saveMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar historial clínico
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}

