
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  title: string;
  amount: number;
  onTitleChange: (title: string) => void;
  onAmountChange: (amount: number) => void;
}

export const BasicInfoSection = ({ title, amount, onTitleChange, onAmountChange }: BasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Transação *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ex: Venda de produto, Pagamento de fornecedor..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$) *</Label>
        <Input
          id="amount"
          type="number"
          value={amount || ''}
          onChange={(e) => onAmountChange(Number(e.target.value))}
          placeholder="0,00"
          step="0.01"
          min="0"
          required
        />
      </div>
    </div>
  );
};
