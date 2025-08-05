import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Layers, CheckCircle } from 'lucide-react';
import { useQuotes } from '@/hooks/useQuotes';
import { useDeals } from '@/hooks/useDeals';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const CommercialBulkOperations = () => {
  const [operationType, setOperationType] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: quotes = [] } = useQuotes();
  const { data: deals = [] } = useDeals();
  const { toast } = useToast();

  const currentData = operationType === 'quotes' ? quotes : deals;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const executeBulkAction = async () => {
    if (selectedItems.length === 0 || !bulkAction || !operationType) {
      toast({
        title: 'Erro',
        description: 'Selecione itens e uma ação para executar',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const tableName = operationType === 'quotes' ? 'quotes' : 'deals';
      let updateData: any = {};

      switch (bulkAction) {
        case 'delete':
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .in('id', selectedItems);
          
          if (deleteError) throw deleteError;
          break;

        case 'status_active':
          updateData = { status: operationType === 'quotes' ? 'enviado' : 'ativo' };
          break;

        case 'status_inactive':
          updateData = { status: operationType === 'quotes' ? 'expirado' : 'inativo' };
          break;

        case 'approve':
          updateData = { 
            status: operationType === 'quotes' ? 'aprovado' : 'won',
            approved_at: new Date().toISOString()
          };
          break;
      }

      if (bulkAction !== 'delete') {
        const { error: updateError } = await supabase
          .from(tableName)
          .update(updateData)
          .in('id', selectedItems);
        
        if (updateError) throw updateError;
      }

      toast({
        title: 'Sucesso',
        description: `${selectedItems.length} itens processados com sucesso!`,
      });

      setSelectedItems([]);
      setBulkAction('');
    } catch (error) {
      console.error('Erro na operação em lote:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao executar operação em lote',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
      case 'won':
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'enviado':
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'rejeitado':
      case 'lost':
      case 'expirado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="mr-2 h-5 w-5" />
            Operações em Lote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operation-type">Tipo de Dados</Label>
              <Select value={operationType} onValueChange={setOperationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quotes">Orçamentos</SelectItem>
                  <SelectItem value="deals">Deals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-action">Ação</Label>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status_active">Ativar</SelectItem>
                  <SelectItem value="status_inactive">Desativar</SelectItem>
                  <SelectItem value="approve">Aprovar</SelectItem>
                  <SelectItem value="delete">Excluir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={executeBulkAction}
                disabled={selectedItems.length === 0 || !bulkAction || isLoading}
                className="w-full"
                variant={bulkAction === 'delete' ? 'destructive' : 'default'}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isLoading ? 'Processando...' : 'Executar'}
              </Button>
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                {selectedItems.length} item(s) selecionado(s) para {bulkAction}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {operationType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {operationType === 'quotes' ? 'Orçamentos' : 'Deals'} 
                ({currentData.length})
              </span>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedItems.length === currentData.length && currentData.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label className="text-sm">Selecionar todos</Label>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Layers className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Nenhum registro encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === currentData.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>
                      {operationType === 'quotes' ? 'Número' : 'Título'}
                    </TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>
                      {operationType === 'quotes' ? 'Total' : 'Valor'}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => 
                            handleSelectItem(item.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {operationType === 'quotes' 
                          ? (item as any).quote_number 
                          : (item as any).title}
                      </TableCell>
                      <TableCell>
                        {operationType === 'quotes' 
                          ? (item as any).customer_name 
                          : (item as any).customers?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {operationType === 'quotes' 
                          ? new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format((item as any).total || 0)
                          : new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format((item as any).value || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor((item as any).status)}>
                          {(item as any).status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date((item as any).created_at).toLocaleDateString('pt-BR')}
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