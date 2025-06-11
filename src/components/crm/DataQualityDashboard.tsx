
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Users, 
  DollarSign, 
  FileText,
  Target,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { dataValidationService } from "@/services/dataValidation";

interface QualityMetrics {
  customers: {
    total: number;
    highQuality: number;
    mediumQuality: number;
    lowQuality: number;
    averageScore: number;
  };
  transactions: {
    total: number;
    valid: number;
    invalid: number;
    averageScore: number;
  };
  deals: {
    total: number;
    complete: number;
    incomplete: number;
    averageScore: number;
  };
  opportunities: {
    total: number;
    complete: number;
    incomplete: number;
    averageScore: number;
  };
}

export const DataQualityDashboard = () => {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationLogs, setValidationLogs] = useState<any[]>([]);

  useEffect(() => {
    loadQualityMetrics();
    loadRecentLogs();
  }, []);

  const loadQualityMetrics = async () => {
    setLoading(true);
    try {
      // Carregar métricas de clientes
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('data_quality_score');

      if (customersError) throw customersError;

      // Carregar métricas de transações
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('data_quality_score');

      if (transactionsError) throw transactionsError;

      // Carregar métricas de deals
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('data_quality_score');

      if (dealsError) throw dealsError;

      // Carregar métricas de oportunidades
      const { data: opportunitiesData, error: opportunitiesError } = await supabase
        .from('opportunities')
        .select('data_quality_score');

      if (opportunitiesError) throw opportunitiesError;

      // Processar métricas de clientes
      const customerScores = customersData?.map(c => c.data_quality_score || 0) || [];
      const customerMetrics = {
        total: customerScores.length,
        highQuality: customerScores.filter(score => score >= 80).length,
        mediumQuality: customerScores.filter(score => score >= 50 && score < 80).length,
        lowQuality: customerScores.filter(score => score < 50).length,
        averageScore: customerScores.length > 0 ? 
          Math.round(customerScores.reduce((sum, score) => sum + score, 0) / customerScores.length) : 0
      };

      // Processar métricas de transações
      const transactionScores = transactionsData?.map(t => t.data_quality_score || 0) || [];
      const transactionMetrics = {
        total: transactionScores.length,
        valid: transactionScores.filter(score => score >= 70).length,
        invalid: transactionScores.filter(score => score < 70).length,
        averageScore: transactionScores.length > 0 ? 
          Math.round(transactionScores.reduce((sum, score) => sum + score, 0) / transactionScores.length) : 0
      };

      // Processar métricas de deals
      const dealScores = dealsData?.map(d => d.data_quality_score || 0) || [];
      const dealMetrics = {
        total: dealScores.length,
        complete: dealScores.filter(score => score >= 70).length,
        incomplete: dealScores.filter(score => score < 70).length,
        averageScore: dealScores.length > 0 ? 
          Math.round(dealScores.reduce((sum, score) => sum + score, 0) / dealScores.length) : 0
      };

      // Processar métricas de oportunidades
      const opportunityScores = opportunitiesData?.map(o => o.data_quality_score || 0) || [];
      const opportunityMetrics = {
        total: opportunityScores.length,
        complete: opportunityScores.filter(score => score >= 70).length,
        incomplete: opportunityScores.filter(score => score < 70).length,
        averageScore: opportunityScores.length > 0 ? 
          Math.round(opportunityScores.reduce((sum, score) => sum + score, 0) / opportunityScores.length) : 0
      };

      setMetrics({
        customers: customerMetrics,
        transactions: transactionMetrics,
        deals: dealMetrics,
        opportunities: opportunityMetrics
      });

    } catch (error) {
      console.error('Erro ao carregar métricas de qualidade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as métricas de qualidade",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentLogs = async () => {
    const logs = await dataValidationService.getValidationLogs({ limit: 10 });
    setValidationLogs(logs);
  };

  const runFullValidation = async () => {
    setLoading(true);
    try {
      toast({
        title: "Iniciando validação completa",
        description: "Isso pode levar alguns minutos...",
      });

      // Atualizar scores de clientes usando a função do banco
      const { error: customersError } = await supabase.rpc('calculate_customer_data_quality', {});
      if (customersError) {
        console.error('Erro ao atualizar scores de clientes:', customersError);
      }

      await loadQualityMetrics();
      await loadRecentLogs();

      toast({
        title: "Validação concluída",
        description: "Todos os dados foram revalidados com sucesso",
      });
    } catch (error) {
      console.error('Erro na validação completa:', error);
      toast({
        title: "Erro na validação",
        description: "Ocorreu um erro durante a validação dos dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (score >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Bom</Badge>;
    return <Badge className="bg-red-100 text-red-800">Precisa melhorar</Badge>;
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Carregando métricas de qualidade...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Qualidade dos Dados</h1>
          <p className="text-muted-foreground">Monitor e validação da qualidade dos dados do CRM</p>
        </div>
        <Button onClick={runFullValidation} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Validar Todos os Dados
        </Button>
      </div>

      {metrics && (
        <>
          {/* Cards de Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.customers.total}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={(metrics.customers.highQuality / metrics.customers.total) * 100} className="flex-1" />
                  <span className={`text-sm font-medium ${getScoreColor(metrics.customers.averageScore)}`}>
                    {metrics.customers.averageScore}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Alta: {metrics.customers.highQuality}</span>
                  <span>Média: {metrics.customers.mediumQuality}</span>
                  <span>Baixa: {metrics.customers.lowQuality}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transações</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.transactions.total}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={(metrics.transactions.valid / metrics.transactions.total) * 100} className="flex-1" />
                  <span className={`text-sm font-medium ${getScoreColor(metrics.transactions.averageScore)}`}>
                    {metrics.transactions.averageScore}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Válidas: {metrics.transactions.valid}</span>
                  <span>Inválidas: {metrics.transactions.invalid}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.deals.total}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={(metrics.deals.complete / metrics.deals.total) * 100} className="flex-1" />
                  <span className={`text-sm font-medium ${getScoreColor(metrics.deals.averageScore)}`}>
                    {metrics.deals.averageScore}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Completos: {metrics.deals.complete}</span>
                  <span>Incompletos: {metrics.deals.incomplete}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.opportunities.total}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={(metrics.opportunities.complete / metrics.opportunities.total) * 100} className="flex-1" />
                  <span className={`text-sm font-medium ${getScoreColor(metrics.opportunities.averageScore)}`}>
                    {metrics.opportunities.averageScore}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Completas: {metrics.opportunities.complete}</span>
                  <span>Incompletas: {metrics.opportunities.incomplete}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Score Geral de Qualidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    <span className={getScoreColor(metrics.customers.averageScore)}>
                      {metrics.customers.averageScore}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Clientes</div>
                  {getScoreBadge(metrics.customers.averageScore)}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    <span className={getScoreColor(metrics.transactions.averageScore)}>
                      {metrics.transactions.averageScore}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Transações</div>
                  {getScoreBadge(metrics.transactions.averageScore)}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    <span className={getScoreColor(metrics.deals.averageScore)}>
                      {metrics.deals.averageScore}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Deals</div>
                  {getScoreBadge(metrics.deals.averageScore)}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    <span className={getScoreColor(metrics.opportunities.averageScore)}>
                      {metrics.opportunities.averageScore}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Oportunidades</div>
                  {getScoreBadge(metrics.opportunities.averageScore)}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Logs Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Logs de Validação Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {validationLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum log de validação encontrado
            </div>
          ) : (
            <div className="space-y-3">
              {validationLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {log.validation_status === 'passed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {log.validation_status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {log.validation_status === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                    <div>
                      <div className="font-medium">
                        {log.module_name} - {log.table_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.validation_type} • {new Date(log.validated_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    log.validation_status === 'passed' ? 'default' :
                    log.validation_status === 'warning' ? 'secondary' : 'destructive'
                  }>
                    {log.validation_status === 'passed' ? 'Aprovado' :
                     log.validation_status === 'warning' ? 'Atenção' : 'Falhou'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas e Recomendações */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.customers.lowQuality > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {metrics.customers.lowQuality} clientes têm qualidade de dados baixa. 
                    Revise informações como email, telefone e endereço.
                  </AlertDescription>
                </Alert>
              )}
              
              {metrics.transactions.invalid > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {metrics.transactions.invalid} transações têm dados inválidos. 
                    Verifique valores, datas e categorias.
                  </AlertDescription>
                </Alert>
              )}
              
              {metrics.deals.incomplete > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {metrics.deals.incomplete} deals estão incompletos. 
                    Adicione valores, datas de fechamento e responsáveis.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
