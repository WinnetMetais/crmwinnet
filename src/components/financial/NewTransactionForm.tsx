
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TransactionFormData } from "@/types/transaction";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { BasicInfoSection } from "./BasicInfoSection";
import { CategorySection } from "./CategorySection";
import { DateStatusSection } from "./DateStatusSection";
import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { RecurrenceSection } from "./RecurrenceSection";
import { TagsSection } from "./TagsSection";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useTransactions";

interface NewTransactionFormProps {
  onClose: () => void;
  editingTransaction?: any;
}

export const NewTransactionForm = ({ onClose, editingTransaction }: NewTransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'receita',
    title: '',
    amount: 0,
    category: '',
    subcategory: '',
    channel: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentMethod: '',
    status: 'pendente',
    recurring: false,
    recurringPeriod: 'mensal',
    description: '',
    tags: [],
    clientName: '',
    invoiceNumber: ''
  });

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type || 'receita',
        title: editingTransaction.title || editingTransaction.description || '',
        amount: Number(editingTransaction.amount) || 0,
        category: editingTransaction.category || '',
        subcategory: editingTransaction.subcategory || '',
        channel: editingTransaction.channel || '',
        date: editingTransaction.date || new Date().toISOString().split('T')[0],
        dueDate: editingTransaction.due_date || '',
        paymentMethod: editingTransaction.payment_method || '',
        status: editingTransaction.status || 'pendente',
        recurring: editingTransaction.recurring || false,
        recurringPeriod: editingTransaction.recurring_period || 'mensal',
        description: editingTransaction.description || '',
        tags: editingTransaction.tags || [],
        clientName: editingTransaction.client_name || '',
        invoiceNumber: editingTransaction.invoice_number || ''
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const transactionData = {
      type: formData.type,
      title: formData.title,
      amount: formData.amount,
      category: formData.category,
      subcategory: formData.subcategory,
      channel: formData.channel,
      date: formData.date,
      due_date: formData.dueDate || null,
      payment_method: formData.paymentMethod,
      status: formData.status,
      recurring: formData.recurring,
      recurring_period: formData.recurringPeriod,
      description: formData.description,
      tags: formData.tags,
      client_name: formData.clientName,
      invoice_number: formData.invoiceNumber
    };

    try {
      if (editingTransaction) {
        await updateTransaction.mutateAsync({
          id: editingTransaction.id,
          updates: transactionData
        });
        toast({
          title: "Sucesso",
          description: "Transação atualizada com sucesso!",
        });
      } else {
        await createTransaction.mutateAsync(transactionData);
        toast({
          title: "Sucesso",
          description: `${formData.type === 'receita' ? 'Receita' : 'Despesa'} criada com sucesso!`,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: editingTransaction ? "Erro ao atualizar transação" : "Erro ao criar transação",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (updates: Partial<TransactionFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {editingTransaction ? 'Editar Transação' : 'Nova Transação Financeira'}
            </div>
            <Button variant="outline" onClick={onClose}>✕</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <TransactionTypeSelector
              value={formData.type}
              onChange={(type) => updateFormData({ 
                type, 
                category: '', 
                subcategory: '' 
              })}
            />

            <BasicInfoSection
              title={formData.title}
              amount={formData.amount}
              onTitleChange={(title) => updateFormData({ title })}
              onAmountChange={(amount) => updateFormData({ amount })}
            />

            <CategorySection
              type={formData.type}
              category={formData.category}
              subcategory={formData.subcategory}
              onCategoryChange={(category) => updateFormData({ category, subcategory: '' })}
              onSubcategoryChange={(subcategory) => updateFormData({ subcategory })}
            />

            <DateStatusSection
              date={formData.date}
              dueDate={formData.dueDate}
              status={formData.status}
              onDateChange={(date) => updateFormData({ date })}
              onDueDateChange={(dueDate) => updateFormData({ dueDate })}
              onStatusChange={(status) => updateFormData({ status })}
            />

            <AdditionalInfoSection
              paymentMethod={formData.paymentMethod}
              clientName={formData.clientName}
              onPaymentMethodChange={(paymentMethod) => updateFormData({ paymentMethod })}
              onClientNameChange={(clientName) => updateFormData({ clientName })}
            />

            <RecurrenceSection
              recurring={formData.recurring}
              recurringPeriod={formData.recurringPeriod}
              onRecurringChange={(recurring) => updateFormData({ recurring })}
              onRecurringPeriodChange={(recurringPeriod) => updateFormData({ recurringPeriod })}
            />

            <TagsSection
              tags={formData.tags}
              onAddTag={(tag) => updateFormData({ tags: [...formData.tags, tag] })}
              onRemoveTag={(tagToRemove) => updateFormData({ 
                tags: formData.tags.filter(tag => tag !== tagToRemove) 
              })}
            />

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Informações adicionais sobre a transação..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createTransaction.isPending || updateTransaction.isPending}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {editingTransaction ? 'Atualizar Transação' : 'Criar Transação'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
