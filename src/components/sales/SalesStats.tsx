
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDealsWithRelations } from "@/services/pipeline";

export const SalesStats = () => {
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals-stats'],
    queryFn: getDealsWithRelations
  });

  // Calcular estatísticas dos dados reais
  const activeDeals = deals.filter((deal: any) => deal.status !== 'lost' && deal.status !== 'won');
  const wonDeals = deals.filter((deal: any) => deal.status === 'won' || deal.pipeline_stages?.name?.toLowerCase().includes('fechado'));
  const totalRevenue = wonDeals.reduce((sum: number, deal: any) => sum + (deal.actual_value || deal.estimated_value || 0), 0);
  const conversionRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0;
  const averageTicket = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const stats = [
    { 
      title: 'Receita Total', 
      value: formatCurrency(totalRevenue), 
      change: '+12.5%', 
      isPositive: true,
      description: 'deals fechados',
      icon: TrendingUp
    },
    { 
      title: 'Oportunidades Abertas', 
      value: activeDeals.length.toString(), 
      change: `+${Math.max(0, activeDeals.length - 10)}`, 
      isPositive: true,
      description: 'em andamento',
      icon: TrendingUp
    },
    { 
      title: 'Taxa de Conversão', 
      value: `${conversionRate.toFixed(1)}%`, 
      change: conversionRate > 20 ? '+2.3%' : '-2.3%', 
      isPositive: conversionRate > 20,
      description: 'deals fechados/total',
      icon: TrendingUp
    },
    { 
      title: 'Ticket Médio', 
      value: formatCurrency(averageTicket), 
      change: '+8.7%', 
      isPositive: true,
      description: 'por deal fechado',
      icon: TrendingUp
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`text-xs font-medium flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {stat.isPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              {stat.change}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
