
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface RecurrenceSectionProps {
  recurring: boolean;
  recurringPeriod: string;
  onRecurringChange: (recurring: boolean) => void;
  onRecurringPeriodChange: (period: string) => void;
}

export const RecurrenceSection = ({ 
  recurring, 
  recurringPeriod, 
  onRecurringChange, 
  onRecurringPeriodChange 
}: RecurrenceSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="recurring"
          checked={recurring}
          onCheckedChange={onRecurringChange}
        />
        <Label htmlFor="recurring">Transação recorrente</Label>
      </div>
      
      {recurring && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recurringPeriod">Período de Recorrência</Label>
            <Select value={recurringPeriod} onValueChange={onRecurringPeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
