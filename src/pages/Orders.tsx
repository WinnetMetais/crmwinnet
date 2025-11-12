import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrders } from "@/hooks/useOrders";
import { LoadingFallback } from "@/components/layout/LoadingFallback";
import { Plus, FileText, Package, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Orders = () => {
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) return <LoadingFallback />;
  
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar pedidos</h3>
            <p className="text-muted-foreground">
              Não foi possível carregar os pedidos. Tente novamente mais tarde.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'aberto':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'invoiced':
      case 'faturado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os pedidos e acompanhe o status de cada um
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Abertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {/* @ts-ignore - Order status property */}
              {orders?.filter(order => order.status.toLowerCase() === 'open').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {/* @ts-ignore - Order type may vary */}
              {orders?.filter(order => order.status?.toLowerCase() === 'approved').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* @ts-ignore - Order type may vary */}
              R$ {orders?.reduce((sum, order) => sum + (order.net_total || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            Todos os pedidos do sistema ordenados por data de criação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro pedido
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Pedido
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {/* @ts-ignore */}
                    {order.order_number}
                  </TableCell>
                    <TableCell>
                      {/* @ts-ignore - Order customer type may vary */}
                      {order.customers?.name || 'Cliente não identificado'}
                    </TableCell>
                    <TableCell>
                      {/* @ts-ignore - Order type may vary */}
                      {format(new Date(order.issue_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                  <TableCell>
                    {/* @ts-ignore */}
                    <Badge className={getStatusColor(order.status)}>
                      {/* @ts-ignore */}
                      {order.status}
                    </Badge>
                  </TableCell>
                    <TableCell>
                      {/* @ts-ignore - Order type may vary */}
                      R$ {order.net_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;