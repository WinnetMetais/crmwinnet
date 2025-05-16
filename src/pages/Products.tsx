
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Filter, 
  Package, 
  ShoppingCart, 
  Truck, 
  ArrowUpDown, 
  Edit, 
  Trash2 
} from "lucide-react";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Sample product data for Winnet Metais
  const products = [
    {
      id: 1,
      name: 'Aço Carbono ASTM A36',
      category: 'Aço Carbono',
      price: 'R$ 1.850,00',
      stock: 320,
      status: 'Disponível'
    },
    {
      id: 2,
      name: 'Alumínio 6061',
      category: 'Alumínio',
      price: 'R$ 2.450,00',
      stock: 150,
      status: 'Disponível'
    },
    {
      id: 3,
      name: 'Bronze Fosforoso',
      category: 'Bronze',
      price: 'R$ 3.200,00',
      stock: 75,
      status: 'Baixo Estoque'
    },
    {
      id: 4,
      name: 'Aço Inox 304',
      category: 'Aço Inox',
      price: 'R$ 4.100,00',
      stock: 90,
      status: 'Disponível'
    },
    {
      id: 5,
      name: 'Latão CuZn37',
      category: 'Latão',
      price: 'R$ 2.800,00',
      stock: 0,
      status: 'Sem Estoque'
    },
    {
      id: 6,
      name: 'Cobre Eletrolítico',
      category: 'Cobre',
      price: 'R$ 3.950,00',
      stock: 45,
      status: 'Baixo Estoque'
    },
    {
      id: 7,
      name: 'Níquel 200',
      category: 'Níquel',
      price: 'R$ 5.600,00',
      stock: 30,
      status: 'Disponível'
    },
    {
      id: 8,
      name: 'Chapa Galvanizada',
      category: 'Aço Galvanizado',
      price: 'R$ 1.350,00',
      stock: 200,
      status: 'Disponível'
    },
  ];

  // Filter products based on search term and selected tab
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'available') return matchesSearch && product.status === 'Disponível';
    if (selectedTab === 'lowStock') return matchesSearch && product.status === 'Baixo Estoque';
    if (selectedTab === 'outOfStock') return matchesSearch && product.status === 'Sem Estoque';
    
    return matchesSearch;
  });

  // Categories summary for the cards
  const categorySummary = [
    { name: 'Aço Carbono', count: 120, value: 'R$ 220.000,00' },
    { name: 'Aço Inox', count: 85, value: 'R$ 348.500,00' },
    { name: 'Alumínio', count: 150, value: 'R$ 367.500,00' },
    { name: 'Cobre e Latão', count: 45, value: 'R$ 177.300,00' },
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
                <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </Button>
              </div>
            </div>

            {/* Category Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {categorySummary.map((category, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{category.count} itens</div>
                    <p className="text-xs text-muted-foreground mt-1">Valor em estoque: {category.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Lista de Produtos</CardTitle>
                    <CardDescription>
                      Gerencie seu catálogo de metais e ligas
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar produtos..."
                        className="pl-8 w-full md:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Tabs 
                      defaultValue="all" 
                      className="w-full md:w-auto" 
                      onValueChange={setSelectedTab}
                      value={selectedTab}
                    >
                      <TabsList className="grid grid-cols-4 w-full md:w-auto">
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="available">Disponíveis</TabsTrigger>
                        <TabsTrigger value="lowStock">Baixo Estoque</TabsTrigger>
                        <TabsTrigger value="outOfStock">Sem Estoque</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Preço
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Estoque
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Nenhum produto encontrado</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.status === 'Disponível'
                                  ? 'default'
                                  : product.status === 'Baixo Estoque'
                                  ? 'outline'
                                  : 'destructive'
                              }
                              className={
                                product.status === 'Disponível'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : product.status === 'Baixo Estoque'
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100'
                                  : ''
                              }
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Pedidos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">Pedido #{10548 + item}</p>
                          <p className="text-sm text-muted-foreground">3 itens - R$ {(Math.random() * 10000).toFixed(2)}</p>
                        </div>
                        <Badge>Processando</Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">Ver Todos os Pedidos</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Entregas Programadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">Cliente {['ABC', 'XYZ', 'JKL'][item-1]} Ltda.</p>
                          <p className="text-sm text-muted-foreground">Entrega para {['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'][item-1]}</p>
                        </div>
                        <p className="text-sm">{['12/06', '15/06', '18/06'][item-1]}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">Ver Agenda de Entregas</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Reposição de Estoque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Latão CuZn37', 'Bronze Fosforoso', 'Cobre Eletrolítico'].map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{item}</p>
                          <p className="text-sm text-muted-foreground">Abaixo do mínimo</p>
                        </div>
                        <Button size="sm" variant="outline">Pedir</Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">Gerenciar Estoque</Button>
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

export default Products;
