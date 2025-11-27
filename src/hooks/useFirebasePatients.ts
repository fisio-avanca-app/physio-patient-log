import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc, 
  query, 
  where,
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { Patient, CreatePatientData } from '@/types/patient';

export const useFirebasePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Carrega pacientes do Firestore (apenas não arquivados)
  useEffect(() => {
    if (!user) {
      setPatients([]);
      setLoading(false);
      return;
    }

    const patientsRef = collection(db, 'patients');
    const q = query(
      patientsRef, 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Patient[];
      
      // Filtrar apenas pacientes não arquivados (archived = false ou undefined)
      const activePatients = patientsData.filter(p => !p.archived);
      
      console.log(patientsData)
      setPatients(activePatients);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Adiciona novo paciente
  const addPatient = async (patientData: CreatePatientData): Promise<Patient> => {
    if (!user) throw new Error('Usuário não autenticado');

    const newPatientData = {
      ...patientData,
      userId: user.uid,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'patients'), newPatientData);
    
    const newPatient: Patient = {
      id: docRef.id,
      ...newPatientData
    };

    return newPatient;
  };

  // Atualiza paciente
  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    if (!user) throw new Error('Usuário não autenticado');

    const patientRef = doc(db, 'patients', id);
    
    // Garantir que archived exista (retrocompatibilidade)
    const updatesWithArchived = {
      ...updates,
      archived: updates.archived !== undefined ? updates.archived : false,
      updatedAt: new Date()
    };
    
    await updateDoc(patientRef, updatesWithArchived);
  };

  // Remove paciente
  const deletePatient = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    // Remove paciente
    await deleteDoc(doc(db, 'patients', id));
    
    // Remove evoluções do paciente
    const evolutionsRef = collection(db, 'evolutions');
    const evolutionsQuery = query(evolutionsRef, where('patientId', '==', id));
    const evolutionsSnapshot = await getDocs(evolutionsQuery);
    
    const deletePromises = evolutionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  };

  // Busca paciente por ID (incluindo arquivados)
  const getPatientById = async (id: string): Promise<Patient | undefined> => {
    // Primeiro tenta na lista local
    const localPatient = patients.find(patient => patient.id === id);
    if (localPatient) return localPatient;
    
    // Se não encontrar localmente, busca no Firestore (pode ser arquivado)
    try {
      const patientRef = doc(db, 'patients', id);
      const patientSnap = await getDoc(patientRef);
      
      if (patientSnap.exists()) {
        const data = patientSnap.data();
        return {
          id: patientSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Patient;
      }
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
    }
    
    return undefined;
  };

  // Arquiva paciente
  const archivePatient = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const patientRef = doc(db, 'patients', id);
    await updateDoc(patientRef, {
      archived: true,
      updatedAt: new Date()
    });
  };

  // Desarquiva paciente
  const unarchivePatient = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const patientRef = doc(db, 'patients', id);
    await updateDoc(patientRef, {
      archived: false,
      updatedAt: new Date()
    });
  };

  // Busca pacientes arquivados
  const getArchivedPatients = () => {
    if (!user) return [];

    const patientsRef = collection(db, 'patients');
    const [archivedPatients, setArchivedPatients] = useState<Patient[]>([]);

    useEffect(() => {
      const q = query(
        patientsRef,
        where('userId', '==', user.uid),
        where('archived', '==', true),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const archived = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Patient[];
        
        setArchivedPatients(archived);
      });

      return () => unsubscribe();
    }, [user?.uid]);

    return archivedPatients;
  };

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    archivePatient,
    unarchivePatient
  };
};