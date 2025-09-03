import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSalesMetrics } from '@/hooks/useUnifiedSales';
import { 
  TrendingUp, 
  Users, 
  Handshake, 
  Target, 
  FileText, 
  DollarSign,
  RefreshCw 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

/**
 * Unified Analytics Dashboard
 * Displays comprehensive sales metrics from the materialized view
 */
export const UnifiedAnalyticsDashboard = () => {
  const { data: analytics, isLoading, error, refresh } = useSalesMetrics();

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Erro ao carregar analytics</p>
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  const metricCards = [
    {
      title: 'Total de Clientes',
      value: analytics.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Deals Fechados',
      value: `${analytics.wonDeals}/${analytics.totalDeals}`,
      subtitle: `${analytics.conversionRate.toFixed(1)}% conversão`,
      icon: Handshake,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Oportunidades',
      value: analytics.totalOpportunities.toLocaleString(),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Orçamentos',
      value: analytics.totalQuotes.toLocaleString(),
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Receita Total',
      value: `R$ ${analytics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      subtitle: `Ticket médio: R$ ${analytics.averageDealValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-700',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Despesas',
      value: `R$ ${analytics.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      subtitle: `Lucro: R$ ${(analytics.totalRevenue - analytics.totalExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Unificado</h2>
          <p className="text-muted-foreground">
            Visão consolidada de vendas, clientes e financeiro
          </p>
        </div>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${metric.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Monthly Trend Chart */}
      {analytics.monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Receita</Badge>
              <Badge variant="outline">Deals</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="revenue" orientation="left" />
                <YAxis yAxisId="deals" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' 
                      ? `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : value,
                    name === 'revenue' ? 'Receita' : 'Deals'
                  ]}
                />
                <Line 
                  yAxisId="revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="deals"
                  type="monotone" 
                  dataKey="deals" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Fluxo Automatizado</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Cliente → Oportunidade (automático)</p>
                <p>✅ Orçamento → Deal (ao aprovar)</p>
                <p>✅ Deal → Financeiro (ao fechar)</p>
                <p>✅ Sincronização em tempo real</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Performance</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>📊 Analytics em tempo real</p>
                <p>🔄 Sync unificado ativo</p>
                <p>⚡ Cache otimizado</p>
                <p>🎯 Zero redundância</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};