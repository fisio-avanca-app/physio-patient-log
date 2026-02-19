import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useFirebaseSourceUnits } from '@/hooks/useFirebaseSourceUnits';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Trash2, Building2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const SourceUnits: React.FC = () => {
  const { sourceUnits, loading, addSourceUnit, deleteSourceUnit } = useFirebaseSourceUnits();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ id: string; name: string } | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await addSourceUnit(newName.trim());
      setNewName('');
      setShowForm(false);
      toast({ title: 'Unidade adicionada', description: `${newName.trim()} foi cadastrada com sucesso!` });
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível adicionar a unidade.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await deleteSourceUnit(deleteDialog.id);
      toast({ title: 'Unidade removida', description: `${deleteDialog.name} foi removida.` });
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível remover a unidade.', variant: 'destructive' });
    }
    setDeleteDialog(null);
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Unidades de Origem</h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Unidade
          </Button>
        </div>

        {sourceUnits.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma unidade cadastrada</h3>
              <p className="text-muted-foreground mb-6">Cadastre sua primeira unidade de origem.</p>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Unidade
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sourceUnits.map((unit) => (
              <Card key={unit.id} className="shadow-card hover:shadow-soft transition-all duration-300">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{unit.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteDialog({ id: unit.id, name: unit.name })}
                    className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal adicionar */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Unidade de Origem</DialogTitle>
              <DialogDescription>Cadastre uma nova unidade de origem para os pacientes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome da unidade"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <div className="flex gap-3">
                <Button onClick={handleAdd} className="flex-1 bg-gradient-primary hover:opacity-90">Cadastrar</Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal confirmar exclusão */}
        <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a unidade <strong>{deleteDialog?.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-4">
              <Button variant="destructive" onClick={handleDelete} className="flex-1">Excluir</Button>
              <Button variant="outline" onClick={() => setDeleteDialog(null)} className="flex-1">Cancelar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};
