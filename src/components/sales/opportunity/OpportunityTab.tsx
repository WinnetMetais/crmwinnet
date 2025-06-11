
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OpportunityData {
  opportunityTitle: string;
  estimatedValue: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  leadSource: string;
  assignedTo: string;
}

interface OpportunityTabProps {
  formData: OpportunityData;
  onUpdateData: (updates: Partial<OpportunityData>) => void;
}

export const OpportunityTab = ({ formData, onUpdateData }: OpportunityTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informações da Oportunidade</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Título da Oportunidade *</Label>
            <Select value={formData.opportunityTitle} onValueChange={(value) => onUpdateData({ opportunityTitle: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de oportunidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Venda de Produto">Venda de Produto</SelectItem>
                <SelectItem value="Venda de Serviço">Venda de Serviço</SelectItem>
                <SelectItem value="Fornecimento de Material">Fornecimento de Material</SelectItem>
                <SelectItem value="Projeto Customizado">Projeto Customizado</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="estimatedValue">Valor Estimado (R$)</Label>
            <Input
              id="estimatedValue"
              type="number"
              step="0.01"
              value={formData.estimatedValue}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="stage">Estágio</Label>
          <Select value={formData.stage} onValueChange={(value) => onUpdateData({ stage: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estágio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospecto">Prospecto</SelectItem>
              <SelectItem value="qualificacao">Qualificação</SelectItem>
              <SelectItem value="proposta">Proposta</SelectItem>
              <SelectItem value="negociacao">Negociação</SelectItem>
              <SelectItem value="fechamento">Fechamento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="probability">Probabilidade (%)</Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => onUpdateData({ probability: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="closeDate">Data Prevista Fechamento</Label>
          <Input
            id="closeDate"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => onUpdateData({ expectedCloseDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="leadSource">Origem do Lead</Label>
          <Select value={formData.leadSource} onValueChange={(value) => onUpdateData({ leadSource: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Como nos conheceu?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="site">Site</SelectItem>
              <SelectItem value="google-ads">Google Ads</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
              <SelectItem value="mercado-livre">Mercado Livre</SelectItem>
              <SelectItem value="visita-externa">Visita Externa</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assignedTo">Responsável</Label>
          <Select value={formData.assignedTo} onValueChange={(value) => onUpdateData({ assignedTo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ketellyn-lira">Ketellyn Lira</SelectItem>
              <SelectItem value="evandro-pacheco">Evandro Pacheco</SelectItem>
              <SelectItem value="dianna-guarnier">Dianna Guarnier</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
