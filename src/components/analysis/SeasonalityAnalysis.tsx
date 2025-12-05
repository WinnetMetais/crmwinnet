
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Snowflake, Sun, Leaf, CloudRain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { seasonalityService } from '@/services/seasonality';
import { toast } from '@/hooks/use-toast';

export const SeasonalityAnalysis = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMetric, setSelectedMetric] = useState('vendas');
  const [monthlyData, setMonthlyData] = useState<Array<Record<string, any>>>([]);
  const [seasonalAnalysis, setSeasonalAnalysis] = useState<Array<Record<string, any>>>([]);
  const [productSeasonality, setProductSeasonality] = useState<Array<Record<string, any>>>([]);
  const [yearOverYearComparison, setYearOverYearComparison] = useState<Array<Record<string, any>>>([]);
  const [kpis, setKpis] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSeasonalityData();
  }, [selectedYear, selectedMetric]);

  const fetchSeasonalityData = async () => {
    setLoading(true);
    try {
      const data = await seasonalityService.getData(selectedYear, selectedMetric);
      setMonthlyData(data.monthlyData);
      setSeasonalAnalysis(data.seasonalAnalysis);
      setProductSeasonality(data.productSeasonality);
      setYearOverYearComparison(data.yearOverYearComparison);
      setKpis(data.kpis);
    } catch (error) {
      console.error('Error fetching seasonality data:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados de sazonalidade",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMonthlyData = useMemo(() => {
    return monthlyData.filter(item => item[selectedMetric] !== undefined);
  }, [monthlyData, selectedMetric]);

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'Primavera': return <Leaf className="h-5 w-5 text-green-600" />;
      case 'Verão': return <Sun className="h-5 w-5 text-warning" />;
      case 'Outono': return <CloudRain className="h-5 w-5 text-orange-600" />;
      case 'Inverno': return <Snowflake className="h-5 w-5 text-blue-600" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const seasonalityChart = useMemo(() => {
    if (loading || !monthlyData.length) return null;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={filteredMonthlyData} aria-label="Gráfico de Sazonalidade">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(value, name) => [
            selectedMetric === 'vendas' ? `R$ ${Number(value).toLocaleString()}` : 
            selectedMetric === 'conversao' ? `${value}%` : value,
            selectedMetric === 'vendas' ? 'Vendas' : selectedMetric === 'leads' ? 'Leads' : 'Taxa de Conversão'
          ]} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey={selectedMetric} 
            stroke="hsl(var(--primary))" 
            fill="hsl(var(--primary))" 
            fillOpacity={0.3}
            name={selectedMetric === 'vendas' ? 'Vendas' : selectedMetric === 'leads' ? 'Leads' : 'Conversão'}
          />
          <Line 
            type="monotone" 
            dataKey="sazonalidade" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={2}
            dot={false}
            name="Índice Sazonal"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }, [filteredMonthlyData, selectedMetric, loading]);

  return (
    <div className="space-y-6">
      {/* Header e Controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Análise de Sazonalidade</h2>
        <div className="flex gap-4">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
              <SelectItem value="conversao">Conversão</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs de Sazonalidade */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Índice de Sazonalidade</p>
                <p className="text-3xl font-bold">{kpis.sazonalityIndex || '0'}%</p>
                <p className="text-sm text-muted-foreground">Variação anual</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Melhor Mês</p>
                <p className="text-3xl font-bold">{kpis.maxMonth?.mes || 'N/A'}</p>
                <p className="text-sm text-success">R$ {(kpis.maxMonth?.vendas || 0).toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pior Mês</p>
                <p className="text-3xl font-bold">{kpis.minMonth?.mes || 'N/A'}</p>
                <p className="text-sm text-destructive">R$ {(kpis.minMonth?.vendas || 0).toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média Mensal</p>
                <p className="text-3xl font-bold">R$ {Math.round((kpis.avgMonthly || 0) / 1000)}K</p>
                <p className="text-sm text-muted-foreground">R$ {(kpis.avgMonthly || 0).toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Sazonalidade */}
      <Card>
        <CardHeader>
          <CardTitle>Padrão Sazonal de {selectedMetric === 'vendas' ? 'Vendas' : selectedMetric === 'leads' ? 'Leads' : 'Conversão'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Carregando dados de sazonalidade...</p>
            </div>
          ) : seasonalityChart}
        </CardContent>
      </Card>

      {/* Análise por Estação */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Estação do Ano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {seasonalAnalysis.map((season, index) => {
              const IconComponent = season.icone;
              return (
                <div key={index} className="p-4 border rounded-lg text-center">
                  <div className="flex justify-center mb-3">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h4 className="font-medium mb-2">{season.estacao}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-success">
                        R$ {(season.vendas / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-muted-foreground">Vendas Totais</p>
                    </div>
                    <div>
                      <Badge variant={season.crescimento > 0 ? "default" : "destructive"}>
                        {season.crescimento > 0 ? '+' : ''}{season.crescimento}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">vs média anual</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{season.leads} leads</p>
                      <p className="text-xs text-muted-foreground">Melhor: {season.melhorMes}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparação Ano a Ano */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação Ano a Ano (2023 vs 2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearOverYearComparison} aria-label="Comparação Ano a Ano">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                `R$ ${Number(value).toLocaleString()}`,
                name
              ]} />
              <Legend />
              <Bar dataKey="2023" fill="hsl(var(--muted))" name="2023" />
              <Bar dataKey="2024" fill="hsl(var(--primary))" name="2024" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-success">+13.2%</p>
                <p className="text-sm text-muted-foreground">Crescimento Médio</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">+R$ 485K</p>
                <p className="text-sm text-muted-foreground">Incremento Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">Q2</p>
                <p className="text-sm text-muted-foreground">Melhor Trimestre</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sazonalidade por Produto */}
      <Card>
        <CardHeader>
          <CardTitle>Sazonalidade por Produto (Análise Trimestral)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Produto</th>
                  <th className="text-right p-3">Q1</th>
                  <th className="text-right p-3">Q2</th>
                  <th className="text-right p-3">Q3</th>
                  <th className="text-right p-3">Q4</th>
                  <th className="text-center p-3">Pico</th>
                  <th className="text-right p-3">Variação</th>
                </tr>
              </thead>
              <tbody>
                {productSeasonality.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{product.produto}</td>
                    <td className="p-3 text-right">R$ {product.q1.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium text-success">R$ {product.q2.toLocaleString()}</td>
                    <td className="p-3 text-right">R$ {product.q3.toLocaleString()}</td>
                    <td className="p-3 text-right">R$ {product.q4.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <Badge variant="default">{product.pico}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Badge variant={product.variacao > 20 ? "default" : "secondary"}>
                        {product.variacao}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-medium text-secondary-foreground mb-2">Insights de Sazonalidade:</h4>
            <ul className="text-sm text-secondary-foreground space-y-1">
              <li>• Pico de vendas concentrado no Q2 (Outono) para todos os produtos</li>
              <li>• Lixeira L4090 apresenta maior variação sazonal (26.4%)</li>
              <li>• Período de menor demanda: Q3 (Inverno) - ideal para manutenção e estoque</li>
              <li>• Recomendação: aumentar estoque em março para atender demanda do Q2</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
