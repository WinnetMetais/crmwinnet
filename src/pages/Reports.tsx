
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart, Download, Calendar, Filter, Printer, Mail, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
  const [reportType, setReportType] = useState('performance');
  const [dateRange, setDateRange] = useState('30d');

  const reportTemplates = [
    { id: 1, name: 'Desempenho de Campanhas', type: 'performance', date: '15/05/2025', status: 'Gerado' },
    { id: 2, name: 'Análise de Audiência', type: 'audience', date: '12/05/2025', status: 'Gerado' },
    { id: 3, name: 'ROI por Canal', type: 'roi', date: '10/05/2025', status: 'Gerado' },
    { id: 4, name: 'Conteúdo e Engajamento', type: 'content', date: '05/05/2025', status: 'Gerado' },
  ];

  const scheduledReports = [
    { id: 1, name: 'Relatório Semanal de Performance', frequency: 'Semanal', nextDate: '22/05/2025', recipients: 3 },
    { id: 2, name: 'Análise Mensal de Campanhas', frequency: 'Mensal', nextDate: '01/06/2025', recipients: 5 },
    { id: 3, name: 'Dashboard Executivo', frequency: 'Semanal', nextDate: '22/05/2025', recipients: 2 },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Relatórios</h1>
              </div>

              <div className="flex space-x-4 items-center">
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="12m">Último ano</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Novo Relatório</CardTitle>
                  <CardDescription>Gerar relatório personalizado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Tipo de Relatório</label>
                      <Select defaultValue="performance" onValueChange={setReportType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Performance de Campanhas</SelectItem>
                          <SelectItem value="audience">Segmentação de Público</SelectItem>
                          <SelectItem value="content">Desempenho de Conteúdo</SelectItem>
                          <SelectItem value="roi">Análise de ROI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Nome do Relatório</label>
                      <Input placeholder="Ex: Relatório Mensal de Desempenho" />
                    </div>
                    
                    <div className="pt-2">
                      <Button className="w-full">
                        <FileBarChart className="h-4 w-4 mr-2" />
                        Gerar Relatório
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Relatórios Agendados</CardTitle>
                  <CardDescription>Automação de relatórios</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      {scheduledReports.slice(0, 2).map((report) => (
                        <div key={report.id} className="p-3 border-b last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{report.name}</p>
                              <p className="text-xs text-muted-foreground">Próximo: {report.nextDate}</p>
                            </div>
                            <Badge variant="outline">{report.frequency}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Gerenciar Agendamentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Exportar Dados</CardTitle>
                  <CardDescription>Download em vários formatos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select defaultValue="current">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione os dados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Dashboard Atual</SelectItem>
                        <SelectItem value="campaigns">Dados de Campanhas</SelectItem>
                        <SelectItem value="roi">Métricas de ROI</SelectItem>
                        <SelectItem value="audience">Dados de Audiência</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        JSON
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="w-full mb-8">
              <CardHeader>
                <CardTitle>Relatórios Recentes</CardTitle>
                <CardDescription>
                  Histórico de relatórios gerados
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="audience">Audiência</TabsTrigger>
                      <TabsTrigger value="content">Conteúdo</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-2" />
                            Compartilhar
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Via Email</DropdownMenuItem>
                          <DropdownMenuItem>Link Compartilhável</DropdownMenuItem>
                          <DropdownMenuItem>Exportar e Enviar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <TabsContent value="all" className="mt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportTemplates.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.name}</TableCell>
                            <TableCell>{report.type === 'performance' ? 'Performance' : 
                                       report.type === 'audience' ? 'Audiência' : 
                                       report.type === 'content' ? 'Conteúdo' : 'ROI'}</TableCell>
                            <TableCell>{report.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="performance" className="mt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportTemplates.filter(r => r.type === 'performance').map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.name}</TableCell>
                            <TableCell>Performance</TableCell>
                            <TableCell>{report.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  {/* Similar structure for other tab contents */}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Reports;
