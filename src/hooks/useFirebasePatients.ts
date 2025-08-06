import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
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

  // Carrega pacientes do Firestore
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
      
      setPatients(patientsData);
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
    await updateDoc(patientRef, {
      ...updates,
      updatedAt: new Date()
    });
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