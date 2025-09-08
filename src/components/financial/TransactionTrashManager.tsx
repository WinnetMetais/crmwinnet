import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/transactions';

interface DeletedTransaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  deleted_at: string;
  deleted_by: string;
}

const TransactionTrashManager: React.FC = () => {
  const [deletedTransactions, setDeletedTransactions] = useState<DeletedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const loadDeletedTransactions = async () => {
    try {
      setLoading(true);
      const transactions = await transactionService.getDeletedTransactions();
      setDeletedTransactions(transactions);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar transações excluídas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedTransactions();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      setRestoring(id);
      await transactionService.restoreTransaction(id);
      toast({
        title: 'Sucesso',
        description: 'Transação restaurada com sucesso!'
      });
      await loadDeletedTransactions();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao restaurar transação',
        variant: 'destructive'
      });
    } finally {
      setRestoring(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!transactionToDelete) return;

    try {
      setDeleting(transactionToDelete);
      await transactionService.hardDeleteTransaction(transactionToDelete);
      toast({
        title: 'Sucesso',
        description: 'Transação excluída permanentemente!'
      });
      await loadDeletedTransactions();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir transação permanentemente',
        variant: 'destructive'
      });
    } finally {
      setDeleting(null);
      setShowDeleteDialog(false);
      setTransactionToDelete(null);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTypeBadge = (type: string) => {
    return type === 'receita' ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Receita
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        Despesa
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Lixeira de Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (deletedTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Lixeira de Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Trash2 className="h-12 w-12 mb-4 opacity-50" />
            <p>Nenhuma transação excluída encontrada</p>
            <p className="text-sm">Transações excluídas aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Lixeira de Transações ({deletedTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Excluída em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deletedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                  <TableCell className="font-medium">{transaction.title}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className={transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.deleted_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(transaction.id)}
                        disabled={restoring === transaction.id}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="h-4 w-4" />
                        {restoring === transaction.id ? 'Restaurando...' : 'Restaurar'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setTransactionToDelete(transaction.id);
                          setShowDeleteDialog(true);
                        }}
                        disabled={deleting === transaction.id}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleting === transaction.id ? 'Excluindo...' : 'Excluir'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Excluir Permanentemente
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação será excluída permanentemente
              do sistema e não poderá ser recuperada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePermanentDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionTrashManager;