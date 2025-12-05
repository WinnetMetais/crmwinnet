
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Database,
  Users,
  FileText,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AnalysisResult {
  category: string;
  issue: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  description: string;
  suggestion: string;
  count?: number;
}

export const CRMAnalysisReport = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    const analysisResults: AnalysisResult[] = [];

    try {
      // 1. Analisar integridade de dados dos clientes
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*');

      if (customersError) {
        analysisResults.push({
          category: 'Database',
          issue: 'Erro ao acessar tabela customers',
          severity: 'high',
          description: customersError.message,
          suggestion: 'Verificar permissões e conexão com o banco'
        });
      } else {
        // Verificar clientes sem dados essenciais
        const invalidCustomers = customers?.filter(c => !c.name || c.name.trim() === '') || [];
        if (invalidCustomers.length > 0) {
          analysisResults.push({
            category: 'Data Quality',
            issue: 'Clientes sem nome',
            severity: 'high',
            description: `${invalidCustomers.length} clientes sem nome válido`,
            suggestion: 'Implementar validação obrigatória para o campo nome',
            count: invalidCustomers.length
          });
        }

        // Verificar clientes sem contato
        const noContactCustomers = customers?.filter(c => !c.email && !c.phone) || [];
        if (noContactCustomers.length > 0) {
          analysisResults.push({
            category: 'Data Quality',
            issue: 'Clientes sem contato',
            severity: 'medium',
            description: `${noContactCustomers.length} clientes sem email nem telefone`,
            suggestion: 'Adicionar campos de contato obrigatórios',
            count: noContactCustomers.length
          });
        }

        // Verificar dados de teste
        const testCustomers = customers?.filter(c => 
          c.name?.toLowerCase().includes('teste') ||
          c.name?.toLowerCase().includes('test') ||
          c.email?.toLowerCase().includes('test')
        ) || [];
        
        if (testCustomers.length > 0) {
          analysisResults.push({
            category: 'Data Quality',
            issue: 'Dados de teste em produção',
            severity: 'medium',
            description: `${testCustomers.length} clientes com dados de teste`,
            suggestion: 'Remover dados de teste do ambiente de produção',
            count: testCustomers.length
          });
        }
      }

      // 2. Analisar deals
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('*');

      if (!dealsError && deals) {
        // Deals sem cliente
        const orphanDeals = deals.filter(d => !d.customer_id);
        if (orphanDeals.length > 0) {
          analysisResults.push({
            category: 'Data Integrity',
            issue: 'Deals órfãos',
            severity: 'high',
            description: `${orphanDeals.length} deals sem cliente associado`,
            suggestion: 'Associar deals a clientes válidos ou remover registros órfãos',
            count: orphanDeals.length
          });
        }

        // Deals sem valor
        const noValueDeals = deals.filter(d => !d.value || d.value <= 0);
        if (noValueDeals.length > 0) {
          analysisResults.push({
            category: 'Data Quality',
            issue: 'Deals sem valor',
            severity: 'medium',
            description: `${noValueDeals.length} deals sem valor definido`,
            suggestion: 'Definir valores estimados para todos os deals',
            count: noValueDeals.length
          });
        }
      }

      // 3. Analisar transações
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*');

      if (!transactionsError && transactions) {
        // Transações com valores suspeitos
        const suspiciousTransactions = transactions.filter(t => t.amount > 1000000);
        if (suspiciousTransactions.length > 0) {
          analysisResults.push({
            category: 'Data Quality',
            issue: 'Transações com valores altos',
            severity: 'medium',
            description: `${suspiciousTransactions.length} transações acima de R$ 1.000.000`,
            suggestion: 'Verificar se os valores estão corretos',
            count: suspiciousTransactions.length
          });
        }

        // Transações futuras
        const futureTransactions = transactions.filter(t => 
          new Date(t.date) > new Date()
        );
        if (futureTransactions.length > 0) {
          analysisResults.push({
            category: 'Data Quality',
            issue: 'Transações com data futura',
            severity: 'low',
            description: `${futureTransactions.length} transações com data futura`,
            suggestion: 'Verificar se as datas estão corretas',
            count: futureTransactions.length
          });
        }
      }

      // 4. Verificar configurações do sistema
      const { data: pipelineStages } = await supabase
        .from('pipeline_stages')
        .select('*')
        .eq('active', true);

      if (!pipelineStages || pipelineStages.length < 3) {
        analysisResults.push({
          category: 'Configuration',
          issue: 'Pipeline incompleto',
          severity: 'medium',
          description: 'Menos de 3 estágios ativos no pipeline',
          suggestion: 'Configurar pelo menos 3-5 estágios no pipeline de vendas',
          count: pipelineStages?.length || 0
        });
      }

      // 5. Verificar segmentos de clientes
      const { data: segments } = await supabase
        .from('customer_segments')
        .select('*')
        .eq('active', true);

      if (!segments || segments.length === 0) {
        analysisResults.push({
          category: 'Configuration',
          issue: 'Sem segmentos de clientes',
          severity: 'low',
          description: 'Nenhum segmento de cliente configurado',
          suggestion: 'Criar segmentos para melhor organização dos clientes'
        });
      }

      // Se não encontrou problemas
      if (analysisResults.length === 0) {
        analysisResults.push({
          category: 'System',
          issue: 'Sistema em ordem',
          severity: 'info',
          description: 'Nenhum problema crítico identificado',
          suggestion: 'Continue monitorando a qualidade dos dados regularmente'
        });
      }

      setResults(analysisResults);
      setLastAnalysis(new Date());

      toast({
        title: "Análise Concluída",
        description: `${analysisResults.length} itens analisados`,
      });

    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível completar a análise do sistema",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-info" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">Crítico</Badge>;
      case 'medium': return <Badge variant="warning">Médio</Badge>;
      case 'low': return <Badge variant="secondary">Baixo</Badge>;
      case 'info': return <Badge variant="success">Info</Badge>;
      default: return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Database': return <Database className="h-4 w-4" />;
      case 'Data Quality': return <FileText className="h-4 w-4" />;
      case 'Data Integrity': return <Users className="h-4 w-4" />;
      case 'Configuration': return <TrendingUp className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Relatório de Análise do CRM
          </CardTitle>
          <Button onClick={runAnalysis} disabled={loading} variant="outline">
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Analisar Novamente
          </Button>
        </div>
        {lastAnalysis && (
          <p className="text-sm text-muted-foreground">
            Última análise: {lastAnalysis.toLocaleString('pt-BR')}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <div className="text-muted-foreground">Analisando sistema...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => (
              <Alert key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(result.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(result.category)}
                        <span className="font-medium">{result.issue}</span>
                        {getSeverityBadge(result.severity)}
                        {result.count !== undefined && (
                          <span className="text-sm text-muted-foreground">
                            ({result.count} registros)
                          </span>
                        )}
                      </div>
                      <AlertDescription className="mb-2">
                        {result.description}
                      </AlertDescription>
                      <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                        <strong>Sugestão:</strong> {result.suggestion}
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Resumo da Análise */}
        {!loading && results.length > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Resumo da Análise</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-destructive font-medium">
                  {results.filter(r => r.severity === 'high').length}
                </span>
                <div className="text-muted-foreground">Críticos</div>
              </div>
              <div>
                <span className="text-warning font-medium">
                  {results.filter(r => r.severity === 'medium').length}
                </span>
                <div className="text-muted-foreground">Médios</div>
              </div>
              <div>
                <span className="text-info font-medium">
                  {results.filter(r => r.severity === 'low').length}
                </span>
                <div className="text-muted-foreground">Baixos</div>
              </div>
              <div>
                <span className="text-green-600 font-medium">
                  {results.filter(r => r.severity === 'info').length}
                </span>
                <div className="text-muted-foreground">Informativos</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
