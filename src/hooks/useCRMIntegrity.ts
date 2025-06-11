
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CRMIntegrityCheck {
  module: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  count?: number;
}

export const useCRMIntegrity = () => {
  const [checks, setChecks] = useState<CRMIntegrityCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'ok' | 'warning' | 'error'>('ok');

  const runIntegrityCheck = async () => {
    setIsChecking(true);
    const newChecks: CRMIntegrityCheck[] = [];

    try {
      // Verificar tabela customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id, name, email, data_quality_score')
        .limit(1000);

      if (customersError) {
        newChecks.push({
          module: 'Customers',
          status: 'error',
          message: `Erro ao acessar dados: ${customersError.message}`
        });
      } else {
        const invalidCustomers = customers?.filter(c => !c.name || c.name.trim() === '') || [];
        newChecks.push({
          module: 'Customers',
          status: invalidCustomers.length > 0 ? 'warning' : 'ok',
          message: invalidCustomers.length > 0 
            ? `${invalidCustomers.length} clientes sem nome válido`
            : `${customers?.length || 0} clientes válidos`,
          count: customers?.length || 0
        });
      }

      // Verificar tabela deals
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('id, title, customer_id, pipeline_stage_id')
        .limit(1000);

      if (dealsError) {
        newChecks.push({
          module: 'Deals',
          status: 'error',
          message: `Erro ao acessar dados: ${dealsError.message}`
        });
      } else {
        const invalidDeals = deals?.filter(d => !d.title || !d.customer_id) || [];
        newChecks.push({
          module: 'Deals',
          status: invalidDeals.length > 0 ? 'warning' : 'ok',
          message: invalidDeals.length > 0 
            ? `${invalidDeals.length} deals com dados incompletos`
            : `${deals?.length || 0} deals válidos`,
          count: deals?.length || 0
        });
      }

      // Verificar tabela opportunities
      const { data: opportunities, error: opportunitiesError } = await supabase
        .from('opportunities')
        .select('id, title, customer_id, value')
        .limit(1000);

      if (opportunitiesError) {
        newChecks.push({
          module: 'Opportunities',
          status: 'error',
          message: `Erro ao acessar dados: ${opportunitiesError.message}`
        });
      } else {
        newChecks.push({
          module: 'Opportunities',
          status: 'ok',
          message: `${opportunities?.length || 0} oportunidades registradas`,
          count: opportunities?.length || 0
        });
      }

      // Verificar pipeline stages
      const { data: stages, error: stagesError } = await supabase
        .from('pipeline_stages')
        .select('id, name, active')
        .eq('active', true);

      if (stagesError) {
        newChecks.push({
          module: 'Pipeline Stages',
          status: 'error',
          message: `Erro ao acessar estágios: ${stagesError.message}`
        });
      } else {
        newChecks.push({
          module: 'Pipeline Stages',
          status: (stages?.length || 0) < 3 ? 'warning' : 'ok',
          message: `${stages?.length || 0} estágios ativos`,
          count: stages?.length || 0
        });
      }

      // Verificar transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('id, title, amount, type')
        .limit(1000);

      if (transactionsError) {
        newChecks.push({
          module: 'Transactions',
          status: 'error',
          message: `Erro ao acessar transações: ${transactionsError.message}`
        });
      } else {
        newChecks.push({
          module: 'Transactions',
          status: 'ok',
          message: `${transactions?.length || 0} transações registradas`,
          count: transactions?.length || 0
        });
      }

      // Verificar integridade referencial
      const { data: dealsWithoutCustomers, error: integrityError } = await supabase
        .from('deals')
        .select('id')
        .is('customer_id', null);

      if (!integrityError && dealsWithoutCustomers) {
        newChecks.push({
          module: 'Integridade Referencial',
          status: dealsWithoutCustomers.length > 0 ? 'warning' : 'ok',
          message: dealsWithoutCustomers.length > 0 
            ? `${dealsWithoutCustomers.length} deals sem cliente associado`
            : 'Integridade referencial OK'
        });
      }

      setChecks(newChecks);

      // Determinar status geral
      const hasErrors = newChecks.some(check => check.status === 'error');
      const hasWarnings = newChecks.some(check => check.status === 'warning');
      
      setOverallStatus(hasErrors ? 'error' : hasWarnings ? 'warning' : 'ok');

      toast({
        title: "Verificação de Integridade Concluída",
        description: `Sistema ${hasErrors ? 'com erros' : hasWarnings ? 'com avisos' : 'funcionando normalmente'}`,
        variant: hasErrors ? 'destructive' : 'default'
      });

    } catch (error) {
      console.error('Erro na verificação de integridade:', error);
      toast({
        title: "Erro na Verificação",
        description: "Não foi possível verificar a integridade do sistema",
        variant: 'destructive'
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runIntegrityCheck();
  }, []);

  return {
    checks,
    isChecking,
    overallStatus,
    runIntegrityCheck
  };
};
