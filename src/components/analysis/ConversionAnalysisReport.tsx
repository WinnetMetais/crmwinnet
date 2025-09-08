import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { conversionAnalyticsService } from "@/services/conversionAnalytics";
import { LoadingFallback } from "@/components/layout/LoadingFallback";
import { TrendingUp, TrendingDown, Users, Target, Award, BarChart3 } from "lucide-react";

const ConversionAnalysisReport = () => {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['conversion-metrics'],
    queryFn: () => conversionAnalyticsService.getConversionMetrics(),
  });

  const { data: funnelData, isLoading: funnelLoading } = useQuery({
    queryKey: ['conversion-funnel'],
    queryFn: () => conversionAnalyticsService.getConversionFunnel(),
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['conversion-trends'],
    queryFn: () => conversionAnalyticsService.getConversionTrends(6),
  });

  const { data: sourceAnalysis, isLoading: sourceLoading } = useQuery({
    queryKey: ['source-analysis'],
    queryFn: () => conversionAnalyticsService.getSourceAnalysis(),
  });

  if (metricsLoading || funnelLoading || trendsLoading || sourceLoading) {
    return <LoadingFallback />;
  }

  const getConversionColor = (rate: number) => {
    if (rate >= 20) return 'text-green-600';
    if (rate >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConversionIcon = (rate: number) => {
    if (rate >= 15) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Análise de Conversão</h2>
        <p className="text-muted-foreground">
          Acompanhe o desempenho do seu funil de vendas e identifique oportunidades de melhoria
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Conversão Geral</CardTitle>
              {getConversionIcon(metrics?.overallConversion || 0)}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getConversionColor(metrics?.overallConversion || 0)}`}>
              {metrics?.overallConversion?.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              De leads para fechamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Lead → Qualificado</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getConversionColor(metrics?.leadToQualified || 0)}`}>
              {metrics?.leadToQualified?.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.qualifiedLeads} de {metrics?.totalLeads} leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Qualificado → Oportunidade</CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getConversionColor(metrics?.qualifiedToOpportunity || 0)}`}>
              {metrics?.qualifiedToOpportunity?.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.opportunities} oportunidades criadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Oportunidade → Fechamento</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getConversionColor(metrics?.opportunityToClose || 0)}`}>
              {metrics?.opportunityToClose?.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.closedDeals} deals fechados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funil de Conversão Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>
            Visualização do caminho do lead até o fechamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData?.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      {stage.stage}
                    </Badge>
                    <span className="font-semibold">{stage.count}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stage.conversionRate.toFixed(1)}%
                  </div>
                </div>
                <Progress 
                  value={stage.conversionRate} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análise por Fonte */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Fonte de Lead</CardTitle>
          <CardDescription>
            Performance de conversão por canal de aquisição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sourceAnalysis?.map((source) => (
              <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{source.source}</div>
                  <div className="text-sm text-muted-foreground">
                    {source.leads} leads • {source.opportunities} oportunidades • {source.deals} fechamentos
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getConversionColor(source.conversionRate)}`}>
                    {source.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">conversão</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendência de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Conversão (6 meses)</CardTitle>
          <CardDescription>
            Evolução das métricas de conversão ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends?.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{trend.period}</div>
                  <div className="text-sm text-muted-foreground">
                    {trend.leads} leads → {trend.opportunities} oportunidades → {trend.deals} fechamentos
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getConversionColor(trend.conversionRate)}`}>
                    {trend.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">taxa conversão</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionAnalysisReport;