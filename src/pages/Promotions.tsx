
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Filter, Megaphone, Tag, PercentIcon, BellRing } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Promotions = () => {
  const [date, setDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample promotion data
  const promotions = [
    {
      id: 1,
      name: 'Desconto em Aços Inox',
      type: 'Desconto',
      discount: '15%',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-06-15'),
      status: 'Ativa',
      audience: 'Clientes Premium'
    },
    {
      id: 2,
      name: 'Compre 5 Pague 4 - Alumínio',
      type: 'Combo',
      discount: 'Frete grátis',
      startDate: new Date('2025-05-10'),
      endDate: new Date('2025-05-30'),
      status: 'Ativa',
      audience: 'Todos os clientes'
    },
    {
      id: 3,
      name: 'Promoção Relâmpago - Cobre',
      type: 'Desconto',
      discount: '20%',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-03'),
      status: 'Agendada',
      audience: 'Novos clientes'
    },
    {
      id: 4,
      name: 'Black Friday Metais',
      type: 'Desconto',
      discount: '30%',
      startDate: new Date('2024-11-27'),
      endDate: new Date('2024-11-29'),
      status: 'Agendada',
      audience: 'Todos os clientes'
    },
    {
      id: 5,
      name: 'Promoção de Verão',
      type: 'Frete',
      discount: 'Frete grátis',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      status: 'Encerrada',
      audience: 'Clientes Premium'
    }
  ];

  // Filter promotions based on search term and active tab
  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         promo.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && promo.status === 'Ativa';
    if (activeTab === 'scheduled') return matchesSearch && promo.status === 'Agendada';
    if (activeTab === 'finished') return matchesSearch && promo.status === 'Encerrada';
    
    return matchesSearch;
  });

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Promoções</h1>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Promoção
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Promoções</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{promotions.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-green-500" />
                    Promoções Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {promotions.filter(p => p.status === 'Ativa').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                    Promoções Agendadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {promotions.filter(p => p.status === 'Agendada').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <PercentIcon className="mr-2 h-4 w-4 text-purple-500" />
                    Desconto Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">18%</div>
                </CardContent>
              </Card>
            </div>

            {/* Promotions Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Lista de Promoções</CardTitle>
                    <CardDescription>
                      Gerencie todas as suas promoções e ofertas especiais
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                      <Input
                        placeholder="Buscar promoções..."
                        className="pl-8 w-full md:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    
                    <Tabs 
                      defaultValue="active" 
                      className="w-full md:w-auto" 
                      onValueChange={setActiveTab}
                      value={activeTab}
                    >
                      <TabsList className="grid grid-cols-4 w-full md:w-auto">
                        <TabsTrigger value="all">Todas</TabsTrigger>
                        <TabsTrigger value="active">Ativas</TabsTrigger>
                        <TabsTrigger value="scheduled">Agendadas</TabsTrigger>
                        <TabsTrigger value="finished">Encerradas</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Desconto</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Fim</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Público</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromotions.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell>{promo.id}</TableCell>
                        <TableCell className="font-medium">{promo.name}</TableCell>
                        <TableCell>{promo.type}</TableCell>
                        <TableCell>{promo.discount}</TableCell>
                        <TableCell>{format(promo.startDate, "dd/MM/yyyy")}</TableCell>
                        <TableCell>{format(promo.endDate, "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              promo.status === 'Ativa' 
                                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                : promo.status === 'Agendada'
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            )}
                          >
                            {promo.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{promo.audience}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500">
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Schedule Calendar */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Calendário de Promoções
                  </CardTitle>
                  <CardDescription>
                    Visualize as datas e períodos de todas as suas promoções
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border p-3 pointer-events-auto"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="font-medium mb-4">Eventos Próximos</h3>
                      <div className="space-y-4">
                        {promotions
                          .filter(p => p.status !== 'Encerrada')
                          .map((promo, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-3 rounded-md border">
                              <div className={cn(
                                "w-2 h-12 rounded-full",
                                promo.status === 'Ativa' ? "bg-green-500" : "bg-blue-500"
                              )} />
                              <div className="flex-1">
                                <div className="font-medium">{promo.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {format(promo.startDate, "dd/MM/yyyy")} - {format(promo.endDate, "dd/MM/yyyy")}
                                </div>
                              </div>
                              <Badge variant="outline">{promo.discount}</Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notification Templates */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BellRing className="mr-2 h-5 w-5" />
                    Notificação de Promoções
                  </CardTitle>
                  <CardDescription>
                    Configure mensagens automáticas para promoções
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="font-medium mb-2">Notificação de Início</div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Mensagem automática enviada quando uma promoção começa.
                      </p>
                      <Button variant="outline" size="sm">Configurar Template</Button>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="font-medium mb-2">Lembrete de Término</div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Mensagem automática enviada 24h antes do fim da promoção.
                      </p>
                      <Button variant="outline" size="sm">Configurar Template</Button>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="font-medium mb-2">Promoções Exclusivas</div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Mensagem personalizada para clientes VIP.
                      </p>
                      <Button variant="outline" size="sm">Configurar Template</Button>
                    </div>
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

export default Promotions;
