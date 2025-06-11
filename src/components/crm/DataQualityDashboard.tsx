
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Users, 
  Target,
  FileText,
  RefreshCw
} from "lucide-react";
import { useCRMData } from "@/hooks/useCRMData";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const DataQualityDashboard = () => {
  const {
    qualityMetrics,
    validationLogs,
    metricsLoading,
    logsLoading,
    runValidation,
    isValidating,
    refreshData
  } = useCRMData();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  // Dados para gráficos
  const chartData = Object.entries(qualityMetrics).map(([module, metrics]) => ({
    name: module.charAt(0).toUpperCase() + module.slice(1),
    score: metrics.averageScore,
    valid: metrics.validRecords,
    invalid: metrics.invalidRecords,
    total: metrics.totalRecords
  }));

  const pieData = Object.entries(qualityMetrics).map(([module, metrics]) => ({
    name: module,
    value: metrics.totalRecords
  }));

  const handleRunValidation = () => {
    runValidation(undefined); // Explicitly pass undefined to validate all customers
  };

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Qualidade dos Dados</h1>
          <p className="text-muted-foreground">Visão geral da qualidade dos dados no CRM</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} variant="outline" disabled={isValidating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={handleRunValidation} disabled={isValidating}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Executar Verificação
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(qualityMetrics).map(([module, metrics]) => {
          const IconComponent = module === 'customers' ? Users :
                              module === 'deals' ? Target :
                              module === 'opportunities' ? TrendingUp : FileText;
          
          return (
            <Card key={module}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {module}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metrics.totalRecords}</span>
                    <Badge variant={getScoreBadgeVariant(metrics.averageScore)}>
                      {metrics.averageScore}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Qualidade Média</span>
                      <span className={getScoreColor(metrics.averageScore)}>
                        {metrics.averageScore}%
                      </span>
                    </div>
                    <Progress value={metrics.averageScore} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{metrics.validRecords} válidos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-red-600" />
                      <span>{metrics.invalidRecords} inválidos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score de Qualidade por Módulo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" name="Score Médio" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Registros Válidos vs Inválidos */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Validação por Módulo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valid" fill="#10b981" name="Válidos" />
              <Bar dataKey="invalid" fill="#ef4444" name="Inválidos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Logs Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Validação Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!logsLoading && validationLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {log.validation_status === 'passed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : log.validation_status === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">{log.table_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.validation_type} - {log.validated_by}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    log.validation_status === 'passed' ? 'default' :
                    log.validation_status === 'warning' ? 'secondary' : 'destructive'
                  }>
                    {log.validation_status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
            
            {!logsLoading && validationLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum log de validação encontrado
              </div>
            )}

            {logsLoading && (
              <div className="flex justify-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
