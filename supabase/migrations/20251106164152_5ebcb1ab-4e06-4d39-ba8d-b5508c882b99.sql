-- Criar tabelas faltantes

-- Tabela de segmentos de clientes
CREATE TABLE IF NOT EXISTS public.customer_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de estágios do pipeline
CREATE TABLE IF NOT EXISTS public.pipeline_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  order_position INTEGER NOT NULL,
  color TEXT,
  pipeline_type TEXT DEFAULT 'sales',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de mensagens WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  contact_name TEXT,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound',
  status TEXT DEFAULT 'sent',
  whatsapp_message_id TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  received_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para customer_segments
CREATE POLICY "Users can view segments"
  ON public.customer_segments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert segments"
  ON public.customer_segments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update segments"
  ON public.customer_segments FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete segments"
  ON public.customer_segments FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Políticas RLS para pipeline_stages
CREATE POLICY "Users can view stages"
  ON public.pipeline_stages FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage stages"
  ON public.pipeline_stages FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Políticas RLS para whatsapp_messages
CREATE POLICY "Users can view messages"
  ON public.whatsapp_messages FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert messages"
  ON public.whatsapp_messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update messages"
  ON public.whatsapp_messages FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Triggers para atualização automática
CREATE TRIGGER update_customer_segments_updated_at
  BEFORE UPDATE ON public.customer_segments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir estágios padrão do pipeline
INSERT INTO public.pipeline_stages (name, description, order_position, color, pipeline_type) VALUES
  ('Qualificação', 'Qualificação inicial do lead', 1, '#3b82f6', 'sales'),
  ('Proposta', 'Proposta enviada ao cliente', 2, '#8b5cf6', 'sales'),
  ('Negociação', 'Em negociação com o cliente', 3, '#f59e0b', 'sales'),
  ('Fechamento', 'Aguardando fechamento', 4, '#10b981', 'sales'),
  ('Ganho', 'Negócio fechado com sucesso', 5, '#22c55e', 'sales'),
  ('Perdido', 'Negócio perdido', 6, '#ef4444', 'sales')
ON CONFLICT DO NOTHING;

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE customer_segments;
ALTER PUBLICATION supabase_realtime ADD TABLE pipeline_stages;
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_messages;