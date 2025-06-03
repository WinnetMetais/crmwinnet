
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Filter, Download } from "lucide-react";

export const CashFlowManager = () => {
  const [viewPeriod, setViewPeriod] = useState('month');

  // Dados do fluxo de caixa baseados na planilha
  const cashFlowData = [
    {
      id: 1,
      date: '02/jan',
      description: 'Anuidade',
      category: 'Despesa Fixa',
      type: 'SAIDA',
      value: -22.00,
      status: 'Pago',
      method: 'Débito Automático'
    },
    {
      id: 2,
      date: '05/mai',
      description: 'Venda - Melhor Envio',
      category: 'Receita',
      type: 'ENTRADA',
      value: 30.83,
      status: 'Recebido',
      method: 'PIX'
    },
    {
      id: 3,
      date: '07/mai',
      description: 'Venda - Produto',
      category: 'Receita',
      type: 'ENTRADA',
      value: 4.85,
      status: 'Recebido',
      method: 'Débito Automático'
    },
    {
      id: 4,
      date: '09/mai',
      description: 'Imposto de Renda',
      category: 'Despesa Fixa',
      type: 'SAIDA',
      value: -184.00,
      status: 'Pendente',
      method: 'PIX'
    },
    {
      id: 5,
      date: '12/mai',
      description: 'Transferência',
      category: 'Movimentação',
      type: 'ENTRADA',
      value: 1218.43,
      status: 'Recebido',
      method: 'Transferência'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recebido':
      case 'Pago':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Atrasado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'ENTRADA' 
      ? 'text-green-600 font-semibold' 
      : 'text-red-600 font-semibold';
  };

  return (
    <div className="space-y-6">
      {/* Controles e Filtros */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Controle de Fluxo de Caixa</CardTitle>
            <div className="flex space-x-3">
              <Select defaultValue="month" onValueChange={setViewPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Entrada
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <div className="text-lg font-bold text-green-600">R$ 1.254,11</div>
              <div className="text-sm text-muted-foreground">Total Entradas</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-red-50">
              <div className="text-lg font-bold text-red-600">R$ 206,00</div>
              <div className="text-sm text-muted-foreground">Total Saídas</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <div className="text-lg font-bold text-blue-600">R$ 1.048,11</div>
              <div className="text-sm text-muted-foreground">Saldo Líquido</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-purple-50">
              <div className="text-lg font-bold text-purple-600">R$ 26.508,14</div>
              <div className="text-sm text-muted-foreground">Saldo Acumulado</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashFlowData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.date}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <span className={getTypeColor(item.type)}>
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getTypeColor(item.type)}>
                      R$ {Math.abs(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm">
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Formulário de Nova Entrada */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Movimentação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Data</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa-fixa">Despesa Fixa</SelectItem>
                  <SelectItem value="despesa-variavel">Despesa Variável</SelectItem>
                  <SelectItem value="investimento">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Input placeholder="Ex: Venda de produto" />
            </div>
            <div>
              <label className="text-sm font-medium">Valor</label>
              <Input type="number" placeholder="0,00" step="0.01" />
            </div>
            <div>
              <label className="text-sm font-medium">Método de Pagamento</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="debito">Débito Automático</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>Adicionar Movimentação</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
