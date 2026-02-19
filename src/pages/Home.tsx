import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PatientForm } from '@/components/PatientForm';
import { useFirebasePatients } from '@/hooks/useFirebasePatients';
import { useFirebaseSourceUnits } from '@/hooks/useFirebaseSourceUnits';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, Users, Calendar, TrendingUp, Archive, Building2 } from 'lucide-react';
import { CreatePatientData } from '@/types/patient';
import { useFirebaseEvolutions } from '@/hooks/useFirebaseEvolutions';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const { patients, loading, addPatient } = useFirebasePatients();
  const { sourceUnits } = useFirebaseSourceUnits();
  const { evolutions } = useFirebaseEvolutions();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // Contar pacientes por unidade
  const unitCounts: Record<string, number> = {};
  patients.forEach(p => {
    const unit = p.sourceUnit || 'Sem unidade';
    unitCounts[unit] = (unitCounts[unit] || 0) + 1;
  });

  // Montar lista de unidades (cadastradas + "Sem unidade" se houver)
  const unitCards = sourceUnits.map(u => ({
    name: u.name,
    count: unitCounts[u.name] || 0,
  }));

  // Adicionar unidades não cadastradas que têm pacientes (retrocompatibilidade)
  const registeredNames = new Set(sourceUnits.map(u => u.name));
  Object.keys(unitCounts).forEach(name => {
    if (!registeredNames.has(name)) {
      unitCards.push({ name, count: unitCounts[name] });
    }
  });

  const handleAddPatient = (data: CreatePatientData) => {
    addPatient(data);
    setShowForm(false);
    toast({
      title: "Paciente cadastrado",
      description: `${data.name} foi adicionado com sucesso!`,
    });
  };

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
        {/* Estatísticas */}
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

        {/* Ações */}
        <div className="flex flex-wrap gap-3 justify-end">
          <Button 
            onClick={() => navigate('/source-units')}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Unidades
          </Button>
          <Button 
            onClick={() => navigate('/archived')}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Archive className="h-4 w-4 mr-2" />
            Arquivados
          </Button>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Paciente
          </Button>
        </div>

        {/* Cards de unidades */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Unidades de Origem</h2>

          {unitCards.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma unidade cadastrada</h3>
                <p className="text-muted-foreground mb-6">Cadastre unidades de origem para organizar seus pacientes.</p>
                <Button onClick={() => navigate('/source-units')} className="bg-gradient-primary hover:opacity-90">
                  <Building2 className="h-4 w-4 mr-2" />
                  Gerenciar Unidades
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {unitCards.map((unit) => (
                <Card
                  key={unit.name}
                  className="shadow-card hover:shadow-soft transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => navigate(`/unit/${encodeURIComponent(unit.name)}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-full p-3">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">🏥 {unit.name}</h3>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-primary">({unit.count})</span>
                    </div>
                  </CardContent>
                </Card>
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
      </div>
    </Layout>
  );
};
