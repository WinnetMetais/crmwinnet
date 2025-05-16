
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Search, Plus, Filter, Eye, Edit, Trash2, UserPlus, Building, Users, ArrowUpDown, UserCheck, MessageSquare, Phone, Mail } from "lucide-react";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [openNewCustomerDialog, setOpenNewCustomerDialog] = useState(false);

  // Sample customer data
  const customers = [
    {
      id: 1,
      name: 'Metalúrgica Paulista Ltda',
      contact: 'Carlos Mendes',
      email: 'carlos@metalurgicapaulista.com.br',
      phone: '(11) 3456-7890',
      segment: 'Indústria',
      region: 'São Paulo',
      status: 'Ativo',
      lastPurchase: '12/05/2025',
      value: 'R$ 28.540,00'
    },
    {
      id: 2,
      name: 'Aços Rio Grande S.A.',
      contact: 'Maria Silva',
      email: 'maria@acosriogrande.com.br',
      phone: '(51) 3422-9876',
      segment: 'Distribuidor',
      region: 'Rio Grande do Sul',
      status: 'Ativo',
      lastPurchase: '03/05/2025',
      value: 'R$ 45.980,00'
    },
    {
      id: 3,
      name: 'Construtora Belo Horizonte',
      contact: 'João Ferreira',
      email: 'joao@construtorabh.com.br',
      phone: '(31) 3567-1234',
      segment: 'Construção',
      region: 'Minas Gerais',
      status: 'Ativo',
      lastPurchase: '25/04/2025',
      value: 'R$ 32.450,00'
    },
    {
      id: 4,
      name: 'Metalúrgica Nordeste',
      contact: 'Ana Costa',
      email: 'ana@metalurgicanordeste.com.br',
      phone: '(81) 3678-5432',
      segment: 'Indústria',
      region: 'Pernambuco',
      status: 'Inativo',
      lastPurchase: '10/02/2025',
      value: 'R$ 18.750,00'
    },
    {
      id: 5,
      name: 'Ferramentaria Curitiba',
      contact: 'Paulo Santos',
      email: 'paulo@ferramentariacuritiba.com.br',
      phone: '(41) 3345-6789',
      segment: 'Varejo',
      region: 'Paraná',
      status: 'Ativo',
      lastPurchase: '08/05/2025',
      value: 'R$ 12.380,00'
    },
    {
      id: 6,
      name: 'Indústria Mecânica Brasília',
      contact: 'Fernanda Lima',
      email: 'fernanda@mecanicabsb.com.br',
      phone: '(61) 3234-5678',
      segment: 'Indústria',
      region: 'Distrito Federal',
      status: 'Prospect',
      lastPurchase: '-',
      value: '-'
    },
    {
      id: 7,
      name: 'Delta Metais Ltda',
      contact: 'Roberto Almeida',
      email: 'roberto@deltametais.com.br',
      phone: '(21) 3789-0123',
      segment: 'Distribuidor',
      region: 'Rio de Janeiro',
      status: 'Ativo',
      lastPurchase: '15/05/2025',
      value: 'R$ 54.320,00'
    },
    {
      id: 8,
      name: 'Fortaleza Metalurgia',
      contact: 'Mariana Costa',
      email: 'mariana@fortalezametalurgia.com.br',
      phone: '(85) 3901-2345',
      segment: 'Indústria',
      region: 'Ceará',
      status: 'Inativo',
      lastPurchase: '22/01/2025',
      value: 'R$ 23.450,00'
    }
  ];

  // Filter customers based on search term and active tab
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && customer.status === 'Ativo';
    if (activeTab === 'inactive') return matchesSearch && customer.status === 'Inativo';
    if (activeTab === 'prospect') return matchesSearch && customer.status === 'Prospect';
    
    return matchesSearch;
  });

  // Sample data for charts
  const segmentData = [
    { name: 'Indústria', value: 35 },
    { name: 'Distribuidor', value: 25 },
    { name: 'Construção', value: 20 },
    { name: 'Varejo', value: 15 },
    { name: 'Outros', value: 5 }
  ];

  const regionData = [
    { region: 'São Paulo', value: 45 },
    { region: 'Rio Grande do Sul', value: 15 },
    { region: 'Minas Gerais', value: 12 },
    { region: 'Rio de Janeiro', value: 10 },
    { region: 'Paraná', value: 8 },
    { region: 'Outros', value: 10 }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
                  <p className="text-muted-foreground">Gerencie os relacionamentos com clientes da Winnet Metais</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                
                <Dialog open={openNewCustomerDialog} onOpenChange={setOpenNewCustomerDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Novo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do novo cliente. Clique em salvar quando terminar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Empresa
                        </Label>
                        <Input id="name" placeholder="Nome da empresa" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contact" className="text-right">
                          Contato
                        </Label>
                        <Input id="contact" placeholder="Nome do contato principal" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          E-mail
                        </Label>
                        <Input id="email" type="email" placeholder="email@empresa.com.br" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Telefone
                        </Label>
                        <Input id="phone" placeholder="(00) 0000-0000" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="segment" className="text-right">
                          Segmento
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o segmento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="industria">Indústria</SelectItem>
                            <SelectItem value="distribuidor">Distribuidor</SelectItem>
                            <SelectItem value="construcao">Construção</SelectItem>
                            <SelectItem value="varejo">Varejo</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="region" className="text-right">
                          Região
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione a região" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sp">São Paulo</SelectItem>
                            <SelectItem value="rj">Rio de Janeiro</SelectItem>
                            <SelectItem value="mg">Minas Gerais</SelectItem>
                            <SelectItem value="rs">Rio Grande do Sul</SelectItem>
                            <SelectItem value="pr">Paraná</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                            <SelectItem value="prospect">Prospect</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenNewCustomerDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setOpenNewCustomerDialog(false)}>
                        Salvar Cliente
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Customer Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Building className="mr-2 h-4 w-4 text-blue-500" />
                    Total de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.length}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    +3 no último mês
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                    Clientes Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.filter(c => c.status === 'Ativo').length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((customers.filter(c => c.status === 'Ativo').length / customers.length) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Users className="mr-2 h-4 w-4 text-yellow-500" />
                    Prospects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.filter(c => c.status === 'Prospect').length}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    +2 no último mês
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 28.480,00</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    +12.5% vs. período anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Customer Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Clientes por Segmento</CardTitle>
                  <CardDescription>Distribuição dos clientes por área de atuação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={segmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {segmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clientes por Região</CardTitle>
                  <CardDescription>Distribuição geográfica dos clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="%" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
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
                      Gerencie seus clientes e prospectos
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar clientes..."
                        className="pl-8 w-full md:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Tabs 
                      defaultValue="all" 
                      className="w-full md:w-auto" 
                      onValueChange={setActiveTab}
                      value={activeTab}
                    >
                      <TabsList className="grid grid-cols-4 w-full md:w-auto">
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="active">Ativos</TabsTrigger>
                        <TabsTrigger value="inactive">Inativos</TabsTrigger>
                        <TabsTrigger value="prospect">Prospects</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Segmento</TableHead>
                        <TableHead>Região</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Última Compra
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
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
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.contact}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{customer.segment}</TableCell>
                          <TableCell>{customer.region}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                customer.status === 'Ativo'
                                  ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                  : customer.status === 'Inativo'
                                  ? "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100"
                                  : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
                              }
                            >
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{customer.lastPurchase}</TableCell>
                          <TableCell>{customer.value}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost" title="Visualizar">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" title="Editar">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" title="Enviar Mensagem">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Últimos Contatos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Metalúrgica Paulista Ltda', date: '14/05/2025', type: 'Telefone' },
                      { name: 'Delta Metais Ltda', date: '13/05/2025', type: 'E-mail' },
                      { name: 'Aços Rio Grande S.A.', date: '11/05/2025', type: 'Reunião' }
                    ].map((contact, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 border-b">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.date} - {contact.type}</p>
                        </div>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">Ver Histórico Completo</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Campanhas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Promoção Aço Inox', date: '10/05/2025', status: 'Enviado', opens: '68%' },
                      { name: 'Novos Produtos Q2', date: '25/04/2025', status: 'Enviado', opens: '72%' },
                      { name: 'Convite Feira Metais', date: '15/04/2025', status: 'Enviado', opens: '55%' }
                    ].map((campaign, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 border-b">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {campaign.date} - Aberturas: {campaign.opens}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {campaign.status}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">Campanhas de E-mail</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" onClick={() => setOpenNewCustomerDialog(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Novo Cliente
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Enviar Mensagem
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Nova Campanha
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      Exportar Contatos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Customers;
