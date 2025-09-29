// src/lib/api.ts
import type {
  ApiResponse,
  User,
  Animal,
  Application,
  ClinicalRecord,
  FilterOptions,
} from "../types";

// 1) Config
// src/lib/api.ts
const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "http://localhost:4000/api/v1";  // fallback sensato en dev

// Activa mocks en dev o si quieres forzar con VITE_USE_MOCK=true
const USE_MOCK =
  (import.meta as any).env?.VITE_USE_MOCK === "true" ||
  (import.meta as any).env?.MODE === "development";

// 2) Mock data mínimo para que catálogo y detalle respiren sin backend
const MOCK_ANIMALS: Animal[] = [
  {
    id: "luna",
    name: "Luna",
    breed: "Mestizo",
    age: 2,
    size: "medium",
    energy: "medium",
    status: "available",
    foundation: { name: "Fundación PAE" } as any,
    description:
      "Luna es una perrita muy inteligente y leal. Ideal para familias que buscan una compañera juguetona.",
    photos: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop&crop=face",
    ],
    goodWith: { children: true, dogs: true, cats: true } as any,
    health: {
      vaccinated: true,
      sterilized: true,
      dewormed: true,
      lastCheckup: "2025-06-10",
    } as any,
    createdAt: "2024-12-31",
  } as Animal,
  {
    id: "max",
    name: "Max",
    breed: "Labrador Mix",
    age: 4,
    size: "large",
    energy: "high",
    status: "available",
    foundation: { name: "Fundación PAE" } as any,
    description:
      "Max es un perro guardián muy leal y protector. Necesita una familia activa.",
    photos: [
      "https://images.pexels.com/photos/59523/pexels-photo-59523.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    goodWith: { children: true, dogs: false, cats: true } as any,
    health: {
      vaccinated: true,
      sterilized: true,
      dewormed: true,
      lastCheckup: "2025-05-18",
    } as any,
    createdAt: "2024-12-31",
  } as Animal,
  {
    id: "bella",
    name: "Bella",
    breed: "Chihuahua Mix",
    age: 1,
    size: "small",
    energy: "low",
    status: "available",
    foundation: { name: "Fundación PAE" } as any,
    description:
      "Bella es una cachorra dulce y pequeña. Perfecta para apartamentos y espacios tranquilos.",
    photos: [
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    goodWith: { children: false, dogs: true, cats: true } as any,
    health: {
      vaccinated: true,
      sterilized: false,
      dewormed: true,
      lastCheckup: "2025-04-02",
    } as any,
    createdAt: "2025-01-15",
  } as Animal,
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// 3) Cliente con fallback a mock
class ApiClient {
  private getAuthHeaders() {
    const token = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state
      ?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }
      return data;
    } catch (err) {
      return {
        error:
          err instanceof Error ? err.message : "Unknown error calling API endpoint",
      };
    }
  }

  // ===== Auth =====
  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    email: string;
    password: string;
    role: string;
    profile: any;
  }) {
    return this.request<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request<User>("/users/me");
  }

  async updateProfile(profile: Partial<User["profile"]>) {
    return this.request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ profile }),
    });
  }

  // ===== Animals =====
  async getAnimals(filters?: FilterOptions) {
    // Modo MOCK
    if (USE_MOCK) {
      await sleep(250);
      let list = [...MOCK_ANIMALS];

      if (filters) {
        const { size, energy, status, q } = filters as any;
        if (size) list = list.filter((a) => a.size === size);
        if (energy) list = list.filter((a) => a.energy === energy);
        if (status) list = list.filter((a) => a.status === status);
        if (q) {
          const s = String(q).toLowerCase();
          list = list.filter(
            (a) =>
              a.name.toLowerCase().includes(s) ||
              a.breed.toLowerCase().includes(s)
          );
        }
      }

      return {
        animals: list,
        total: list.length,
      } as unknown as ApiResponse<{ animals: Animal[]; total: number }>;
    }

    // API real
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)));
        } else {
          params.set(key, String(value));
        }
      });
    }
    const qs = params.toString();
    return this.request<{ animals: Animal[]; total: number }>(
      `/animals${qs ? `?${qs}` : ""}`
    );
  }

  async getAnimal(id: string) {
    if (USE_MOCK) {
      await sleep(200);
      const found = MOCK_ANIMALS.find((a) => a.id === id);
      if (!found)
        return { error: "Animal not found" } as ApiResponse<Animal>;
      return found as unknown as ApiResponse<Animal>;
    }
    return this.request<Animal>(`/animals/${id}`);
  }

  // Helpers locales que usamos en la UI
  getAnimalByIdLocal(id: string) {
    return MOCK_ANIMALS.find((a) => a.id === id);
  }
  getAnimalsLocal() {
    return MOCK_ANIMALS;
  }

  async createAnimal(data: Partial<Animal>) {
    return this.request<Animal>("/animals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAnimal(id: string, data: Partial<Animal>) {
    return this.request<Animal>(`/animals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // ===== Applications =====
  async createApplication(data: { animalId: string; form: any }) {
    return this.request<Application>("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyApplications() {
    return this.request<Application[]>("/applications/mine");
  }

  async getApplications(status?: string) {
    const params = status ? `?status=${status}` : "";
    return this.request<{ applications: Application[]; total: number }>(
      `/applications${params}`
    );
  }

  async updateApplicationStatus(id: string, status: string, notes?: string) {
    return this.request<Application>(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  }

  // ===== Clinical =====
  async getClinicalRecord(animalId: string) {
    // En mock devolvemos un record vacíllo decente
    if (USE_MOCK) {
      await sleep(150);
      return {
        animalId,
        vaccinated: true,
        sterilized: true,
        dewormed: true,
        lastCheckup: "2025-05-12",
        notes: "Chequeo general OK",
      } as unknown as ApiResponse<ClinicalRecord>;
    }
    return this.request<ClinicalRecord>(`/clinical/${animalId}`);
  }

  async updateClinicalRecord(animalId: string, data: Partial<ClinicalRecord>) {
    return this.request<ClinicalRecord>(`/clinical/${animalId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async approveClinical(animalId: string, approved: boolean) {
    return this.request<ClinicalRecord>(`/clinical/${animalId}/approval`, {
      method: "POST",
      body: JSON.stringify({ approved }),
    });
  }

  // ===== Analytics =====
  async getAnalytics(range?: string) {
    if (USE_MOCK) {
      await sleep(200);
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
      } as unknown as ApiResponse<any>;
    }
    const params = range ? `?range=${range}` : "";
    return this.request<any>(`/analytics/overview${params}`);
  }
}

export const apiClient = new ApiClient();

// Exposición de helpers mock para páginas que lo requieran de forma directa
export const getAnimals = () => apiClient.getAnimalsLocal();
export const getAnimalById = (id: string) => apiClient.getAnimalByIdLocal(id);