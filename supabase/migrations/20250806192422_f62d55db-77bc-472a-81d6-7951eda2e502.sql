-- Finalizar otimização: últimos índices para foreign keys restantes

-- Content templates (módulo de marketing)
CREATE INDEX IF NOT EXISTS idx_content_templates_user_id ON public.content_templates(user_id);

-- Customer relationships com tabelas de referência
CREATE INDEX IF NOT EXISTS idx_customers_customer_type_id ON public.customers(customer_type_id);
CREATE INDEX IF NOT EXISTS idx_customers_priority_id ON public.customers(priority_id);
CREATE INDEX IF NOT EXISTS idx_customers_qualification_status_id ON public.customers(qualification_status_id);

-- Deal relationships com tabelas de referência
CREATE INDEX IF NOT EXISTS idx_deals_priority_id ON public.deals(priority_id);
CREATE INDEX IF NOT EXISTS idx_deals_qualification_status_id ON public.deals(qualification_status_id);

-- OTIMIZAÇÃO COMPLETA
-- ✅ Todos os foreign keys críticos agora possuem índices
-- ✅ Performance otimizada para JOINs e relacionamentos
-- ✅ Índices não utilizados são normais em desenvolvimento
-- ✅ Eles serão ativados automaticamente com dados reais