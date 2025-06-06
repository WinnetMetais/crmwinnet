
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, X } from "lucide-react";
import { CustomerSelector } from "@/components/customers/CustomerSelector";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { ProductSelector } from "@/components/products/ProductSelector";
import { ClientTab } from "./opportunity/ClientTab";
import { OpportunityTab } from "./opportunity/OpportunityTab";
import { ProductsTab } from "./opportunity/ProductsTab";
import { ActionsTab } from "./opportunity/ActionsTab";
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

                <TabsContent value="client">
                  <ClientTab
                    selectedCustomer={selectedCustomer}
                    onSelectCustomer={() => setShowCustomerSelector(true)}
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
