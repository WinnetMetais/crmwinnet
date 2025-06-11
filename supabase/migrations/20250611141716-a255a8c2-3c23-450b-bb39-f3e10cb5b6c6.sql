
-- Criar tabela para armazenar configurações do sistema
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para oportunidades (vendas)
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  value NUMERIC,
  stage TEXT NOT NULL DEFAULT 'prospecto',
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  actual_close_date DATE,
  lead_source TEXT,
  assigned_to TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para itens de oportunidade
CREATE TABLE public.opportunity_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'kg',
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para relacionar deals com opportunities
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS opportunity_id UUID REFERENCES public.opportunities(id);

-- Criar tabela para histórico de interações com clientes
CREATE TABLE public.customer_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'whatsapp', 'proposal'
  subject TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_minutes INTEGER,
  outcome TEXT,
  next_action TEXT,
  next_action_date DATE,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Atualizar tabela customers para incluir campos faltantes
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifecycle_stage TEXT DEFAULT 'lead',
ADD COLUMN IF NOT EXISTS source_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS owner TEXT;

-- Atualizar tabela quotes para melhor integração
ALTER TABLE public.quotes
ADD COLUMN IF NOT EXISTS opportunity_id UUID REFERENCES public.opportunities(id),
ADD COLUMN IF NOT EXISTS deal_id UUID REFERENCES public.deals(id);

-- Criar tabela para configurações de produtos (margens, impostos, etc)
CREATE TABLE public.product_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  configuration_type TEXT NOT NULL, -- 'margin', 'tax', 'discount'
  configuration_data JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para relatórios e análises
CREATE TABLE public.analytics_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL, -- 'sales', 'customers', 'products', 'financial'
  data JSONB NOT NULL,
  period_start DATE,
  period_end DATE,
  generated_by TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para configurações de integração
CREATE TABLE public.integration_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_type TEXT NOT NULL, -- 'google_ads', 'facebook', 'linkedin', 'bling'
  action TEXT NOT NULL, -- 'sync', 'import', 'export'
  status TEXT NOT NULL, -- 'success', 'error', 'pending'
  data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar colunas de auditoria nas tabelas principais
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS created_by TEXT;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_opportunities_customer ON public.opportunities(customer_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_assigned ON public.opportunities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_opportunity_items_opportunity ON public.opportunity_items(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_items_product ON public.opportunity_items(product_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_customer ON public.customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_type ON public.customer_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_date ON public.customer_interactions(date);
CREATE INDEX IF NOT EXISTS idx_customers_owner ON public.customers(owner);
CREATE INDEX IF NOT EXISTS idx_customers_lifecycle ON public.customers(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_customers_score ON public.customers(lead_score);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS básicas (ajustar conforme necessário)
CREATE POLICY "Users can view all opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Users can create opportunities" ON public.opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update opportunities" ON public.opportunities FOR UPDATE USING (true);
CREATE POLICY "Users can delete opportunities" ON public.opportunities FOR DELETE USING (true);

CREATE POLICY "Users can view all opportunity_items" ON public.opportunity_items FOR SELECT USING (true);
CREATE POLICY "Users can create opportunity_items" ON public.opportunity_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update opportunity_items" ON public.opportunity_items FOR UPDATE USING (true);
CREATE POLICY "Users can delete opportunity_items" ON public.opportunity_items FOR DELETE USING (true);

CREATE POLICY "Users can view all customer_interactions" ON public.customer_interactions FOR SELECT USING (true);
CREATE POLICY "Users can create customer_interactions" ON public.customer_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update customer_interactions" ON public.customer_interactions FOR UPDATE USING (true);
CREATE POLICY "Users can delete customer_interactions" ON public.customer_interactions FOR DELETE USING (true);

CREATE POLICY "Public read product_configurations" ON public.product_configurations FOR SELECT USING (true);
CREATE POLICY "Users can manage product_configurations" ON public.product_configurations FOR ALL USING (true);

CREATE POLICY "Users can view analytics_reports" ON public.analytics_reports FOR SELECT USING (true);
CREATE POLICY "Users can create analytics_reports" ON public.analytics_reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view integration_logs" ON public.integration_logs FOR SELECT USING (true);
CREATE POLICY "Users can create integration_logs" ON public.integration_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read system_settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage system_settings" ON public.system_settings FOR ALL USING (true);

-- Inserir configurações padrão do sistema
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
('default_margins', '{"50": 50, "55": 55, "60": 60, "65": 65, "70": 70, "75": 75}', 'Margens padrão para produtos'),
('default_currency', '"BRL"', 'Moeda padrão do sistema'),
('company_info', '{"name": "Winnet Metais", "cnpj": "", "address": "", "phone": "", "email": ""}', 'Informações da empresa'),
('email_templates', '{}', 'Templates de email do sistema'),
('notification_settings', '{"email": true, "system": true, "whatsapp": false}', 'Configurações de notificação');

-- Criar triggers para auditoria automática
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_configurations_updated_at BEFORE UPDATE ON public.product_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
