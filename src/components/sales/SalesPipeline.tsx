
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Edit, ArrowRight } from "lucide-react";

interface Opportunity {
  id: string;
  client: string;
  value: number;
  probability: number;
  description: string;
  stage: string;
}

const initialOpportunities: Opportunity[] = [
  { id: '1', client: 'Empresa ABC', value: 15000, probability: 20, description: 'Fornecimento de chapas de aço', stage: 'prospecto' },
  { id: '2', client: 'Metalúrgica XYZ', value: 8500, probability: 40, description: 'Perfis metálicos para construção', stage: 'prospecto' },
  { id: '3', client: 'Construtora Silva', value: 22000, probability: 60, description: 'Material para nova obra', stage: 'qualificacao' },
  { id: '4', client: 'Indústria Metal BR', value: 12500, probability: 70, description: 'Chapas galvanizadas', stage: 'qualificacao' },
  { id: '5', client: 'Ferragens Paulista', value: 35000, probability: 80, description: 'Contrato anual de fornecimento', stage: 'proposta' },
  { id: '6', client: 'Indústria Mecânica', value: 18500, probability: 90, description: 'Aço especial para maquinário', stage: 'negociacao' },
  { id: '7', client: 'Transportadora União', value: 45000, probability: 95, description: 'Ampliação de frota', stage: 'fechamento' },
];

const stages = [
  { id: 'prospecto', name: 'Prospectos', color: 'bg-purple-500' },
  { id: 'qualificacao', name: 'Qualificação', color: 'bg-pink-500' },
  { id: 'proposta', name: 'Proposta', color: 'bg-orange-500' },
  { id: 'negociacao', name: 'Negociação', color: 'bg-blue-500' },
  { id: 'fechamento', name: 'Fechamento', color: 'bg-green-500' },
];

export const SalesPipeline = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOpportunities = searchTerm
    ? opportunities.filter(opp => 
        opp.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : opportunities;

  const moveOpportunity = (oppId: string, targetStage: string) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === oppId ? { ...opp, stage: targetStage } : opp
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pipeline Comercial</h2>
        <div className="flex gap-2">
          <Input 
            placeholder="Buscar oportunidades..." 
            className="w-60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>Nova Oportunidade</Button>
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <ResizablePanel defaultSize={20} minSize={15}>
              <div className="flex h-full flex-col">
                <div className={`${stage.color} text-white p-3 font-medium flex justify-between items-center`}>
                  <div>{stage.name}</div>
                  <Badge variant="outline" className="bg-white/20">
                    {filteredOpportunities.filter(opp => opp.stage === stage.id).length}
                  </Badge>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-3">
                  {filteredOpportunities
                    .filter(opp => opp.stage === stage.id)
                    .map(opp => (
                      <Card key={opp.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{opp.client}</h3>
                            <Badge variant={opp.probability >= 70 ? "default" : "outline"} className="text-xs">
                              {opp.probability}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{opp.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="font-medium">R$ {opp.value.toLocaleString('pt-BR')}</div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {index < stages.length - 1 && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  onClick={() => moveOpportunity(opp.id, stages[index + 1].id)}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
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
    </div>
  );
};
