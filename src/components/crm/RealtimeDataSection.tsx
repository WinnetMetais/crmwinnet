
import React from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, AlertCircle, CheckSquare, Clock, Building2 } from "lucide-react";

interface RealtimeDataSectionProps {
  customers: any[];
  deals: any[];
  tasks: any[];
  isLoadingData: boolean;
}

export const RealtimeDataSection = ({ customers, deals, tasks, isLoadingData }: RealtimeDataSectionProps) => {
  return (
    <section>
      <div className="mb-8">
        <h2 className="heading-2 mb-2 text-slate-900">Atividade Recente</h2>
        <p className="body-medium text-slate-600">Acompanhe as últimas atualizações e movimentações do sistema</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clientes Recentes */}
        <Card className="card-clean hover-glow">
          <div className="card-header-clean">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-wrapper icon-blue">
                  <Users className="h-5 w-5" />
                </div>
                <span className="heading-4 text-slate-900">Clientes Recentes</span>
              </div>
              <Badge className="badge-info">
                {customers?.slice(0, 5).length || 0}
              </Badge>
            </CardTitle>
          </div>
          <div className="card-content-clean">
            <div className="space-y-3">
              {customers?.slice(0, 5).map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="body-medium font-medium text-slate-900">{customer.name}</p>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Building2 className="h-3 w-3" />
                        <p className="body-small">{customer.company || 'Empresa não informada'}</p>
                      </div>
                    </div>
                  </div>
                  <Badge className={customer.status === 'active' ? 'badge-success' : 'badge-neutral'}>
                    {customer.status || 'N/A'}
                  </Badge>
                </div>
              )) || (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="body-medium text-slate-500 font-medium">
                    {isLoadingData ? 'Carregando clientes...' : 'Nenhum cliente encontrado'}
                  </p>
                  <p className="body-small text-slate-400 mt-1">
                    {isLoadingData ? 'Aguarde um momento' : 'Adicione novos clientes para visualizar aqui'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Negócios em Andamento */}
        <Card className="card-clean hover-glow">
          <div className="card-header-clean">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-wrapper icon-green">
                  <Target className="h-5 w-5" />
                </div>
                <span className="heading-4 text-slate-900">Negócios Ativos</span>
              </div>
              <Badge className="badge-success">
                {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').length || 0}
              </Badge>
            </CardTitle>
          </div>
          <div className="card-content-clean">
            <div className="space-y-3">
              {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').slice(0, 5).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center border border-emerald-200">
                      <Target className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="body-medium font-medium text-slate-900">{deal.title}</p>
                      <p className="body-small text-slate-500">{deal.customers?.name || 'Cliente não definido'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="body-medium font-semibold text-emerald-600 mb-1">
                      R$ {(deal.estimated_value || 0).toLocaleString()}
                    </p>
                    <Badge className="badge-neutral text-xs">
                      {deal.status}
                    </Badge>
                  </div>
                </div>
              )) || (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="body-medium text-slate-500 font-medium">
                    {isLoadingData ? 'Carregando negócios...' : 'Nenhum negócio ativo'}
                  </p>
                  <p className="body-small text-slate-400 mt-1">
                    {isLoadingData ? 'Aguarde um momento' : 'Crie novas oportunidades para visualizar aqui'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Tarefas Urgentes */}
        <Card className="card-clean hover-glow">
          <div className="card-header-clean">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-wrapper highlight-blue">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <span className="heading-4 text-slate-900">Tarefas Urgentes</span>
              </div>
              <Badge className="badge-info">
                {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').length || 0}
              </Badge>
            </CardTitle>
          </div>
          <div className="card-content-clean">
            <div className="space-y-3">
              {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="body-medium font-medium text-slate-900">{task.title}</p>
                      <p className="body-small text-slate-500">{task.assigned_to || 'Não atribuído'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="badge-info mb-2">
                      {task.priority}
                    </Badge>
                    {task.due_date && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="h-3 w-3" />
                        <p className="body-small">
                          {new Date(task.due_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="body-medium text-slate-500 font-medium">
                    {isLoadingData ? 'Carregando tarefas...' : 'Nenhuma tarefa urgente'}
                  </p>
                  <p className="body-small text-slate-400 mt-1">
                    {isLoadingData ? 'Aguarde um momento' : 'Ótimo! Todas as tarefas estão em dia'}
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
