
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FileBarChart, Download, Save, Play, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReportField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency';
  required: boolean;
}

interface SavedReport {
  id: string;
  name: string;
  description: string;
  fields: string[];
  filters: any;
  createdAt: string;
  lastRun: string;
}

export const CustomReportsGenerator = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const availableFields: ReportField[] = [
    { id: 'customer_name', name: 'customer_name', label: 'Nome do Cliente', type: 'text', required: false },
    { id: 'customer_company', name: 'customer_company', label: 'Empresa do Cliente', type: 'text', required: false },
    { id: 'sale_value', name: 'sale_value', label: 'Valor da Venda', type: 'currency', required: false },
    { id: 'sale_date', name: 'sale_date', label: 'Data da Venda', type: 'date', required: false },
    { id: 'product_name', name: 'product_name', label: 'Nome do Produto', type: 'text', required: false },
    { id: 'salesperson', name: 'salesperson', label: 'Vendedor', type: 'text', required: false },
    { id: 'commission', name: 'commission', label: 'Comissão', type: 'currency', required: false },
    { id: 'lead_source', name: 'lead_source', label: 'Origem do Lead', type: 'text', required: false },
    { id: 'conversion_rate', name: 'conversion_rate', label: 'Taxa de Conversão', type: 'number', required: false },
    { id: 'deal_stage', name: 'deal_stage', label: 'Estágio do Negócio', type: 'text', required: false }
  ];

  const [savedReports] = useState<SavedReport[]>([
    {
      id: '1',
      name: 'Relatório de Vendas Mensal',
      description: 'Vendas por vendedor no último mês',
      fields: ['customer_name', 'sale_value', 'salesperson', 'sale_date'],
      filters: { period: 'monthly' },
      createdAt: '2024-01-10',
      lastRun: '2024-01-15'
    },
    {
      id: '2',
      name: 'Análise de Conversão',
      description: 'Taxa de conversão por origem de lead',
      fields: ['lead_source', 'conversion_rate', 'customer_name'],
      filters: { period: 'quarterly' },
      createdAt: '2024-01-08',
      lastRun: '2024-01-14'
    }
  ]);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleGenerateReport = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "Selecione campos",
        description: "Selecione pelo menos um campo para o relatório.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Relatório gerado",
      description: "Seu relatório customizado foi gerado com sucesso!",
    });
  };

  const handleSaveReport = () => {
    if (!reportName || selectedFields.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e selecione campos.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Relatório salvo",
      description: "Relatório foi salvo para uso futuro!",
    });

    setReportName('');
    setReportDescription('');
    setSelectedFields([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Relatórios Salvos</p>
                <p className="text-3xl font-bold">{savedReports.length}</p>
              </div>
              <FileBarChart className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Executados Hoje</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Play className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agendados</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Relatório</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="reportName">Nome do Relatório</Label>
                <Input
                  id="reportName"
                  placeholder="Ex: Vendas por Região"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="reportDescription">Descrição</Label>
                <Textarea
                  id="reportDescription"
                  placeholder="Descrição do relatório..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label>Período</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFrom">Data Inicial</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">Data Final</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Campos do Relatório</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-4">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => handleFieldToggle(field.id)}
                    />
                    <Label htmlFor={field.id} className="flex-1 cursor-pointer">
                      {field.label}
                    </Label>
                    <Badge variant="outline">{field.type}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleGenerateReport} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
              <Button onClick={handleSaveReport} variant="outline" className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios Salvos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <Badge variant="outline">{report.fields.length} campos</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    <p>Criado: {new Date(report.createdAt).toLocaleDateString('pt-BR')}</p>
                    <p>Última execução: {new Date(report.lastRun).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="h-3 w-3 mr-1" />
                      Executar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
