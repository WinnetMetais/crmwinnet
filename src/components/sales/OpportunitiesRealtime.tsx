import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, DollarSign, Calendar, User } from "lucide-react";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export const OpportunitiesRealtime = () => {
  const { data: opportunities = [], isLoading } = useOpportunities();
  useRealtimeUpdates(); // Enable real-time updates

  const openOpportunities = opportunities.filter(opp => opp.status === 'active' || opp.stage !== 'won');

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
                        <span>{opportunity.customer_id || 'Cliente não definido'}</span>
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
                        <Badge variant="outline" className={getStageColor(opportunity.stage)}>
                          {getStageLabel(opportunity.stage)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button size="sm" variant="outline">
                      Ver Detalhes
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
    </Card>
  );
};