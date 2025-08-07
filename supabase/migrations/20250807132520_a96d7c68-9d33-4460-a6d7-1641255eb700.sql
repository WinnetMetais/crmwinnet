-- Remover índices não utilizados para otimizar performance do banco de dados

-- Remover índices da tabela commissions
DROP INDEX IF EXISTS public.idx_commissions_deal_id;
DROP INDEX IF EXISTS public.idx_commissions_quote_id;
DROP INDEX IF EXISTS public.idx_commissions_user_id;

-- Remover índices da tabela content_calendar
DROP INDEX IF EXISTS public.idx_content_calendar_user_id;
DROP INDEX IF EXISTS public.idx_content_calendar_campaign_id;

-- Remover índices da tabela deals
DROP INDEX IF EXISTS public.idx_deals_priority_id;
DROP INDEX IF EXISTS public.idx_deals_qualification_status_id;
DROP INDEX IF EXISTS public.idx_deals_customer_id;
DROP INDEX IF EXISTS public.idx_deals_pipeline_stage_id;
DROP INDEX IF EXISTS public.idx_deals_opportunity_id;

-- Remover índices da tabela pipeline_history
DROP INDEX IF EXISTS public.idx_pipeline_history_deal_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_from_stage_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_to_stage_id;

-- Remover índices da tabela quote_items
DROP INDEX IF EXISTS public.idx_quote_items_quote_id;
DROP INDEX IF EXISTS public.idx_quote_items_product_id;
DROP INDEX IF EXISTS public.idx_quote_items_user_id;

-- Remover índices da tabela content_templates
DROP INDEX IF EXISTS public.idx_content_templates_user_id;

-- Remover índices da tabela negotiations
DROP INDEX IF EXISTS public.idx_negotiations_customer_id;
DROP INDEX IF EXISTS public.idx_negotiations_deal_id;
DROP INDEX IF EXISTS public.idx_negotiations_quote_id;
DROP INDEX IF EXISTS public.idx_negotiations_user_id;

-- Remover índices da tabela pipeline_activities
DROP INDEX IF EXISTS public.idx_pipeline_activities_deal_id;
DROP INDEX IF EXISTS public.idx_pipeline_activities_customer_id;

-- Remover índices da tabela product_configurations
DROP INDEX IF EXISTS public.idx_product_configurations_product_id;

-- Remover índices da tabela customers
DROP INDEX IF EXISTS public.idx_customers_customer_type_id;
DROP INDEX IF EXISTS public.idx_customers_priority_id;
DROP INDEX IF EXISTS public.idx_customers_qualification_status_id;
DROP INDEX IF EXISTS public.idx_customers_lead_source_id;
DROP INDEX IF EXISTS public.idx_customers_segment_id;

-- Remover índices da tabela tasks
DROP INDEX IF EXISTS public.idx_tasks_customer_id;
DROP INDEX IF EXISTS public.idx_tasks_deal_id;
DROP INDEX IF EXISTS public.idx_tasks_quote_id;

-- Remover índices da tabela user_permissions
DROP INDEX IF EXISTS public.idx_user_permissions_granted_by;

-- Remover índices da tabela quotes
DROP INDEX IF EXISTS public.idx_quotes_deal_id;
DROP INDEX IF EXISTS public.idx_quotes_opportunity_id;

-- Remover índices da tabela audit_logs
DROP INDEX IF EXISTS public.idx_audit_logs_user_id;