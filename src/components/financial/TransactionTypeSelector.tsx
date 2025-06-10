
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TransactionTypeSelectorProps {
  value: 'receita' | 'despesa';
  onChange: (type: 'receita' | 'despesa') => void;
}

export const TransactionTypeSelector = ({ value, onChange }: TransactionTypeSelectorProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={value === 'receita' ? 'default' : 'outline'}
            onClick={() => onChange('receita')}
            className={`h-16 ${value === 'receita' ? 'bg-green-600 hover:bg-green-700' : 'border-green-300 text-green-600 hover:bg-green-50'}`}
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Receita / Entrada
          </Button>
          <Button
            type="button"
            variant={value === 'despesa' ? 'default' : 'outline'}
            onClick={() => onChange('despesa')}
            className={`h-16 ${value === 'despesa' ? 'bg-red-600 hover:bg-red-700' : 'border-red-300 text-red-600 hover:bg-red-50'}`}
          >
            <TrendingDown className="h-5 w-5 mr-2" />
            Despesa / Saída
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
