
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, ArrowRight, Phone, Mail, Calendar, User, Building, MapPin, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getDealsWithRelations, 
  getPipelineStages, 
  updateDealStage, 
  createPipelineActivity,
  createDeal,
  updateDeal,
  deleteDeal,
  Deal,
  PipelineStage 
} from "@/services/pipeline";
import { DealEditModal } from "./DealEditModal";
import { toast } from "@/hooks/use-toast";

export const SalesPipeline = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activityDialog, setActivityDialog] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    activity_type: 'call',
    scheduled_date: ''
  });

  const queryClient = useQueryClient();

  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['deals-pipeline'],
    queryFn: getDealsWithRelations
  });

  const { data: stages = [] } = useQuery({
    queryKey: ['pipeline-stages'],
    queryFn: getPipelineStages
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ dealId, stageId }: { dealId: string; stageId: string }) => 
      updateDealStage(dealId, stageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals-pipeline'] });
    }
  });

  const createActivityMutation = useMutation({
    mutationFn: createPipelineActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals-pipeline'] });
      setActivityDialog(false);
      setNewActivity({ title: '', description: '', activity_type: 'call', scheduled_date: '' });
    }
  });

  const createDealMutation = useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals-pipeline'] });
      setEditModalOpen(false);
      setSelectedDeal(null);
    }
  });

  const updateDealMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateDeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals-pipeline'] });
      setEditModalOpen(false);
      setSelectedDeal(null);
    }
  });

  const deleteDealMutation = useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals-pipeline'] });
      setDeleteDialogOpen(false);
      setDealToDelete(null);
    }
  });

  const filteredDeals = searchTerm
    ? deals.filter((deal: Deal) => 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.customers?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.customers?.company || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : deals;

  const moveOpportunity = (dealId: string, targetStageId: string) => {
    updateStageMutation.mutate({ dealId, stageId: targetStageId });
  };

  const handleCreateActivity = () => {
    if (!selectedDeal || !newActivity.title) return;
    
    createActivityMutation.mutate({
      deal_id: selectedDeal.id,
      customer_id: selectedDeal.customer_id,
      title: newActivity.title,
      description: newActivity.description,
      activity_type: newActivity.activity_type,
      scheduled_date: newActivity.scheduled_date ? new Date(newActivity.scheduled_date).toISOString() : undefined,
      status: 'pending',
      created_by: 'Usuário Atual'
    });
  };

  const handleCreateDeal = () => {
    setModalMode('create');
    setSelectedDeal(null);
    setEditModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setModalMode('edit');
    setSelectedDeal(deal);
    setEditModalOpen(true);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDealToDelete(dealId);
    setDeleteDialogOpen(true);
  };

  const handleSaveDeal = (dealData: any) => {
    if (modalMode === 'create') {
      createDealMutation.mutate(dealData);
    } else if (selectedDeal) {
      updateDealMutation.mutate({ id: selectedDeal.id, data: dealData });
    }
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      deleteDealMutation.mutate(dealToDelete);
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (dealsLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pipeline Comercial Winnet</h2>
        <div className="flex gap-2">
          <Input 
            placeholder="Buscar oportunidades..." 
            className="w-60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleCreateDeal}>
            <Plus className="mr-1 h-4 w-4" /> Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Estatísticas do Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredDeals.length}</div>
              <div className="text-sm text-gray-600">Total Oportunidades</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredDeals.reduce((sum: number, deal: Deal) => sum + (deal.estimated_value || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Valor Total Pipeline</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredDeals.filter((deal: Deal) => deal.pipeline_stages?.name === 'Negociação').length}
              </div>
              <div className="text-sm text-gray-600">Em Negociação</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredDeals.length > 0 
                  ? Math.round((filteredDeals.filter((deal: Deal) => 
                      deal.pipeline_stages?.name?.toLowerCase().includes('fechado') || 
                      deal.pipeline_stages?.name?.toLowerCase().includes('ganho') ||
                      deal.status === 'won'
                    ).length / filteredDeals.length) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Taxa Conversão</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        {stages.map((stage: PipelineStage, index: number) => (
          <React.Fragment key={stage.id}>
            <ResizablePanel defaultSize={Math.floor(100 / stages.length)} minSize={15}>
              <div className="flex h-full flex-col">
                <div 
                  className="text-white p-3 font-medium flex justify-between items-center"
                  style={{ backgroundColor: stage.color }}
                >
                  <div>{stage.name}</div>
                  <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                    {filteredDeals.filter((deal: Deal) => deal.pipeline_stage_id === stage.id).length}
                  </Badge>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-3">
                  {filteredDeals
                    .filter((deal: Deal) => deal.pipeline_stage_id === stage.id)
                    .map((deal: Deal) => (
                       <Card 
                         key={deal.id} 
                         className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                         onClick={() => setSelectedDeal(deal)}
                       >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm">{deal.customers?.name || 'Cliente não informado'}</h3>
                            {deal.priorities && (
                              <Badge 
                                style={{ 
                                  backgroundColor: deal.priorities.color + '20', 
                                  color: deal.priorities.color,
                                  border: `1px solid ${deal.priorities.color}30`
                                }}
                                className="text-xs"
                              >
                                {deal.priorities.name}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{deal.title}</p>
                          
                          {deal.customers?.company && (
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <Building className="h-3 w-3 mr-1" />
                              <span>{deal.customers.company}</span>
                            </div>
                          )}
                          
                          {deal.customers?.city && (
                            <div className="flex items-center text-xs text-gray-500 mb-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{deal.customers.city}, {deal.customers.state}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium text-green-600">
                              {formatCurrency(deal.estimated_value)}
                            </div>
                            {deal.qualification_status && (
                              <Badge variant="outline" className="text-xs">
                                {deal.qualification_status.name}
                              </Badge>
                            )}
                          </div>
                          
                           <div className="flex justify-between items-center">
                             <div className="flex gap-1">
                               <Button 
                                 size="sm" 
                                 variant="ghost" 
                                 className="h-7 w-7 p-0"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleEditDeal(deal);
                                 }}
                               >
                                 <Edit className="h-3.5 w-3.5" />
                               </Button>
                               <Button 
                                 size="sm" 
                                 variant="ghost" 
                                 className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleDeleteDeal(deal.id);
                                 }}
                               >
                                 <Trash2 className="h-3.5 w-3.5" />
                               </Button>
                              {deal.customers?.phone && (
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                  <Phone className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {deal.customers?.email && (
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                  <Mail className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                             {index < stages.length - 1 && (
                               <Button 
                                 size="sm" 
                                 variant="ghost"
                                 className="h-7 w-7 p-0"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   moveOpportunity(deal.id, stages[index + 1].id);
                                 }}
                                 disabled={updateStageMutation.isPending}
                               >
                                 <ArrowRight className="h-3.5 w-3.5" />
                               </Button>
                             )}
                          </div>
                          
                          {deal.assigned_to && (
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <User className="h-3 w-3 mr-1" />
                              <span>{deal.assigned_to}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </ResizablePanel>
            {index < stages.length - 1 && (
              <ResizableHandle withHandle />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>

      {/* Modal de Edição/Criação */}
      <DealEditModal
        deal={selectedDeal}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDeal(null);
        }}
        onSave={handleSaveDeal}
        mode={modalMode}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta oportunidade? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Botão flutuante para adicionar atividade */}
      {selectedDeal && (
        <Button 
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
          onClick={() => setActivityDialog(true)}
        >
          <Calendar className="h-6 w-6" />
        </Button>
      )}

      {/* Dialog para adicionar atividade */}
      <Dialog open={activityDialog} onOpenChange={setActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Atividade - {selectedDeal?.customers?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tipo de Atividade</label>
              <Select value={newActivity.activity_type} onValueChange={(value) => 
                setNewActivity(prev => ({ ...prev, activity_type: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Ligação</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Reunião</SelectItem>
                  <SelectItem value="proposal">Proposta</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input 
                value={newActivity.title}
                onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Ligação de acompanhamento"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea 
                value={newActivity.description}
                onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalhes da atividade..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Data Agendada</label>
              <Input 
                type="datetime-local"
                value={newActivity.scheduled_date}
                onChange={(e) => setNewActivity(prev => ({ ...prev, scheduled_date: e.target.value }))}
              />
            </div>
            <Button 
              onClick={handleCreateActivity}
              disabled={createActivityMutation.isPending || !newActivity.title}
              className="w-full"
            >
              {createActivityMutation.isPending ? 'Criando...' : 'Criar Atividade'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
