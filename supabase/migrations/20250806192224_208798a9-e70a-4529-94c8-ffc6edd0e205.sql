-- Completar otimização: adicionar índices para relacionamentos críticos restantes

-- Comissões (módulo comercial importante)
CREATE INDEX IF NOT EXISTS idx_commissions_deal_id ON public.commissions(deal_id);
CREATE INDEX IF NOT EXISTS idx_commissions_quote_id ON public.commissions(quote_id);
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON public.commissions(user_id);

-- Negociações (processo de vendas)
CREATE INDEX IF NOT EXISTS idx_negotiations_customer_id ON public.negotiations(customer_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_deal_id ON public.negotiations(deal_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_quote_id ON public.negotiations(quote_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_user_id ON public.negotiations(user_id);

-- Deals - relacionamentos secundários importantes
CREATE INDEX IF NOT EXISTS idx_deals_opportunity_id ON public.deals(opportunity_id);

-- Quote items - relacionamento com produtos
CREATE INDEX IF NOT EXISTS idx_quote_items_product_id ON public.quote_items(product_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_user_id ON public.quote_items(user_id);

-- Quotes - relacionamento com oportunidades
CREATE INDEX IF NOT EXISTS idx_quotes_opportunity_id ON public.quotes(opportunity_id);

-- Tasks - relacionamento com quotes
CREATE INDEX IF NOT EXISTS idx_tasks_quote_id ON public.tasks(quote_id);

-- Pipeline activities - relacionamento com customer
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_customer_id ON public.pipeline_activities(customer_id);

-- Pipeline history - transições de estágio
CREATE INDEX IF NOT EXISTS idx_pipeline_history_from_stage_id ON public.pipeline_history(from_stage_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_to_stage_id ON public.pipeline_history(to_stage_id);

-- Product configurations
CREATE INDEX IF NOT EXISTS idx_product_configurations_product_id ON public.product_configurations(product_id);

-- Content (menos crítico, mas usado em marketing)
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON public.content_calendar(user_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_campaign_id ON public.content_calendar(campaign_id);

-- NOTA: Índices não utilizados são normais em desenvolvimento
-- Eles serão ativados quando houver dados e queries reais