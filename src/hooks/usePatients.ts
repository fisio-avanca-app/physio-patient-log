import { useState, useEffect } from 'react';
import { Patient, CreatePatientData } from '@/types/patient';

// Hook para gerenciar pacientes (temporariamente no localStorage)
export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega pacientes do localStorage
  useEffect(() => {
    const savedPatients = localStorage.getItem('fisio-patients');
    if (savedPatients) {
      const parsedPatients = JSON.parse(savedPatients).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
      setPatients(parsedPatients);
    }
    setLoading(false);
  }, []);

  // Salva pacientes no localStorage
  const savePatients = (newPatients: Patient[]) => {
    localStorage.setItem('fisio-patients', JSON.stringify(newPatients));
    setPatients(newPatients);
  };

  // Adiciona novo paciente
  const addPatient = (patientData: CreatePatientData): Patient => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...patientData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedPatients = [...patients, newPatient];
    savePatients(updatedPatients);
    return newPatient;
  };

  // Atualiza paciente
  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const updatedPatients = patients.map(patient =>
      patient.id === id
        ? { ...patient, ...updates, updatedAt: new Date() }
        : patient
    );
    savePatients(updatedPatients);
  };

  // Remove paciente
  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    savePatients(updatedPatients);
    
    // Remove evoluções do paciente também
    const savedEvolutions = localStorage.getItem('fisio-evolutions');
    if (savedEvolutions) {
      const evolutions = JSON.parse(savedEvolutions);
      const filteredEvolutions = evolutions.filter((evo: any) => evo.patientId !== id);
      localStorage.setItem('fisio-evolutions', JSON.stringify(filteredEvolutions));
    }
  };

  // Busca paciente por ID
  const getPatientById = (id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id);
  };

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById
  };
};