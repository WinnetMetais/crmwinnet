
import React, { useMemo } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from 'recharts';
import { useOpportunities } from '@/hooks/useOpportunities';

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
    opportunities.forEach((o: any) => {
      const s = normalizeStage(o.stage);
      if (counts[s] !== undefined) counts[s] += 1;
    });
    return [
      { name: 'Prospecção', value: counts.prospecting, fill: colors.prospecting },
      { name: 'Qualificação', value: counts.qualification, fill: colors.qualification },
      { name: 'Proposta', value: counts.proposal, fill: colors.proposal },
      { name: 'Negociação', value: counts.negotiation, fill: colors.negotiation },
      { name: 'Fechamento', value: counts.won, fill: colors.won },
    ];
  }, [opportunities]);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className={detailed ? 'h-[300px] md:h-[500px] flex items-center justify-center' : 'h-[300px] flex items-center justify-center'}>
        <p className="text-sm text-muted-foreground">Sem dados de oportunidades</p>
      </div>
    );
  }

  return (
    <ChartContainer config={{}} className={detailed ? "h-[500px]" : "h-[300px]"}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <ChartTooltip content={({ active, payload }) => (
            <ChartTooltipContent active={active} payload={payload} formatter={(value, name) => [`${value} oportunidades`, name]} />
          )} />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList position="right" fill="#fff" stroke="none" dataKey="name" fontSize={detailed ? 14 : 11} />
            <LabelList position="right" fill="#fff" stroke="none" dataKey="value" fontSize={detailed ? 14 : 11} formatter={(value: number) => `${value} oportunidades`} offset={detailed ? 120 : 80} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
