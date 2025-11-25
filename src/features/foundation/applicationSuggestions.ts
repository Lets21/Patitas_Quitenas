const SUGGESTIONS_MAP: Record<string, Record<string, string>> = {
  allowVisits: {
    no: "El adoptante no acepta visitas periódicas, requisito esencial para garantizar el bienestar del perro.",
  },
  behaviorResponse: {
    punish:
      "Las técnicas de castigo afectan negativamente al perro y no son aceptadas como método de corrección por la fundación.",
    abandon: "La devolución o abandono no es compatible con una adopción responsable.",
  },
  monthlyBudget: {
    low: "El presupuesto parece insuficiente para cubrir gastos veterinarios básicos y una alimentación adecuada.",
  },
  relationAnimals: {
    negative: "La relación previa negativa con animales requiere una evaluación más profunda antes de autorizar la adopción.",
  },
  travelPlans: {
    other: "Los planes de viaje declarados no garantizan acompañamiento ni supervisión constante para el perro.",
  },
  careCommitment: {
    lowCare: "El nivel de cuidados ofrecido es muy básico y podría no cubrir necesidades esenciales del perro.",
  },
  familyDecision: {
    disagree: "No toda la familia está de acuerdo con la adopción, lo que incrementa el riesgo de devolución.",
  },
  acceptSterilization: {
    no: "La esterilización es una condición obligatoria de la fundación para asegurar el control reproductivo.",
  },
};

const RECOMMENDED_REASON_MAP: Record<string, Record<string, string | undefined>> = {
  allowVisits: {
    no: "El adoptante no acepta visitas de seguimiento.",
  },
  behaviorResponse: {
    punish: "Manejo inadecuado ante problemas de comportamiento.",
    abandon: "Manejo inadecuado ante problemas de comportamiento.",
  },
  monthlyBudget: {
    low: "El presupuesto mensual es insuficiente para cubrir los cuidados del perro.",
  },
  relationAnimals: {
    negative: "La experiencia previa con animales no es suficiente.",
  },
  travelPlans: {
    other: "El plan para cuidar al perro durante viajes no garantiza su bienestar.",
  },
  careCommitment: {
    lowCare: "El nivel de cuidados ofrecido es insuficiente.",
  },
  familyDecision: {
    disagree: "La familia no está completamente de acuerdo con la adopción.",
  },
  acceptSterilization: {
    no: "No acepta la esterilización obligatoria del cachorro.",
  },
};

export interface SuggestionEntry {
  field: string;
  value: string;
  message: string;
  reason?: string;
}

export function collectSuggestionEntries(form?: Record<string, any> | null): SuggestionEntry[] {
  if (!form) return [];
  const entries: SuggestionEntry[] = [];
  for (const [field, responses] of Object.entries(SUGGESTIONS_MAP)) {
    const rawValue = form[field];
    if (rawValue === null || rawValue === undefined || rawValue === "") continue;
    const suggestion = responses[String(rawValue)];
    if (suggestion) {
      const reason = RECOMMENDED_REASON_MAP[field]?.[String(rawValue)];
      entries.push({
        field,
        value: String(rawValue),
        message: suggestion,
        reason,
      });
    }
  }
  return entries;
}

export function detectSuggestionsFromForm(form?: Record<string, any> | null): string[] {
  return collectSuggestionEntries(form).map((entry) => entry.message);
}

export { SUGGESTIONS_MAP };


