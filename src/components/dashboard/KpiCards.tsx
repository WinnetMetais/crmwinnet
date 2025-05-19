
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

type KpiData = {
  metric: string;
  valor: string;
  status: string;
  comparacao: string;
};

interface KpiCardsProps {
  kpiData: KpiData[];
}

export const KpiCards = ({ kpiData }: KpiCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardDescription>{kpi.metric}</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {kpi.valor}
              {kpi.status === 'aumento' ? (
                <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={kpi.status === 'aumento' ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
              {kpi.comparacao} em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
