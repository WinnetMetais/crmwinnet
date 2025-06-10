
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { KanbanSquare, Plus, Edit, Trash2, User, Building, MapPin, Phone } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getDealsWithRelations, 
  getPipelineStages, 
  updateDealStage,
  Deal,
  PipelineStage 
} from "@/services/pipeline";

export const SalesKanban = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['deals-kanban'],
    queryFn: getDealsWithRelations
  });

  const { data: stages = [] } = useQuery({
    queryKey: ['pipeline-stages-kanban'],
    queryFn: getPipelineStages
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ dealId, stageId }: { dealId: string; stageId: string }) => 
      updateDealStage(dealId, stageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
    }
  });

  const filteredDeals = searchTerm
    ? deals.filter((deal: Deal) => 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.customers?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.customers?.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.assigned_to || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : deals;

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
    setDraggedDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    
    if (dealId && stageId) {
      updateStageMutation.mutate({ dealId, stageId });
    }
    setDraggedDeal(null);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPriorityColor = (priority?: { color: string }) => {
    return priority?.color || '#6B7280';
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
        <div className="flex items-center gap-2">
          <KanbanSquare className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Kanban Comercial Winnet</h2>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Buscar negócios..." 
            className="w-60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>
            <Plus className="mr-1 h-4 w-4" /> Nova Oportunidade
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {stages.map((stage: PipelineStage) => (
          <div 
            key={stage.id} 
            className="border rounded-lg border-t-4"
            style={{ borderTopColor: stage.color }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="p-3 border-b bg-muted/10 flex justify-between items-center">
              <h3 className="font-medium">{stage.name}</h3>
              <Badge variant="outline">
                {filteredDeals.filter((deal: Deal) => deal.pipeline_stage_id === stage.id).length}
              </Badge>
            </div>
            <div className="p-3 space-y-3 min-h-[500px]">
              {filteredDeals
                .filter((deal: Deal) => deal.pipeline_stage_id === stage.id)
                .map((deal: Deal) => (
                  <Card 
                    key={deal.id}
                    className={`shadow-sm cursor-move transition-all ${
                      draggedDeal === deal.id ? 'opacity-50 scale-95' : 'hover:shadow-md'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div 
                          className="h-2 w-2 mt-1.5 rounded-full" 
                          style={{ backgroundColor: getPriorityColor(deal.priorities) }}
                        />
                        <h4 className="font-medium flex-1 ml-2 text-sm">{deal.customers?.name || 'Cliente não informado'}</h4>
                        <div className="flex space-x-1 ml-2">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{deal.title}</p>
                      
                      {deal.customers?.company && (
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Building className="h-3 w-3 mr-1" />
                          <span className="truncate">{deal.customers.company}</span>
                        </div>
                      )}
                      
                      {deal.customers?.city && (
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{deal.customers.city}, {deal.customers.state}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-600 text-sm">
                          {formatCurrency(deal.estimated_value)}
                        </span>
                        {deal.qualification_status && (
                          <Badge variant="outline" className="text-xs">
                            {deal.qualification_status.name}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {deal.assigned_to && (
                          <Badge variant="outline" className="text-xs">
                            <User className="h-3 w-3 mr-1" />
                            {deal.assigned_to}
                          </Badge>
                        )}
                        
                        {deal.customers?.phone && (
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Phone className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      {deal.follow_up_date && new Date(deal.follow_up_date) > new Date() && (
                        <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          Follow-up: {new Date(deal.follow_up_date).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Estatísticas do Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{filteredDeals.length}</div>
              <div className="text-sm text-gray-600">Total de Negócios</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(filteredDeals.reduce((sum: number, deal: Deal) => sum + (deal.estimated_value || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {filteredDeals.filter((deal: Deal) => deal.pipeline_stages?.name === 'Negociação').length}
              </div>
              <div className="text-sm text-gray-600">Em Negociação</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {filteredDeals.filter((deal: Deal) => deal.active_follow_up).length}
              </div>
              <div className="text-sm text-gray-600">Follow-ups Ativos</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
