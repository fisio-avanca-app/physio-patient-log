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
import { ArrowLeft, Plus, Calendar, FileText, Phone, Mail, User, Trash2, Edit, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CreateEvolutionData, Patient, Evolution } from '@/types/patient';
import { useToast } from '@/hooks/use-toast';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatientById, updatePatient } = useFirebasePatients();
  const { getEvolutionsByPatient, addEvolution, deleteEvolution } = useFirebaseEvolutions();
  const { toast } = useToast();
  const [showEvolutionForm, setShowEvolutionForm] = useState(false);
  const [showEditPatientForm, setShowEditPatientForm] = useState(false);
  const [editingEvolution, setEditingEvolution] = useState<Evolution | null>(null);

  const patient = id ? getPatientById(id) : null;
  const evolutions = id ? getEvolutionsByPatient(id) : [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    date: string;
    description: string;
  }>();

  const { register: registerPatient, handleSubmit: handleSubmitPatient, reset: resetPatient, setValue: setValuePatient, formState: { errors: errorsPatient } } = useForm<Partial<Patient>>();

  const { register: registerEvolution, handleSubmit: handleSubmitEvolution, reset: resetEvolution, setValue: setValueEvolution, formState: { errors: errorsEvolution } } = useForm<{
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
    if (!id) 
      return;
    
  const [year, month, day] = data.date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);

    const evolutionData: CreateEvolutionData = {
      patientId: id,
      date: localDate,
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

  const handleUpdatePatient = (data: Partial<Patient>) => {
    if (!id) return;
    
    updatePatient(id, data);
    setShowEditPatientForm(false);
    resetPatient();
    toast({
      title: "Paciente atualizado",
      description: "Os dados do paciente foram atualizados com sucesso!",
    });
  };

  const handleUpdateEvolution = (data: { date: string; description: string }) => {
    if (!editingEvolution) return;
    
    // Como não temos método updateEvolution no hook, vamos deletar e recriar
    deleteEvolution(editingEvolution.id);
    
  const [year, month, day] = data.date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);

    const evolutionData: CreateEvolutionData = {
      patientId: editingEvolution.patientId,
      date: localDate,
      description: data.description
    };

    addEvolution(evolutionData);
    setEditingEvolution(null);
    resetEvolution();
    toast({
      title: "Evolução atualizada",
      description: "A evolução foi atualizada com sucesso!",
    });
  };

  const openEditPatient = () => {
    if (patient) {
      setValuePatient('name', patient.name);
      setValuePatient('age', patient.age);
      setValuePatient('phone', patient.phone);
      setValuePatient('email', patient.email || '');
      setValuePatient('diagnosis', patient.diagnosis);
      setValuePatient('weight', patient.weight);
      setValuePatient('height', patient.height);
      setValuePatient('sex', patient.sex);
      setValuePatient('dateOfBirth', patient.dateOfBirth);
      setValuePatient('cpf', patient.cpf);
      setValuePatient('cns', patient.cns);
      setValuePatient('acs', patient.acs);
      setValuePatient('sourceUnit', patient.sourceUnit);
      setValuePatient('address', patient.address);
      setValuePatient('referencePoint', patient.referencePoint);
      setValuePatient('service', patient.service);
      setValuePatient('riskRating', patient.riskRating);
      setShowEditPatientForm(true);
    }
  };

  const openEditEvolution = (evolution: Evolution) => {
    setValueEvolution('date', evolution.date.toISOString().split('T')[0]);
    setValueEvolution('description', evolution.description);
    setEditingEvolution(evolution);
  };

  const formatDateBr = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
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
          
          <div className="flex space-x-3">
            <Button 
              onClick={openEditPatient}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Paciente
            </Button>
            <Button 
              onClick={() => setShowEvolutionForm(true)}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Evolução
            </Button>
          </div>
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

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Peso</p>
                <p className="text-lg font-semibold text-foreground">{patient.weight} quilos</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Altura</p>
                <p className="text-lg font-semibold text-foreground">{patient.height} m</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">CPF</p>
                <p className="text-lg font-semibold text-foreground">{patient.cpf} </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                <p className="text-lg font-semibold text-foreground">{formatDateBr(patient.dateOfBirth)} </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                <p className="text-lg font-semibold text-foreground">{patient.address} </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Ponto de Referência</p>
                <p className="text-lg font-semibold text-foreground">{patient.referencePoint} </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Unidade de Origem</p>
                <p className="text-lg font-semibold text-foreground">{patient.sourceUnit} </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Agente Comunitário de Saúde</p>
                <p className="text-lg font-semibold text-foreground">{patient.acs} </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Sexo</p>
                <p className="text-lg font-semibold text-foreground">{patient.sex} </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Atendimento</p>
                <p className="text-lg font-semibold text-foreground">{patient.service} </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Carteira Nacional de Saúde</p>
                <p className="text-lg font-semibold text-foreground">{patient.cns} </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Classificação de Risco</p>
                <p className="text-lg font-semibold text-foreground">{patient.riskRating} </p>
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
              <Badge className="bg-primary/10 text-primary border-primary/20">
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
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditEvolution(evolution)}
                          className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvolution(evolution.id)}
                          className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

        {/* Modal de edição do paciente */}
        <Dialog open={showEditPatientForm} onOpenChange={setShowEditPatientForm}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Editar Paciente</span>
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitPatient(handleUpdatePatient)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome *</Label>
                  <Input
                    id="edit-name"
                    {...registerPatient('name', { required: 'Nome é obrigatório' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.name && <p className="text-sm text-destructive">{errorsPatient.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-age">Idade *</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    {...registerPatient('age', { required: 'Idade é obrigatória', valueAsNumber: true })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.age && <p className="text-sm text-destructive">{errorsPatient.age.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone *</Label>
                  <Input
                    id="edit-phone"
                    {...registerPatient('phone', { required: 'Telefone é obrigatório' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.phone && <p className="text-sm text-destructive">{errorsPatient.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    {...registerPatient('email')}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-weight">Peso *</Label>
                  <Input
                    id="edit-weight"
                    {...registerPatient('weight', { required: 'Peso é obrigatório' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.weight && <p className="text-sm text-destructive">{errorsPatient.weight.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-height">Altura *</Label>
                  <Input
                    id="edit-height"
                    {...registerPatient('height', { required: 'Altura é obrigatória' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.height && <p className="text-sm text-destructive">{errorsPatient.height.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-sex">Sexo *</Label>
                  <Input
                    id="edit-sex"
                    {...registerPatient('sex', { required: 'Sexo é obrigatório' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.sex && <p className="text-sm text-destructive">{errorsPatient.sex.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-dateOfBirth">Data de Nascimento *</Label>
                  <Input
                    id="edit-dateOfBirth"
                    type="date"
                    {...registerPatient('dateOfBirth', { required: 'Data de nascimento é obrigatória' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.dateOfBirth && <p className="text-sm text-destructive">{errorsPatient.dateOfBirth.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-cpf">CPF *</Label>
                  <Input
                    id="edit-cpf"
                    {...registerPatient('cpf', { required: 'CPF é obrigatório' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.cpf && <p className="text-sm text-destructive">{errorsPatient.cpf.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-cns">CNS *</Label>
                  <Input
                    id="edit-cns"
                    {...registerPatient('cns', { required: 'CNS é obrigatório' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.cns && <p className="text-sm text-destructive">{errorsPatient.cns.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-acs">ACS *</Label>
                  <Input
                    id="edit-acs"
                    {...registerPatient('acs', { required: 'ACS é obrigatório' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.acs && <p className="text-sm text-destructive">{errorsPatient.acs.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-sourceUnit">Unidade de Origem *</Label>
                  <Input
                    id="edit-sourceUnit"
                    {...registerPatient('sourceUnit', { required: 'Unidade de origem é obrigatória' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.sourceUnit && <p className="text-sm text-destructive">{errorsPatient.sourceUnit.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-service">Atendimento *</Label>
                  <Input
                    id="edit-service"
                    {...registerPatient('service', { required: 'Atendimento é obrigatório' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.service && <p className="text-sm text-destructive">{errorsPatient.service.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-riskRating">Classificação de Risco *</Label>
                  <Input
                    id="edit-riskRating"
                    {...registerPatient('riskRating', { required: 'Classificação de risco é obrigatória' })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {errorsPatient.riskRating && <p className="text-sm text-destructive">{errorsPatient.riskRating.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Endereço *</Label>
                <Input
                  id="edit-address"
                  {...registerPatient('address', { required: 'Endereço é obrigatório' })}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
                {errorsPatient.address && <p className="text-sm text-destructive">{errorsPatient.address.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-referencePoint">Ponto de Referência</Label>
                <Input
                  id="edit-referencePoint"
                  {...registerPatient('referencePoint')}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-diagnosis">Diagnóstico *</Label>
                <Textarea
                  id="edit-diagnosis"
                  {...registerPatient('diagnosis', { required: 'Diagnóstico é obrigatório' })}
                  rows={3}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
                {errorsPatient.diagnosis && <p className="text-sm text-destructive">{errorsPatient.diagnosis.message}</p>}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowEditPatientForm(false);
                    resetPatient();
                  }}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de edição de evolução */}
        <Dialog open={!!editingEvolution} onOpenChange={() => setEditingEvolution(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Editar Evolução - {patient.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitEvolution(handleUpdateEvolution)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-evolution-date">Data do Atendimento *</Label>
                <Input
                  id="edit-evolution-date"
                  type="date"
                  {...registerEvolution('date', { required: 'Data é obrigatória' })}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
                {errorsEvolution.date && (
                  <p className="text-sm text-destructive">{errorsEvolution.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-evolution-description">Descrição da Evolução *</Label>
                <Textarea
                  id="edit-evolution-description"
                  {...registerEvolution('description', { required: 'Descrição é obrigatória' })}
                  placeholder="Descreva o atendimento, exercícios realizados, progresso observado, orientações dadas..."
                  rows={6}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
                {errorsEvolution.description && (
                  <p className="text-sm text-destructive">{errorsEvolution.description.message}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingEvolution(null);
                    resetEvolution();
                  }}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
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

