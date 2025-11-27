import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PatientCard } from '@/components/PatientCard';
import { useFirebasePatients } from '@/hooks/useFirebasePatients';
import { useFirebaseArchivedPatients } from '@/hooks/useFirebaseArchivedPatients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, Search, Archive, Users } from 'lucide-react';
import { Patient } from '@/types/patient';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const ArchivedPatients: React.FC = () => {
  const { archivedPatients, loading } = useFirebaseArchivedPatients();
  const { unarchivePatient, deletePatient } = useFirebasePatients();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<Patient | null>(null);
  const [unarchiveDialog, setUnarchiveDialog] = useState<Patient | null>(null);

  const filteredPatients = archivedPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnarchivePatient = async (patient: Patient) => {
    await unarchivePatient(patient.id);
    setUnarchiveDialog(null);
    toast({
      title: "Paciente desarquivado",
      description: `${patient.name} foi movido de volta para a lista ativa.`,
    });
  };

  const handleDeletePatient = (patient: Patient) => {
    deletePatient(patient.id);
    setDeleteDialog(null);
    toast({
      title: "Paciente removido",
      description: `${patient.name} foi removido permanentemente do sistema.`,
    });
  };

  const handleViewPatient = (patient: Patient) => {
    navigate(`/patient/${patient.id}`);
  };

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center space-x-2">
              <Archive className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Pacientes Arquivados</h1>
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pacientes arquivados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de pacientes arquivados */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''} arquivado{filteredPatients.length !== 1 ? 's' : ''}
          </h2>
          
          {filteredPatients.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <Archive className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente arquivado'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Tente ajustar sua busca.'
                    : 'Pacientes arquivados aparecerão aqui.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="relative">
                  <PatientCard
                    patient={patient}
                    onView={handleViewPatient}
                    onDelete={setDeleteDialog}
                  />
                  <div className="mt-2">
                    <Button 
                      onClick={() => setUnarchiveDialog(patient)}
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      size="sm"
                    >
                      Desarquivar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de desarquivar */}
        <Dialog open={!!unarchiveDialog} onOpenChange={() => setUnarchiveDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Desarquivar Paciente</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja desarquivar <strong>{unarchiveDialog?.name}</strong>?
                O paciente voltará para a lista de pacientes ativos.
              </DialogDescription>
            </DialogHeader>
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={() => unarchiveDialog && handleUnarchivePatient(unarchiveDialog)}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                Desarquivar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setUnarchiveDialog(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmação de exclusão */}
        <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão Permanente</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir permanentemente o paciente <strong>{deleteDialog?.name}</strong>?
                Todas as evoluções relacionadas também serão removidas. Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex space-x-3 mt-6">
              <Button 
                variant="destructive" 
                onClick={() => deleteDialog && handleDeletePatient(deleteDialog)}
                className="flex-1"
              >
                Excluir Permanentemente
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
