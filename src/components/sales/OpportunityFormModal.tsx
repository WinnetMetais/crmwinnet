import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

import { Target, DollarSign, Calendar, User } from "lucide-react";
import { useCreateOpportunity, useUpdateOpportunity } from "@/hooks/useOpportunities";
import { toast } from "@/hooks/use-toast";
import { getCustomers } from "@/services/customers";

interface OpportunityFormModalProps {
  open: boolean;
  onClose: () => void;
  opportunity?: any;
  mode?: 'create' | 'edit';
}

export const OpportunityFormModal = ({ open, onClose, opportunity, mode = 'create' }: OpportunityFormModalProps) => {
  const [formData, setFormData] = useState({
    title: opportunity?.title || '',
    description: opportunity?.description || '',
    customer_id: opportunity?.customer_id || '',
    value: opportunity?.value || '',
    probability: opportunity?.probability || 50,
    expected_close_date: opportunity?.expected_close_date || '',
    stage: opportunity?.stage || 'prospecto',
    lead_source: opportunity?.lead_source || '',
    assigned_to: opportunity?.assigned_to || '',
    status: opportunity?.status || 'active',
  });

  const createOpportunityMutation = useCreateOpportunity();
  const updateOpportunityMutation = useUpdateOpportunity();
  const { data: customers = [] } = useQuery({ queryKey: ['customers'], queryFn: getCustomers });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um cliente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const opportunityData = {
        ...formData,
        value: formData.value ? parseFloat(formData.value.toString()) : undefined,
        probability: parseInt(formData.probability.toString()) || 50,
      };

      if (mode === 'create') {
        await createOpportunityMutation.mutateAsync(opportunityData);
        toast({
          title: "Oportunidade Criada",
          description: `${formData.title} foi criada com sucesso!`,
        });
      } else {
        await updateOpportunityMutation.mutateAsync({ 
          id: opportunity.id, 
          data: opportunityData 
        });
        toast({
          title: "Oportunidade Atualizada",
          description: `${formData.title} foi atualizada com sucesso!`,
        });
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {mode === 'create' ? 'Nova Oportunidade' : 'Editar Oportunidade'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="value">Valor e Probabilidade</TabsTrigger>
              <TabsTrigger value="management">Gestão</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Oportunidade *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Ex: Venda de Chapas de Aço - Empresa XYZ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_id">Cliente *</Label>
                <Select value={formData.customer_id} onValueChange={(value) => handleChange('customer_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.length > 0 ? (
                      customers.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>Nenhum cliente encontrado</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descreva a oportunidade, produtos/serviços envolvidos, etc..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stage">Estágio *</Label>
                  <Select value={formData.stage} onValueChange={(value) => handleChange('stage', value)}>
                    <SelectTrigger>
                      <SelectValue />
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

                <div className="space-y-2">
                  <Label htmlFor="lead_source">Origem do Lead</Label>
                  <Input
                    id="lead_source"
                    value={formData.lead_source}
                    onChange={(e) => handleChange('lead_source', e.target.value)}
                    placeholder="Ex: Website, Indicação, Google Ads..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="value" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Valor Estimado (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="probability">Probabilidade de Fechamento (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => handleChange('probability', e.target.value)}
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_close_date">Data Prevista de Fechamento</Label>
                <Input
                  id="expected_close_date"
                  type="date"
                  value={formData.expected_close_date}
                  onChange={(e) => handleChange('expected_close_date', e.target.value)}
                />
              </div>

              {formData.value && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Valor Ponderado</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format((parseFloat(formData.value.toString()) || 0) * (formData.probability / 100))}
                  </p>
                  <p className="text-sm text-green-600">
                    Baseado em {formData.probability}% de probabilidade
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="management" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Responsável</Label>
                  <Input
                    id="assigned_to"
                    value={formData.assigned_to}
                    onChange={(e) => handleChange('assigned_to', e.target.value)}
                    placeholder="Nome do vendedor/responsável"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="won">Ganha</SelectItem>
                      <SelectItem value="lost">Perdida</SelectItem>
                      <SelectItem value="paused">Pausada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createOpportunityMutation.isPending || updateOpportunityMutation.isPending}
            >
              <Target className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Criar Oportunidade' : 'Atualizar Oportunidade'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};