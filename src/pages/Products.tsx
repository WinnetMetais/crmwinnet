
import React, { useState, useEffect } from 'react';
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
  ArrowUpDown, 
  Edit, 
  Trash2,
  TrendingUp,
  AlertTriangle 
} from "lucide-react";
import { Product, getProducts, deleteProduct, getMarginOptions } from "@/services/products";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const marginOptions = getMarginOptions();

  // Filter products based on search term and selected tab
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'available') return matchesSearch && product.active && (product.inventory_count || 0) > (product.min_stock || 0);
    if (selectedTab === 'lowStock') return matchesSearch && product.active && (product.inventory_count || 0) <= (product.min_stock || 0) && (product.inventory_count || 0) > 0;
    if (selectedTab === 'outOfStock') return matchesSearch && ((product.inventory_count || 0) === 0);
    
    return matchesSearch;
  });

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover o produto "${name}"?`)) {
      const success = await deleteProduct(id);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    }
  };

  const getStockStatus = (product: Product) => {
    const stock = product.inventory_count || 0;
    const minStock = product.min_stock || 0;
    
    if (stock === 0) return { label: 'Sem Estoque', variant: 'destructive' as const };
    if (stock <= minStock) return { label: 'Baixo Estoque', variant: 'outline' as const };
    return { label: 'Disponível', variant: 'default' as const };
  };

  // Categories summary for the cards
  const categorySummary = products.reduce((acc: any, product: Product) => {
    if (!product.category) return acc;
    
    if (!acc[product.category]) {
      acc[product.category] = { count: 0, value: 0 };
    }
    
    acc[product.category].count += 1;
    acc[product.category].value += (product.cost_price || 0) * (product.inventory_count || 0);
    
    return acc;
  }, {});

  const categoryCards = Object.entries(categorySummary).map(([category, data]: [string, any]) => ({
    name: category,
    count: data.count,
    value: `R$ ${data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }));

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
              {categoryCards.slice(0, 4).map((category, index) => (
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
                      Gerencie seu catálogo de metais e ligas com margens de lucro automáticas
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
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Carregando produtos...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Custo
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Margens</TableHead>
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
                          <TableCell colSpan={9} className="text-center py-10">
                            <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">Nenhum produto encontrado</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product: Product) => {
                          const stockStatus = getStockStatus(product);
                          return (
                            <TableRow key={product.id}>
                              <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  {product.description && (
                                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                      {product.description}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell className="text-sm">{product.supplier}</TableCell>
                              <TableCell>
                                {product.cost_price ? `R$ ${product.cost_price.toFixed(2)}` : '-'}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1 text-xs">
                                  {product.cost_price && (
                                    <>
                                      <div className="flex justify-between">
                                        <span>60%:</span>
                                        <span className="font-medium">R$ {(product.margin_60 || 0).toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>70%:</span>
                                        <span className="font-medium">R$ {(product.margin_70 || 0).toFixed(2)}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <span>{product.inventory_count || 0}</span>
                                  <span className="text-xs text-muted-foreground">{product.unit}</span>
                                  {(product.inventory_count || 0) <= (product.min_stock || 0) && (
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={stockStatus.variant}
                                  className={
                                    stockStatus.variant === 'default'
                                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                      : stockStatus.variant === 'outline'
                                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100'
                                      : ''
                                  }
                                >
                                  {stockStatus.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button size="icon" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Products;
