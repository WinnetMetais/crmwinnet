
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, CheckSquare, Target } from "lucide-react";

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
    <section className="animate-fade-in">
      <div className="mb-6">
        <h2 className="heading-2 mb-2">Métricas Principais</h2>
        <p className="body-medium">Acompanhe os indicadores-chave do seu CRM</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="metric-container animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-wrapper icon-blue">
              <Users className="h-6 w-6" />
            </div>
            <Badge className="badge-success">Ativo</Badge>
          </div>
          <div>
            <p className="body-small uppercase tracking-wider text-slate-500 mb-1">Total de Clientes</p>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {isLoadingData ? '...' : metrics.totalCustomers}
            </p>
            <p className="body-small text-slate-500">Clientes registrados</p>
          </div>
        </div>

        <div className="metric-container animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="icon-wrapper icon-green">
              <Target className="h-6 w-6" />
            </div>
            <Badge className="badge-success">Crescendo</Badge>
          </div>
          <div>
            <p className="body-small uppercase tracking-wider text-slate-500 mb-1">Negócios Ativos</p>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {isLoadingData ? '...' : metrics.totalDeals}
            </p>
            <p className="body-small text-slate-500">Oportunidades em andamento</p>
          </div>
        </div>

        <div className="metric-container animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="icon-wrapper icon-orange">
              <DollarSign className="h-6 w-6" />
            </div>
            <Badge className="badge-neutral">Pipeline</Badge>
          </div>
          <div>
            <p className="body-small uppercase tracking-wider text-slate-500 mb-1">Receita Estimada</p>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {isLoadingData ? '...' : `R$ ${metrics.totalRevenue.toLocaleString()}`}
            </p>
            <p className="body-small text-slate-500">Valor do pipeline</p>
          </div>
        </div>

        <div className="metric-container animate-slide-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="icon-wrapper icon-purple">
              <CheckSquare className="h-6 w-6" />
            </div>
            <Badge className="badge-warning">Atenção</Badge>
          </div>
          <div>
            <p className="body-small uppercase tracking-wider text-slate-500 mb-1">Tarefas Pendentes</p>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {isLoadingData ? '...' : metrics.pendingTasks}
            </p>
            <p className="body-small text-slate-500">Requerem ação</p>
          </div>
        </div>
      </div>
    </section>
  );
};
