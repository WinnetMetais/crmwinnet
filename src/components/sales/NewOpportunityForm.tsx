
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { Plus, DollarSign } from "lucide-react";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { QuoteForm } from "@/components/sales/QuoteForm";
import { CustomerFormData } from "@/types/customer";
import { ClientTab } from "@/components/sales/opportunity/ClientTab";
import { OpportunityTab } from "@/components/sales/opportunity/OpportunityTab";
import { ProductsTab } from "@/components/sales/opportunity/ProductsTab";
import { ActionsTab } from "@/components/sales/opportunity/ActionsTab";
import { toast } from "@/hooks/use-toast";
import { useCreateOpportunity } from "@/hooks/useOpportunities";
import { createOpportunityItem } from "@/services/opportunities";

interface OpportunityItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
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
    opportunityTitle: 'Venda de Produto',
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

  const createOpportunityMutation = useCreateOpportunity();

  const updateFormData = (updates: Partial<OpportunityFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleCustomerSubmit = (customerData: CustomerFormData) => {
    updateFormData({
      customerId: Date.now().toString(),
      clientName: customerData.name,
      clientEmail: customerData.email,
      clientPhone: customerData.phone,
      clientAddress: customerData.address,
      clientCnpj: customerData.cnpj,
      leadSource: customerData.leadSource
    });
    
    setShowCustomerForm(false);
    setIsNewCustomer(false);
    
    toast({
      title: "Cliente Cadastrado",
      description: "Cliente foi cadastrado e vinculado à oportunidade!",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.clientName) {
      toast({
        title: "Cliente obrigatório",
        description: "Selecione ou cadastre um cliente para continuar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Criar a oportunidade
      const opportunityData = {
        customer_id: formData.customerId,
        title: formData.opportunityTitle,
        description: formData.notes,
        value: formData.total,
        stage: formData.stage,
        probability: formData.probability,
        expected_close_date: formData.expectedCloseDate || null,
        lead_source: formData.leadSource,
        assigned_to: formData.assignedTo,
        status: 'active',
        created_by: 'Usuário Atual'
      };

      const opportunity = await createOpportunityMutation.mutateAsync(opportunityData);
      
      if (opportunity && formData.items.length > 0) {
        // Criar itens da oportunidade
        for (const item of formData.items) {
          await createOpportunityItem({
            opportunity_id: opportunity.id,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            total: item.total
          });
        }
      }

      if (formData.generateQuote && formData.items.length > 0) {
        setShowQuoteForm(true);
        return;
      }
      
      toast({
        title: "Oportunidade Criada",
        description: "A nova oportunidade foi cadastrada com sucesso!",
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
    }
  };

  const generateQuote = () => {
    updateFormData({ generateQuote: true });
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
                  <ClientTab
                    formData={formData}
                    onUpdateData={updateFormData}
                    onNewCustomer={() => {
                      setIsNewCustomer(true);
                      setShowCustomerForm(true);
                    }}
                  />
                </TabsContent>

                <TabsContent value="opportunity" className="space-y-6 mt-6">
                  <OpportunityTab
                    formData={{
                      opportunityTitle: formData.opportunityTitle,
                      estimatedValue: formData.estimatedValue,
                      stage: formData.stage,
                      probability: formData.probability,
                      expectedCloseDate: formData.expectedCloseDate,
                      leadSource: formData.leadSource,
                      assignedTo: formData.assignedTo
                    }}
                    onUpdateData={updateFormData}
                  />
                </TabsContent>

                <TabsContent value="products" className="space-y-6 mt-6">
                  <ProductsTab
                    formData={formData}
                    onUpdateData={updateFormData}
                  />
                </TabsContent>

                <TabsContent value="actions" className="space-y-6 mt-6">
                  <ActionsTab
                    formData={formData}
                    onUpdateData={updateFormData}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-6 mt-6 border-t">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={createOpportunityMutation.isPending}
                >
                  {createOpportunityMutation.isPending ? 'Criando...' : 'Criar Oportunidade'}
                </Button>
                {formData.items.length > 0 && (
                  <Button type="button" variant="outline" onClick={generateQuote}>
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

      {/* Modal de Orçamento */}
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
