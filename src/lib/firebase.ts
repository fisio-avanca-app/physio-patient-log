import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase - substitua pelos seus dados
const firebaseConfig = {
 apiKey: "AIzaSyChvYxNaypLbUgX1lHfxH-0NIcZHo3yLAw",
  authDomain: "fisioavanca.firebaseapp.com",
  projectId: "fisioavanca",
  storageBucket: "fisioavanca.firebasestorage.app",
  messagingSenderId: "1014645267392",
  appId: "1:1014645267392:web:23808e29a244b30ba68625",
  measurementId: "G-NRS01N5F66"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;