// src/lib/api.ts
import type {
  User,
  Animal,
  Application,
  ClinicalRecord,
  FilterOptions,
  MedicalHistory,
} from "../types";

// === IMPORTA EL STORE PARA LEER EL TOKEN EN TIEMPO REAL ===
import { useAuthStore } from "@/lib/auth";

/* =========================================================================
   CONFIG
   Lee VITE_API_URL (origin del backend). Normaliza para que termine en /api/v1
   ========================================================================= */
const RAW_URL = (import.meta as any).env?.VITE_API_URL?.trim() ?? "";
const ORIGIN = (RAW_URL || "http://localhost:4000").replace(/\/+$/, "");
const API_BASE = ORIGIN.endsWith("/api/v1") ? ORIGIN : `${ORIGIN}/api/v1`;

// Modo mock opcional
const USE_MOCK = String((import.meta as any).env?.VITE_USE_MOCK) === "true";

/* =========================================================================
   Helpers de URL de archivos servidos por el backend (/uploads/...)
   ========================================================================= */
export const urlFromBackend = (relOrAbs: string) => {
  if (!relOrAbs) return relOrAbs;
  if (/^https?:\/\//i.test(relOrAbs)) return relOrAbs;
  if (relOrAbs.startsWith("/uploads/")) return `${ORIGIN}${relOrAbs}`;
  return relOrAbs;
};

/* =========================================================================
   Lectura robusta del token
   - 1º: Zustand store en memoria
   - 2º: localStorage (persist de Zustand)
   ========================================================================= */
function getToken(): string | null {
  try {
    const mem = useAuthStore.getState()?.token;
    if (mem) return mem;
  } catch {}
  try {
    const persisted = JSON.parse(localStorage.getItem("auth-storage") || "null");
    return persisted?.state?.token ?? null;
  } catch {
    return null;
  }
}

/* =========================================================================
   Subida simple de foto (multipart) para Fundación
   ========================================================================= */
export async function uploadAnimalPhoto(file: File): Promise<string> {
  const token = getToken();
  const fd = new FormData();
  fd.append("photo", file);
  const res = await fetch(`${API_BASE}/foundation/animals/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Error al subir imagen");
  return data.url as string; // p.ej. "/uploads/17123-foo.jpg"
}

/* =========================================================================
   MOCKS (opcionales)
   ========================================================================= */
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

/* =========================================================================
   Adaptadores / Helpers
   ========================================================================= */
function mapAnimal(dto: any): Animal {
  return { ...dto, id: dto.id ?? dto._id };
}

// Acepta { token } | { accessToken } | { jwt } | { data:{ token } } etc.
function extractToken(payload: any): string | null {
  if (!payload) return null;
  const p = payload.data ?? payload;
  return p.token ?? p.accessToken ?? p.jwt ?? null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  console.log(`[API Request] ${options.method || "GET"} ${API_BASE}${endpoint}`, { hasToken: !!token });

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
    body: options.body,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // 204 No Content posible
  }

  console.log(`[API Response] ${options.method || "GET"} ${endpoint}`, { status: res.status, ok: res.ok, data });

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    console.error(`[API Error] ${endpoint}:`, msg, data);
    throw new Error(msg);
  }

  return data as T;
}

async function requestForm<T>(
  endpoint: string,
  fd: FormData,
  method: "POST" | "PATCH" = "POST"
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: fd,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

/* =========================================================================
   ApiClient
   ========================================================================= */
class ApiClient {
  // ===== Auth =====
  async login(email: string, password: string) {
    // Mapeo flexible del token
    const raw = await request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const user: User = (raw.data?.user ?? raw.user) as User;
    const token = extractToken(raw);
    if (!token) {
      // Si tu backend devuelve el token en header Set-Cookie (httpOnly) y no en JSON,
      // la app seguirá funcionando porque el header Authorization no es estrictamente necesario.
      // Pero para nuestras llamadas con Authorization, exigimos uno.
      throw new Error("El backend no devolvió un token de acceso.");
    }
    return { user, token } as { user: User; token: string };
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

  // src/lib/api.ts
async getAnimal(id: string) {
  if (!id) throw new Error("ID inválido");
  const safeId = encodeURIComponent(String(id).trim().replace(/^\/+/, ""));
  const dto = await request<any>(`/animals/${safeId}`); // <-- siempre barra
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
    const response = await request<{ ok: boolean; data: { animals: any[]; pagination: any } }>(`/foundation/animals`);
    const animalsData = response?.data?.animals || [];
    const animals = Array.isArray(animalsData) ? animalsData.map(mapAnimal) : [];
    return { animals, total: response?.data?.pagination?.total ?? 0 };
  }

  async foundationCreateAnimal(fd: FormData) {
    const res = await requestForm<{ data: any }>(`/foundation/animals`, fd, "POST");
    if (!res?.data) throw new Error("Invalid response from server");
    return mapAnimal(res.data);
  }

  async foundationUpdateAnimal(id: string, fd: FormData) {
    const res = await requestForm<{ data: any }>(`/foundation/animals/${id}`, fd, "PATCH");
    if (!res?.data) throw new Error("Invalid response from server");
    return mapAnimal(res.data);
  }

  async foundationDeleteAnimal(id: string) {
    return request<{ ok: boolean }>(`/foundation/animals/${id}`, { method: "DELETE" });
  }

  async foundationUpdateClinical(id: string, record: any, evidence?: File[]) {
    const fd = new FormData();
    fd.append("record", JSON.stringify(record));
    (evidence || []).forEach((f) => fd.append("evidence", f));
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

  async getApplicationsRanking(animalId?: string, minScore?: number) {
    const params = new URLSearchParams();
    if (animalId) params.append("animalId", animalId);
    if (minScore !== undefined && minScore > 0) {
      params.append("minScore", String(minScore));
    }
    return request<{ applications: Application[]; total: number }>(
      `/applications/ranking?${params.toString()}`
    );
  }

  async updateApplicationStatus(id: string, status: string, notes?: string) {
    return request<Application>(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  }

  async rejectApplication(id: string, data: { reason: string }) {
    return request<{ ok: boolean; message: string }>(`/applications/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async getApplication(id: string) {
    return request<Application>(`/applications/${id}`);
  }

  // ===== Clinical =====
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

  // ===== Foundation Stats (Dashboard Fundación) =====
  async getFoundationStats() {
    // backend responde:
    // {
    //   ok: true,
    //   data: {
    //     totalDogs,
    //     waitingDogs,
    //     adoptedDogs,
    //     activeRequests
    //   }
    // }
    const res = await request<{
      ok: boolean;
      data: {
        totalDogs: number;
        waitingDogs: number;
        adoptedDogs: number;
        activeRequests: number;
      };
    }>("/foundation/stats");

    // devolvemos solo .data para que el hook lo use directo
    return res.data;
  }

  // ===== Foundation Analytics (Estadísticas Avanzadas) =====
  async getFoundationAnalytics() {
    const res = await request<{
      ok: boolean;
      data: {
        adoptionsTimeline: Array<{ month: string; count: number }>;
        topAnimalsWithApplications: Array<{
          animalId: string;
          name: string;
          breed: string;
          age: number;
          applicationCount: number;
          photos: string[];
          state: string;
        }>;
        stateDistribution: Array<{ _id: string; count: number }>;
        adoptionRate: number;
        applicationsByStatus: Array<{ _id: string; count: number }>;
        avgDaysToAdoption: number;
        recentAdoptions: Array<{
          _id: string;
          name: string;
          attributes: { breed: string; age: number };
          updatedAt: string;
          photos: string[];
        }>;
        dogsBySize: Array<{ _id: string; count: number }>;
        dogsByEnergy: Array<{ _id: string; count: number }>;
        registrationTimeline: Array<{ month: string; count: number }>;
        summary: {
          totalDogs: number;
          adoptedDogs: number;
          totalApplications: number;
        };
      };
    }>("/foundation/analytics");

    return res.data;
  }

  // ===== Generic GET method =====
  async get<T = any>(endpoint: string): Promise<{ ok: boolean; data: T }> {
    return request<{ ok: boolean; data: T }>(endpoint);
  }

  // ===== Foundation Animals (Lista de animales con paginación) =====
  async getFoundationAnimals(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 10).toString(),
      search: params.search || "",
      status: params.status || "todos",
    });

    const res = await request<{
      ok: boolean;
      data: {
        animals: Array<{
          id: string;
          name: string;
          age: number;
          breed: string;
          size: string;
          gender: string;
          energy: string;
          health: string[];
          status: string;
          statusLabel: string;
          statusColor: string;
          photo: string | null;
          clinicalSummary: string;
        }>;
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    }>(`/foundation/animals?${queryParams}`);

    return res.data;
  }

  // ===== Admin - Users Management =====
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.search) queryParams.set("search", params.search);
    if (params?.role) queryParams.set("role", params.role);
    if (params?.status) queryParams.set("status", params.status);

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams}` : ""}`;
    const res = await request<{
      ok: boolean;
      data: {
        users: User[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    }>(endpoint);

    return res.data;
  }

  async getUserById(id: string) {
    const res = await request<{ ok: boolean; data: User }>(`/admin/users/${id}`);
    return res.data;
  }

  async createUser(userData: Partial<User>) {
    const res = await request<{ ok: boolean; data: User }>("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return res.data;
  }

  async updateUser(id: string, userData: Partial<User>) {
    const res = await request<{ ok: boolean; data: User }>(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
    return res.data;
  }

  async deleteUser(id: string) {
    const res = await request<{ ok: boolean; message: string }>(`/admin/users/${id}`, {
      method: "DELETE",
    });
    return res;
  }

  async toggleUserStatus(id: string, active: boolean) {
    const res = await request<{ ok: boolean; data: User }>(`/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    });
    return res.data;
  }

  // ===== Matching con KNN =====
  async getRecommendations(limit?: number) {
    const params = limit ? `?limit=${limit}` : "";
    return request<{
      matches: Array<{
        animalId: string;
        animalName: string;
        // Nuevo formato KNN
        distance: number;
        score: number;
        rank: number;
        isTopK: boolean;
        // Campos opcionales para retrocompatibilidad
        matchScore?: number;
        matchReasons?: string[];
        compatibilityFactors?: {
          size: number;
          energy: number;
          coexistence: number;
          personality: number;
          lifestyle: number;
        };
        animal: Animal;
      }>;
      total: number;
      k?: number;
      algorithm?: string;
      preferences: any;
    }>(`/matching/recommendations${params}`);
  }

  async calculateMatch(animalId: string) {
    return request<{
      match: {
        animalId: string;
        animalName: string;
        matchScore: number;
        distance: number;
        matchReasons: string[];
        compatibilityFactors: {
          size: number;
          energy: number;
          coexistence: number;
          personality: number;
          lifestyle: number;
        };
        animal: Animal;
      };
    }>("/matching/calculate", {
      method: "POST",
      body: JSON.stringify({ animalId }),
    });
  }

  async getMatchingStats() {
    return request<{
      hasPreferences: boolean;
      totalAnimals: number;
      highMatches: number;
      mediumMatches: number;
      lowMatches: number;
      averageScore?: number;
      message?: string;
    }>("/matching/stats");
  }

  // ===== Clínica - Historial Médico =====
  async getClinicAnimals() {
    return request<{ ok: boolean; data: { animals: Animal[] } }>("/clinic/animals");
  }

  async getMedicalHistory(animalId: string) {
    return request<{ ok: boolean; data: MedicalHistory | null }>(
      `/clinic/animals/${animalId}/medical-history`
    );
  }

  async saveMedicalHistory(animalId: string, data: Partial<MedicalHistory>) {
    return request<{ ok: boolean; data: MedicalHistory }>(
      `/clinic/animals/${animalId}/medical-history`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async getPublicMedicalHistory(animalId: string) {
    return request<{ ok: boolean; data: MedicalHistory | null }>(
      `/animals/${animalId}/medical-history`
    );
  }
}

export const apiClient = new ApiClient();
