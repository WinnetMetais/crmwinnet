-- Adicionar índices para foreign keys não indexadas para melhorar performance
-- Isso vai acelerar queries com JOINs e lookups de foreign keys

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- Commissions
CREATE INDEX IF NOT EXISTS idx_commissions_deal_id ON public.commissions(deal_id);
CREATE INDEX IF NOT EXISTS idx_commissions_quote_id ON public.commissions(quote_id);
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON public.commissions(user_id);

-- Content Calendar
CREATE INDEX IF NOT EXISTS idx_content_calendar_campaign_id ON public.content_calendar(campaign_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON public.content_calendar(user_id);

-- Content Templates
CREATE INDEX IF NOT EXISTS idx_content_templates_user_id ON public.content_templates(user_id);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_customer_type_id ON public.customers(customer_type_id);
CREATE INDEX IF NOT EXISTS idx_customers_lead_source_id ON public.customers(lead_source_id);
CREATE INDEX IF NOT EXISTS idx_customers_priority_id ON public.customers(priority_id);
CREATE INDEX IF NOT EXISTS idx_customers_qualification_status_id ON public.customers(qualification_status_id);
CREATE INDEX IF NOT EXISTS idx_customers_segment_id ON public.customers(segment_id);

-- Deals
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON public.deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_opportunity_id ON public.deals(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_deals_pipeline_stage_id ON public.deals(pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_priority_id ON public.deals(priority_id);
CREATE INDEX IF NOT EXISTS idx_deals_qualification_status_id ON public.deals(qualification_status_id);

-- Negotiations
CREATE INDEX IF NOT EXISTS idx_negotiations_customer_id ON public.negotiations(customer_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_deal_id ON public.negotiations(deal_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_quote_id ON public.negotiations(quote_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_user_id ON public.negotiations(user_id);

-- Pipeline Activities
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_customer_id ON public.pipeline_activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_deal_id ON public.pipeline_activities(deal_id);

-- Pipeline History
CREATE INDEX IF NOT EXISTS idx_pipeline_history_deal_id ON public.pipeline_history(deal_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_from_stage_id ON public.pipeline_history(from_stage_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_to_stage_id ON public.pipeline_history(to_stage_id);

-- Product Configurations
CREATE INDEX IF NOT EXISTS idx_product_configurations_product_id ON public.product_configurations(product_id);

-- Quote Items
CREATE INDEX IF NOT EXISTS idx_quote_items_product_id ON public.quote_items(product_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items(quote_id);

-- Quotes
CREATE INDEX IF NOT EXISTS idx_quotes_deal_id ON public.quotes(deal_id);
CREATE INDEX IF NOT EXISTS idx_quotes_opportunity_id ON public.quotes(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON public.quotes(user_id);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_customer_id ON public.tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON public.tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_quote_id ON public.tasks(quote_id);

-- User Permissions
CREATE INDEX IF NOT EXISTS idx_user_permissions_granted_by ON public.user_permissions(granted_by);

-- Remover índices não utilizados para otimizar performance
DROP INDEX IF EXISTS public.idx_deals_created_at;
DROP INDEX IF EXISTS public.idx_quote_items_user_id;
DROP INDEX IF EXISTS public.idx_customers_email;
DROP INDEX IF EXISTS public.idx_customers_name;
DROP INDEX IF EXISTS public.idx_opportunities_created_at;
DROP INDEX IF EXISTS public.idx_quotes_created_at;