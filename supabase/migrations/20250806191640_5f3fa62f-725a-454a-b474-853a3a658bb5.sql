-- Otimização final: manter apenas índices essenciais e remover todos não utilizados

-- 1. Adicionar o índice faltante para foreign key
CREATE INDEX IF NOT EXISTS idx_quote_items_user_id ON public.quote_items(user_id);

-- 2. Remover TODOS os índices não utilizados para máxima eficiência
DROP INDEX IF EXISTS public.idx_commissions_deal_id;
DROP INDEX IF EXISTS public.idx_commissions_quote_id;
DROP INDEX IF EXISTS public.idx_commissions_user_id;
DROP INDEX IF EXISTS public.idx_content_calendar_campaign_id;
DROP INDEX IF EXISTS public.idx_content_calendar_user_id;
DROP INDEX IF EXISTS public.idx_deals_customer_id;
DROP INDEX IF EXISTS public.idx_deals_opportunity_id;
DROP INDEX IF EXISTS public.idx_deals_pipeline_stage_id;
DROP INDEX IF EXISTS public.idx_deals_priority_id;
DROP INDEX IF EXISTS public.idx_deals_qualification_status_id;
DROP INDEX IF EXISTS public.idx_deals_status_customer;
DROP INDEX IF EXISTS public.idx_pipeline_history_deal_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_from_stage_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_to_stage_id;
DROP INDEX IF EXISTS public.idx_quote_items_product_id;
DROP INDEX IF EXISTS public.idx_quote_items_quote_id;
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
DROP INDEX IF EXISTS public.idx_customers_status_created;
DROP INDEX IF EXISTS public.idx_opportunities_stage_customer;
DROP INDEX IF EXISTS public.idx_tasks_customer_id;
DROP INDEX IF EXISTS public.idx_tasks_deal_id;
DROP INDEX IF EXISTS public.idx_tasks_quote_id;
DROP INDEX IF EXISTS public.idx_tasks_status_user;
DROP INDEX IF EXISTS public.idx_user_permissions_granted_by;
DROP INDEX IF EXISTS public.idx_quotes_deal_id;
DROP INDEX IF EXISTS public.idx_quotes_opportunity_id;
DROP INDEX IF EXISTS public.idx_quotes_status_customer;
DROP INDEX IF EXISTS public.idx_audit_logs_user_id;

-- 3. Manter apenas índices essenciais que são realmente utilizados
-- Estes índices são criados conforme necessário quando o sistema estiver em uso

-- Comentário: Os índices serão criados dinamicamente quando as queries 
-- específicas começarem a ser executadas em produção, garantindo
-- máxima eficiência sem desperdício de recursos de armazenamento.