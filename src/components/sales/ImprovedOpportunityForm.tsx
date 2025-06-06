import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, DollarSign, User, Building2, X, Trash2 } from "lucide-react";
import { CustomerSelector } from "@/components/customers/CustomerSelector";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { ProductSelector } from "@/components/products/ProductSelector";
import { Customer, createCustomer } from "@/services/customers";
import { Product } from "@/services/products";
import { CustomerFormData } from "@/types/customer";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface OpportunityItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface OpportunityFormData {
  customerId: string;
  customerName: string;
  opportunityTitle: string;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  estimatedValue: number;
  leadSource: string;
  assignedTo: string;
  items: OpportunityItem[];
  notes: string;
  nextAction: string;
  nextActionDate: string;
}

export const ImprovedOpportunityForm = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('client');
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<OpportunityFormData>({
    customerId: '',
    customerName: '',
    opportunityTitle: '',
    stage: 'prospecto',
    probability: 20,
    expectedCloseDate: '',
    estimatedValue: 0,
    leadSource: '',
    assignedTo: '',
    items: [],
    notes: '',
    nextAction: '',
    nextActionDate: ''
  });

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (newCustomer) => {
      if (newCustomer) {
        setSelectedCustomer(newCustomer);
        setFormData(prev => ({
          ...prev,
          customerId: newCustomer.id,
          customerName: newCustomer.name
        }));
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        setShowCustomerForm(false);
        toast({
          title: "Cliente Cadastrado",
          description: "Cliente foi cadastrado e vinculado à oportunidade!",
        });
      }
    },
  });

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name
    }));
    setShowCustomerSelector(false);
  };

  const handleNewCustomer = () => {
    setShowCustomerSelector(false);
    setShowCustomerForm(true);
  };

  const handleCustomerSubmit = (customerData: CustomerFormData) => {
    const customerToCreate = {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      company: customerData.company,
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      zip_code: customerData.zipCode,
      notes: customerData.notes,
      status: customerData.status,
      lead_source: customerData.leadSource,
      website: customerData.website
    };
    
    createCustomerMutation.mutate(customerToCreate);
  };

  const handleProductSelect = (product: Product, margin: number) => {
    const marginPrice = product.cost_price ? product.cost_price / (1 - margin / 100) : 0;
    
    const newItem: OpportunityItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      sku: product.sku || '',
      quantity: 1,
      unit: product.unit || 'kg',
      unitPrice: marginPrice,
      total: marginPrice
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      estimatedValue: prev.estimatedValue + marginPrice
    }));
    
    setShowProductSelector(false);
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const newTotal = quantity * item.unitPrice;
          return { ...item, quantity, total: newTotal };
        }
        return item;
      })
    }));
    
    // Recalcular valor total
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        estimatedValue: prev.items.reduce((sum, item) => sum + item.total, 0)
      }));
    }, 0);
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      return {
        ...prev,
        items: newItems,
        estimatedValue: newItems.reduce((sum, item) => sum + item.total, 0)
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      toast({
        title: "Cliente obrigatório",
        description: "Selecione ou cadastre um cliente antes de continuar.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Nova oportunidade:', formData);
    
    toast({
      title: "Oportunidade Criada",
      description: "A nova oportunidade foi cadastrada com sucesso!",
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6" />
                <h2 className="text-xl font-bold">Nova Oportunidade - Winnet Metais</h2>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="client" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="client">Cliente</TabsTrigger>
                  <TabsTrigger value="opportunity">Oportunidade</TabsTrigger>
                  <TabsTrigger value="products">Produtos</TabsTrigger>
                  <TabsTrigger value="actions">Ações</TabsTrigger>
                </TabsList>

                <TabsContent value="client" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Dados do Cliente</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCustomerSelector(true)}
                    >
                      Selecionar Cliente
                    </Button>
                  </div>

                  {selectedCustomer ? (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{selectedCustomer.name}</span>
                            </div>
                            {selectedCustomer.company && (
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>{selectedCustomer.company}</span>
                              </div>
                            )}
                            {selectedCustomer.email && (
                              <p className="text-sm text-muted-foreground">
                                {selectedCustomer.email}
                              </p>
                            )}
                            {selectedCustomer.phone && (
                              <p className="text-sm text-muted-foreground">
                                {selectedCustomer.phone}
                              </p>
                            )}
                          </div>
                          <Badge variant="default">
                            Cliente Selecionado
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <User className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Nenhum cliente selecionado
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Clique em "Selecionar Cliente" para escolher ou cadastrar um cliente
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="opportunity" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informações da Oportunidade</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Título da Oportunidade *</Label>
                        <Input
                          id="title"
                          placeholder="Ex: Fornecimento de lixeiras"
                          value={formData.opportunityTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, opportunityTitle: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="estimatedValue">Valor Estimado (R$)</Label>
                        <Input
                          id="estimatedValue"
                          type="number"
                          step="0.01"
                          value={formData.estimatedValue}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="stage">Estágio</Label>
                      <Select value={formData.stage} onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estágio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospecto">Prospecto</SelectItem>
                          <SelectItem value="qualificacao">Qualificação</SelectItem>
                          <SelectItem value="proposta">Proposta</SelectItem>
                          <SelectItem value="negociacao">Negociação</SelectItem>
                          <SelectItem value="fechamento">Fechamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="probability">Probabilidade (%)</Label>
                      <Input
                        id="probability"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.probability}
                        onChange={(e) => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="closeDate">Data Prevista Fechamento</Label>
                      <Input
                        id="closeDate"
                        type="date"
                        value={formData.expectedCloseDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leadSource">Origem do Lead</Label>
                      <Select value={formData.leadSource} onValueChange={(value) => setFormData(prev => ({ ...prev, leadSource: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Como nos conheceu?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="site">Site</SelectItem>
                          <SelectItem value="google-ads">Google Ads</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="indicacao">Indicação</SelectItem>
                          <SelectItem value="mercado-livre">Mercado Livre</SelectItem>
                          <SelectItem value="visita-externa">Visita Externa</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="assignedTo">Responsável</Label>
                      <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carlos-silva">Carlos Silva</SelectItem>
                          <SelectItem value="ana-oliveira">Ana Oliveira</SelectItem>
                          <SelectItem value="joao-santos">João Santos</SelectItem>
                          <SelectItem value="maria-costa">Maria Costa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Produtos/Serviços</h3>
                    <Button 
                      type="button" 
                      onClick={() => setShowProductSelector(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  </div>

                  {formData.items.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Nenhum produto adicionado
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Clique em "Adicionar Produto" para incluir itens no orçamento
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.items.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                              <div className="md:col-span-2">
                                <Label className="text-sm font-medium">
                                  {item.productName}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  SKU: {item.sku}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs">
                                  Qtd
                                </Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">
                                  Unidade
                                </Label>
                                <p className="text-sm mt-1">
                                  {item.unit}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs">
                                  Preço Unit.
                                </Label>
                                <p className="text-sm mt-1">
                                  R$ {item.unitPrice.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-xs">
                                    Total
                                  </Label>
                                  <p className="text-sm font-medium mt-1">
                                    R$ {item.total.toFixed(2)}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-blue-900">
                              Valor Total: R$ {formData.estimatedValue.toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Próximas Ações</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nextAction">Próxima Ação</Label>
                        <Input
                          id="nextAction"
                          placeholder="Ex: Enviar proposta comercial"
                          value={formData.nextAction}
                          onChange={(e) => setFormData(prev => ({ ...prev, nextAction: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nextActionDate">Data da Próxima Ação</Label>
                        <Input
                          id="nextActionDate"
                          type="date"
                          value={formData.nextActionDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, nextActionDate: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      placeholder="Informações adicionais sobre a oportunidade..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Criar Oportunidade
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {showCustomerSelector && (
        <CustomerSelector
          onSelectCustomer={handleCustomerSelect}
          onNewCustomer={handleNewCustomer}
          onClose={() => setShowCustomerSelector(false)}
          selectedCustomer={selectedCustomer}
        />
      )}

      {showCustomerForm && (
        <CustomerFormModal
          onSubmit={handleCustomerSubmit}
          onCancel={() => setShowCustomerForm(false)}
          mode="create"
        />
      )}

      {showProductSelector && (
        <ProductSelector
          onSelect={handleProductSelect}
          onClose={() => setShowProductSelector(false)}
        />
      )}
    </>
  );
};
