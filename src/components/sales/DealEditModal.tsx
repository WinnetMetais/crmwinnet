
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { 
  Deal, 
  getCustomers, 
  getPipelineStages, 
  getPriorities, 
  getQualificationStatus 
} from "@/services/pipeline";

interface DealEditModalProps {
  deal: Deal | null;
  open: boolean;
  onClose: () => void;
  onSave: (dealData: any) => void;
  mode: 'create' | 'edit';
}

export const DealEditModal = ({ deal, open, onClose, onSave, mode }: DealEditModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    customer_id: '',
    estimated_value: '',
    pipeline_stage_id: '',
    priority_id: '',
    qualification_status_id: '',
    assigned_to: '',
    description: '',
    close_date: '',
    follow_up_date: '',
    observations: ''
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers-select'],
    queryFn: getCustomers
  });

  const { data: stages = [] } = useQuery({
    queryKey: ['pipeline-stages-modal'],
    queryFn: getPipelineStages
  });

  const { data: priorities = [] } = useQuery({
    queryKey: ['priorities-modal'],
    queryFn: getPriorities
  });

  const { data: qualificationStatus = [] } = useQuery({
    queryKey: ['qualification-status-modal'],
    queryFn: getQualificationStatus
  });

  useEffect(() => {
    if (deal && mode === 'edit') {
      setFormData({
        title: deal.title || '',
        customer_id: deal.customer_id || '',
        estimated_value: deal.estimated_value?.toString() || '',
        pipeline_stage_id: deal.pipeline_stage_id || '',
        priority_id: deal.priority_id || '',
        qualification_status_id: deal.qualification_status_id || '',
        assigned_to: deal.assigned_to || '',
        description: deal.description || '',
        close_date: deal.close_date ? new Date(deal.close_date).toISOString().split('T')[0] : '',
        follow_up_date: deal.follow_up_date ? new Date(deal.follow_up_date).toISOString().split('T')[0] : '',
        observations: deal.observations || ''
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        customer_id: '',
        estimated_value: '',
        pipeline_stage_id: stages[0]?.id || '',
        priority_id: '',
        qualification_status_id: '',
        assigned_to: '',
        description: '',
        close_date: '',
        follow_up_date: '',
        observations: ''
      });
    }
  }, [deal, mode, stages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dealData = {
      ...formData,
      estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
      close_date: formData.close_date ? new Date(formData.close_date).toISOString() : null,
      follow_up_date: formData.follow_up_date ? new Date(formData.follow_up_date).toISOString() : null,
    };

    onSave(dealData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nova Oportunidade' : 'Editar Oportunidade'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Oportunidade *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Fornecimento de aço inox"
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
                  {customers.map((customer: any) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} {customer.company && `- ${customer.company}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_value">Valor Estimado (R$)</Label>
              <Input
                id="estimated_value"
                type="number"
                step="0.01"
                min="0"
                value={formData.estimated_value}
                onChange={(e) => handleChange('estimated_value', e.target.value)}
                placeholder="0,00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pipeline_stage_id">Estágio</Label>
              <Select value={formData.pipeline_stage_id} onValueChange={(value) => handleChange('pipeline_stage_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estágio" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage: any) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority_id">Prioridade</Label>
              <Select value={formData.priority_id} onValueChange={(value) => handleChange('priority_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority: any) => (
                    <SelectItem key={priority.id} value={priority.id}>
                      {priority.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qualification_status_id">Status de Qualificação</Label>
              <Select value={formData.qualification_status_id} onValueChange={(value) => handleChange('qualification_status_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status de qualificação" />
                </SelectTrigger>
                <SelectContent>
                  {qualificationStatus.map((status: any) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Responsável</Label>
              <Select value={formData.assigned_to} onValueChange={(value) => handleChange('assigned_to', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Carlos Silva">Carlos Silva</SelectItem>
                  <SelectItem value="Ana Oliveira">Ana Oliveira</SelectItem>
                  <SelectItem value="João Santos">João Santos</SelectItem>
                  <SelectItem value="Maria Costa">Maria Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="close_date">Data Prevista de Fechamento</Label>
              <Input
                id="close_date"
                type="date"
                value={formData.close_date}
                onChange={(e) => handleChange('close_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="follow_up_date">Próximo Follow-up</Label>
            <Input
              id="follow_up_date"
              type="date"
              value={formData.follow_up_date}
              onChange={(e) => handleChange('follow_up_date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descrição da oportunidade..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Criar Oportunidade' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
