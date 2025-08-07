-- Remover índices não utilizados (conforme relatório do linter)
DROP INDEX IF EXISTS public.idx_audit_logs_user_id;
DROP INDEX IF EXISTS public.idx_commissions_deal_id;
DROP INDEX IF EXISTS public.idx_commissions_quote_id;
DROP INDEX IF EXISTS public.idx_commissions_user_id;
DROP INDEX IF EXISTS public.idx_content_calendar_campaign_id;
DROP INDEX IF EXISTS public.idx_content_calendar_user_id;
DROP INDEX IF EXISTS public.idx_content_templates_user_id;
DROP INDEX IF EXISTS public.idx_customers_customer_type_id;
DROP INDEX IF EXISTS public.idx_customers_lead_source_id;
DROP INDEX IF EXISTS public.idx_customers_priority_id;
DROP INDEX IF EXISTS public.idx_customers_qualification_status_id;
DROP INDEX IF EXISTS public.idx_customers_segment_id;
DROP INDEX IF EXISTS public.idx_deals_customer_id;
DROP INDEX IF EXISTS public.idx_deals_opportunity_id;
DROP INDEX IF EXISTS public.idx_deals_pipeline_stage_id;
DROP INDEX IF EXISTS public.idx_deals_priority_id;
DROP INDEX IF EXISTS public.idx_deals_qualification_status_id;
DROP INDEX IF EXISTS public.idx_negotiations_customer_id;
DROP INDEX IF EXISTS public.idx_negotiations_deal_id;
DROP INDEX IF EXISTS public.idx_negotiations_quote_id;
DROP INDEX IF EXISTS public.idx_negotiations_user_id;
DROP INDEX IF EXISTS public.idx_pipeline_activities_customer_id;
DROP INDEX IF EXISTS public.idx_pipeline_activities_deal_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_deal_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_from_stage_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_to_stage_id;
DROP INDEX IF EXISTS public.idx_product_configurations_product_id;
DROP INDEX IF EXISTS public.idx_quote_items_product_id;
DROP INDEX IF EXISTS public.idx_quote_items_quote_id;
DROP INDEX IF EXISTS public.idx_quote_items_user_id;
DROP INDEX IF EXISTS public.idx_quotes_deal_id;
DROP INDEX IF EXISTS public.idx_quotes_opportunity_id;
DROP INDEX IF EXISTS public.idx_tasks_customer_id;
DROP INDEX IF EXISTS public.idx_tasks_deal_id;
DROP INDEX IF EXISTS public.idx_tasks_quote_id;
DROP INDEX IF EXISTS public.idx_user_permissions_granted_by;

-- Criar tabelas essenciais faltantes para módulos comercial e financeiro

-- 1. Tabela de condições de pagamento
CREATE TABLE IF NOT EXISTS public.payment_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  days INTEGER NOT NULL DEFAULT 0,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabela de listas de preços
CREATE TABLE IF NOT EXISTS public.price_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price DECIMAL(12,2) NOT NULL,
  min_quantity INTEGER DEFAULT 1,
  max_quantity INTEGER,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela de itens de fatura
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  discount DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabela de performance de vendas
CREATE TABLE IF NOT EXISTS public.sales_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salesperson TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  deals_won INTEGER DEFAULT 0,
  deals_lost INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  commission_earned DECIMAL(12,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  average_deal_size DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabela de relatórios financeiros
CREATE TABLE IF NOT EXISTS public.financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN ('monthly', 'quarterly', 'yearly', 'custom')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_expenses DECIMAL(12,2) DEFAULT 0,
  net_profit DECIMAL(12,2) DEFAULT 0,
  cash_flow DECIMAL(12,2) DEFAULT 0,
  report_data JSONB DEFAULT '{}',
  generated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir dados de configuração essenciais
-- 1. Métodos de pagamento padrão
INSERT INTO public.payment_methods (name, type) VALUES
  ('Dinheiro', 'cash'),
  ('Cartão de Crédito', 'credit_card'),
  ('Cartão de Débito', 'debit_card'),
  ('PIX', 'pix'),
  ('Transferência Bancária', 'bank_transfer'),
  ('Boleto', 'boleto'),
  ('Cheque', 'check')
ON CONFLICT (name) DO NOTHING;

-- 2. Condições de pagamento padrão
INSERT INTO public.payment_terms (name, days, discount_percentage) VALUES
  ('À Vista', 0, 5.0),
  ('30 dias', 30, 2.0),
  ('60 dias', 60, 0),
  ('90 dias', 90, 0),
  ('15/30 dias', 30, 3.0)
ON CONFLICT DO NOTHING;

-- 3. Estágios do pipeline padrão
INSERT INTO public.pipeline_stages (name, description, order_position, color) VALUES
  ('Prospecção', 'Identificação de novos leads', 1, '#6B7280'),
  ('Qualificação', 'Validação do interesse e necessidade', 2, '#3B82F6'),
  ('Proposta', 'Apresentação da proposta comercial', 3, '#F59E0B'),
  ('Negociação', 'Discussão de termos e condições', 4, '#10B981'),
  ('Fechamento', 'Finalização do negócio', 5, '#059669'),
  ('Perdido', 'Negócio não concretizado', 6, '#EF4444')
ON CONFLICT (name) DO NOTHING;

-- 4. Segmentos de cliente padrão
INSERT INTO public.customer_segments (name, description) VALUES
  ('Pequeno Porte', 'Empresas com até 50 funcionários'),
  ('Médio Porte', 'Empresas com 51 a 500 funcionários'),
  ('Grande Porte', 'Empresas com mais de 500 funcionários'),
  ('Governo', 'Órgãos públicos e governamentais'),
  ('Pessoa Física', 'Clientes individuais')
ON CONFLICT (name) DO NOTHING;

-- 5. Fontes de lead padrão
INSERT INTO public.lead_sources (name, description) VALUES
  ('Website', 'Leads gerados através do site'),
  ('Indicação', 'Indicações de clientes existentes'),
  ('Marketing Digital', 'Campanhas online e redes sociais'),
  ('Telemarketing', 'Contato telefônico ativo'),
  ('Evento', 'Feiras e eventos do setor'),
  ('WhatsApp', 'Contatos via WhatsApp Business')
ON CONFLICT (name) DO NOTHING;

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.payment_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para as novas tabelas
CREATE POLICY "Everyone can view payment_terms" ON public.payment_terms FOR SELECT USING (true);
CREATE POLICY "Everyone can view price_lists" ON public.price_lists FOR SELECT USING (true);
CREATE POLICY "Users can view invoice_items" ON public.invoice_items FOR SELECT USING (true);
CREATE POLICY "Users can view sales_performance" ON public.sales_performance FOR SELECT USING (true);
CREATE POLICY "Users can view financial_reports" ON public.financial_reports FOR SELECT USING (true);

-- Triggers para updated_at
CREATE TRIGGER update_payment_terms_updated_at
  BEFORE UPDATE ON public.payment_terms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_price_lists_updated_at
  BEFORE UPDATE ON public.price_lists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_performance_updated_at
  BEFORE UPDATE ON public.sales_performance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();