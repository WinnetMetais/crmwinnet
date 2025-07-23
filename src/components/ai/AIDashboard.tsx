
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
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
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { aiService } from "@/services/ai";
import { useAIMetrics, useAIInsights } from "@/hooks/useAIMetrics";
import type { AIProvider } from "@/types/ai";

export const AIDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  // Hooks para dados reais
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useAIMetrics();
  const { data: insights, isLoading: insightsLoading, error: insightsError } = useAIInsights();
  
  // Providers estáticos (para manter compatibilidade)
  const providers: AIProvider[] = useMemo(() => 
    aiService.getProviders().map(p => ({
      ...p,
      status: p.apiKey ? 'connected' : 'disconnected'
    } as AIProvider)), []
  );

  // Handlers
  const handleRefresh = async () => {
    try {
      await refetchMetrics();
      toast({
        title: "Dados atualizados",
        description: "Métricas de IA foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar dados de IA",
        variant: "destructive",
      });
    }
  };

  // Error handling
  if (metricsError || insightsError) {
    toast({
      title: "Erro",
      description: "Falha ao carregar dados de IA",
      variant: "destructive",
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'sales': return TrendingUp;
      case 'marketing': return MessageSquare;
      case 'financial': return DollarSign;
      case 'crm': return Users;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center" aria-label="Central de IA">
            <Brain className="h-8 w-8 mr-3 text-purple-600" aria-hidden="true" />
            Central de IA
          </h2>
          <p className="text-muted-foreground">
            Painel de controle das funcionalidades de Inteligência Artificial
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={metricsLoading}
            aria-label="Atualizar dados"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${metricsLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configurar IA
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            {metricsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-2 w-full" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tokens Usados</p>
                  <p className="text-2xl font-bold">{metrics?.tokensUsed.toLocaleString() || 0}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            )}
            {!metricsLoading && metrics && (
              <div className="mt-2">
                <Progress 
                  value={(metrics.tokensUsed / (metrics.tokensUsed + metrics.tokensRemaining)) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.tokensRemaining.toLocaleString()} restantes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {metricsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requisições IA</p>
                  <p className="text-2xl font-bold">{metrics?.totalRequests || 0}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            )}
            {!metricsLoading && (
              <p className="text-xs text-green-600 mt-2">+32% vs semana anterior</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {metricsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Modelos Ativos</p>
                  <p className="text-2xl font-bold">{metrics?.activeModels || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            )}
            {!metricsLoading && (
              <p className="text-xs text-muted-foreground mt-2">{metrics?.topUsedProvider || 'N/A'}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {metricsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Economia Gerada</p>
                  <p className="text-2xl font-bold">R$ {metrics?.costSavings.toLocaleString() || 0}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            )}
            {!metricsLoading && (
              <p className="text-xs text-green-600 mt-2">Automação de processos</p>
            )}
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
              {insightsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Skeleton className="h-5 w-5 mt-0.5" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {insights?.map((insight) => {
                    const IconComponent = getInsightIcon(insight.type);
                    return (
                      <div key={insight.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <IconComponent className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                            {insight.confidence && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Confiança: {Math.round(insight.confidence * 100)}%
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(insight.status)} variant="outline">
                          {getStatusIcon(insight.status)}
                          <span className="ml-1 capitalize">{insight.status}</span>
                        </Badge>
                      </div>
                    );
                  }) || []}
                  {(!insights || insights.length === 0) && !insightsLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum insight disponível no momento</p>
                      <p className="text-xs">Os dados serão atualizados automaticamente</p>
                    </div>
                  )}
                </div>
              )}
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
                  <div className="mt-3">
                    <Progress 
                      value={provider.freeTokens > 0 ? (provider.usedTokens / provider.freeTokens) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">
                      Modelos: {provider.models.join(', ')}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-3"
                    aria-label={`Configurar ${provider.name}`}
                  >
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
