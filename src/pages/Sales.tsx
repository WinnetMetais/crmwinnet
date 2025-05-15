
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Funnel, Pipeline, KanbanSquare } from "lucide-react";
import { SalesFunnelChart } from "@/components/sales/SalesFunnelChart";
import { SalesPipeline } from "@/components/sales/SalesPipeline";
import { SalesKanban } from "@/components/sales/SalesKanban";
import { SalesStats } from "@/components/sales/SalesStats";

const Sales = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Vendas</h1>
          <p className="text-muted-foreground">Gerencie o processo comercial da Winnet Metais</p>
        </div>
        <Button>Nova Oportunidade <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </div>

      <SalesStats />

      <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="funnel" className="flex items-center gap-2">
            <Funnel className="h-4 w-4" />
            Funil de Vendas
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <Pipeline className="h-4 w-4" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <KanbanSquare className="h-4 w-4" />
            Kanban
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Funil de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <SalesFunnelChart />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Principais Oportunidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2">Cliente</th>
                        <th className="pb-2">Valor</th>
                        <th className="pb-2">Probabilidade</th>
                        <th className="pb-2">Estágio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="border-b">
                          <td className="py-3">Cliente {i}</td>
                          <td className="py-3">R$ {(Math.random() * 10000).toFixed(2)}</td>
                          <td className="py-3">{Math.floor(Math.random() * 100)}%</td>
                          <td className="py-3">{["Qualificação", "Proposta", "Negociação", "Fechamento"][Math.floor(Math.random() * 4)]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <SalesFunnelChart detailed={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6">
          <SalesPipeline />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <SalesKanban />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;
