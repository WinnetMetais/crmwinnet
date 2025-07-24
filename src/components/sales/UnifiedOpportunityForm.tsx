import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, DollarSign } from "lucide-react";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { CustomerSelector } from "@/components/customers/CustomerSelector";
import { ProductSelector } from "@/components/products/ProductSelector";
import { QuoteForm } from "@/components/sales/QuoteForm";
import { CustomerFormData } from "@/types/customer";
import { Customer, createCustomer } from "@/services/customers";
import { Product } from "@/services/products";
import { ClientTab } from "./opportunity/ClientTab";
import { OpportunityTab } from "./opportunity/OpportunityTab";
import { ProductsTab } from "./opportunity/ProductsTab";
import { ActionsTab } from "./opportunity/ActionsTab";
import { toast } from "@/hooks/use-toast";
import { useCreateOpportunity } from "@/hooks/useOpportunities";
import { createOpportunityItem } from "@/services/opportunities";
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

interface UnifiedOpportunityFormProps {
  onClose: () => void;
  mode?: 'create' | 'edit';
  initialData?: Record<string, any>;
}

export const UnifiedOpportunityForm = ({ 
  onClose, 
  mode = 'create',
  initialData
}: UnifiedOpportunityFormProps) => {
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    initialData?.customer || null
  );
  
  const queryClient = useQueryClient();
  const createOpportunityMutation = useCreateOpportunity();

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

  const [formData, setFormData] = useState<OpportunityFormData>({
    customerId: initialData?.customer?.id || '',
    customerName: initialData?.customer?.name || '',
    opportunityTitle: initialData?.title || 'Venda de Produto',
    stage: initialData?.stage || 'prospecto',
    probability: initialData?.probability || 20,
    expectedCloseDate: initialData?.expectedCloseDate || '',
    estimatedValue: initialData?.estimatedValue || 0,
    leadSource: initialData?.leadSource || '',
    assignedTo: initialData?.assignedTo || '',
    items: initialData?.items || [],
    notes: initialData?.notes || '',
    nextAction: initialData?.nextAction || '',
    nextActionDate: initialData?.nextActionDate || ''
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
      zip_code: customerData.zip_code,
      cnpj: customerData.cnpj,
      notes: customerData.notes,
      status: customerData.status,
      lead_source: customerData.lead_source,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      toast({
        title: "Cliente obrigatório",
        description: "Selecione ou cadastre um cliente antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.opportunityTitle.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Preencha o título da oportunidade.",
        variant: "destructive"
      });
      return;
    }

    try {
      const opportunityData = {
        customer_id: formData.customerId,
        title: formData.opportunityTitle,
        description: formData.notes,
        value: formData.estimatedValue,
        stage: formData.stage,
        probability: formData.probability,
        expected_close_date: formData.expectedCloseDate || null,
        lead_source: formData.leadSource,
        assigned_to: formData.assignedTo,
        status: 'active',
        created_by: 'Usuário Atual'
      };

      const opportunity = await createOpportunityMutation.mutateAsync(opportunityData);
      
      // Criar itens da oportunidade se existirem
      if (opportunity && formData.items.length > 0) {
        for (const item of formData.items) {
          await createOpportunityItem({
            opportunity_id: opportunity.id,
            description: item.productName,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unitPrice,
            total: item.total
          });
        }
      }
      
      toast({
        title: "Oportunidade Criada",
        description: "A nova oportunidade foi cadastrada com sucesso!",
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar oportunidade. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const generateQuote = () => {
    if (formData.items.length === 0) {
      toast({
        title: "Sem produtos",
        description: "Adicione produtos antes de gerar um orçamento.",
        variant: "destructive"
      });
      return;
    }
    setShowQuoteForm(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6" />
                <h2 className="text-xl font-bold">
                  {mode === 'edit' ? 'Editar Oportunidade' : 'Nova Oportunidade'} - Winnet Metais
                </h2>
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

                <TabsContent value="client">
                  <ClientTab
                    selectedCustomer={selectedCustomer}
                    onSelectCustomer={() => setShowCustomerSelector(true)}
                    onNewCustomer={handleNewCustomer}
                  />
                </TabsContent>

                <TabsContent value="opportunity">
                  <OpportunityTab
                    formData={formData}
                    onUpdateData={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
                  />
                </TabsContent>

                <TabsContent value="products">
                  <ProductsTab
                    items={formData.items}
                    estimatedValue={formData.estimatedValue}
                    onAddProduct={() => setShowProductSelector(true)}
                    onUpdateQuantity={updateItemQuantity}
                    onRemoveItem={removeItem}
                  />
                </TabsContent>

                <TabsContent value="actions">
                  <ActionsTab
                    formData={formData}
                    onUpdateData={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-between items-center space-x-4 mt-6 pt-6 border-t">
                <div className="flex gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createOpportunityMutation.isPending}>
                    {createOpportunityMutation.isPending 
                      ? 'Salvando...' 
                      : mode === 'edit' ? 'Atualizar Oportunidade' : 'Criar Oportunidade'
                    }
                  </Button>
                  {formData.items.length > 0 && (
                    <Button type="button" variant="outline" onClick={generateQuote}>
                      Gerar Orçamento
                    </Button>
                  )}
                </div>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modais */}
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

      {showQuoteForm && selectedCustomer && (
        <QuoteForm
          onClose={() => setShowQuoteForm(false)}
          initialData={{
            customerName: selectedCustomer.name,
            customerEmail: selectedCustomer.email || '',
            customerPhone: selectedCustomer.phone || '',
            customerAddress: selectedCustomer.address || '',
            customerCnpj: selectedCustomer.cnpj || '',
            items: formData.items.map(item => ({
              id: item.id,
              code: item.sku,
              description: item.productName,
              quantity: item.quantity,
              unit: item.unit,
              unitPrice: item.unitPrice,
              total: item.total
            })),
            subtotal: formData.estimatedValue,
            discount: 0,
            total: formData.estimatedValue,
            notes: formData.notes
          }}
        />
      )}
    </>
  );
};