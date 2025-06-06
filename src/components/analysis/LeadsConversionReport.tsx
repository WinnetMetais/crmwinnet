
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Target, Phone } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, BarChart, Bar } from 'recharts';

export const LeadsConversionReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedSource, setSelectedSource] = useState('all');

  const conversionFunnelData = [
    { stage: 'Leads Recebidos', quantidade: 850, taxa: 100 },
    { stage: 'Leads Qualificados', quantidade: 425, taxa: 50 },
    { stage: 'Propostas Enviadas', quantidade: 255, taxa: 30 },
    { stage: 'Negociações Iniciadas', quantidade: 170, taxa: 20 },
    { stage: 'Vendas Fechadas', quantidade: 85, taxa: 10 }
  ];

  const conversionBySource = [
    { origem: 'Site Winnet', leads: 245, conversoes: 61, taxa: 24.9, cpa: 185 },
    { origem: 'Google Ads', leads: 185, conversoes: 34, taxa: 18.4, cpa: 220 },
    { origem: 'Indicações', leads: 125, conversoes: 39, taxa: 31.2, cpa: 95 },
    { origem: 'Mercado Livre', leads: 95, conversoes: 15, taxa: 15.8, cpa: 165 },
    { origem: 'Redes Sociais', leads: 85, conversoes: 18, taxa: 21.2, cpa: 142 },
    { origem: 'Cold Email', leads: 115, conversoes: 23, taxa: 20.0, cpa: 198 }
  ];

  const timeToConversionData = [
    { dias: '0-7', quantidade: 28, percentual: 32.9 },
    { dias: '8-15', quantidade: 24, percentual: 28.2 },
    { dias: '16-30', quantidade: 18, percentual: 21.2 },
    { dias: '31-60', quantidade: 12, percentual: 14.1 },
    { dias: '60+', quantidade: 3, percentual: 3.5 }
  ];

  const conversionTrendData = [
    { week: 'Sem 1', leads: 95, conversoes: 8, taxa: 8.4 },
    { week: 'Sem 2', leads: 112, conversoes: 12, taxa: 10.7 },
    { week: 'Sem 3', leads: 88, conversoes: 9, taxa: 10.2 },
    { week: 'Sem 4', leads: 125, conversoes: 15, taxa: 12.0 },
    { week: 'Sem 5', leads: 98, conversoes: 11, taxa: 11.2 },
    { week: 'Sem 6', leads: 132, conversoes: 18, taxa: 13.6 }
  ];

  const totalLeads = conversionBySource.reduce((acc, item) => acc + item.leads, 0);
  const totalConversions = conversionBySource.reduce((acc, item) => acc + item.conversoes, 0);
  const overallConversionRate = ((totalConversions / totalLeads) * 100).toFixed(1);
  const avgCPA = (conversionBySource.reduce((acc, item) => acc + item.cpa, 0) / conversionBySource.length).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header e Controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">Relatório de Conversão de Leads</h2>
        <div className="flex gap-4">
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="12m">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs de Conversão */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão Geral</p>
                <p className="text-3xl font-bold">{overallConversionRate}%</p>
                <p className="text-sm text-green-600">+2.4% vs período anterior</p>
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
                <p className="text-3xl font-bold">{totalLeads}</p>
                <p className="text-sm text-green-600">+18.5% vs período anterior</p>
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
                <p className="text-3xl font-bold">{totalConversions}</p>
                <p className="text-sm text-green-600">+25.3% vs período anterior</p>
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
                <p className="text-3xl font-bold">R$ {avgCPA}</p>
                <p className="text-sm text-red-600">+8.2% vs período anterior</p>
              </div>
              <Phone className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funil de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionFunnelData.map((stage, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="text-right">
                    <span className="font-bold">{stage.quantidade}</span>
                    <span className="text-sm text-muted-foreground ml-2">({stage.taxa}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${stage.taxa}%` }}
                  />
                </div>
                {index < conversionFunnelData.length - 1 && (
                  <div className="text-sm text-red-600 mt-1">
                    ↓ Perda: {stage.quantidade - conversionFunnelData[index + 1].quantidade} leads ({((stage.quantidade - conversionFunnelData[index + 1].quantidade) / stage.quantidade * 100).toFixed(1)}%)
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversão por Origem */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Origem de Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Origem</th>
                  <th className="text-right p-3">Leads</th>
                  <th className="text-right p-3">Conversões</th>
                  <th className="text-right p-3">Taxa</th>
                  <th className="text-right p-3">CPA</th>
                  <th className="text-right p-3">ROI</th>
                </tr>
              </thead>
              <tbody>
                {conversionBySource.map((source, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{source.origem}</td>
                    <td className="p-3 text-right">{source.leads}</td>
                    <td className="p-3 text-right font-medium">{source.conversoes}</td>
                    <td className="p-3 text-right">
                      <Badge variant={source.taxa >= 25 ? "default" : source.taxa >= 20 ? "secondary" : "destructive"}>
                        {source.taxa}%
                      </Badge>
                    </td>
                    <td className="p-3 text-right">R$ {source.cpa}</td>
                    <td className="p-3 text-right text-green-600">
                      {((source.conversoes * 8450 - source.leads * source.cpa) / (source.leads * source.cpa) * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tendência de Conversão e Tempo para Conversão */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Conversão (Últimas 6 Semanas)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="leads" fill="#94a3b8" name="Leads" />
                <Line yAxisId="right" type="monotone" dataKey="taxa" stroke="#2563eb" strokeWidth={3} name="Taxa %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo para Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeToConversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dias" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'quantidade' ? `${value} conversões` : `${value}%`,
                  name === 'quantidade' ? 'Quantidade' : 'Percentual'
                ]} />
                <Bar dataKey="quantidade" fill="#16a34a" name="Conversões" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Tempo médio para conversão: <span className="font-medium">14.3 dias</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
