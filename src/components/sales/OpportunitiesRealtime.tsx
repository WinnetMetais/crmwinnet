import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, DollarSign, Calendar, User, Trash } from "lucide-react";
import { useOpportunities, useDeleteOpportunity } from "@/hooks/useOpportunities";
import { useUnifiedRealtimeSync } from '@/hooks/useUnifiedRealtimeSync';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const OpportunitiesRealtime = () => {
  const { data: opportunities = [], isLoading } = useOpportunities();
  useUnifiedRealtimeSync(); // Enable real-time updates
  const navigate = useNavigate();

  const deleteMutation = useDeleteOpportunity();

  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const normalizeStage = (stage?: string) => {
    const s = (stage || '').toLowerCase();
    if (['prospecting','prospect','prospecto','prospecção','prospeccao'].includes(s)) return 'prospecting';
    if (['qualification','qualificacao','qualificação'].includes(s)) return 'qualification';
    if (['proposal','proposta'].includes(s)) return 'proposal';
    if (['negotiation','negociacao','negociação'].includes(s)) return 'negotiation';
    if (['won','ganho','fechado ganho'].includes(s)) return 'won';
    if (['lost','perdido','fechado perdido'].includes(s)) return 'lost';
    return s || 'prospecting';
  };

  const isOpen = (opp: any) => {
    const status = (opp?.status || '').toLowerCase();
    const stage = normalizeStage(opp?.stage);
    if (status) return status !== 'won' && status !== 'lost' && status !== 'closed';
    return stage !== 'won' && stage !== 'lost';
  };

  const normalizedOpps = useMemo(() => opportunities.map((o: any) => ({
    ...o,
    stage_normalized: normalizeStage(o?.stage),
    status_normalized: (o?.status || '').toLowerCase(),
  })), [opportunities]);

  const openOpportunities = useMemo(() => normalizedOpps.filter(isOpen), [normalizedOpps]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'bg-blue-100 text-blue-800';
      case 'qualification': return 'bg-yellow-100 text-yellow-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'negotiation': return 'bg-purple-100 text-purple-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'Prospecção';
      case 'qualification': return 'Qualificação';
      case 'proposal': return 'Proposta';
      case 'negotiation': return 'Negociação';
      case 'won': return 'Ganho';
      case 'lost': return 'Perdido';
      default: return stage;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Oportunidades em Aberto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Oportunidades em Aberto
          <Badge variant="secondary" className="ml-2">
            {openOpportunities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {openOpportunities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma oportunidade em aberto</p>
          </div>
        ) : (
          <div className="space-y-4">
            {openOpportunities.slice(0, 10).map((opportunity) => (
              <div key={opportunity.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{opportunity.title}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{opportunity.customers?.name || opportunity.customer?.name || opportunity.customer_name || opportunity.customer_id || 'Cliente não definido'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {opportunity.value 
                            ? `R$ ${opportunity.value.toLocaleString('pt-BR')}` 
                            : 'Valor não definido'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {opportunity.expected_close_date 
                            ? new Date(opportunity.expected_close_date).toLocaleDateString('pt-BR')
                            : 'Data não definida'
                          }
                        </span>
                      </div>
                      <div>
                        <Badge variant="outline" className={getStageColor(normalizeStage(opportunity.stage))}>
                          {getStageLabel(normalizeStage(opportunity.stage))}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/sales/opportunities/${opportunity.id}`)}>
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(opportunity.id, {
                      onSuccess: () => toast({ title: 'Oportunidade excluída', description: 'Removida com sucesso' }),
                      onError: (e: any) => toast({ title: 'Erro ao excluir', description: e?.message || 'Tente novamente', variant: 'destructive' })
                    })}>
                      <Trash className="h-4 w-4 mr-1" /> Excluir
                    </Button>
                  </div>
                </div>
                
                {opportunity.probability && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Probabilidade</span>
                      <span>{opportunity.probability}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${opportunity.probability}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {openOpportunities.length > 10 && (
              <div className="text-center pt-4">
                <Button variant="outline">
                  Ver todas as {openOpportunities.length} oportunidades
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Oportunidade</DialogTitle>
          </DialogHeader>
          {selectedOpp ? (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Título</span>
                <p className="font-medium">{selectedOpp.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedOpp.customer_name || selectedOpp.customer_id || 'Cliente não definido'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{selectedOpp.value ? `R$ ${Number(selectedOpp.value).toLocaleString('pt-BR')}` : 'Sem valor'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {selectedOpp.expected_close_date ? new Date(selectedOpp.expected_close_date).toLocaleDateString('pt-BR') : 'Sem data'}
                  </span>
                </div>
                <div>
                  <Badge variant="outline" className={getStageColor(normalizeStage(selectedOpp.stage))}>
                    {getStageLabel(normalizeStage(selectedOpp.stage))}
                  </Badge>
                </div>
              </div>
              {selectedOpp.description && (
                <div>
                  <span className="text-sm text-muted-foreground">Descrição</span>
                  <p className="whitespace-pre-wrap text-sm">{selectedOpp.description}</p>
                </div>
              )}
              {typeof selectedOpp.probability === 'number' && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Probabilidade</span>
                    <span>{selectedOpp.probability}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${selectedOpp.probability}%` }} />
                  </div>
                </div>
              )}
              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>Fechar</Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Card>
  );
};