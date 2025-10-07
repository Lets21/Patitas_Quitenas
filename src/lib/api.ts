// src/lib/api.ts
import type {
  User,
  Animal,
  Application,
  ClinicalRecord,
  FilterOptions,
} from "../types";

/**
 * =======================
 * Config
 * =======================
 */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:4000/api/v1";

// Entra a mocks sólo si lo fuerzas con VITE_USE_MOCK=true
const USE_MOCK = String((import.meta as any).env?.VITE_USE_MOCK) === "true";

/**
 * =======================
 * Helper para URLs de archivos servidos por el backend (/uploads/..)
 * Si el valor ya es absoluto (http...), lo deja igual.
 * =======================
 */
export const urlFromBackend = (relOrAbs: string) => {
  if (!relOrAbs) return relOrAbs;
  if (relOrAbs.startsWith("http")) return relOrAbs;

  // API_BASE apunta a /api/v1. Quitamos /api/v1 para obtener el origin.
  const base = API_BASE.replace(/\/$/, "");
  const origin = base.replace(/\/api\/v1$/, "");
  return `${origin}${relOrAbs.startsWith("/") ? "" : "/"}${relOrAbs}`;
};

export async function uploadAnimalPhoto(file: File): Promise<string> {
  const token = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.token;
  const fd = new FormData();
  fd.append("photo", file);
  const res = await fetch(`${API_BASE}/foundation/animals/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Error al subir imagen");
  return data.url as string; // p.ej. "/uploads/17123-foo.jpg"
}

/**
 * =======================
 * Mocks compatibles (opcionales)
 * =======================
 */
const MOCK_ANIMALS: Animal[] = [
  {
    _id: "a1",
    id: "a1",
    name: "Luna",
    photos: [
      "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    ],
    attributes: {
      age: 2,
      size: "MEDIUM",
      breed: "Mestizo",
      gender: "FEMALE",
      energy: "MEDIUM",
      coexistence: { children: true, cats: false, dogs: true },
    },
    clinicalSummary: "Saludable, vacunada y esterilizada",
    state: "AVAILABLE",
    foundationId: "fundacion-demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "a2",
    id: "a2",
    name: "Max",
    photos: [
      "https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    ],
    attributes: {
      age: 4,
      size: "LARGE",
      breed: "Labrador Mix",
      gender: "MALE",
      energy: "HIGH",
      coexistence: { children: true, cats: true, dogs: true },
    },
    clinicalSummary: "Muy saludable, requiere ejercicio diario",
    state: "AVAILABLE",
    foundationId: "fundacion-demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "a3",
    id: "a3",
    name: "Bella",
    photos: [
      "https://images.pexels.com/photos/1938126/pexels-photo-1938126.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    ],
    attributes: {
      age: 1,
      size: "SMALL",
      breed: "Chihuahua Mix",
      gender: "FEMALE",
      energy: "LOW",
      coexistence: { children: false, cats: true, dogs: false },
    },
    clinicalSummary: "Muy tranquila, ideal para departamento",
    state: "AVAILABLE",
    foundationId: "fundacion-demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * =======================
 * Adaptadores/Helpers
 * =======================
 */

// El backend devuelve _id; en el front preferimos id.
// Esta función NO cambia el resto de la estructura.
function mapAnimal(dto: any): Animal {
  return {
    ...dto,
    id: dto.id ?? dto._id, // preferimos id si ya viene, si no, usamos _id
  };
}

/**
 * request<T> — devuelve siempre T “plano”
 * Lanza Error si la respuesta no es OK.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.token;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // podría ser 204 No Content; lo dejamos como null
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || "Request failed";
    throw new Error(msg);
  }

  return data as T;
}

/**
 * requestForm<T> — para multipart/form-data (NO setear Content-Type)
 */
async function requestForm<T>(
  endpoint: string,
  fd: FormData,
  method: "POST" | "PATCH" = "POST"
): Promise<T> {
  const token = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.token;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // NO pongas Content-Type aquí: el browser calcula el boundary
    },
    body: fd,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // 204 No Content posible
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || "Request failed";
    throw new Error(msg);
  }

  return data as T;
}

/**
 * =======================
 * ApiClient
 * =======================
 */
class ApiClient {
  // ===== Auth =====
  async login(email: string, password: string) {
    return request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { email: string; password: string; role: string; profile: any }) {
    return request<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return request<User>("/users/me");
  }

  async updateProfile(profile: Partial<User["profile"]>) {
    return request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ profile }),
    });
  }

  // ===== Animals (Catálogo público) =====
  async getAnimals(filters?: FilterOptions) {
    if (USE_MOCK) {
      await sleep(250);
      // filtrado básico opcional
      let list = [...MOCK_ANIMALS];
      if (filters) {
        if (filters.size?.length) {
          list = list.filter((a) => (filters.size as string[]).includes(a.attributes.size));
        }
        if (filters.energy?.length) {
          list = list.filter((a) => (filters.energy as string[]).includes(a.attributes.energy));
        }
        if ((filters as any).q) {
          const q = String((filters as any).q).toLowerCase();
          list = list.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.attributes.breed.toLowerCase().includes(q)
          );
        }
      }
      return { animals: list, total: list.length };
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        if (Array.isArray(v)) v.forEach((x) => params.append(k, String(x)));
        else params.set(k, String(v));
      });
    }
    const qs = params.toString();
    const data = await request<{ animals: any[]; total: number }>(
      `/animals${qs ? `?${qs}` : ""}`
    );
    return {
      animals: data.animals.map(mapAnimal),
      total: data.total,
    } as { animals: Animal[]; total: number };
  }

  async getAnimal(id: string) {
    if (USE_MOCK) {
      await sleep(150);
      const found = MOCK_ANIMALS.find((a) => (a.id ?? a._id) === id);
      if (!found) throw new Error("Animal no encontrado");
      return found;
    }
    const dto = await request<any>(`/animals/${id}`);
    return mapAnimal(dto);
  }

  async createAnimal(payload: Partial<Animal>) {
    const dto = await request<any>("/animals", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapAnimal(dto);
  }

  async updateAnimal(id: string, payload: Partial<Animal>) {
    const dto = await request<any>(`/animals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return mapAnimal(dto);
  }

  async deleteAnimal(id: string) {
    await request<void>(`/animals/${id}`, { method: "DELETE" });
  }

  // ===== Fundación – CRUD con fotos =====
  async foundationListAnimals() {
    // { animals, total }
    const data = await request<{ animals: any[]; total: number }>(`/foundation/animals`);
    return { animals: data.animals.map(mapAnimal), total: data.total };
  }

  async foundationCreateAnimal(fd: FormData) {
    // responde { data: Animal }
    const res = await requestForm<{ data: any }>(`/foundation/animals`, fd, "POST");
    return mapAnimal(res.data);
  }

  async foundationUpdateAnimal(id: string, fd: FormData) {
    // responde { data: Animal }
    const res = await requestForm<{ data: any }>(`/foundation/animals/${id}`, fd, "PATCH");
    return mapAnimal(res.data);
  }

  async foundationDeleteAnimal(id: string) {
    return request<{ ok: boolean }>(`/foundation/animals/${id}`, { method: "DELETE" });
  }

  async foundationUpdateClinical(id: string, record: any, evidence?: File[]) {
    const fd = new FormData();
    fd.append("record", JSON.stringify(record));
    (evidence || []).forEach((f) => fd.append("evidence", f));
    // responde { data: ClinicalRecord }
    return requestForm<{ data: ClinicalRecord }>(
      `/foundation/animals/${id}/clinical`,
      fd,
      "POST"
    );
  }

  // ===== Applications =====
  async createApplication(data: { animalId: string; form: any }) {
    return request<Application>("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyApplications() {
    return request<Application[]>("/applications/mine");
  }

  async getApplications(status?: string) {
    const params = status ? `?status=${status}` : "";
    return request<{ applications: Application[]; total: number }>(
      `/applications${params}`
    );
  }

  async updateApplicationStatus(id: string, status: string, notes?: string) {
    return request<Application>(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  }

  // ===== Clinical (público/clinica) =====
  async getClinicalRecord(animalId: string) {
    if (USE_MOCK) {
      await sleep(120);
      return {
        id: "mock",
        animalId,
        vaccinations: [{ name: "Rabia", date: "2025-05-12" }],
        sterilized: true,
        dewormings: [{ type: "General", date: "2025-03-01" }],
        diagnoses: [],
        treatments: [],
        vetNotes: "Chequeo general OK",
        clinicUserId: "clinica-demo",
        approved: true,
        updatedAt: new Date().toISOString(),
      } as ClinicalRecord;
    }
    return request<ClinicalRecord>(`/clinical/${animalId}`);
  }

  async updateClinicalRecord(animalId: string, data: Partial<ClinicalRecord>) {
    return request<ClinicalRecord>(`/clinical/${animalId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async approveClinical(animalId: string, approved: boolean) {
    return request<ClinicalRecord>(`/clinical/${animalId}/approval`, {
      method: "POST",
      body: JSON.stringify({ approved }),
    });
  }

  // ===== Analytics =====
  async getAnalytics(range?: string) {
    if (USE_MOCK) {
      await sleep(120);
      return {
        totalApplications: 42,
        completed: 17,
        avgTimeDays: 14,
        byStage: [
          { stage: "Recibida", count: 12 },
          { stage: "Evaluación", count: 8 },
          { stage: "Visita", count: 5 },
          { stage: "Aprobada", count: 17 },
        ],
      };
    }
    const params = range ? `?range=${range}` : "";
    return request<any>(`/analytics/overview${params}`);
  }
}

export const apiClient = new ApiClient();
