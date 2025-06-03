
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransactionFormData } from "@/types/transaction";

interface TransactionTypeSelectorProps {
  value: 'receita' | 'despesa';
  onChange: (value: 'receita' | 'despesa') => void;
}

export const TransactionTypeSelector = ({ value, onChange }: TransactionTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label>Tipo de Transação *</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="receita" id="receita" />
          <Label htmlFor="receita" className="text-green-600 font-medium">Receita</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="despesa" id="despesa" />
          <Label htmlFor="despesa" className="text-red-600 font-medium">Despesa</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
