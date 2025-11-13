// Componente para mostrar las respuestas del formulario de adopción de manera legible
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
  homeType: "Tipo de vivienda",
  hasYard: "Tiene patio",
  hasChildren: "Hay niños",
  otherPets: "Otras mascotas",
  activityLevel: "Nivel de actividad",
  hoursAway: "Horas fuera de casa",
  budget: "Presupuesto",
  experience: "Experiencia con perros",
  notes: "Notas adicionales",
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
  otherPets: {
    ninguno: "Ninguna",
    perro: "Perro(s)",
    gato: "Gato(s)",
    ambos: "Perros y gatos",
  },
  activityLevel: {
    bajo: "Bajo",
    medio: "Medio",
    alto: "Alto",
  },
  budget: {
    básico: "Básico",
    medio: "Medio",
    alto: "Alto",
  },
  experience: {
    primera_vez: "Primera vez",
    con_experiencia: "Con experiencia",
  },
};

function formatValue(key: string, value: any): string {
  if (value === null || value === undefined || value === "") {
    return "No especificado";
  }

  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  if (typeof value === "number") {
    if (key === "hoursAway") {
      return `${value} horas por día`;
    }
    return String(value);
  }

  const valueMap = VALUE_LABELS[key];
  if (valueMap && valueMap[value]) {
    return valueMap[value];
  }

  return String(value);
}

export default function ApplicationFormView({ form }: { form: FormData }) {
  if (!form || Object.keys(form).length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">No hay respuestas disponibles</div>
    );
  }

  // Campos del nuevo formulario (prioridad)
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

  // Campos antiguos (solo si no hay campos nuevos)
  const OLD_FORM_FIELDS = [
    "homeType",
    "hasYard",
    "hasChildren",
    "otherPets",
    "activityLevel",
    "hoursAway",
    "budget",
    "experience",
    "notes",
  ];

  // Verificar si hay campos del nuevo formulario
  const hasNewFormFields = NEW_FORM_FIELDS.some(
    (field) => form[field as keyof FormData] !== null &&
      form[field as keyof FormData] !== undefined &&
      form[field as keyof FormData] !== ""
  );

  // Determinar qué campos mostrar
  const fieldsToShow = hasNewFormFields ? NEW_FORM_FIELDS : OLD_FORM_FIELDS;

  // Filtrar solo campos con valores y que estén en la lista de campos a mostrar
  const fieldsWithValues = fieldsToShow
    .map((key) => [key, form[key as keyof FormData]])
    .filter(([_, value]) => {
      return value !== null && value !== undefined && value !== "";
    });

  if (fieldsWithValues.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">No hay respuestas disponibles</div>
    );
  }

  // Ordenar los campos según el orden definido
  const orderedFields = fieldsWithValues.sort((a, b) => {
    const indexA = fieldsToShow.indexOf(a[0] as string);
    const indexB = fieldsToShow.indexOf(b[0] as string);
    return indexA - indexB;
  });

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Respuestas del cuestionario
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {orderedFields.map(([key, value]) => {
          const typedKey = key as string; 
          const label = LABELS[typedKey] || typedKey;
          const formattedValue = formatValue(typedKey, value);

          return (
            <div key={String(typedKey)} className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 mb-1">{label}</span>
              <span className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

