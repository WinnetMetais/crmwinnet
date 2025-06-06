
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MessageSquare,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { aiService } from "@/services/ai";
import { salesAI } from "@/services/ai/salesAI";
import { marketingAI } from "@/services/ai/marketingAI";
import { financialAI } from "@/services/ai/financialAI";
import { crmAI } from "@/services/ai/crmAI";

export const AIDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiStats, setAiStats] = useState({
    totalRequests: 0,
    tokensUsed: 0,
    tokensRemaining: 100000,
    activeModels: 3,
    lastUpdate: new Date()
  });

  const [aiInsights, setAiInsights] = useState([
    {
      type: 'sales',
      title: 'Lead Scoring Ativo',
      description: '15 leads analisados com IA nas últimas 24h',
      status: 'active',
      icon: TrendingUp
    },
    {
      type: 'marketing',
      title: 'Conteúdo Gerado',
      description: '8 posts criados automaticamente esta semana',
      status: 'completed',
      icon: MessageSquare
    },
    {
      type: 'financial',
      title: 'Anomalias Detectadas',
      description: '2 transações suspeitas identificadas',
      status: 'warning',
      icon: AlertTriangle
    },
    {
      type: 'crm',
      title: 'Segmentação Atualizada',
      description: 'Clientes reagrupados em 5 segmentos inteligentes',
      status: 'completed',
      icon: Users
    }
  ]);

  const providers = aiService.getProviders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-600" />
            Central de IA
          </h2>
          <p className="text-muted-foreground">
            Painel de controle das funcionalidades de Inteligência Artificial
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Configurar IA
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tokens Usados</p>
                <p className="text-2xl font-bold">{aiStats.tokensUsed.toLocaleString()}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-2">
              <Progress 
                value={(aiStats.tokensUsed / (aiStats.tokensUsed + aiStats.tokensRemaining)) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {aiStats.tokensRemaining.toLocaleString()} restantes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Requisições IA</p>
                <p className="text-2xl font-bold">{aiStats.totalRequests}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">+32% vs semana anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modelos Ativos</p>
                <p className="text-2xl font-bold">{aiStats.activeModels}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">OpenAI, Anthropic, HF</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Economia Gerada</p>
                <p className="text-2xl font-bold">R$ 12.450</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">Automação de processos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sales">Vendas IA</TabsTrigger>
          <TabsTrigger value="marketing">Marketing IA</TabsTrigger>
          <TabsTrigger value="financial">Financeiro IA</TabsTrigger>
          <TabsTrigger value="providers">Provedores</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Insights Ativos */}
          <Card>
            <CardHeader>
              <CardTitle>Insights Ativos de IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <insight.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(insight.status)} variant="outline">
                      {getStatusIcon(insight.status)}
                      <span className="ml-1 capitalize">{insight.status}</span>
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Funcionalidades Disponíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  IA de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lead Scoring</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Geração de Propostas</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Previsão de Fechamento</span>
                  <Badge variant="outline">Beta</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  IA de Marketing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Geração de Conteúdo</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Otimização de Campanhas</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Chatbot Inteligente</span>
                  <Badge variant="outline">Em Breve</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Leads Analisados</span>
                    <span className="font-medium">248</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Precisão do Modelo</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <Button size="sm" className="w-full">Analisar Novos Leads</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geração de Propostas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Propostas Geradas</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taxa de Aprovação</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Button size="sm" className="w-full">Gerar Proposta</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Previsão de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Próximo Mês</span>
                    <span className="font-medium">R$ 125k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Confiança</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Button size="sm" className="w-full">Ver Análise</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerador de Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Gerar Post LinkedIn</Button>
                <Button variant="outline" className="w-full">Criar Email Marketing</Button>
                <Button variant="outline" className="w-full">Escrever Blog Post</Button>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    23 conteúdos gerados esta semana
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise de Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Engagement Médio</span>
                  <span className="font-medium">+24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Conversões</span>
                  <span className="font-medium">+18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">ROI de Conteúdo</span>
                  <span className="font-medium">312%</span>
                </div>
                <Button size="sm" className="w-full">Ver Relatório</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Previsão Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Próximo Trimestre</span>
                    <span className="font-medium">R$ 450k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Margem de Erro</span>
                    <span className="font-medium">±8%</span>
                  </div>
                  <Button size="sm" className="w-full">Atualizar Previsão</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detecção de Anomalias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Anomalias Detectadas</span>
                    <span className="font-medium text-orange-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Valor Total</span>
                    <span className="font-medium">R$ 8.750</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Investigar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Otimização de Preços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Produtos Analisados</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Aumento Médio</span>
                    <span className="font-medium text-green-600">+12%</span>
                  </div>
                  <Button size="sm" className="w-full">Aplicar Sugestões</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {providers.map((provider, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{provider.name}</span>
                    <Badge variant={provider.apiKey ? "default" : "outline"}>
                      {provider.apiKey ? "Conectado" : "Desconectado"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Tokens Livres</span>
                    <span className="font-medium">{provider.freeTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tokens Usados</span>
                    <span className="font-medium">{provider.usedTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Modelos</span>
                    <span className="font-medium">{provider.models.length}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    {provider.apiKey ? "Configurar" : "Conectar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
