// ---------- Roles / Usuarios ----------
export type UserRole = "ADOPTANTE" | "FUNDACION" | "CLINICA" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "PENDING_VERIFICATION";
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  preferredSize?: "SMALL" | "MEDIUM" | "LARGE";
  preferredEnergy?: "LOW" | "MEDIUM" | "HIGH";
  hasChildren?: boolean;
  otherPets?: "none" | "dog" | "cat" | "both";
  dwelling?: string;
  experienceLevel?: "NONE" | "BEGINNER" | "INTERMEDIATE" | "EXPERT";
  activityLevel?: "LOW" | "MEDIUM" | "HIGH";
  spaceSize?: "SMALL" | "MEDIUM" | "LARGE";
  timeAvailable?: "LOW" | "MEDIUM" | "HIGH";
  groomingCommitment?: "LOW" | "MEDIUM" | "HIGH";
  completed?: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  document?: string;
  experience?: string;
  livingSpace?: "APARTMENT" | "HOUSE" | "FARM";
  hasYard?: boolean;
  hasChildren?: boolean;
  hasOtherPets?: boolean;
  preferences?: UserPreferences; // Preferencias para matching KNN
}

// ---------- Animales ----------
export type AnimalState = "RESCUED" | "QUARANTINE" | "AVAILABLE" | "RESERVED" | "ADOPTED";

export interface AnimalPersonality {
  sociability?: number;   // 1..5
  energy?: number;        // 1..5
  training?: number;      // 1..5
  adaptability?: number;  // 1..5
}

export interface AnimalCompatibility {
  kids?: boolean;
  cats?: boolean;
  dogs?: boolean;
  apartment?: boolean;
}

export interface AnimalClinicalHistory {
  lastVaccination?: string | null; // ISO string o texto corto
  sterilized?: boolean;
  conditions?: string | null;
}

export interface Animal {
  // En frontend trabajamos con `id`. Si viene `_id` del backend, lo puedes mapear.
  id: string;
  _id?: string; // opcional: útil cuando consumes directamente la respuesta de Mongo
  name: string;
  photos: string[];
  attributes: {
    age: number;
    size: "SMALL" | "MEDIUM" | "LARGE";
    breed: string;
    gender: "MALE" | "FEMALE";
    energy: "LOW" | "MEDIUM" | "HIGH";
    coexistence: {
      children: boolean;
      cats: boolean;
      dogs: boolean;
    };
  };
  clinicalSummary: string;
  state: AnimalState;
  foundationId: string;
  createdAt: string;
  updatedAt: string;
  // Nuevos campos opcionales
  personality?: AnimalPersonality;
  compatibility?: AnimalCompatibility;
  clinicalHistory?: AnimalClinicalHistory;
}

// Filtros del catálogo. Mantén arrays para size/energy (multi-selección).
export interface FilterOptions {
  age?: string;                 // ej. "PUPPY|YOUNG|ADULT|SENIOR" o rango que definas
  size?: Array<"SMALL" | "MEDIUM" | "LARGE">;
  energy?: Array<"LOW" | "MEDIUM" | "HIGH">;
  breed?: string;
  coexistence?: Array<"children" | "cats" | "dogs">;
}

// Listado paginado genérico para animales
export interface ApiList<T> {
  animals: T[];
  total: number;
  page: number;
  limit: number;
}

// ---------- Solicitudes / Clínica / Seguimiento ----------
export interface Application {
  id: string;
  adoptantId: string;
  animalId: string;
  animal?: Animal;
  adoptant?: User;
  form: {
    motivation: string;
    experience: string;
    availability: string;
    compatibility: Record<string, any>;
    attachments: Attachment[];
  };
  status: "PENDING" | "PRE_APPROVED" | "REJECTED" | "APPROVED" | "DELIVERED";
  timeline: TimelineEvent[];
  foundationNotes?: string;
  clinicApproval?: boolean;
  knnScore?: number;
  knnFactors?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  status: Application["status"];
  date: string;
  notes?: string;
  userId: string;
}

export interface ClinicalRecord {
  id: string;
  animalId: string;
  vaccinations: Vaccination[];
  sterilized: boolean;
  dewormings: Deworming[];
  diagnoses: string[];
  treatments: string[];
  vetNotes: string;
  clinicUserId: string;
  approved?: boolean;
  updatedAt: string;
}

export interface Vaccination {
  name: string;
  date: string;
  nextDue?: string;
}

export interface Deworming {
  type: string;
  date: string;
  nextDue?: string;
}

export interface Visit {
  id: string;
  applicationId: string;
  scheduledAt: string;
  result?: "APPROVED" | "REJECTED";
  notes?: string;
  evidence: string[];
  createdAt: string;
}

export interface Followup {
  id: string;
  applicationId: string;
  type: "30D" | "90D";
  dueAt: string;
  status: "PENDING" | "COMPLETED" | "OVERDUE";
  evidence: Attachment[];
  notes?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  mime: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// Respuesta genérica para endpoints que devuelven un objeto/colección simple
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
