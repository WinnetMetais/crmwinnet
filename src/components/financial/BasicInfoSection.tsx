
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  title: string;
  amount: number;
  onTitleChange: (value: string) => void;
  onAmountChange: (value: number) => void;
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
          placeholder="Ex: Venda de chapas de aço"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$) *</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          required
        />
      </div>
    </div>
  );
};
