
-- Criar tabela para lead sources (canais de entrada)
CREATE TABLE public.lead_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir canais baseados na planilha
INSERT INTO public.lead_sources (name, description) VALUES
('ORGANICO', 'Lead orgânico'),
('METÁLICOS', 'Canal metálicos'),
('GOOGLE', 'Google Ads/Busca'),
('FRIO', 'Prospecção fria'),
('INDICAÇÃO', 'Indicação de clientes');

-- Criar tabela para segmentos de clientes
CREATE TABLE public.customer_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir segmentos baseados na planilha
INSERT INTO public.customer_segments (name, description) VALUES
('Revenda', 'Cliente revenda'),
('Clínica', 'Clínica médica'),
('Hotel', 'Setor hoteleiro'),
('Condomínio', 'Administradora de condomínios'),
('Construtora', 'Empresa de construção');

-- Criar tabela para tipos de cliente
CREATE TABLE public.customer_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir tipos baseados na planilha
INSERT INTO public.customer_types (name, description) VALUES
('FINAL PJ', 'Pessoa Jurídica - Cliente Final'),
('FINAL PF', 'Pessoa Física - Cliente Final'),
('REVENDA', 'Cliente Revenda');

-- Criar tabela para estágios do pipeline
CREATE TABLE public.pipeline_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  order_position INTEGER NOT NULL,
  color TEXT DEFAULT '#6B7280',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir estágios baseados no fluxo comercial
INSERT INTO public.pipeline_stages (name, description, order_position, color) VALUES
('Cliente', 'Novo cliente cadastrado', 1, '#8B5CF6'),
('Negociação', 'Em processo de negociação', 2, '#F59E0B'),
('Avaliação', 'Avaliando proposta/orçamento', 3, '#3B82F6'),
('Apresentação', 'Apresentando soluções', 4, '#06B6D4'),
('Fechado', 'Negócio fechado com sucesso', 5, '#10B981'),
('Perdido', 'Negócio perdido', 6, '#EF4444');

-- Criar tabela para prioridades
CREATE TABLE public.priorities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  color TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir prioridades
INSERT INTO public.priorities (name, level, color) VALUES
('BAIXA', 1, '#10B981'),
('MÉDIA', 2, '#F59E0B'),
('ALTA', 3, '#EF4444');

-- Criar tabela para status de qualificação
CREATE TABLE public.qualification_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir status de qualificação
INSERT INTO public.qualification_status (name, description) VALUES
('SIM', 'Cliente qualificado'),
('NÃO', 'Cliente não qualificado'),
('PENDENTE', 'Qualificação pendente');

-- Atualizar tabela customers para incluir novos campos
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS lead_source_id UUID REFERENCES public.lead_sources(id),
ADD COLUMN IF NOT EXISTS segment_id UUID REFERENCES public.customer_segments(id),
ADD COLUMN IF NOT EXISTS customer_type_id UUID REFERENCES public.customer_types(id),
ADD COLUMN IF NOT EXISTS priority_id UUID REFERENCES public.priorities(id),
ADD COLUMN IF NOT EXISTS qualification_status_id UUID REFERENCES public.qualification_status(id),
ADD COLUMN IF NOT EXISTS cnpj TEXT,
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS social_reason TEXT;

-- Atualizar tabela deals para incluir campos do pipeline
ALTER TABLE public.deals
ADD COLUMN IF NOT EXISTS pipeline_stage_id UUID REFERENCES public.pipeline_stages(id),
ADD COLUMN IF NOT EXISTS estimated_value NUMERIC,
ADD COLUMN IF NOT EXISTS actual_value NUMERIC,
ADD COLUMN IF NOT EXISTS proposal_sent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS proposal_value NUMERIC,
ADD COLUMN IF NOT EXISTS priority_id UUID REFERENCES public.priorities(id),
ADD COLUMN IF NOT EXISTS qualification_status_id UUID REFERENCES public.qualification_status(id),
ADD COLUMN IF NOT EXISTS presentation_sent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS follow_up_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS active_follow_up BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS observations TEXT;

-- Criar tabela para atividades do pipeline
CREATE TABLE public.pipeline_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  activity_type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'proposal', 'follow_up'
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para histórico de mudanças no pipeline
CREATE TABLE public.pipeline_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  from_stage_id UUID REFERENCES public.pipeline_stages(id),
  to_stage_id UUID REFERENCES public.pipeline_stages(id),
  changed_by TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_customers_lead_source ON public.customers(lead_source_id);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON public.customers(segment_id);
CREATE INDEX IF NOT EXISTS idx_customers_type ON public.customers(customer_type_id);
CREATE INDEX IF NOT EXISTS idx_deals_pipeline_stage ON public.deals(pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_priority ON public.deals(priority_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_deal ON public.pipeline_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_status ON public.pipeline_activities(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_deal ON public.pipeline_history(deal_id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_history ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para acesso público de leitura (dados de configuração)
CREATE POLICY "Public read lead_sources" ON public.lead_sources FOR SELECT USING (true);
CREATE POLICY "Public read customer_segments" ON public.customer_segments FOR SELECT USING (true);
CREATE POLICY "Public read customer_types" ON public.customer_types FOR SELECT USING (true);
CREATE POLICY "Public read pipeline_stages" ON public.pipeline_stages FOR SELECT USING (true);
CREATE POLICY "Public read priorities" ON public.priorities FOR SELECT USING (true);
CREATE POLICY "Public read qualification_status" ON public.qualification_status FOR SELECT USING (true);

-- Políticas para pipeline_activities (usuários podem ver e gerenciar suas próprias atividades)
CREATE POLICY "Users can view all pipeline_activities" ON public.pipeline_activities FOR SELECT USING (true);
CREATE POLICY "Users can create pipeline_activities" ON public.pipeline_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update pipeline_activities" ON public.pipeline_activities FOR UPDATE USING (true);
CREATE POLICY "Users can delete pipeline_activities" ON public.pipeline_activities FOR DELETE USING (true);

-- Políticas para pipeline_history (usuários podem ver todo o histórico)
CREATE POLICY "Users can view pipeline_history" ON public.pipeline_history FOR SELECT USING (true);
CREATE POLICY "Users can create pipeline_history" ON public.pipeline_history FOR INSERT WITH CHECK (true);
