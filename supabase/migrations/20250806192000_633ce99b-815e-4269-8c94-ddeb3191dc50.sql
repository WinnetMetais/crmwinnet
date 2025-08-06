-- Estratégia inteligente: adicionar apenas índices essenciais para CRM

-- 1. REMOVER índice não utilizado
DROP INDEX IF EXISTS public.idx_quote_items_user_id;

-- 2. ADICIONAR apenas índices CRÍTICOS para performance do CRM
-- Estes são os índices que impactam diretamente as operações principais

-- Relacionamentos principais de customers (muito utilizados)
CREATE INDEX IF NOT EXISTS idx_customers_lead_source_id ON public.customers(lead_source_id);
CREATE INDEX IF NOT EXISTS idx_customers_segment_id ON public.customers(segment_id);

-- Relacionamentos principais de deals (core do CRM)
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON public.deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_pipeline_stage_id ON public.deals(pipeline_stage_id);

-- Relacionamentos de tasks (muito acessado)
CREATE INDEX IF NOT EXISTS idx_tasks_customer_id ON public.tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON public.tasks(deal_id);

-- Relacionamentos de quotes (essencial para vendas)
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_quotes_deal_id ON public.quotes(deal_id);

-- Pipeline activities (importante para histórico)
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_deal_id ON public.pipeline_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_deal_id ON public.pipeline_history(deal_id);

-- User permissions (segurança e acesso)
CREATE INDEX IF NOT EXISTS idx_user_permissions_granted_by ON public.user_permissions(granted_by);

-- Auditoria (para consultas de logs)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- NOTA: Os demais índices serão criados sob demanda quando o sistema 
-- estiver em produção e identificarmos gargalos específicos.
-- Esta abordagem evita overhead desnecessário no banco.