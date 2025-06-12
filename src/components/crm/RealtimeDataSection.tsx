
import React from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, AlertCircle, CheckSquare } from "lucide-react";

interface RealtimeDataSectionProps {
  customers: any[];
  deals: any[];
  tasks: any[];
  isLoadingData: boolean;
}

export const RealtimeDataSection = ({ customers, deals, tasks, isLoadingData }: RealtimeDataSectionProps) => {
  return (
    <section className="animate-fade-in" style={{animationDelay: '0.4s'}}>
      <div className="mb-6">
        <h2 className="heading-2 mb-2">Atividade Recente</h2>
        <p className="body-medium">Acompanhe as últimas atualizações do sistema</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clientes Recentes */}
        <Card className="card-clean">
          <div className="card-header-clean">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="heading-4">Clientes Recentes</span>
              </div>
              <Badge className="badge-neutral">
                {customers?.slice(0, 5).length || 0}
              </Badge>
            </CardTitle>
          </div>
          <div className="card-content-clean">
            <div className="space-y-4">
              {customers?.slice(0, 5).map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 rounded-md border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="body-medium font-medium text-slate-900">{customer.name}</p>
                      <p className="body-small text-slate-500">{customer.company || 'Empresa não informada'}</p>
                    </div>
                  </div>
                  <Badge className={customer.status === 'active' ? 'badge-success' : 'badge-neutral'}>
                    {customer.status || 'N/A'}
                  </Badge>
                </div>
              )) || (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="body-medium text-slate-500">
                    {isLoadingData ? 'Carregando clientes...' : 'Nenhum cliente encontrado'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Negócios em Andamento */}
        <Card className="card-clean">
          <div className="card-header-clean">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-emerald-600" />
                <span className="heading-4">Negócios Ativos</span>
              </div>
              <Badge className="badge-success">
                {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').length || 0}
              </Badge>
            </CardTitle>
          </div>
          <div className="card-content-clean">
            <div className="space-y-4">
              {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').slice(0, 5).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 rounded-md border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="body-medium font-medium text-slate-900">{deal.title}</p>
                      <p className="body-small text-slate-500">{deal.customers?.name || 'Cliente não definido'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="body-medium font-semibold text-emerald-600">
                      R$ {(deal.estimated_value || 0).toLocaleString()}
                    </p>
                    <Badge className="badge-neutral text-xs">
                      {deal.status}
                    </Badge>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <Target className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="body-medium text-slate-500">
                    {isLoadingData ? 'Carregando negócios...' : 'Nenhum negócio ativo'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Tarefas Urgentes */}
        <Card className="card-clean">
          <div className="card-header-clean">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="heading-4">Tarefas Urgentes</span>
              </div>
              <Badge className="badge-warning">
                {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').length || 0}
              </Badge>
            </CardTitle>
          </div>
          <div className="card-content-clean">
            <div className="space-y-4">
              {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-md border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="body-medium font-medium text-slate-900">{task.title}</p>
                      <p className="body-small text-slate-500">{task.assigned_to || 'Não atribuído'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="badge-warning mb-1">
                      {task.priority}
                    </Badge>
                    {task.due_date && (
                      <p className="body-small text-slate-500">
                        {new Date(task.due_date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <CheckSquare className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="body-medium text-slate-500">
                    {isLoadingData ? 'Carregando tarefas...' : 'Nenhuma tarefa urgente'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
