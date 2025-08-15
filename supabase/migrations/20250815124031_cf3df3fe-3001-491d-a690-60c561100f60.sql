-- Corrigir migração anterior sem duplicar realtime

-- Criar tabela de clientes para orçamentos caso não exista
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

-- Habilitar RLS
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

-- Habilitar realtime apenas se não estiver habilitado
ALTER TABLE public.customers_quotes REPLICA IDENTITY FULL;