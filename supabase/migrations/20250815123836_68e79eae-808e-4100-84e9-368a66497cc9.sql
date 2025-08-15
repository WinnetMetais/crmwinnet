-- Melhorar tabelas de orçamentos e implementar funcionalidades necessárias

-- Criar tabela de clientes caso não exista (para busca de clientes)
CREATE TABLE IF NOT EXISTS public.customers_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cnpj_cpf TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  contact_person TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID DEFAULT auth.uid()
);

-- Habilitar RLS para customers_quotes
ALTER TABLE public.customers_quotes ENABLE ROW LEVEL SECURITY;

-- Políticas para customers_quotes
CREATE POLICY "Users can view all customers_quotes" 
ON public.customers_quotes 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage customers_quotes" 
ON public.customers_quotes 
FOR ALL 
USING (auth.uid() = created_by OR is_admin())
WITH CHECK (auth.uid() = created_by OR is_admin());

-- Melhorar tabela quotes
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers_quotes(id),
ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid(),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE;

-- Melhorar tabela quote_items
ALTER TABLE public.quote_items 
ADD COLUMN IF NOT EXISTS product_id UUID,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON public.quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_created_by ON public.quotes(created_by);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_product_id ON public.quote_items(product_id);

-- Trigger para atualizar updated_at em quotes
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_quotes_updated_at_trigger ON public.quotes;
CREATE TRIGGER update_quotes_updated_at_trigger
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at();

-- Habilitar realtime para quotes e quote_items
ALTER TABLE public.quotes REPLICA IDENTITY FULL;
ALTER TABLE public.quote_items REPLICA IDENTITY FULL;
ALTER TABLE public.customers_quotes REPLICA IDENTITY FULL;

-- Adicionar tabelas à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quote_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers_quotes;