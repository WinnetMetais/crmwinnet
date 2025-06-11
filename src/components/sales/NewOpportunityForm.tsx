import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Download, Calculator, User, FileText, DollarSign, Truck } from "lucide-react";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { QuoteForm } from "@/components/sales/QuoteForm";
import { CustomerFormData } from "@/types/customer";
import { toast } from "@/hooks/use-toast";

interface OpportunityItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface OpportunityFormData {
  // Cliente
  customerId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCnpj: string;
  
  // Oportunidade
  opportunityTitle: string;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  
  // Comercial
  estimatedValue: number;
  leadSource: string;
  assignedTo: string;
  
  // Orçamento
  generateQuote: boolean;
  items: OpportunityItem[];
  subtotal: number;
  freight: number;
  discount: number;
  total: number;
  
  // Observações
  notes: string;
  nextAction: string;
  nextActionDate: string;
}

export const NewOpportunityForm = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('client');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  
  const [formData, setFormData] = useState<OpportunityFormData>({
    customerId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientCnpj: '',
    opportunityTitle: 'Venda de Produto', // Valor padrão
    stage: 'prospecto',
    probability: 20,
    expectedCloseDate: '',
    estimatedValue: 0,
    leadSource: '',
    assignedTo: '',
    generateQuote: false,
    items: [],
    subtotal: 0,
    freight: 0,
    discount: 0,
    total: 0,
    notes: '',
    nextAction: '',
    nextActionDate: ''
  });

  const handleCustomerSubmit = (customerData: CustomerFormData) => {
    // Integrar dados do cliente na oportunidade
    setFormData(prev => ({
      ...prev,
      customerId: Date.now().toString(), // Simulando ID
      clientName: customerData.name,
      clientEmail: customerData.email,
      clientPhone: customerData.phone,
      clientAddress: customerData.address,
      clientCnpj: customerData.cnpj,
      leadSource: customerData.leadSource
    }));
    
    setShowCustomerForm(false);
    setIsNewCustomer(false);
    
    toast({
      title: "Cliente Cadastrado",
      description: "Cliente foi cadastrado e vinculado à oportunidade!",
    });
  };

  const addItem = () => {
    const newItem: OpportunityItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit: 'kg',
      unitPrice: 0,
      total: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id: string, field: keyof OpportunityItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
    calculateTotals();
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    calculateTotals();
  };

  const calculateTotals = () => {
    setTimeout(() => {
      setFormData(prev => {
        const subtotal = prev.items.reduce((sum, item) => sum + item.total, 0);
        const discountAmount = subtotal * (prev.discount / 100);
        const total = subtotal - discountAmount + prev.freight;
        
        return {
          ...prev,
          subtotal,
          total,
          estimatedValue: total
        };
      });
    }, 0);
  };

  const handleFreightChange = (freight: number) => {
    setFormData(prev => ({ ...prev, freight }));
    calculateTotals();
  };

  const handleDiscountChange = (discount: number) => {
    setFormData(prev => ({ ...prev, discount }));
    calculateTotals();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova oportunidade:', formData);
    
    if (formData.generateQuote && formData.items.length > 0) {
      setShowQuoteForm(true);
      return;
    }
    
    toast({
      title: "Oportunidade Criada",
      description: "A nova oportunidade foi cadastrada com sucesso!",
    });
    onClose();
  };

  const generateQuote = () => {
    setFormData(prev => ({ ...prev, generateQuote: true }));
    setShowQuoteForm(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Nova Oportunidade de Venda
              </div>
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">✕</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="client">Cliente</TabsTrigger>
                  <TabsTrigger value="opportunity">Oportunidade</TabsTrigger>
                  <TabsTrigger value="products">Produtos</TabsTrigger>
                  <TabsTrigger value="actions">Ações</TabsTrigger>
                </TabsList>

                <TabsContent value="client" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Dados do Cliente</h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsNewCustomer(true);
                          setShowCustomerForm(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Cliente
                      </Button>
                      <Button type="button" variant="outline">
                        Buscar Cliente
                      </Button>
                    </div>
                  </div>

                  {formData.clientName ? (
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{formData.clientName}</h4>
                          <p className="text-sm text-gray-600">{formData.clientEmail}</p>
                          <p className="text-sm text-gray-600">{formData.clientPhone}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Cliente Selecionado
                        </Badge>
                      </div>
                    </Card>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum cliente selecionado</p>
                      <p className="text-sm">Cadastre um novo cliente ou busque um existente</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="opportunity" className="space-y-6 mt-6">
                  <h3 className="text-lg font-medium">Informações da Oportunidade</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="opportunityTitle">Título da Oportunidade *</Label>
                      <Select value={formData.opportunityTitle} onValueChange={(value) => setFormData(prev => ({ ...prev, opportunityTitle: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de oportunidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Venda de Produto">Venda de Produto</SelectItem>
                          <SelectItem value="Venda de Serviço">Venda de Serviço</SelectItem>
                          <SelectItem value="Fornecimento de Material">Fornecimento de Material</SelectItem>
                          <SelectItem value="Projeto Customizado">Projeto Customizado</SelectItem>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedValue">Valor Estimado (R$)</Label>
                      <Input
                        id="estimatedValue"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.estimatedValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stage">Estágio</Label>
                      <Select value={formData.stage} onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
                        <SelectTrigger>
                          <SelectValue />
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
                    <div className="space-y-2">
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
                    <div className="space-y-2">
                      <Label htmlFor="expectedCloseDate">Data Prevista Fechamento</Label>
                      <Input
                        id="expectedCloseDate"
                        type="date"
                        value={formData.expectedCloseDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leadSource">Origem do Lead</Label>
                      <Select value={formData.leadSource} onValueChange={(value) => setFormData(prev => ({ ...prev, leadSource: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Como nos conheceu?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="site">Site</SelectItem>
                          <SelectItem value="google">Google Ads</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="indicacao">Indicação</SelectItem>
                          <SelectItem value="mercado-livre">Mercado Livre</SelectItem>
                          <SelectItem value="visita-externa">Visita Externa</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Responsável</Label>
                      <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ketellyn-lira">Ketellyn Lira</SelectItem>
                          <SelectItem value="evandro-pacheco">Evandro Pacheco</SelectItem>
                          <SelectItem value="dianna-guarnier">Dianna Guarnier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="products" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Produtos/Serviços</h3>
                    <Button type="button" onClick={addItem} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Item
                    </Button>
                  </div>

                  {formData.items.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="md:col-span-2 space-y-2">
                          <Label>Descrição *</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Ex: Chapa de aço inox 304"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantidade</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unidade</Label>
                          <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="ton">Tonelada</SelectItem>
                              <SelectItem value="m">Metro</SelectItem>
                              <SelectItem value="m2">Metro²</SelectItem>
                              <SelectItem value="pc">Peça</SelectItem>
                              <SelectItem value="un">Unidade</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Preço Unit. (R$)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Badge variant="secondary">
                              Total: R$ {item.total.toFixed(2)}
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Seção de Frete e Desconto */}
                  <Card className="p-4 bg-gray-50">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Frete e Desconto
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Valor do Frete (R$)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.freight}
                          onChange={(e) => handleFreightChange(parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Desconto (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={formData.discount}
                          onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Resumo dos Valores */}
                  {formData.items.length > 0 && (
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal dos Produtos:</span>
                          <span className="font-medium">R$ {formData.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frete:</span>
                          <span className="font-medium">R$ {formData.freight.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Desconto ({formData.discount}%):</span>
                          <span className="font-medium text-red-600">
                            - R$ {(formData.subtotal * (formData.discount / 100)).toFixed(2)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold text-blue-900">
                          <span className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            Valor Total:
                          </span>
                          <span>R$ {formData.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="space-y-6 mt-6">
                  <h3 className="text-lg font-medium">Próximas Ações</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nextAction">Próxima Ação</Label>
                      <Input
                        id="nextAction"
                        value={formData.nextAction}
                        onChange={(e) => setFormData(prev => ({ ...prev, nextAction: e.target.value }))}
                        placeholder="Ex: Enviar orçamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextActionDate">Data da Próxima Ação</Label>
                      <Input
                        id="nextActionDate"
                        type="date"
                        value={formData.nextActionDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, nextActionDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Informações adicionais sobre a oportunidade..."
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-6 mt-6 border-t">
                <Button type="submit" className="flex-1">
                  Criar Oportunidade
                </Button>
                {formData.items.length > 0 && (
                  <Button type="button" variant="outline" onClick={generateQuote}>
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Orçamento
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Cadastro de Cliente */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CustomerForm
              onSubmit={handleCustomerSubmit}
              onCancel={() => setShowCustomerForm(false)}
              mode="create"
            />
          </div>
        </div>
      )}

      {/* Modal de Orçamento com dados atualizados */}
      {showQuoteForm && (
        <QuoteForm
          onClose={() => setShowQuoteForm(false)}
          initialData={{
            customerName: formData.clientName,
            customerEmail: formData.clientEmail,
            customerPhone: formData.clientPhone,
            customerAddress: formData.clientAddress,
            customerCnpj: formData.clientCnpj,
            items: formData.items.map(item => ({
              ...item,
              code: ''
            })),
            subtotal: formData.subtotal,
            discount: formData.discount,
            total: formData.total,
            notes: `Frete: R$ ${formData.freight.toFixed(2)}\n${formData.notes}`.trim()
          }}
        />
      )}
    </>
  );
};

export default NewOpportunityForm;
