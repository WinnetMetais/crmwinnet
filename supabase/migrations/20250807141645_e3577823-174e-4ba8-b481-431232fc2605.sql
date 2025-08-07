-- Limpar todos os dados fictícios e mockados do sistema
-- Mantendo apenas configurações essenciais

-- Remover dados de transações financeiras
DELETE FROM public.transactions;

-- Remover dados de relatórios financeiros
DELETE FROM public.financial_reports;

-- Remover dados de performance de vendas
DELETE FROM public.sales_performance;

-- Remover dados de analytics
DELETE FROM public.analytics_data;

-- Remover dados de relatórios de analytics
DELETE FROM public.analytics_reports;

-- Remover dados de CRM
DELETE FROM public.opportunity_items;
DELETE FROM public.opportunities;
DELETE FROM public.deals;
DELETE FROM public.pipeline_history;
DELETE FROM public.pipeline_activities;

-- Remover dados de orçamentos
DELETE FROM public.quote_items;
DELETE FROM public.quotes;

-- Remover dados de clientes (exceto se houver clientes reais importantes)
DELETE FROM public.customers;

-- Remover dados de produtos de teste
DELETE FROM public.products WHERE sku IN ('CH-1020', 'TR-001', 'BR-034');

-- Remover dados de campanhas de marketing
DELETE FROM public.marketing_campaigns;
DELETE FROM public.campaigns;
DELETE FROM public.content_calendar;

-- Remover dados de negociações
DELETE FROM public.negotiations;

-- Remover dados de comissões
DELETE FROM public.commissions;

-- Remover dados de tarefas
DELETE FROM public.tasks;

-- Remover dados de WhatsApp
DELETE FROM public.whatsapp_messages;

-- Limpar logs de auditoria (manter estrutura)
DELETE FROM public.audit_logs;

-- Limpar logs de validação de dados
DELETE FROM public.data_validation_logs;

-- Confirmar limpeza com tipo correto
INSERT INTO public.system_settings (setting_key, setting_value, description)
VALUES ('data_cleanup_completed', 
        ('{"date": "' || NOW()::text || '", "action": "removed_all_mock_data"}')::jsonb, 
        'Registro de limpeza de dados fictícios')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();