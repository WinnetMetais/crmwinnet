
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface RecurrenceSectionProps {
  recurring: boolean;
  recurringPeriod: string;
  onRecurringChange: (value: boolean) => void;
  onRecurringPeriodChange: (value: string) => void;
}

export const RecurrenceSection = ({ recurring, recurringPeriod, onRecurringChange, onRecurringPeriodChange }: RecurrenceSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="recurring"
          checked={recurring}
          onCheckedChange={onRecurringChange}
        />
        <Label htmlFor="recurring">Transação Recorrente</Label>
      </div>
      
      {recurring && (
        <div className="space-y-2">
          <Label htmlFor="recurringPeriod">Período de Recorrência</Label>
          <Select value={recurringPeriod} onValueChange={onRecurringPeriodChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="semestral">Semestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
