
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ActionsData {
  nextAction: string;
  nextActionDate: string;
  notes: string;
}

interface ActionsTabProps {
  formData: ActionsData;
  onUpdateData: (updates: Partial<ActionsData>) => void;
}

export const ActionsTab = ({ formData, onUpdateData }: ActionsTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Próximas Ações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nextAction">Próxima Ação</Label>
            <Input
              id="nextAction"
              placeholder="Ex: Enviar proposta comercial"
              value={formData.nextAction}
              onChange={(e) => onUpdateData({ nextAction: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="nextActionDate">Data da Próxima Ação</Label>
            <Input
              id="nextActionDate"
              type="date"
              value={formData.nextActionDate}
              onChange={(e) => onUpdateData({ nextActionDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Informações adicionais sobre a oportunidade..."
          value={formData.notes}
          onChange={(e) => onUpdateData({ notes: e.target.value })}
        />
      </div>
    </div>
  );
};
