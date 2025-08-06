import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { FirebaseSetup } from '@/components/FirebaseSetup';
import { PatientCard } from '@/components/PatientCard';
import { PatientForm } from '@/components/PatientForm';
import { useFirebasePatients } from '@/hooks/useFirebasePatients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Users, Calendar, TrendingUp } from 'lucide-react';
import { Patient, CreatePatientData } from '@/types/patient';
import { useFirebaseEvolutions } from '@/hooks/useFirebaseEvolutions';
import { useToast } from '@/hooks/use-toast';

export const Home: React.FC = () => {
  const { patients, loading, addPatient, deletePatient } = useFirebasePatients();
  const { evolutions } = useFirebaseEvolutions();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = (data: CreatePatientData) => {
    addPatient(data);
    setShowForm(false);
    toast({
      title: "Paciente cadastrado",
      description: `${data.name} foi adicionado com sucesso!`,
    });
  };

  const handleDeletePatient = (patient: Patient) => {
    deletePatient(patient.id);
    setDeleteDialog(null);
    toast({
      title: "Paciente removido",
      description: `${patient.name} foi removido do sistema.`,
    });
  };

  const handleViewPatient = (patient: Patient) => {
    // Navegar para página de detalhes do paciente
    window.location.href = `/patient/${patient.id}`;
  };

  // Estatísticas
  const totalPatients = patients.length;
  const totalEvolutions = evolutions.length;
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const evolutionsThisMonth = evolutions.filter(evo => 
    evo.date.getMonth() === thisMonth && evo.date.getFullYear() === thisYear
  ).length;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <FirebaseSetup />
        {/* Header com estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Pacientes</p>
                  <p className="text-3xl font-bold text-primary">{totalPatients}</p>
                </div>
                <div className="bg-primary/10 rounded-full p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Evoluções Este Mês</p>
                  <p className="text-3xl font-bold text-accent">{evolutionsThisMonth}</p>
                </div>
                <div className="bg-accent/10 rounded-full p-3">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Evoluções</p>
                  <p className="text-3xl font-bold text-primary-glow">{totalEvolutions}</p>
                </div>
                <div className="bg-primary-glow/10 rounded-full p-3">
                  <TrendingUp className="h-6 w-6 text-primary-glow" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações e busca */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-primary hover:opacity-90 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Paciente</span>
          </Button>
        </div>

        {/* Lista de pacientes */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Pacientes {searchTerm && `(${filteredPatients.length} encontrado${filteredPatients.length !== 1 ? 's' : ''})`}
          </h2>
          
          {filteredPatients.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm 
                    ? 'Tente ajustar sua busca ou cadastre um novo paciente.'
                    : 'Comece cadastrando seu primeiro paciente para organizar os atendimentos.'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Paciente
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onView={handleViewPatient}
                  onDelete={setDeleteDialog}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal de cadastro */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <PatientForm
              onSubmit={handleAddPatient}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Modal de confirmação de exclusão */}
        <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o paciente <strong>{deleteDialog?.name}</strong>?
                Todas as evoluções relacionadas também serão removidas. Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex space-x-3 mt-6">
              <Button 
                variant="destructive" 
                onClick={() => deleteDialog && handleDeletePatient(deleteDialog)}
                className="flex-1"
              >
                Excluir
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialog(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};