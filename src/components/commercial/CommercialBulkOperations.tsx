
import React, { useState, useEffect } from 'react';
import { BulkOperations } from "@/components/shared/BulkOperations";
import { ValidationErrorDisplay } from "@/components/shared/ValidationErrorDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Mail, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  lifecycle_stage: string;
  lead_source: string;
  created_at: string;
}

export const CommercialBulkOperations = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
      console.log(`Carregados ${data?.length || 0} clientes para operações em massa`);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdate = async (updates: Record<string, any>) => {
    const { id, ...updateData } = updates;
    
    const { error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  };

  const handleBulkValidate = async () => {
    const valid: Customer[] = [];
    const invalid: any[] = [];

    for (const customer of customers) {
      const errors = validateCustomer(customer);
      
      if (errors.length === 0) {
        valid.push(customer);
      } else {
        invalid.push({
          customer,
          errors
        });
      }
    }

    // Preparar erros para exibição
    const formattedErrors = invalid.flatMap(item => 
      item.errors.map((error: any) => ({
        id: item.customer.id,
        field: error.field,
        message: error.message,
        severity: error.severity as 'error' | 'warning' | 'info'
      }))
    );

    setValidationErrors(formattedErrors);
    return { valid, invalid: invalid.map(i => i.customer) };
  };

  const validateCustomer = (customer: Customer) => {
    const errors = [];

    // Validar nome
    if (!customer.name || customer.name.trim().length < 2) {
      errors.push({
        field: 'nome_vazio',
        message: 'Nome do cliente está vazio ou muito curto',
        severity: 'error'
      });
    }

    // Validar email
    if (customer.email && !isValidEmail(customer.email)) {
      errors.push({
        field: 'email_invalido',
        message: 'Formato de email inválido',
        severity: 'warning'
      });
    }

    // Validar telefone
    if (customer.phone && !isValidPhone(customer.phone)) {
      errors.push({
        field: 'telefone_invalido',
        message: 'Formato de telefone inválido',
        severity: 'warning'
      });
    }

    // Validar dados de teste
    const testKeywords = ['teste', 'test', 'exemplo', 'example', 'demo'];
    if (testKeywords.some(keyword => 
      customer.name?.toLowerCase().includes(keyword) ||
      customer.company?.toLowerCase().includes(keyword)
    )) {
      errors.push({
        field: 'dados_teste',
        message: 'Possível dado de teste detectado',
        severity: 'info'
      });
    }

    // Validar dados incompletos
    if (!customer.email && !customer.phone) {
      errors.push({
        field: 'dados_incompletos',
        message: 'Cliente sem email nem telefone de contato',
        severity: 'warning'
      });
    }

    return errors;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\(\)\-\+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleBulkDelete = async (ids: string[]) => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .in('id', ids);

    if (error) throw error;
    
    // Recarregar dados
    await loadCustomers();
  };

  const handleFixError = async (errorId: string) => {
    // Implementar correção automática baseada no tipo de erro
    console.log('Corrigindo erro para item:', errorId);
    toast({
      title: "Correção iniciada",
      description: "Implementando correção automática...",
    });
  };

  const updateFields = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'ativo', label: 'Ativo' },
        { value: 'inativo', label: 'Inativo' },
        { value: 'prospect', label: 'Prospect' }
      ]
    },
    {
      key: 'lifecycle_stage',
      label: 'Estágio do Ciclo',
      type: 'select' as const,
      options: [
        { value: 'lead', label: 'Lead' },
        { value: 'prospect', label: 'Prospect' },
        { value: 'qualificado', label: 'Qualificado' },
        { value: 'cliente', label: 'Cliente' }
      ]
    },
    {
      key: 'lead_source',
      label: 'Fonte do Lead',
      type: 'text' as const
    },
    {
      key: 'notes',
      label: 'Observações',
      type: 'text' as const
    }
  ];

  const toggleCustomerSelection = (customerId: string) => {
    const newSelection = new Set(selectedCustomers);
    if (newSelection.has(customerId)) {
      newSelection.delete(customerId);
    } else {
      newSelection.add(customerId);
    }
    setSelectedCustomers(newSelection);
  };

  return (
    <div className="space-y-6">
      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clientes Comerciais ({customers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando clientes...</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedCustomers.has(customer.id)}
                        onCheckedChange={() => toggleCustomerSelection(customer.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{customer.name}</span>
                          <Badge variant="outline">{customer.status}</Badge>
                          <Badge variant="secondary">{customer.lifecycle_stage}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {customer.company && (
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {customer.company}
                            </div>
                          )}
                          {customer.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </div>
                          )}
                          <div className="text-xs">
                            Fonte: {customer.lead_source || 'Não informado'} | 
                            Criado: {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {customers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Operações em Massa */}
      <BulkOperations
        data={customers}
        selectedItems={selectedCustomers}
        onSelectionChange={setSelectedCustomers}
        onBulkUpdate={handleBulkUpdate}
        onBulkValidate={handleBulkValidate}
        onBulkDelete={handleBulkDelete}
        updateFields={updateFields}
        moduleType="commercial"
      />

      {/* Exibição de Erros de Validação */}
      {validationErrors.length > 0 && (
        <ValidationErrorDisplay
          errors={validationErrors}
          onFixError={handleFixError}
          moduleType="commercial"
        />
      )}
    </div>
  );
};
