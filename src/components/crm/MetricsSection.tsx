
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, CheckSquare, Target, TrendingUp, TrendingDown } from "lucide-react";

interface MetricsSectionProps {
  metrics: {
    totalCustomers: number;
    totalDeals: number;
    totalRevenue: number;
    pendingTasks: number;
  };
  isLoadingData: boolean;
}

export const MetricsSection = ({ metrics, isLoadingData }: MetricsSectionProps) => {
  return (
    <section>
      <div className="mb-8">
        <h2 className="heading-2 mb-2 text-slate-900">Métricas Principais</h2>
        <p className="body-medium text-slate-600">Acompanhe os indicadores-chave do seu CRM em tempo real</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="metric-container hover-lift animate-slide-in">
          <div className="flex items-center justify-between mb-6">
            <div className="icon-wrapper icon-blue">
              <Users className="h-6 w-6" />
            </div>
            <Badge className="badge-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Ativo
            </Badge>
          </div>
          <div>
            <p className="body-small uppercase tracking-wider text-slate-500 mb-2 font-medium">Total de Clientes</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {isLoadingData ? (
                <span className="animate-pulse bg-slate-200 rounded w-16 h-8 inline-block"></span>
              ) : (
                metrics.totalCustomers.toLocaleString()
              )}
            </p>
            <p className="body-small text-slate-600">Clientes registrados no sistema</p>
          </div>
        </div>

        <div className="metric-container hover-lift animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-6">
            <div className="icon-wrapper icon-green">
              <Target className="h-6 w-6" />
            </div>
            <Badge className="badge-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Crescendo
            </Badge>
          </div>
          <div>
            <p className="body-small uppercase tracking-wider text-slate-500 mb-2 font-medium">Negócios Ativos</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {isLoadingData ? (
                <span className="animate-pulse bg-slate-200 rounded w-16 h-8 inline-block"></span>
              ) : (
                metrics.totalDeals.toLocaleString()
              )}
            </p>
            <p className="body-small text-slate-600">Oportunidades em andamento</p>
          </div>
        </div>

        <div className="metric-container hover-lift animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-6">
            <div className="icon-wrapper highlight-blue">
              <DollarSign className="h-6 w-6" />
            </div>
            <Badge className="badge-info">Pipeline</Badge>
          </div>
          <div>
            <p className="body-small uppercase tracking-wider text-slate-500 mb-2 font-medium">Receita Estimada</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {isLoadingData ? (
                <span className="animate-pulse bg-slate-200 rounded w-24 h-8 inline-block"></span>
              ) : (
                `R$ ${metrics.totalRevenue.toLocaleString()}`
              )}
            </p>
            <p className="body-small text-slate-600">Valor total do pipeline</p>
          </div>
        </div>

        <div className="metric-container hover-lift animate-slide-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-6">
            <div className="icon-wrapper icon-purple">
              <CheckSquare className="h-6 w-6" />
            </div>
            <Badge className={metrics.pendingTasks > 10 ? "badge-info" : "badge-neutral"} >
              {metrics.pendingTasks > 10 ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : null}
              {metrics.pendingTasks > 10 ? "Atenção" : "Normal"}
            </Badge>
          </div>
          <div>
            <p className="body-small uppercase tracking-wider text-slate-500 mb-2 font-medium">Tarefas Pendentes</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {isLoadingData ? (
                <span className="animate-pulse bg-slate-200 rounded w-16 h-8 inline-block"></span>
              ) : (
                metrics.pendingTasks.toLocaleString()
              )}
            </p>
            <p className="body-small text-slate-600">Requerem ação imediata</p>
          </div>
        </div>
      </div>
    </section>
  );
};
