import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { Evolution, CreateEvolutionData } from '@/types/patient';

export const useFirebaseEvolutions = () => {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Carrega evoluções do Firestore
  useEffect(() => {
    if (!user) {
      setEvolutions([]);
      setLoading(false);
      return;
    }

    const evolutionsRef = collection(db, 'evolutions');
    const q = query(
      evolutionsRef, 
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const evolutionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Evolution[];
      
      setEvolutions(evolutionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Adiciona nova evolução
  const addEvolution = async (evolutionData: CreateEvolutionData): Promise<Evolution> => {
    if (!user) throw new Error('Usuário não autenticado');

    const newEvolutionData = {
      ...evolutionData,
      userId: user.uid,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'evolutions'), newEvolutionData);
    
    const newEvolution: Evolution = {
      id: docRef.id,
      ...newEvolutionData
    };

    return newEvolution;
  };

  // Remove evolução
  const deleteEvolution = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    await deleteDoc(doc(db, 'evolutions', id));
  };

  // Busca evoluções por paciente
  const getEvolutionsByPatient = (patientId: string): Evolution[] => {
    return evolutions
      .filter(evolution => evolution.patientId === patientId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  return {
    evolutions,
    loading,
    addEvolution,
    deleteEvolution,
    getEvolutionsByPatient
  };
};