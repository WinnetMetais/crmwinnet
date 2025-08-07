-- Criar índices para chaves estrangeiras sem cobertura para otimizar performance

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- Índices para commissions
CREATE INDEX IF NOT EXISTS idx_commissions_deal_id ON public.commissions(deal_id);
CREATE INDEX IF NOT EXISTS idx_commissions_quote_id ON public.commissions(quote_id);
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON public.commissions(user_id);

-- Índices para content_calendar
CREATE INDEX IF NOT EXISTS idx_content_calendar_campaign_id ON public.content_calendar(campaign_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON public.content_calendar(user_id);

-- Índices para content_templates
CREATE INDEX IF NOT EXISTS idx_content_templates_user_id ON public.content_templates(user_id);

-- Índices para customers
CREATE INDEX IF NOT EXISTS idx_customers_customer_type_id ON public.customers(customer_type_id);
CREATE INDEX IF NOT EXISTS idx_customers_lead_source_id ON public.customers(lead_source_id);
CREATE INDEX IF NOT EXISTS idx_customers_priority_id ON public.customers(priority_id);
CREATE INDEX IF NOT EXISTS idx_customers_qualification_status_id ON public.customers(qualification_status_id);
CREATE INDEX IF NOT EXISTS idx_customers_segment_id ON public.customers(segment_id);

-- Índices para deals
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON public.deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_opportunity_id ON public.deals(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_deals_pipeline_stage_id ON public.deals(pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_priority_id ON public.deals(priority_id);
CREATE INDEX IF NOT EXISTS idx_deals_qualification_status_id ON public.deals(qualification_status_id);

-- Índices para negotiations
CREATE INDEX IF NOT EXISTS idx_negotiations_customer_id ON public.negotiations(customer_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_deal_id ON public.negotiations(deal_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_quote_id ON public.negotiations(quote_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_user_id ON public.negotiations(user_id);

-- Índices para pipeline_activities
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_customer_id ON public.pipeline_activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_deal_id ON public.pipeline_activities(deal_id);

-- Índices para pipeline_history
CREATE INDEX IF NOT EXISTS idx_pipeline_history_deal_id ON public.pipeline_history(deal_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_from_stage_id ON public.pipeline_history(from_stage_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_to_stage_id ON public.pipeline_history(to_stage_id);

-- Índices para product_configurations
CREATE INDEX IF NOT EXISTS idx_product_configurations_product_id ON public.product_configurations(product_id);

-- Índices para quote_items
CREATE INDEX IF NOT EXISTS idx_quote_items_product_id ON public.quote_items(product_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_user_id ON public.quote_items(user_id);

-- Índices para quotes
CREATE INDEX IF NOT EXISTS idx_quotes_deal_id ON public.quotes(deal_id);
CREATE INDEX IF NOT EXISTS idx_quotes_opportunity_id ON public.quotes(opportunity_id);

-- Índices para tasks
CREATE INDEX IF NOT EXISTS idx_tasks_customer_id ON public.tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON public.tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_quote_id ON public.tasks(quote_id);

-- Índices para user_permissions
CREATE INDEX IF NOT EXISTS idx_user_permissions_granted_by ON public.user_permissions(granted_by);