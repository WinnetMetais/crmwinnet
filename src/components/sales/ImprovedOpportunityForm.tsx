import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, DollarSign, User, Building2 } from "lucide-react";
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

  const handleSubmit = (e: React.EventForm) => {
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
      
        
          
            
              
                
                  Nova Oportunidade de Venda
                
                ✕
              
            
          
          
            
              
                
                  Cliente
                  Oportunidade
                  Produtos
                  Ações
                

                
                  
                    Dados do Cliente
                    
                      Trocar Cliente
                    
                  

                  {selectedCustomer ? (
                    
                      
                        
                          
                            
                            {selectedCustomer.name}
                          
                          {selectedCustomer.company && (
                            
                              {selectedCustomer.company}
                            
                          )}
                          {selectedCustomer.email && (
                            
                              {selectedCustomer.email}
                            
                          )}
                          {selectedCustomer.phone && (
                            
                              {selectedCustomer.phone}
                            
                          )}
                        
                        
                          Cliente Selecionado
                        
                      
                    
                  ) : (
                    
                      
                        
                      
                      
                        Nenhum cliente selecionado
                      
                      
                        Clique em "Selecionar Cliente" para escolher ou cadastrar um cliente
                      
                    
                  )}
                

                
                  
                    Informações da Oportunidade
                    
                      Título da Oportunidade *
                      
                        
                        Ex: Fornecimento de lixeiras
                        
                      
                    
                    
                      Valor Estimado (R$)
                      
                        
                        
                        
                        readOnly
                      
                    
                  

                  
                    
                      Estágio
                      
                        
                          
                          
                        
                        
                          Prospecto
                          Qualificação
                          Proposta
                          Negociação
                          Fechamento
                        
                      
                    
                    
                      Probabilidade (%)
                      
                        
                        
                        
                        
                      
                    
                    
                      Data Prevista Fechamento
                      
                        
                        
                        
                      
                    
                  

                  
                    
                      Origem do Lead
                      
                        
                          
                          Como nos conheceu?
                        
                        
                          Site
                          Google Ads
                          Facebook
                          Instagram
                          Indicação
                          Mercado Livre
                          Visita Externa
                          Outros
                        
                      
                    
                    
                      Responsável
                      
                        
                          
                          Selecione o responsável
                        
                        
                          Carlos Silva
                          Ana Oliveira
                          João Santos
                          Maria Costa
                        
                      
                    
                  
                

                
                  
                    Produtos/Serviços
                    
                      
                      Adicionar Produto
                    
                  

                  {formData.items.length === 0 ? (
                    
                      
                        
                      
                      
                        Nenhum produto adicionado
                      
                      
                        Clique em "Adicionar Produto" para incluir itens no orçamento
                      
                    
                  ) : (
                    
                      {formData.items.map((item) => (
                        
                          
                            
                              
                                {item.productName}
                              
                              
                                SKU: {item.sku}
                              
                            
                            
                              
                                Qtd
                              
                              
                                
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="mt-1"
                              
                            
                            
                              
                                Unidade
                              
                              
                                {item.unit}
                              
                            
                            
                              
                                Preço Unit.
                              
                              
                                R$ {item.unitPrice.toFixed(2)}
                              
                            
                            
                              
                                
                                  Total
                                
                                
                                  R$ {item.total.toFixed(2)}
                                
                              
                              
                                Remover
                              
                            
                          
                        
                      ))}

                      
                        
                          
                            
                              Valor Total: R$ {formData.estimatedValue.toFixed(2)}
                            
                          
                        
                      
                    
                  )}
                

                
                  
                    Próximas Ações
                    
                      Próxima Ação
                      
                        
                        Ex: Enviar proposta comercial
                        
                      
                    
                    
                      Data da Próxima Ação
                      
                        
                        
                        
                      
                    
                  

                  
                    Observações
                    
                      
                      Informações adicionais sobre a oportunidade...
                      
                    
                  
                
              

              
                
                  Criar Oportunidade
                
                
                  Cancelar
                
              
            
          
        
      

      {showCustomerSelector && (
        
          
            
              
              
              
              
            
          
        
      )}

      {showCustomerForm && (
        
          
            
              
              
              
            
          
        
      )}

      {showProductSelector && (
        
          
            
              
            
          
        
      )}
    </>
  );
};
