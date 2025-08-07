import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, DollarSign, Calendar, Plus } from "lucide-react";
import { useTransactions, useDeleteTransaction } from "@/hooks/useTransactions";
import { NewTransactionForm } from "./NewTransactionForm";
import { toast } from "@/hooks/use-toast";
import type { Transaction } from "@/services/transactions";

export const TransactionsList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pago': 'default',
      'pendente': 'secondary',
      'vencido': 'destructive'
    } as const;
    
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const getTypeBadge = (type: string) => {
    return type === 'receita' ? 'default' : 'destructive';
  };

  if (showForm) {
    return (
      <NewTransactionForm 
        onClose={handleCloseForm}
        editingTransaction={editingTransaction}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Todas as Transações ({transactions.length})
            </CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando transações...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira receita ou despesa.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Transação
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge variant={getTypeBadge(transaction.type)}>
                          {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.title}</div>
                          {transaction.description && (
                            <div className="text-sm text-muted-foreground">
                              {transaction.description.substring(0, 50)}...
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <span className={transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}>
                          R$ {Number(transaction.amount).toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2 
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(transaction)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(transaction.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            disabled={deleteTransaction.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
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
    </div>
  );
};