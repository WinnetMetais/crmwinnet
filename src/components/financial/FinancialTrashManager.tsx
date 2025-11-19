import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, RotateCcw, AlertTriangle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/transactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função auxiliar para formatação de moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

interface DeletedTransaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  date: string;
  deleted_at: string | null;
  client_name: string | null;
  category: string;
}

export const FinancialTrashManager = () => {
  const [deletedTransactions, setDeletedTransactions] = useState<DeletedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [hardDeleting, setHardDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const loadDeletedTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getDeletedTransactions();
      setDeletedTransactions(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao carregar lixeira',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setRestoring(id);
      await transactionService.restoreTransaction(id);
      
      toast({
        title: 'Sucesso',
        description: 'Transação restaurada com sucesso!',
      });
      
      await loadDeletedTransactions();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao restaurar transação',
        variant: 'destructive',
      });
    } finally {
      setRestoring(null);
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!confirm('⚠️ ATENÇÃO: Esta ação irá excluir permanentemente a transação. Não poderá ser desfeita. Continuar?')) {
      return;
    }

    try {
      setHardDeleting(id);
      await transactionService.hardDeleteTransaction(id);
      
      toast({
        title: 'Excluído Permanentemente',
        description: 'Transação excluída permanentemente do sistema',
        variant: 'destructive',
      });
      
      await loadDeletedTransactions();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir definitivamente',
        variant: 'destructive',
      });
    } finally {
      setHardDeleting(null);
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'receita' ? (
      <Badge variant="success">
        Receita
      </Badge>
    ) : (
      <Badge variant="destructive">
        Despesa
      </Badge>
    );
  };

  useEffect(() => {
    loadDeletedTransactions();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Lixeira Financeira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">Carregando transações deletadas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Lixeira Financeira
        </CardTitle>
        <CardDescription>
          Transações excluídas ficam aqui por segurança. Você pode restaurá-las ou excluí-las permanentemente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {deletedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Lixeira vazia</p>
            <p className="text-sm text-muted-foreground">Nenhuma transação deletada encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {deletedTransactions.length} transação(ões) na lixeira. 
                Você pode restaurar ou excluir permanentemente.
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Original</TableHead>
                  <TableHead>Deletado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {getTypeBadge(transaction.type)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.title}
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.client_name || '-'}</TableCell>
                    <TableCell className={
                      transaction.type === 'receita' 
                        ? 'text-green-600 font-medium' 
                        : 'text-red-600 font-medium'
                    }>
                      {transaction.type === 'receita' ? '+' : '-'} 
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(transaction.deleted_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(transaction.id)}
                          disabled={restoring === transaction.id}
                          className="h-8"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          {restoring === transaction.id ? 'Restaurando...' : 'Restaurar'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleHardDelete(transaction.id)}
                          disabled={hardDeleting === transaction.id}
                          className="h-8"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {hardDeleting === transaction.id ? 'Excluindo...' : 'Excluir'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};