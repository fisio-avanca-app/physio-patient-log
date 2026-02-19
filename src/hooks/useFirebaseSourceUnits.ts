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
import { SourceUnit } from '@/types/sourceUnit';

export const useFirebaseSourceUnits = () => {
  const [sourceUnits, setSourceUnits] = useState<SourceUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setSourceUnits([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, 'sourceUnits');
    const q = query(
      ref,
      where('userId', '==', user.uid),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as SourceUnit[];
      
      setSourceUnits(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addSourceUnit = async (name: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    await addDoc(collection(db, 'sourceUnits'), {
      name,
      userId: user.uid,
      createdAt: new Date(),
    });
  };

  const deleteSourceUnit = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    await deleteDoc(doc(db, 'sourceUnits', id));
  };

  return { sourceUnits, loading, addSourceUnit, deleteSourceUnit };
};
