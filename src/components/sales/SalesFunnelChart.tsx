
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from 'recharts';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

interface SalesFunnelChartProps {
  detailed?: boolean;
}

const colors = {
  prospecting: '#8B5CF6',
  qualification: '#D946EF',
  proposal: '#F97316',
  negotiation: '#0EA5E9',
  won: '#22C55E',
};

export const SalesFunnelChart = ({ detailed = false }: SalesFunnelChartProps) => {
  const { data: opportunities = [] } = useOpportunities();

  const normalizeStage = (stage?: string) => {
    const s = (stage || '').toLowerCase();
    if (['prospecting','prospect','prospecto','prospecção','prospeccao'].includes(s)) return 'prospecting';
    if (['qualification','qualificacao','qualificação'].includes(s)) return 'qualification';
    if (['proposal','proposta'].includes(s)) return 'proposal';
    if (['negotiation','negociacao','negociação'].includes(s)) return 'negotiation';
    if (['won','ganho','fechado ganho'].includes(s)) return 'won';
    return 'prospecting';
  };

  const data = useMemo(() => {
    const counts = { prospecting: 0, qualification: 0, proposal: 0, negotiation: 0, won: 0 } as Record<string, number>;
    const values = { prospecting: 0, qualification: 0, proposal: 0, negotiation: 0, won: 0 } as Record<string, number>;
    
    opportunities.forEach((o: any) => {
      const s = normalizeStage(o.stage);
      if (counts[s] !== undefined) {
        counts[s] += 1;
        values[s] += o.value || 0;
      }
    });
    
    return [
      { 
        name: 'Prospecção', 
        value: counts.prospecting, 
        amount: values.prospecting,
        fill: colors.prospecting,
        conversionRate: 100 
      },
      { 
        name: 'Qualificação', 
        value: counts.qualification, 
        amount: values.qualification,
        fill: colors.qualification,
        conversionRate: counts.prospecting > 0 ? (counts.qualification / counts.prospecting * 100) : 0
      },
      { 
        name: 'Proposta', 
        value: counts.proposal, 
        amount: values.proposal,
        fill: colors.proposal,
        conversionRate: counts.qualification > 0 ? (counts.proposal / counts.qualification * 100) : 0
      },
      { 
        name: 'Negociação', 
        value: counts.negotiation, 
        amount: values.negotiation,
        fill: colors.negotiation,
        conversionRate: counts.proposal > 0 ? (counts.negotiation / counts.proposal * 100) : 0
      },
      { 
        name: 'Fechamento', 
        value: counts.won, 
        amount: values.won,
        fill: colors.won,
        conversionRate: counts.negotiation > 0 ? (counts.won / counts.negotiation * 100) : 0
      },
    ];
  }, [opportunities]);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
  const overallConversion = data.length > 1 ? ((data[data.length - 1].value / data[0].value) * 100) : 0;

  if (total === 0) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Oportunidades</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">R$ 0</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversão Geral</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
                <Percent className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className={detailed ? 'h-[300px] md:h-[500px] flex items-center justify-center' : 'h-[300px] flex items-center justify-center'}>
          <p className="text-sm text-muted-foreground">Sem dados de oportunidades</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {detailed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Oportunidades</p>
                  <p className="text-2xl font-bold">{total}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">R$ {totalAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversão Geral</p>
                  <p className="text-2xl font-bold">{overallConversion.toFixed(1)}%</p>
                </div>
                <Percent className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer config={{}} className={detailed ? "h-[400px]" : "h-[300px]"}>
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <ChartTooltip content={({ active, payload }) => (
                <ChartTooltipContent 
                  active={active} 
                  payload={payload} 
                  formatter={(value, name, props) => [
                    `${value} oportunidades (R$ ${props?.payload?.amount?.toLocaleString() || 0})`, 
                    name
                  ]} 
                />
              )} />
              <Funnel dataKey="value" data={data} isAnimationActive>
                <LabelList position="right" fill="#fff" stroke="none" dataKey="name" fontSize={detailed ? 14 : 11} />
                <LabelList 
                  position="right" 
                  fill="#fff" 
                  stroke="none" 
                  dataKey="value" 
                  fontSize={detailed ? 12 : 10} 
                  formatter={(value: number) => `${value} opps`} 
                  offset={detailed ? 100 : 70} 
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </ChartContainer>

        {detailed && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Métricas por Estágio</h3>
            {data.map((stage, index) => (
              <Card key={stage.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{stage.name}</h4>
                    <Badge 
                      style={{ backgroundColor: stage.fill }} 
                      className="text-white"
                    >
                      {stage.conversionRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Oportunidades</p>
                      <p className="text-xl font-bold">{stage.value}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                      <p className="text-xl font-bold">R$ {stage.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  {stage.value > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Ticket Médio</p>
                      <p className="font-medium">R$ {(stage.amount / stage.value).toLocaleString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
