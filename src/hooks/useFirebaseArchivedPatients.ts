import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where,
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { Patient } from '@/types/patient';

export const useFirebaseArchivedPatients = () => {
  const [archivedPatients, setArchivedPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setArchivedPatients([]);
      setLoading(false);
      return;
    }

    const patientsRef = collection(db, 'patients');
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    archivedPatients,
    loading
  };
};
