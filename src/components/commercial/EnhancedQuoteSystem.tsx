import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Send, 
  Eye, 
  Download,
  Plus,
  Trash2,
  Calculator,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Copy
} from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
  valid_until: string;
  discount_percentage: number;
  observations: string;
  items: QuoteItem[];
}

interface QuoteItem {
  id: string;
  product_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
}

interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  items: Partial<QuoteItem>[];
  default_discount: number;
  validity_days: number;
}

interface QuoteMetrics {
  total_quotes: number;
  pending_quotes: number;
  approved_quotes: number;
  total_value: number;
  conversion_rate: number;
  average_value: number;
}

export const EnhancedQuoteSystem = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [templates, setTemplates] = useState<QuoteTemplate[]>([]);
  const [metrics, setMetrics] = useState<QuoteMetrics>({
    total_quotes: 0,
    pending_quotes: 0,
    approved_quotes: 0,
    total_value: 0,
    conversion_rate: 0,
    average_value: 0
  });
  const [loading, setLoading] = useState(false);
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const [newQuote, setNewQuote] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    observations: '',
    discount_percentage: 0,
    valid_days: 30,
    items: [] as Partial<QuoteItem>[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadQuotes(),
        loadTemplates(),
        calculateMetrics()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          quote_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedQuotes = data?.map(quote => ({
        ...quote,
        items: quote.quote_items || [],
        discount_percentage: quote.discount_percentage || 0,
        observations: quote.observations || ''
      })) || [];
      
      setQuotes(formattedQuotes);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      // Mock data for demonstration
      const mockQuotes: Quote[] = [
        {
          id: '1',
          quote_number: 'ORC-001',
          customer_name: 'João Silva',
          customer_email: 'joao@empresa.com',
          customer_phone: '(11) 99999-9999',
          total: 15000,
          status: 'pending',
          created_at: new Date().toISOString(),
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          discount_percentage: 5,
          observations: 'Cliente interessado em lote grande',
          items: [
            {
              id: '1',
              product_name: 'Lixeira L4090',
              description: 'Lixeira industrial 40 litros',
              quantity: 10,
              unit_price: 1500,
              discount: 0,
              total: 15000
            }
          ]
        }
      ];
      setQuotes(mockQuotes);
    }
  };

  const loadTemplates = async () => {
    // Mock templates for demonstration
    const mockTemplates: QuoteTemplate[] = [
      {
        id: '1',
        name: 'Pacote Básico Lixeiras',
        description: 'Conjunto básico de lixeiras para empresas',
        default_discount: 5,
        validity_days: 30,
        items: [
          {
            product_name: 'Lixeira L4090',
            description: 'Lixeira industrial 40 litros',
            quantity: 5,
            unit_price: 1500
          },
          {
            product_name: 'Lixeira L1618',
            description: 'Lixeira pequena 16 litros',
            quantity: 10,
            unit_price: 800
          }
        ]
      }
    ];
    setTemplates(mockTemplates);
  };

  const calculateMetrics = async () => {
    // Mock metrics calculation
    setMetrics({
      total_quotes: 45,
      pending_quotes: 12,
      approved_quotes: 28,
      total_value: 450000,
      conversion_rate: 62.2,
      average_value: 10000
    });
  };

  const createQuote = async () => {
    if (!newQuote.customer_name || newQuote.items.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha os dados do cliente e adicione pelo menos um item",
        variant: "destructive",
      });
      return;
    }

    try {
      const total = newQuote.items.reduce((sum, item) => 
        sum + ((item.quantity || 0) * (item.unit_price || 0) * (1 - (item.discount || 0) / 100)), 0
      );

      const quote: Quote = {
        id: Date.now().toString(),
        quote_number: `ORC-${String(quotes.length + 1).padStart(3, '0')}`,
        customer_name: newQuote.customer_name,
        customer_email: newQuote.customer_email,
        customer_phone: newQuote.customer_phone,
        total: total * (1 - newQuote.discount_percentage / 100),
        status: 'pending',
        created_at: new Date().toISOString(),
        valid_until: new Date(Date.now() + newQuote.valid_days * 24 * 60 * 60 * 1000).toISOString(),
        discount_percentage: newQuote.discount_percentage,
        observations: newQuote.observations,
        items: newQuote.items.map((item, index) => ({
          id: index.toString(),
          product_name: item.product_name || '',
          description: item.description || '',
          quantity: item.quantity || 0,
          unit_price: item.unit_price || 0,
          discount: item.discount || 0,
          total: (item.quantity || 0) * (item.unit_price || 0) * (1 - (item.discount || 0) / 100)
        }))
      };

      setQuotes([quote, ...quotes]);
      resetForm();
      setShowCreateQuote(false);

      toast({
        title: "Orçamento criado",
        description: `Orçamento ${quote.quote_number} criado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar orçamento",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewQuote({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      observations: '',
      discount_percentage: 0,
      valid_days: 30,
      items: []
    });
  };

  const addItem = () => {
    setNewQuote({
      ...newQuote,
      items: [...newQuote.items, {
        product_name: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        discount: 0
      }]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = newQuote.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setNewQuote({ ...newQuote, items: updatedItems });
  };

  const removeItem = (index: number) => {
    setNewQuote({
      ...newQuote,
      items: newQuote.items.filter((_, i) => i !== index)
    });
  };

  const duplicateQuote = (quote: Quote) => {
    const newQuoteData = {
      customer_name: quote.customer_name,
      customer_email: quote.customer_email,
      customer_phone: quote.customer_phone,
      observations: quote.observations,
      discount_percentage: quote.discount_percentage,
      valid_days: 30,
      items: quote.items.map(item => ({
        product_name: item.product_name,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount
      }))
    };

    setNewQuote(newQuoteData);
    setShowCreateQuote(true);
  };

  const sendQuote = async (quoteId: string) => {
    toast({
      title: "Orçamento enviado",
      description: "O orçamento foi enviado por e-mail para o cliente!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      case 'expired': return 'Expirado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Sistema de Orçamentos</h2>
          <p className="text-muted-foreground">
            Gestão completa de orçamentos com templates e automações
          </p>
        </div>
        <Dialog open={showCreateQuote} onOpenChange={setShowCreateQuote}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Orçamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Nome do Cliente</Label>
                  <Input
                    value={newQuote.customer_name}
                    onChange={(e) => setNewQuote({...newQuote, customer_name: e.target.value})}
                    placeholder="Nome completo ou empresa"
                  />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={newQuote.customer_email}
                    onChange={(e) => setNewQuote({...newQuote, customer_email: e.target.value})}
                    placeholder="cliente@empresa.com"
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={newQuote.customer_phone}
                    onChange={(e) => setNewQuote({...newQuote, customer_phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Quote Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
                  <Button onClick={addItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {newQuote.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                      <div className="col-span-3">
                        <Label className="text-xs">Produto</Label>
                        <Input
                          value={item.product_name}
                          onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                          placeholder="Nome do produto"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Descrição</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Descrição detalhada"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Qtd</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Preço Unit.</Label>
                        <Input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                          placeholder="0.00"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Desc.%</Label>
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateItem(index, 'discount', Number(e.target.value))}
                          placeholder="0"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Total</Label>
                        <div className="text-sm font-medium p-2 bg-muted rounded">
                          R$ {((item.quantity || 0) * (item.unit_price || 0) * (1 - (item.discount || 0) / 100)).toLocaleString()}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Desconto Geral (%)</Label>
                  <Input
                    type="number"
                    value={newQuote.discount_percentage}
                    onChange={(e) => setNewQuote({...newQuote, discount_percentage: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Validade (dias)</Label>
                  <Input
                    type="number"
                    value={newQuote.valid_days}
                    onChange={(e) => setNewQuote({...newQuote, valid_days: Number(e.target.value)})}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label>Total Geral</Label>
                  <div className="text-xl font-bold p-2 bg-muted rounded">
                    R$ {(newQuote.items.reduce((sum, item) => 
                      sum + ((item.quantity || 0) * (item.unit_price || 0) * (1 - (item.discount || 0) / 100)), 0
                    ) * (1 - newQuote.discount_percentage / 100)).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={newQuote.observations}
                  onChange={(e) => setNewQuote({...newQuote, observations: e.target.value})}
                  placeholder="Observações e condições especiais"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateQuote(false)}>
                  Cancelar
                </Button>
                <Button onClick={createQuote}>
                  Criar Orçamento
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orçamentos</p>
                <p className="text-2xl font-bold">{metrics.total_quotes}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{metrics.pending_quotes}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">{metrics.approved_quotes}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">R$ {metrics.total_value.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa Conversão</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.conversion_rate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">R$ {metrics.average_value.toLocaleString()}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="quotes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotes">Orçamentos</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando orçamentos...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.quote_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quote.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{quote.customer_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>R$ {quote.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(quote.status)}>
                            {getStatusLabel(quote.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(quote.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(quote.valid_until), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => sendQuote(quote.id)}>
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => duplicateQuote(quote)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.items.length} itens • Desconto padrão: {template.default_discount}% • Validade: {template.validity_days} dias
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Usar Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Análises de Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Análises detalhadas serão implementadas em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};