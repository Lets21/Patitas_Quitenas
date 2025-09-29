export type UserRole = 'ADOPTANTE' | 'FUNDACION' | 'CLINICA' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  document?: string;
  experience?: string;
  livingSpace?: 'APARTMENT' | 'HOUSE' | 'FARM';
  hasYard?: boolean;
  hasChildren?: boolean;
  hasOtherPets?: boolean;
}

export interface Animal {
  id: string;
  name: string;
  photos: string[];
  attributes: {
    age: number;
    size: 'SMALL' | 'MEDIUM' | 'LARGE';
    breed: string;
    gender: 'MALE' | 'FEMALE';
    energy: 'LOW' | 'MEDIUM' | 'HIGH';
    coexistence: {
      children: boolean;
      cats: boolean;
      dogs: boolean;
    };
  };
  clinicalSummary: string;
  state: 'RESCUED' | 'QUARANTINE' | 'AVAILABLE' | 'RESERVED' | 'ADOPTED';
  foundationId: string;
  createdAt: string;
  updatedAt: string;
}

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
  status: 'PENDING' | 'PRE_APPROVED' | 'REJECTED' | 'APPROVED' | 'DELIVERED';
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
  status: Application['status'];
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
  result?: 'APPROVED' | 'REJECTED';
  notes?: string;
  evidence: string[];
  createdAt: string;
}

export interface Followup {
  id: string;
  applicationId: string;
  type: '30D' | '90D';
  dueAt: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
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

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface FilterOptions {
  age?: string;
  size?: string[];
  energy?: string[];
  breed?: string;
  coexistence?: string[];
}