
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Clock, DollarSign, TrendingUp, Search, Filter } from "lucide-react";

interface Negotiation {
  id: string;
  customer: string;
  opportunity: string;
  initialValue: number;
  currentValue: number;
  finalValue?: number;
  status: 'em-andamento' | 'fechada-ganha' | 'fechada-perdida' | 'pausada';
  startDate: string;
  lastActivity: string;
  notes: NegotiationNote[];
  assignedTo: string;
}

interface NegotiationNote {
  id: string;
  date: string;
  author: string;
  content: string;
  type: 'proposta' | 'contraproposta' | 'observacao' | 'decisao';
}

export const NegotiationHistory = () => {
  const [negotiations] = useState<Negotiation[]>([
    {
      id: '1',
      customer: 'Cliente ABC Ltda',
      opportunity: 'Lixeiras Industriais L4090',
      initialValue: 25000,
      currentValue: 22500,
      status: 'em-andamento',
      startDate: '2024-01-10',
      lastActivity: '2024-01-15',
      assignedTo: 'João Silva',
      notes: [
        {
          id: '1',
          date: '2024-01-10',
          author: 'João Silva',
          content: 'Cliente solicitou desconto de 10% devido ao volume.',
          type: 'proposta'
        },
        {
          id: '2',
          date: '2024-01-12',
          author: 'Cliente ABC',
          content: 'Aceita desconto de 10%, mas precisa de prazo de pagamento estendido.',
          type: 'contraproposta'
        }
      ]
    },
    {
      id: '2',
      customer: 'Metalúrgica XYZ',
      opportunity: 'Kit Lixeiras Completo',
      initialValue: 45000,
      currentValue: 42000,
      finalValue: 42000,
      status: 'fechada-ganha',
      startDate: '2024-01-05',
      lastActivity: '2024-01-14',
      assignedTo: 'Maria Santos',
      notes: [
        {
          id: '3',
          date: '2024-01-14',
          author: 'Maria Santos',
          content: 'Negociação fechada com sucesso. Cliente aceitou proposta final.',
          type: 'decisao'
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredNegotiations = negotiations.filter(neg => {
    const matchesSearch = neg.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         neg.opportunity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || neg.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalNegotiations = negotiations.length;
  const activeNegotiations = negotiations.filter(n => n.status === 'em-andamento').length;
  const wonNegotiations = negotiations.filter(n => n.status === 'fechada-ganha').length;
  const avgNegotiationValue = negotiations.reduce((sum, n) => sum + n.currentValue, 0) / negotiations.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em-andamento': return 'bg-blue-100 text-blue-800';
      case 'fechada-ganha': return 'bg-green-100 text-green-800';
      case 'fechada-perdida': return 'bg-red-100 text-red-800';
      case 'pausada': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'proposta': return 'bg-blue-50 border-blue-200';
      case 'contraproposta': return 'bg-orange-50 border-orange-200';
      case 'observacao': return 'bg-gray-50 border-gray-200';
      case 'decisao': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Negociações</p>
                <p className="text-3xl font-bold">{totalNegotiations}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                <p className="text-3xl font-bold">{activeNegotiations}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fechadas</p>
                <p className="text-3xl font-bold">{wonNegotiations}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Médio</p>
                <p className="text-3xl font-bold">R$ {avgNegotiationValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou oportunidade..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border rounded-md px-3 py-2"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="em-andamento">Em Andamento</option>
              <option value="fechada-ganha">Fechada - Ganha</option>
              <option value="fechada-perdida">Fechada - Perdida</option>
              <option value="pausada">Pausada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNegotiations.map((negotiation) => (
          <Card key={negotiation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{negotiation.customer}</CardTitle>
                  <p className="text-sm text-muted-foreground">{negotiation.opportunity}</p>
                </div>
                <Badge className={getStatusColor(negotiation.status)}>
                  {negotiation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Valor Inicial</p>
                  <p className="font-medium">R$ {negotiation.initialValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Atual</p>
                  <p className="font-medium">R$ {negotiation.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Responsável</p>
                  <p className="font-medium">{negotiation.assignedTo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Última Atividade</p>
                  <p className="font-medium">{new Date(negotiation.lastActivity).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Histórico de Negociação</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {negotiation.notes.map((note) => (
                    <div key={note.id} className={`p-3 rounded-lg border ${getNoteTypeColor(note.type)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{note.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {note.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Detalhes
                </Button>
                <Button size="sm" className="flex-1">
                  Adicionar Nota
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
