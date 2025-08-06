import React from 'react';
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Calendar, FileText, Trash2 } from 'lucide-react';
import { useEvolutions } from '@/hooks/useEvolutions';

interface PatientCardProps {
  patient: Patient;
  onView: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onView, onDelete }) => {
  const { getEvolutionsByPatient } = useEvolutions();
  const evolutionsCount = getEvolutionsByPatient(patient.id).length;
  const lastEvolution = getEvolutionsByPatient(patient.id)[0];

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-soft transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 rounded-full p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">{patient.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{patient.age} anos</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
            {evolutionsCount} evolução{evolutionsCount !== 1 ? 'ões' : ''}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
        
        <div className="flex items-start space-x-2 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span className="text-foreground">{patient.diagnosis}</span>
        </div>
        
        {lastEvolution && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Último atendimento: {lastEvolution.date.toLocaleDateString('pt-BR')}</span>
          </div>
        )}
        
        <div className="flex space-x-2 pt-2">
          <Button 
            onClick={() => onView(patient)} 
            className="flex-1 bg-gradient-primary hover:opacity-90"
            size="sm"
          >
            Ver Detalhes
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(patient)}
            className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};