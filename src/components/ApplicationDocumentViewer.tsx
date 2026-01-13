// Componente para generar y mostrar documento PDF con las respuestas del formulario
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Download, Eye } from "lucide-react";
import toast from "react-hot-toast";
// @ts-ignore - jsPDF no tiene tipos perfectos
import jsPDF from "jspdf";

interface FormData {
  familyDecision?: string;
  monthlyBudget?: string;
  allowVisits?: string;
  acceptSterilization?: string;
  housing?: string;
  relationAnimals?: string;
  travelPlans?: string;
  behaviorResponse?: string;
  careCommitment?: string;
  // Campos antiguos (compatibilidad)
  homeType?: string;
  hasYard?: boolean;
  hasChildren?: boolean;
  otherPets?: string;
  activityLevel?: string;
  hoursAway?: number;
  budget?: string;
  experience?: string;
  notes?: string;
}

interface ApplicationDocumentViewerProps {
  form: FormData;
  animalName?: string;
  adopterName?: string;
  applicationDate?: string;
  scorePct?: number;
}

const LABELS: Record<string, string> = {
  familyDecision: "Acuerdo familiar",
  monthlyBudget: "Presupuesto mensual",
  allowVisits: "Acepta visitas periódicas",
  acceptSterilization: "Acepta esterilización",
  housing: "Tipo de vivienda",
  relationAnimals: "Relación con animales",
  travelPlans: "Planes de viaje",
  behaviorResponse: "Actitud ante problemas de comportamiento",
  careCommitment: "Nivel de cuidados",
};

const VALUE_LABELS: Record<string, Record<string, string>> = {
  familyDecision: {
    agree: "Totalmente de acuerdo",
    accept: "Aceptan",
    indifferent: "Indiferentes",
    disagree: "En desacuerdo",
  },
  monthlyBudget: {
    high: "Alto (más de $100)",
    medium: "Medio ($50 - $100)",
    low: "Bajo (menos de $50)",
  },
  allowVisits: {
    yes: "Sí",
    no: "No",
  },
  acceptSterilization: {
    yes: "Sí",
    no: "No",
  },
  housing: {
    "Casa urbana": "Casa urbana",
    "Casa de campo": "Casa de campo",
    "Departamento": "Departamento",
    "Quinta": "Quinta",
    "Hacienda": "Hacienda",
    "Otro": "Otro",
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
    fullCare: "Cuidados completos",
    mediumCare: "Cuidados moderados",
    lowCare: "Cuidados básicos",
  },
};

function formatValue(key: string, value: any): string {
  if (value === null || value === undefined || value === "") {
    return "No especificado";
  }

  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  const valueMap = VALUE_LABELS[key];
  if (valueMap && valueMap[value]) {
    return valueMap[value];
  }

  return String(value);
}

export default function ApplicationDocumentViewer({
  form,
  animalName,
  adopterName,
  applicationDate,
  scorePct,
}: ApplicationDocumentViewerProps) {
  const [showPreview, setShowPreview] = useState(false);

  // Campos del nuevo formulario (solo estos)
  const NEW_FORM_FIELDS = [
    "familyDecision",
    "housing",
    "monthlyBudget",
    "relationAnimals",
    "travelPlans",
    "behaviorResponse",
    "careCommitment",
    "allowVisits",
    "acceptSterilization",
  ];

  // Verificar que form existe y es un objeto válido
  if (!form || typeof form !== "object" || Array.isArray(form)) {
    return null;
  }

  // Filtrar solo campos del nuevo formulario con valores
  const fieldsWithValues = NEW_FORM_FIELDS
    .map((key) => [key, form[key as keyof FormData]])
    .filter(([_, value]) => {
      return value !== null && value !== undefined && value !== "";
    });

  if (fieldsWithValues.length === 0) {
    return (
      <div className="mt-4 border-t pt-4">
        <div className="text-sm text-gray-500 italic">No hay respuestas disponibles</div>
      </div>
    );
  }

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;

    // Título
    doc.setFontSize(18);
    doc.text("Solicitud de Adopción", 105, yPos, { align: "center" });
    yPos += 15;

    // Información general
    doc.setFontSize(12);
    if (animalName) {
      doc.text(`Animal: ${animalName}`, 20, yPos);
      yPos += 8;
    }
    if (adopterName) {
      doc.text(`Adoptante: ${adopterName}`, 20, yPos);
      yPos += 8;
    }
    if (applicationDate) {
      doc.text(`Fecha: ${new Date(applicationDate).toLocaleString("es-ES")}`, 20, yPos);
      yPos += 8;
    }
    if (scorePct !== undefined) {
      doc.text(`Puntuación: ${scorePct}%`, 20, yPos);
      yPos += 8;
    }

    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Respuestas del cuestionario
    doc.setFontSize(14);
    doc.text("Respuestas del Cuestionario", 20, yPos);
    yPos += 10;

    doc.setFontSize(11);
    fieldsWithValues.forEach(([key, value]) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      const label = LABELS[key] || key;
      const formattedValue = formatValue(key as string, value);

      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, yPos);
      doc.setFont("helvetica", "normal");
      
      // Dividir texto largo en múltiples líneas
      const lines = doc.splitTextToSize(formattedValue, 150);
      doc.text(lines, 30, yPos);
      yPos += lines.length * 6 + 3;
    });

    // Guardar PDF
    const fileName = `solicitud_${animalName || "adopcion"}_${adopterName || "adoptante"}_${Date.now()}.pdf`;
    doc.save(fileName);
    toast.success("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error generando PDF:", error);
      toast.error("Error al generar el PDF. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Respuestas del cuestionario
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "Ocultar" : "Vista previa"}
          </Button>
          <Button
            size="sm"
            onClick={generatePDF}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Download className="h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
      </div>

      {showPreview && (
        <Card className="p-6 mt-4 bg-white">
          <div className="space-y-4">
            {/* Información general */}
            {(animalName || adopterName || applicationDate || scorePct !== undefined) && (
              <div className="border-b pb-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Información General</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {animalName && (
                    <div>
                      <span className="text-gray-500">Animal: </span>
                      <span className="text-gray-900">{animalName}</span>
                    </div>
                  )}
                  {adopterName && (
                    <div>
                      <span className="text-gray-500">Adoptante: </span>
                      <span className="text-gray-900">{adopterName}</span>
                    </div>
                  )}
                  {applicationDate && (
                    <div>
                      <span className="text-gray-500">Fecha: </span>
                      <span className="text-gray-900">
                        {new Date(applicationDate).toLocaleString("es-ES")}
                      </span>
                    </div>
                  )}
                  {scorePct !== undefined && (
                    <div>
                      <span className="text-gray-500">Puntuación: </span>
                      <span className="text-gray-900 font-semibold">{scorePct}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Respuestas */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Respuestas del Cuestionario</h4>
              <div className="space-y-3">
                {fieldsWithValues.map(([key, value]) => {
                  const label = LABELS[key] || key;
                  const formattedValue = formatValue(key as string, value);

                  return (
                    <div key={key} className="border-l-4 border-primary-500 pl-4 py-2">
                      <div className="font-medium text-gray-900 mb-1">{label}</div>
                      <div className="text-gray-700">{formattedValue}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

