import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const FirebaseSetup: React.FC = () => {
  return (
    <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 mb-6">
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
        <strong>Configuração Firebase necessária:</strong><br />
        1. Substitua as credenciais em <code>src/lib/firebase.ts</code><br />
        2. Ative Authentication e Firestore no Firebase Console<br />
        3. Crie usuários no Firebase Auth para fazer login
      </AlertDescription>
    </Alert>
  );
};