-- Otimização de performance: corrigir problemas identificados pelo linter

-- 1. Adicionar índice faltante para foreign key na tabela quote_items
CREATE INDEX IF NOT EXISTS idx_quote_items_user_id ON public.quote_items(user_id);

-- 2. Remover índices não utilizados para otimizar performance

-- Remover índices não utilizados da tabela commissions
DROP INDEX IF EXISTS public.idx_commissions_deal_id;
DROP INDEX IF EXISTS public.idx_commissions_quote_id;
DROP INDEX IF EXISTS public.idx_commissions_user_id;

-- Remover índices não utilizados da tabela content_calendar
DROP INDEX IF EXISTS public.idx_content_calendar_campaign_id;
DROP INDEX IF EXISTS public.idx_content_calendar_user_id;

-- Remover índices não utilizados da tabela deals
DROP INDEX IF EXISTS public.idx_deals_customer_id;
DROP INDEX IF EXISTS public.idx_deals_opportunity_id;
DROP INDEX IF EXISTS public.idx_deals_pipeline_stage_id;
DROP INDEX IF EXISTS public.idx_deals_priority_id;
DROP INDEX IF EXISTS public.idx_deals_qualification_status_id;

-- Remover índices não utilizados da tabela pipeline_history
DROP INDEX IF EXISTS public.idx_pipeline_history_deal_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_from_stage_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_to_stage_id;

-- Remover índices não utilizados da tabela quote_items
DROP INDEX IF EXISTS public.idx_quote_items_product_id;
DROP INDEX IF EXISTS public.idx_quote_items_quote_id;

-- Remover índices não utilizados de outras tabelas
DROP INDEX IF EXISTS public.idx_content_templates_user_id;
DROP INDEX IF EXISTS public.idx_negotiations_customer_id;
DROP INDEX IF EXISTS public.idx_negotiations_deal_id;
DROP INDEX IF EXISTS public.idx_negotiations_quote_id;
DROP INDEX IF EXISTS public.idx_negotiations_user_id;
DROP INDEX IF EXISTS public.idx_pipeline_activities_customer_id;
DROP INDEX IF EXISTS public.idx_pipeline_activities_deal_id;
DROP INDEX IF EXISTS public.idx_product_configurations_product_id;
DROP INDEX IF EXISTS public.idx_customers_customer_type_id;
DROP INDEX IF EXISTS public.idx_customers_lead_source_id;
DROP INDEX IF EXISTS public.idx_customers_priority_id;
DROP INDEX IF EXISTS public.idx_customers_qualification_status_id;
DROP INDEX IF EXISTS public.idx_customers_segment_id;
DROP INDEX IF EXISTS public.idx_tasks_customer_id;
DROP INDEX IF EXISTS public.idx_tasks_deal_id;
DROP INDEX IF EXISTS public.idx_tasks_quote_id;

-- Remover índices não utilizados da tabela whatsapp_messages
DROP INDEX IF EXISTS public.idx_whatsapp_messages_phone;
DROP INDEX IF EXISTS public.idx_whatsapp_messages_customer;
DROP INDEX IF EXISTS public.idx_whatsapp_messages_received_at;
DROP INDEX IF EXISTS public.idx_whatsapp_messages_whatsapp_id;

-- Remover outros índices não utilizados
DROP INDEX IF EXISTS public.idx_user_permissions_granted_by;
DROP INDEX IF EXISTS public.idx_quotes_deal_id;
DROP INDEX IF EXISTS public.idx_quotes_opportunity_id;
DROP INDEX IF EXISTS public.idx_audit_logs_user_id;

-- 3. Criar apenas índices essenciais que serão realmente utilizados

-- Índices essenciais para queries comuns
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_date ON public.quotes(date DESC);

-- Índices compostos para queries otimizadas
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_customer_received ON public.whatsapp_messages(customer_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_customer_date ON public.customer_interactions(customer_id, date DESC);