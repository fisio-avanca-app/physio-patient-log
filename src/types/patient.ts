export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email?: string;
  diagnosis: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Evolution {
  id: string;
  patientId: string;
  date: Date;
  description: string;
  createdAt: Date;
}

export interface CreatePatientData {
  name: string;
  age: number;
  phone: string;
  email?: string;
  diagnosis: string;
}

export interface CreateEvolutionData {
  patientId: string;
  date: Date;
  description: string;
}