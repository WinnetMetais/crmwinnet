
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExportJob {
  id: string;
  name: string;
  type: 'pdf' | 'excel';
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  fileUrl?: string;
  size?: string;
}

export const ExportSystem = () => {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: '1',
      name: 'Relatório de Vendas - Janeiro',
      type: 'excel',
      format: 'XLSX',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-15 14:30',
      completedAt: '2024-01-15 14:32',
      fileUrl: '/downloads/vendas-janeiro.xlsx',
      size: '2.3 MB'
    },
    {
      id: '2',
      name: 'Lista de Clientes Ativos',
      type: 'pdf',
      format: 'PDF',
      status: 'processing',
      progress: 65,
      createdAt: '2024-01-15 15:15'
    },
    {
      id: '3',
      name: 'Análise de Performance',
      type: 'excel',
      format: 'XLSX',
      status: 'failed',
      progress: 0,
      createdAt: '2024-01-15 13:45'
    }
  ]);

  const [exportConfig, setExportConfig] = useState({
    name: '',
    type: 'excel',
    includeCharts: true,
    includeSummary: true,
    dateRange: { from: '', to: '' }
  });

  const handleStartExport = () => {
    if (!exportConfig.name) {
      toast({
        title: "Nome obrigatório",
        description: "Informe um nome para o arquivo de exportação.",
        variant: "destructive"
      });
      return;
    }

    const newJob: ExportJob = {
      id: Date.now().toString(),
      name: exportConfig.name,
      type: exportConfig.type as 'pdf' | 'excel',
      format: exportConfig.type === 'excel' ? 'XLSX' : 'PDF',
      status: 'pending',
      progress: 0,
      createdAt: new Date().toLocaleString('pt-BR')
    };

    setExportJobs(prev => [newJob, ...prev]);

    // Simular processamento
    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'processing', progress: 25 }
          : job
      ));
    }, 1000);

    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, progress: 50 }
          : job
      ));
    }, 2000);

    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { 
              ...job, 
              status: 'completed', 
              progress: 100,
              completedAt: new Date().toLocaleString('pt-BR'),
              fileUrl: `/downloads/${exportConfig.name.toLowerCase().replace(/\s+/g, '-')}.${exportConfig.type === 'excel' ? 'xlsx' : 'pdf'}`,
              size: '1.8 MB'
            }
          : job
      ));
    }, 4000);

    toast({
      title: "Exportação iniciada",
      description: "O arquivo será processado e ficará disponível para download.",
    });

    setExportConfig({
      name: '',
      type: 'excel',
      includeCharts: true,
      includeSummary: true,
      dateRange: { from: '', to: '' }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedJobs = exportJobs.filter(job => job.status === 'completed').length;
  const processingJobs = exportJobs.filter(job => job.status === 'processing').length;
  const totalSize = exportJobs
    .filter(job => job.size)
    .reduce((total, job) => total + parseFloat(job.size?.split(' ')[0] || '0'), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Arquivos Gerados</p>
                <p className="text-3xl font-bold">{completedJobs}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Processamento</p>
                <p className="text-3xl font-bold">{processingJobs}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                <p className="text-3xl font-bold">47</p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tamanho Total</p>
                <p className="text-3xl font-bold">{totalSize.toFixed(1)} MB</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Exportação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="exportName">Nome do Arquivo</Label>
              <Input
                id="exportName"
                placeholder="Ex: Relatório Mensal Janeiro"
                value={exportConfig.name}
                onChange={(e) => setExportConfig({...exportConfig, name: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="exportType">Formato</Label>
              <select 
                id="exportType"
                className="w-full border rounded-md px-3 py-2"
                value={exportConfig.type}
                onChange={(e) => setExportConfig({...exportConfig, type: e.target.value})}
              >
                <option value="excel">Excel (.xlsx)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Opções de Exportação</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeCharts"
                    checked={exportConfig.includeCharts}
                    onChange={(e) => setExportConfig({...exportConfig, includeCharts: e.target.checked})}
                  />
                  <Label htmlFor="includeCharts">Incluir gráficos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeSummary"
                    checked={exportConfig.includeSummary}
                    onChange={(e) => setExportConfig({...exportConfig, includeSummary: e.target.checked})}
                  />
                  <Label htmlFor="includeSummary">Incluir resumo executivo</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Período dos Dados</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFrom">Data Inicial</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={exportConfig.dateRange.from}
                    onChange={(e) => setExportConfig({
                      ...exportConfig, 
                      dateRange: {...exportConfig.dateRange, from: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">Data Final</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={exportConfig.dateRange.to}
                    onChange={(e) => setExportConfig({
                      ...exportConfig, 
                      dateRange: {...exportConfig.dateRange, to: e.target.value}
                    })}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleStartExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Iniciar Exportação
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Exportações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {exportJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{job.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(job.status)}
                        <Badge className={getStatusColor(job.status)}>
                          {job.status === 'completed' ? 'Concluído' :
                           job.status === 'processing' ? 'Processando' :
                           job.status === 'failed' ? 'Falhou' : 'Pendente'}
                        </Badge>
                        <Badge variant="outline">{job.format}</Badge>
                      </div>
                    </div>
                    {job.size && (
                      <span className="text-sm text-muted-foreground">{job.size}</span>
                    )}
                  </div>

                  {job.status === 'processing' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground mb-3">
                    <p>Criado: {job.createdAt}</p>
                    {job.completedAt && <p>Concluído: {job.completedAt}</p>}
                  </div>

                  {job.status === 'completed' && (
                    <Button size="sm" className="w-full">
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
