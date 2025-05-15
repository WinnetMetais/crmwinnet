
import React from 'react';
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SalesFunnelChartProps {
  detailed?: boolean;
}

const data = [
  { name: 'Prospecto', value: 120, fill: '#8B5CF6' },
  { name: 'Qualificação', value: 80, fill: '#D946EF' },
  { name: 'Proposta', value: 55, fill: '#F97316' },
  { name: 'Negociação', value: 35, fill: '#0EA5E9' },
  { name: 'Fechamento', value: 20, fill: '#22C55E' },
];

const config = {
  "data-1": { theme: { light: '#8B5CF6', dark: '#8B5CF6' }, label: 'Prospecto' },
  "data-2": { theme: { light: '#D946EF', dark: '#D946EF' }, label: 'Qualificação' },
  "data-3": { theme: { light: '#F97316', dark: '#F97316' }, label: 'Proposta' },
  "data-4": { theme: { light: '#0EA5E9', dark: '#0EA5E9' }, label: 'Negociação' },
  "data-5": { theme: { light: '#22C55E', dark: '#22C55E' }, label: 'Fechamento' },
};

export const SalesFunnelChart = ({ detailed = false }: SalesFunnelChartProps) => {
  return (
    <ChartContainer config={config} className={detailed ? "h-[500px]" : "h-[300px]"}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip
            content={({ active, payload }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                formatter={(value, name) => [`${value} oportunidades`, name]}
              />
            )}
          />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
          >
            <LabelList 
              position="right"
              fill="#fff"
              stroke="none"
              dataKey="name"
              fontSize={detailed ? 14 : 11}
            />
            <LabelList
              position="right"
              fill="#fff"
              stroke="none"
              dataKey="value"
              fontSize={detailed ? 14 : 11}
              formatter={(value: number) => `${value} oportunidades`}
              offset={detailed ? 120 : 80}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
