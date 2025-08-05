import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { History, Plus, Calendar, User, FileText } from 'lucide-react';
import { useDeals } from '@/hooks/useDeals';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NegotiationEntry {
  id: string;
  deal_id: string;
  activity_type: string;
  title: string;
  description: string;
  status: string;
  created_by: string;
  created_at: string;
}

export const NegotiationHistory = () => {
  const [selectedDeal, setSelectedDeal] = useState('');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [negotiationData, setNegotiationData] = useState({
    type: '',
    description: '',
    outcome: '',
    next_action: '',
  });
  const [history, setHistory] = useState<NegotiationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: deals = [] } = useDeals();
  const { toast } = useToast();

  const loadNegotiationHistory = async (dealId: string) => {
    try {
      const { data, error } = await supabase
        .from('pipeline_activities')
        .select('*')
        .eq('deal_id', dealId)
        .eq('activity_type', 'negotiation')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleDealChange = (dealId: string) => {
    setSelectedDeal(dealId);
    if (dealId) {
      loadNegotiationHistory(dealId);
    } else {
      setHistory([]);
    }
  };

  const handleAddEntry = async () => {
    if (!selectedDeal || !negotiationData.type || !negotiationData.description) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('pipeline_activities')
        .insert({
          deal_id: selectedDeal,
          activity_type: 'negotiation',
          title: negotiationData.type,
          description: negotiationData.description,
          status: 'completed',
          created_by: 'Usuário Atual',
          completed_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Entrada de negociação adicionada com sucesso!',
      });

      setNegotiationData({
        type: '',
        description: '',
        outcome: '',
        next_action: '',
      });
      setShowNewEntry(false);
      loadNegotiationHistory(selectedDeal);
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao adicionar entrada de negociação',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reunião': return 'bg-blue-100 text-blue-800';
      case 'proposta': return 'bg-green-100 text-green-800';
      case 'negociação': return 'bg-yellow-100 text-yellow-800';
      case 'fechamento': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Histórico de Negociações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="deal-select">Selecionar Deal</Label>
              <Select value={selectedDeal} onValueChange={handleDealChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um deal para ver o histórico" />
                </SelectTrigger>
                <SelectContent>
                  {deals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {deal.title} - {deal.customers?.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDeal && (
              <Dialog open={showNewEntry} onOpenChange={setShowNewEntry}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Entrada
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nova Entrada de Negociação</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Interação</Label>
                      <Select value={negotiationData.type} onValueChange={(value) => 
                        setNegotiationData(prev => ({ ...prev, type: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reunião">Reunião</SelectItem>
                          <SelectItem value="proposta">Proposta</SelectItem>
                          <SelectItem value="negociação">Negociação</SelectItem>
                          <SelectItem value="fechamento">Fechamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={negotiationData.description}
                        onChange={(e) => setNegotiationData(prev => ({ 
                          ...prev, description: e.target.value 
                        }))}
                        placeholder="Descreva o que foi discutido..."
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={handleAddEntry} 
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar Entrada'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedDeal && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Interações</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Nenhuma entrada de negociação encontrada</p>
                <p className="text-sm">Adicione a primeira entrada para começar o histórico</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(entry.title)}>
                          {entry.title}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {entry.description}
                      </TableCell>
                      <TableCell>
                        {entry.status === 'completed' ? 'Concluído' : 'Pendente'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          {entry.created_by}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};