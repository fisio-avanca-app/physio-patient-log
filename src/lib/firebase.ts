import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase - substitua pelos seus dados
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "fisioapp-demo.firebaseapp.com",
  projectId: "fisioapp-demo",
  storageBucket: "fisioapp-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;