import { useState, useEffect } from 'react';
import { Evolution, CreateEvolutionData } from '@/types/patient';

// Hook para gerenciar evoluções dos pacientes
export const useEvolutions = () => {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega evoluções do localStorage
  useEffect(() => {
    const savedEvolutions = localStorage.getItem('fisio-evolutions');
    if (savedEvolutions) {
      const parsedEvolutions = JSON.parse(savedEvolutions).map((evo: any) => ({
        ...evo,
        date: new Date(evo.date),
        createdAt: new Date(evo.createdAt)
      }));
      setEvolutions(parsedEvolutions);
    }
    setLoading(false);
  }, []);

  // Salva evoluções no localStorage
  const saveEvolutions = (newEvolutions: Evolution[]) => {
    localStorage.setItem('fisio-evolutions', JSON.stringify(newEvolutions));
    setEvolutions(newEvolutions);
  };

  // Adiciona nova evolução
  const addEvolution = (evolutionData: CreateEvolutionData): Evolution => {
    const newEvolution: Evolution = {
      id: Date.now().toString(),
      ...evolutionData,
      createdAt: new Date()
    };
    
    const updatedEvolutions = [...evolutions, newEvolution];
    saveEvolutions(updatedEvolutions);
    return newEvolution;
  };

  // Remove evolução
  const deleteEvolution = (id: string) => {
    const updatedEvolutions = evolutions.filter(evolution => evolution.id !== id);
    saveEvolutions(updatedEvolutions);
  };

  // Busca evoluções por paciente
  const getEvolutionsByPatient = (patientId: string): Evolution[] => {
    return evolutions
      .filter(evolution => evolution.patientId === patientId)
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Mais recente primeiro
  };

  return {
    evolutions,
    loading,
    addEvolution,
    deleteEvolution,
    getEvolutionsByPatient
  };
};