
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Filter, 
  Users, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  ArrowUpDown,
  BarChart,
  DollarSign
} from "lucide-react";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample customer data for Winnet Metais
  const customers = [
    {
      id: 1,
      name: 'Indústrias Metalúrgicas Ltda',
      type: 'Indústria',
      contact: 'José Santos',
      email: 'contato@industriasmetalurgicas.com',
      phone: '(11) 3456-7890',
      location: 'São Paulo, SP',
      status: 'Ativo',
      value: 'R$ 158.000,00'
    },
    {
      id: 2,
      name: 'Construção & Engenharia S.A.',
      type: 'Construção',
      contact: 'Maria Oliveira',
      email: 'maria@construcaoengenharia.com',
      phone: '(21) 3456-7890',
      location: 'Rio de Janeiro, RJ',
      status: 'Ativo',
      value: 'R$ 235.000,00'
    },
    {
      id: 3,
      name: 'Central Automotiva Brasil',
      type: 'Automotivo',
      contact: 'Carlos Ferreira',
      email: 'carlos@centralautomotiva.com',
      phone: '(31) 3456-7890',
      location: 'Belo Horizonte, MG',
      status: 'Ativo',
      value: 'R$ 87.500,00'
    },
    {
      id: 4,
      name: 'Tecno Metais Ltda',
      type: 'Indústria',
      contact: 'Amanda Silva',
      email: 'amanda@tecnometais.com',
      phone: '(41) 3456-7890',
      location: 'Curitiba, PR',
      status: 'Inativo',
      value: 'R$ 45.000,00'
    },
    {
      id: 5,
      name: 'Aerospace Componentes S.A.',
      type: 'Aeroespacial',
      contact: 'Roberto Martins',
      email: 'roberto@aerospace.com',
      phone: '(19) 3456-7890',
      location: 'São José dos Campos, SP',
      status: 'Ativo',
      value: 'R$ 320.000,00'
    },
    {
      id: 6,
      name: 'Construtora Horizonte',
      type: 'Construção',
      contact: 'Paulo Mendes',
      email: 'paulo@horizonteconst.com',
      phone: '(51) 3456-7890',
      location: 'Porto Alegre, RS',
      status: 'Ativo',
      value: 'R$ 175.000,00'
    },
    {
      id: 7,
      name: 'Naval Indústria Pesada',
      type: 'Naval',
      contact: 'Fernanda Costa',
      email: 'fernanda@navalind.com',
      phone: '(47) 3456-7890',
      location: 'Itajaí, SC',
      status: 'Inativo',
      value: 'R$ 0,00'
    },
    {
      id: 8,
      name: 'Petro Equipamentos S.A.',
      type: 'Petroquímico',
      contact: 'Ricardo Gomes',
      email: 'ricardo@petroequip.com',
      phone: '(22) 3456-7890',
      location: 'Macaé, RJ',
      status: 'Ativo',
      value: 'R$ 430.000,00'
    },
  ];

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Customer statistics
  const customerStats = [
    { title: 'Total de Clientes', value: '128', change: '+12%', icon: Users },
    { title: 'Novos Clientes (Mês)', value: '18', change: '+5', icon: User },
    { title: 'Taxa de Retenção', value: '87%', change: '+2%', icon: Building },
    { title: 'Valor Médio', value: 'R$ 185.000', change: '+15%', icon: DollarSign },
  ];

  // Customer segments
  const segments = [
    { name: 'Indústria', percentage: 45, color: 'bg-blue-500' },
    { name: 'Construção', percentage: 25, color: 'bg-green-500' },
    { name: 'Automotivo', percentage: 15, color: 'bg-yellow-500' },
    { name: 'Outros', percentage: 15, color: 'bg-gray-500' },
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
                <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Cliente
                </Button>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {customerStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <stat.icon className="mr-2 h-4 w-4" />
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-600 mt-1">{stat.change} vs. mês anterior</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Customer Segments and Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Segmentos de Clientes
                  </CardTitle>
                  <CardDescription>
                    Distribuição por setor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {segments.map((segment) => (
                      <div key={segment.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{segment.name}</span>
                          <span className="font-medium">{segment.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className={`${segment.color} h-2 rounded-full`} 
                            style={{ width: `${segment.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Atividades Recentes
                  </CardTitle>
                  <CardDescription>
                    Interações com clientes nos últimos 30 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-muted">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="h-full w-[1px] bg-muted" />
                      </div>
                      <div className="space-y-1 pb-6">
                        <p className="text-sm font-medium">Novo cliente registrado</p>
                        <p className="text-sm text-muted-foreground">Petro Equipamentos S.A. adicionado ao sistema</p>
                        <p className="text-xs text-muted-foreground">12 Maio 2025, 10:45</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-muted">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="h-full w-[1px] bg-muted" />
                      </div>
                      <div className="space-y-1 pb-6">
                        <p className="text-sm font-medium">Contato realizado</p>
                        <p className="text-sm text-muted-foreground">Ligação com Carlos Ferreira da Central Automotiva</p>
                        <p className="text-xs text-muted-foreground">10 Maio 2025, 14:23</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-muted">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Proposta enviada</p>
                        <p className="text-sm text-muted-foreground">Proposta #24581 enviada para Indústrias Metalúrgicas</p>
                        <p className="text-xs text-muted-foreground">05 Maio 2025, 09:15</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customers Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>
                      Gerencie sua carteira de clientes
                    </CardDescription>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar clientes..."
                      className="pl-8 w-full md:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Setor</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Valor
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.type}</TableCell>
                          <TableCell>
                            <div>
                              {customer.contact}
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Mail className="h-3 w-3 mr-1" />
                                {customer.email}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Phone className="h-3 w-3 mr-1" />
                                {customer.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              {customer.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={customer.status === 'Ativo' ? 'default' : 'outline'}
                              className={
                                customer.status === 'Ativo'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                              }
                            >
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{customer.value}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline">Ver Detalhes</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando <strong>{filteredCustomers.length}</strong> de <strong>{customers.length}</strong> clientes
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Anterior</Button>
                  <Button variant="outline" size="sm">Próximo</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Customers;
