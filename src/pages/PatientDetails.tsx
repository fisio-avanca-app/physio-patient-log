import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useFirebasePatients } from '@/hooks/useFirebasePatients';
import { useFirebaseEvolutions } from '@/hooks/useFirebaseEvolutions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Calendar, FileText, Phone, Mail, User, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CreateEvolutionData } from '@/types/patient';
import { useToast } from '@/hooks/use-toast';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatientById } = useFirebasePatients();
  const { getEvolutionsByPatient, addEvolution, deleteEvolution } = useFirebaseEvolutions();
  const { toast } = useToast();
  const [showEvolutionForm, setShowEvolutionForm] = useState(false);

  const patient = id ? getPatientById(id) : null;
  const evolutions = id ? getEvolutionsByPatient(id) : [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    date: string;
    description: string;
  }>();

  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Paciente não encontrado</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Lista
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddEvolution = (data: { date: string; description: string }) => {
    if (!id) return;
    
    const evolutionData: CreateEvolutionData = {
      patientId: id,
      date: new Date(data.date),
      description: data.description
    };

    addEvolution(evolutionData);
    setShowEvolutionForm(false);
    reset();
    toast({
      title: "Evolução adicionada",
      description: "A evolução foi registrada com sucesso!",
    });
  };

  const handleDeleteEvolution = (evolutionId: string) => {
    deleteEvolution(evolutionId);
    toast({
      title: "Evolução removida",
      description: "A evolução foi removida com sucesso!",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <Button 
            onClick={() => setShowEvolutionForm(true)}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Evolução
          </Button>
        </div>

        {/* Informações do Paciente */}
        <Card className="shadow-card">
          <CardHeader className="bg-gradient-primary text-primary-foreground">
            <CardTitle className="flex items-center space-x-3">
              <User className="h-6 w-6" />
              <span>{patient.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Idade</p>
                <p className="text-lg font-semibold text-foreground">{patient.age} anos</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Telefone
                </p>
                <p className="text-lg font-semibold text-foreground">{patient.phone}</p>
              </div>
              
              {patient.email && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </p>
                  <p className="text-lg font-semibold text-foreground">{patient.email}</p>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Cadastrado em</p>
                <p className="text-lg font-semibold text-foreground">
                  {patient.createdAt.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Diagnóstico/Condição</p>
              <p className="text-foreground bg-muted p-3 rounded-md">{patient.diagnosis}</p>
            </div>
          </CardContent>
        </Card>

        {/* Evoluções */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Evoluções ({evolutions.length})</span>
              <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                {evolutions.length} registro{evolutions.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {evolutions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma evolução registrada</h3>
                <p className="text-muted-foreground mb-4">
                  Registre a primeira evolução deste paciente para acompanhar o progresso.
                </p>
                <Button 
                  onClick={() => setShowEvolutionForm(true)}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Primeira Evolução
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {evolutions.map((evolution) => (
                  <div 
                    key={evolution.id} 
                    className="border border-border rounded-lg p-4 bg-gradient-card hover:shadow-card transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">
                          {evolution.date.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvolution(evolution.id)}
                        className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{evolution.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Registrado em {evolution.createdAt.toLocaleDateString('pt-BR')} às {evolution.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de nova evolução */}
        <Dialog open={showEvolutionForm} onOpenChange={setShowEvolutionForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Nova Evolução - {patient.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(handleAddEvolution)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data do Atendimento *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date', { required: 'Data é obrigatória' })}
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Evolução *</Label>
                <Textarea
                  id="description"
                  {...register('description', { required: 'Descrição é obrigatória' })}
                  placeholder="Descreva o atendimento, exercícios realizados, progresso observado, orientações dadas..."
                  rows={6}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  Salvar Evolução
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowEvolutionForm(false);
                    reset();
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};