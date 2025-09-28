import type { ApiResponse, User, Animal, Application, ClinicalRecord, FilterOptions } from '../types';

const API_BASE = '/api/v1';

class ApiClient {
  private getAuthHeaders() {
    const token = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { email: string; password: string; role: string; profile: any }) {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request<User>('/users/me');
  }

  async updateProfile(profile: Partial<User['profile']>) {
    return this.request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ profile }),
    });
  }

  // Animals endpoints
  async getAnimals(filters?: FilterOptions) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else if (value) {
          params.set(key, value);
        }
      });
    }
    
    return this.request<{ animals: Animal[]; total: number }>(`/animals?${params}`);
  }

  async getAnimal(id: string) {
    return this.request<Animal>(`/animals/${id}`);
  }

  async createAnimal(data: Partial<Animal>) {
    return this.request<Animal>('/animals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAnimal(id: string, data: Partial<Animal>) {
    return this.request<Animal>(`/animals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Applications endpoints
  async createApplication(data: { animalId: string; form: any }) {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyApplications() {
    return this.request<Application[]>('/applications/mine');
  }

  async getApplications(status?: string) {
    const params = status ? `?status=${status}` : '';
    return this.request<{ applications: Application[]; total: number }>(`/applications${params}`);
  }

  async updateApplicationStatus(id: string, status: string, notes?: string) {
    return this.request<Application>(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Clinical endpoints
  async getClinicalRecord(animalId: string) {
    return this.request<ClinicalRecord>(`/clinical/${animalId}`);
  }

  async updateClinicalRecord(animalId: string, data: Partial<ClinicalRecord>) {
    return this.request<ClinicalRecord>(`/clinical/${animalId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async approveClinical(animalId: string, approved: boolean) {
    return this.request<ClinicalRecord>(`/clinical/${animalId}/approval`, {
      method: 'POST',
      body: JSON.stringify({ approved }),
    });
  }

  // Analytics endpoints
  async getAnalytics(range?: string) {
    const params = range ? `?range=${range}` : '';
    return this.request<any>(`/analytics/overview${params}`);
  }
}

export const apiClient = new ApiClient();