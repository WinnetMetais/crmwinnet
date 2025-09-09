import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSidebar from '@/components/sidebar/DashboardSidebar';
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { SearchBarAvancada } from '@/components/crm/SearchBarAvancada';
import { ClienteFormAvancado } from '@/components/crm/ClienteFormAvancado';
import { CRMProvider, useCRM } from '@/contexts/CRMContext';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Plus,
  Filter,
  BarChart3,
  PieChart,
  Calendar,
  Settings,
  RefreshCw
} from 'lucide-react';

const CRMStats: React.FC = () => {
  const { analytics, clientes, refreshData, analyticsLoading } = useCRM();

  const faseStats = clientes.reduce((acc, cliente) => {
    acc[cliente.fase] = (acc[cliente.fase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const conversionRate = faseStats.fechado && faseStats.lead 
    ? ((faseStats.fechado / (faseStats.lead + faseStats.contato + faseStats.proposta + faseStats.negociacao + faseStats.fechado)) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
              <p className="text-2xl font-bold">{clientes.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-2xl font-bold">
                R$ {analytics?.totalRevenue.toLocaleString('pt-BR') || '0'}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Em Negociação</p>
              <p className="text-2xl font-bold">{faseStats.negociacao || 0}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={refreshData}
              disabled={analyticsLoading}
              className="text-xs"
            >
              <RefreshCw className={`w-3 h-3 ${analyticsLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CRMPipelineContent: React.FC = () => {
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <h1 className="text-lg font-semibold">Pipeline de Vendas</h1>
            </div>
            <div className="flex flex-1 items-center space-x-2">
              <SearchBarAvancada />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
              >
                {viewMode === 'kanban' ? <BarChart3 className="w-4 h-4" /> : <PieChart className="w-4 h-4" />}
              </Button>
              <Button onClick={() => setShowNewClientForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="container py-6">
            <CRMStats />

            <Tabs defaultValue="pipeline" className="space-y-4">
              <TabsList>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
              </TabsList>

              <TabsContent value="pipeline" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Pipeline de Vendas</h2>
                    <p className="text-muted-foreground">
                      Acompanhe seus clientes em cada etapa do processo de vendas
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                  </div>
                </div>

                {viewMode === 'kanban' ? (
                  <KanbanBoard />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Lista de Clientes</CardTitle>
                      <CardDescription>
                        Visualização em lista dos seus clientes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Visualização em lista em desenvolvimento...
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics do CRM</CardTitle>
                    <CardDescription>
                      Métricas detalhadas do seu pipeline de vendas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Dashboard de analytics em desenvolvimento...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Relatórios</CardTitle>
                    <CardDescription>
                      Relatórios personalizados do seu CRM
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Sistema de relatórios em desenvolvimento...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modal do formulário de cliente */}
      {showNewClientForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNewClientForm(false);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ClienteFormAvancado
              onSubmit={() => setShowNewClientForm(false)}
              onCancel={() => setShowNewClientForm(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default function CRMPipeline() {
  return (
    <CRMProvider>
      <CRMPipelineContent />
    </CRMProvider>
  );
}