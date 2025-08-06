import React from 'react';
import { useForm } from 'react-hook-form';
import { CreatePatientData } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

interface PatientFormProps {
  onSubmit: (data: CreatePatientData) => void;
  onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreatePatientData>();

  const handleFormSubmit = (data: CreatePatientData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-card">
      <CardHeader className="bg-gradient-primary text-primary-foreground">
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Novo Paciente</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Digite o nome completo"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade *</Label>
              <Input
                id="age"
                type="number"
                {...register('age', { 
                  required: 'Idade é obrigatória',
                  min: { value: 1, message: 'Idade deve ser maior que 0' },
                  max: { value: 120, message: 'Idade deve ser menor que 120' }
                })}
                placeholder="Ex: 35"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Telefone é obrigatório' })}
                placeholder="(11) 99999-9999"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@exemplo.com"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico/Condição *</Label>
            <Textarea
              id="diagnosis"
              {...register('diagnosis', { required: 'Diagnóstico é obrigatório' })}
              placeholder="Descreva o diagnóstico ou condição do paciente..."
              rows={3}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
            {errors.diagnosis && (
              <p className="text-sm text-destructive">{errors.diagnosis.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              Cadastrar Paciente
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};