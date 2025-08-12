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
  sex: string
  dateOfBirth: string,
  cpf: string,
  cns: string,
  acs: string,
  sourceUnit: string
}

export interface CreateEvolutionData {
  patientId: string;
  date: Date;
  description: string;
}