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
                placeholder="(88) 99999-9999"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
              <Label htmlFor="sex">Sexo *</Label>
              <select
                id="sex"
                {...register('sex', { required: 'Sexo é obrigatório' })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:ring-primary/20"
              >
                <option value="" disabled selected>
                  Selecione o sexo
                </option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
              {errors.sex && (
                <p className="text-sm text-destructive">{errors.sex.message}</p>
              )}
          </div>

            <div className="space-y-2">
              <Label htmlFor="email">Data De Natascimento</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                placeholder="99/99/9999"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cns">CNS *</Label>
              <Input
                id="cns"
                {...register('cns', { required: 'CNS é obrigatório' })}
                placeholder="Carteira Nacional de Saúde"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              {errors.cns && (
                <p className="text-sm text-destructive">{errors.cns.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                type="cpf"
                {...register('cpf', { required: 'CPF é obrigatório' })}
                placeholder="999.999.999-99"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
                {errors.cpf && (
                <p className="text-sm text-destructive">{errors.cns.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acs">ACS *</Label>
              <Input
                id="acs"
                {...register('acs', { required: 'ACS é obrigatório' })}
                placeholder="Agente Comunitário de Saúde"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              {errors.acs && (
                <p className="text-sm text-destructive">{errors.acs.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceUnit">Unidade de Origem *</Label>
              <Input
                id="sourceUnit"
                type="sourceUnit"
                {...register('sourceUnit', { required: 'Unidade de Origem é obrigatório' })}
                placeholder="Unidade de Origem"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
                {errors.sourceUnit && (
                <p className="text-sm text-destructive">{errors.sourceUnit.message}</p>
              )}
            </div>
          </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso *</Label>
              <Input
                id="weight"
                {...register('weight', { required: 'Peso é obrigatório' })}
                placeholder="Peso"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              {errors.weight && (
                <p className="text-sm text-destructive">{errors.weight.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura *</Label>
              <Input
                id="height"
                type="height"
                {...register('height', { required: 'Altura é obrigatório' })}
                placeholder="Altura"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
                {errors.height && (
                <p className="text-sm text-destructive">{errors.height.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                {...register('address', { required: 'Endereço é obrigatório' })}
                placeholder="Endereço"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referencePoint">Ponto de Referência *</Label>
              <Input
                id="referencePoint"
                type="referencePoint"
                {...register('referencePoint', { required: 'Ponto de Referência é obrigatório' })}
                placeholder="Ponto de Referência"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
                {errors.referencePoint && (
                <p className="text-sm text-destructive">{errors.referencePoint.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
              <Label htmlFor="service">Atendimento *</Label>
              <select
                id="service"
                {...register('service', { required: 'Atendimento é obrigatório' })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:ring-primary/20"
              >
                <option value="service" disabled selected>
                  Selecione o atendimento
                </option>
                <option value="ambulatorial">Ambulatorial</option>
                <option value="domiciliar">Domiciliar</option>
              </select>
              {errors.service && (
                <p className="text-sm text-destructive">{errors.service.message}</p>
              )}
          </div>

 <div className="space-y-2">
              <Label htmlFor="riskRating">Classificação de risco *</Label>
              <select
                id="riskRating"
                {...register('riskRating', { required: 'Classificação de risco é obrigatório' })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:ring-primary/20"
              >
                <option value="service" disabled selected>
                  Selecione a classificação
                </option>
                <option value="eletivo">Eletivo</option>
                <option value="prioritário">Prioritário</option>
                <option value="urgente">Urgente</option>
              </select>
              {errors.riskRating && (
                <p className="text-sm text-destructive">{errors.riskRating.message}</p>
              )}
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

/*
campos faltantes:
atendimento(ambulatorial ou domicilar)
classificação de risco(eletivo, prioriatario ou urgente)
 */