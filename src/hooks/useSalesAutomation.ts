import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Sales Automation Hook
 * Provides automated workflows and business logic for the sales process
 */
export const useSalesAutomation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Automatically progress opportunity to deal when status changes
   */
  const useAutoProgressToDeal = () => {
    return useMutation({
      mutationFn: async ({ opportunityId, customDealData }: { 
        opportunityId: string; 
        customDealData?: any 
      }) => {
        // Get opportunity data
        const { data: opportunity, error: oppError } = await supabase
          .from('opportunities')
          .select('*')
          .eq('id', opportunityId)
          .single();

        if (oppError) throw oppError;

        // Create deal automatically
        const dealData = {
          customer_id: opportunity.customer_id,
          title: customDealData?.title || `Deal - ${opportunity.title}`,
          value: customDealData?.value || opportunity.value || 0,
          status: 'qualified',
          description: `Deal criado automaticamente da oportunidade: ${opportunity.title}`,
          opportunity_id: opportunityId,
          owner_id: opportunity.owner_id,
          ...customDealData
        };

        const { data: deal, error: dealError } = await supabase
          .from('deals')
          .insert(dealData)
          .select()
          .single();

        if (dealError) throw dealError;

        // Update opportunity stage
        const { error: updateError } = await supabase
          .from('opportunities')
          .update({ 
            stage: 'negotiation',
            updated_at: new Date().toISOString()
          })
          .eq('id', opportunityId);

        if (updateError) throw updateError;

        return { opportunity, deal };
      },
      onSuccess: ({ opportunity, deal }) => {
        queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
        
        toast({
          title: 'Progressão Automática',
          description: `Oportunidade "${opportunity.title}" convertida em deal!`,
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Erro na Progressão',
          description: error.message || 'Falha ao converter oportunidade em deal',
          variant: 'destructive',
        });
      }
    });
  };

  /**
   * Close deal and automatically create financial transaction
   */
  const useCloseDealWithFinanceSync = () => {
    return useMutation({
      mutationFn: async ({ dealId, finalValue, paymentMethod = 'boleto' }: { 
        dealId: string; 
        finalValue?: number;
        paymentMethod?: string;
      }) => {
        // Get deal and customer data
        const { data: deal, error: dealError } = await supabase
          .from('deals')
          .select(`
            *,
            customers!inner(name, email)
          `)
          .eq('id', dealId)
          .single();

        if (dealError) throw dealError;

        const dealValue = finalValue || deal.actual_value || deal.estimated_value || deal.value || 0;
        
        // Update deal to won status
        const { error: updateError } = await supabase
          .from('deals')
          .update({
            status: 'won',
            actual_value: dealValue,
            close_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', dealId);

        if (updateError) throw updateError;

        // The trigger will automatically create the financial transaction
        return { deal, finalValue: dealValue };
      },
      onSuccess: ({ deal, finalValue }) => {
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
        
        toast({
          title: 'Deal Fechado',
          description: `Deal de R$ ${finalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} fechado e transação criada automaticamente!`,
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Erro ao Fechar Deal',
          description: error.message || 'Falha ao fechar deal e sincronizar financeiro',
          variant: 'destructive',
        });
      }
    });
  };

  /**
   * Create customer with auto-opportunity
   */
  const useCreateCustomerWithOpportunity = () => {
    return useMutation({
      mutationFn: async (customerData: any) => {
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .insert({
            ...customerData,
            owner_id: (await supabase.auth.getUser()).data.user?.id
          })
          .select()
          .single();

        if (customerError) throw customerError;

        // The trigger will automatically create an opportunity
        return customer;
      },
      onSuccess: (customer) => {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
        
        toast({
          title: 'Cliente Criado',
          description: `${customer.name} cadastrado com oportunidade automática!`,
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Erro ao Criar Cliente',
          description: error.message || 'Falha ao criar cliente',
          variant: 'destructive',
        });
      }
    });
  };

  return {
    useAutoProgressToDeal,
    useCloseDealWithFinanceSync,
    useCreateCustomerWithOpportunity,
  };
};