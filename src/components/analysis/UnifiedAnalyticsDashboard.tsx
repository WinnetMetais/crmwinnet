import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Target, Users, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BulkOperations } from "@/components/shared/BulkOperations";

// Tipagem para dados
interface LeadData {
  id: string;
  source: string;
  status: string;
  cpa: number;
  created_at: string;
  conversions?: { days_to_convert: number }[];
}

interface SalesData {
  id: string;
  month: string;
  meta: number;
  realizado: number;
}

interface SeasonalityData {
  id: string;
  mes: string;
  vendas: number;
  leads: number;
  conversao: number;
}

const updateFieldsMap = {
  leads: [
    { key: 'source', label: 'Origem', type: 'select' as const, options: [
      { value: 'site', label: 'Site Winnet' },
      { value: 'google', label: 'Google Ads' },
      { value: 'indicacao', label: 'Indicações' },
      { value: 'ml', label: 'Mercado Livre' },
    ]},
    { key: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'recebido', label: 'Recebido' },
      { value: 'qualificado', label: 'Qualificado' },
      { value: 'proposta', label: 'Proposta' },
      { value: 'convertido', label: 'Convertido' },
    ]},
    { key: 'cpa', label: 'CPA', type: 'number' as const },
  ],
  sales: [
    { key: 'meta', label: 'Meta', type: 'number' as const },
    { key: 'realizado', label: 'Realizado', type: 'number' as const },
  ],
  seasonality: [
    { key: 'vendas', label: 'Vendas', type: 'number' as const },
    { key: 'leads', label: 'Leads', type: 'number' as const },
    { key: 'conversao', label: 'Conversão', type: 'number' as const },
  ],
};

export const UnifiedAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('vendas');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [leadsData, setLeadsData] = useState<LeadData[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [seasonalityData, setSeasonalityData] = useState<SeasonalityData[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedSource, selectedPeriod, selectedMetric, selectedYear, selectedSeller]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'leads') {
        // Simulando dados de leads para demonstração
        setLeadsData([
          { id: '1', source: 'site', status: 'qualificado', cpa: 45, created_at: '2024-01-01', conversions: [{ days_to_convert: 7 }] },
          { id: '2', source: 'google', status: 'convertido', cpa: 65, created_at: '2024-01-02', conversions: [{ days_to_convert: 3 }] },
          { id: '3', source: 'indicacao', status: 'proposta', cpa: 25, created_at: '2024-01-03' },
        ]);
      } else if (activeTab === 'sales') {
        // Simulando dados de vendas para demonstração
        setSalesData([
          { id: '1', month: 'Janeiro', meta: 100000, realizado: 85000 },
          { id: '2', month: 'Fevereiro', meta: 120000, realizado: 135000 },
          { id: '3', month: 'Março', meta: 110000, realizado: 98000 },
        ]);
      } else if (activeTab === 'seasonality') {
        // Simulando dados de sazonalidade para demonstração
        setSeasonalityData([
          { id: '1', mes: 'Janeiro', vendas: 85000, leads: 150, conversao: 22.5 },
          { id: '2', mes: 'Fevereiro', vendas: 135000, leads: 180, conversao: 28.3 },
          { id: '3', mes: 'Março', vendas: 98000, leads: 160, conversao: 19.8 },
        ]);
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Falha ao carregar dados.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdate = async (updates: Record<string, any>) => {
    // Implementação simplificada para demonstração
    console.log('Bulk update:', updates);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleBulkValidate = async () => {
    const data = activeTab === 'leads' ? leadsData : activeTab === 'sales' ? salesData : seasonalityData;
    const valid = data.filter(item => Object.values(item).every(val => val !== null && val !== undefined));
    const invalid = data.filter(item => !valid.includes(item));
    return { valid, invalid };
  };

  const handleBulkDelete = async (ids: string[]) => {
    // Implementação simplificada para demonstração
    console.log('Bulk delete:', ids);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fetchData();
  };

  const handleExport = () => {
    const data = activeTab === 'leads' ? leadsData : activeTab === 'sales' ? salesData : seasonalityData;
    const csvContent = data.map(item => Object.values(item).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "Exportação concluída", description: "Relatório exportado como CSV." });
  };

  const getVariationIcon = (variation: number) => (
    variation > 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case 'leads': return leadsData;
      case 'sales': return salesData;
      case 'seasonality': return seasonalityData;
      default: return [];
    }
  };

  const getCurrentUpdateFields = () => {
    return updateFieldsMap[activeTab as keyof typeof updateFieldsMap] || [];
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="leads">Conversão de Leads</TabsTrigger>
          <TabsTrigger value="sales">Vendas Detalhado</TabsTrigger>
          <TabsTrigger value="seasonality">Sazonalidade</TabsTrigger>
          <TabsTrigger value="bulk">Operações em Massa</TabsTrigger>
        </TabsList>

        {/* Relatório de Conversão de Leads */}
        <TabsContent value="leads">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800">
              Relatório de Conversão de Leads
            </h2>
            <div className="flex gap-4">
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todas as Origens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Origens</SelectItem>
                  <SelectItem value="site">Site Winnet</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="indicacao">Indicações</SelectItem>
                  <SelectItem value="ml">Mercado Livre</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Últimos 30 dias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="12m">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
                      <p className="text-3xl font-bold">
                        {((leadsData.reduce((acc, lead) => acc + (lead.conversions?.length || 0), 0) / (leadsData.length || 1)) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Leads</p>
                      <p className="text-3xl font-bold">{leadsData.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversões Totais</p>
                      <p className="text-3xl font-bold">
                        {leadsData.reduce((acc, lead) => acc + (lead.conversions?.length || 0), 0)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">CPA Médio</p>
                      <p className="text-3xl font-bold">
                        R$ {(leadsData.reduce((acc, lead) => acc + (lead.cpa || 0), 0) / (leadsData.length || 1)).toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Relatório de Vendas Detalhado */}
        <TabsContent value="sales">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-800">
              Vendas Detalhado
            </h2>
            <div className="flex gap-4">
              <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todos os Vendedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Vendedores</SelectItem>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="pedro">Pedro Costa</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {salesData.map((item, index) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">{item.month}</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Meta</p>
                          <p className="text-xl font-bold">R$ {item.meta.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Realizado</p>
                          <p className="text-xl font-bold">R$ {item.realizado.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          {getVariationIcon(item.realizado - item.meta)}
                          <span className={`ml-1 font-medium ${item.realizado >= item.meta ? 'text-green-600' : 'text-red-600'}`}>
                            {((item.realizado / item.meta) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Análise de Sazonalidade */}
        <TabsContent value="seasonality">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-800">
              Análise de Sazonalidade
            </h2>
            <div className="flex gap-4">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Métrica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="leads">Leads</SelectItem>
                  <SelectItem value="conversao">Conversão</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {seasonalityData.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-4">{item.mes}</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Vendas</p>
                          <p className="text-xl font-bold">R$ {item.vendas.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Leads</p>
                          <p className="text-xl font-bold">{item.leads}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Conversão</p>
                          <p className="text-xl font-bold">{item.conversao}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Operações em Massa */}
        <TabsContent value="bulk">
          <BulkOperations
            data={getCurrentData()}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            onBulkUpdate={handleBulkUpdate}
            onBulkValidate={handleBulkValidate}
            onBulkDelete={handleBulkDelete}
            updateFields={getCurrentUpdateFields()}
            moduleType="commercial"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};