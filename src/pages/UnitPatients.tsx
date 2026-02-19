import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PatientCard } from '@/components/PatientCard';
import { useFirebasePatients } from '@/hooks/useFirebasePatients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Users, ArrowLeft, Plus } from 'lucide-react';
import { Patient } from '@/types/patient';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';

export const UnitPatients: React.FC = () => {
  const { unitName } = useParams<{ unitName: string }>();
  const decodedUnit = decodeURIComponent(unitName || '');
  const { patients, loading, deletePatient } = useFirebasePatients();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<Patient | null>(null);

  const unitPatients = patients.filter(p => {
    const pUnit = p.sourceUnit || 'Sem unidade';
    return pUnit === decodedUnit;
  });

  const filteredPatients = unitPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePatient = (patient: Patient) => {
    deletePatient(patient.id);
    setDeleteDialog(null);
    toast({
      title: "Paciente removido",
      description: `${patient.name} foi removido do sistema.`,
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
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">🏥 {decodedUnit}</h1>
            <p className="text-sm text-muted-foreground">{unitPatients.length} paciente{unitPatients.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredPatients.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente nesta unidade'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Tente ajustar sua busca.' : 'Cadastre pacientes vinculados a esta unidade.'}
              </p>
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

        <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o paciente <strong>{deleteDialog?.name}</strong>?
                Todas as evoluções relacionadas também serão removidas.
              </DialogDescription>
            </DialogHeader>
            <div className="flex space-x-3 mt-6">
              <Button variant="destructive" onClick={() => deleteDialog && handleDeletePatient(deleteDialog)} className="flex-1">Excluir</Button>
              <Button variant="outline" onClick={() => setDeleteDialog(null)} className="flex-1">Cancelar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};
