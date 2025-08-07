-- Segunda parte: completar estrutura e corrigir segurança

-- 1. Habilitar RLS nas novas tabelas
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;

-- 2. Criar políticas RLS básicas
CREATE POLICY "Public read units" ON public.units FOR SELECT USING (true);
CREATE POLICY "Public read product_categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage suppliers" ON public.suppliers FOR ALL USING (true);
CREATE POLICY "Public read carriers" ON public.carriers FOR SELECT USING (true);

-- 3. Adicionar foreign keys nas tabelas existentes
ALTER TABLE public.products 
ADD CONSTRAINT IF NOT EXISTS fk_products_category 
FOREIGN KEY (category_id) REFERENCES public.product_categories(id);

ALTER TABLE public.products 
ADD CONSTRAINT IF NOT EXISTS fk_products_supplier 
FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);

ALTER TABLE public.products 
ADD CONSTRAINT IF NOT EXISTS fk_products_unit 
FOREIGN KEY (unit_id) REFERENCES public.units(id);

-- 4. Tabela de itens de cotação melhorada
CREATE TABLE IF NOT EXISTS public.quote_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'kg',
  unit_price NUMERIC NOT NULL DEFAULT 0,
  discount_percentage NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  cost_price NUMERIC DEFAULT 0,
  margin_percentage NUMERIC DEFAULT 0,
  profit_amount NUMERIC DEFAULT 0,
  delivery_days INTEGER DEFAULT 0,
  technical_specs JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabela de leads/prospects
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  position TEXT,
  lead_source_id UUID REFERENCES public.lead_sources(id),
  assigned_to TEXT,
  score INTEGER DEFAULT 0,
  qualification_status TEXT DEFAULT 'new',
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_action TEXT,
  next_action_date TIMESTAMP WITH TIME ZONE,
  converted_to_customer_id UUID REFERENCES public.customers(id),
  converted_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Tabela de interações com clientes
CREATE TABLE IF NOT EXISTS public.customer_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  type TEXT NOT NULL,
  subject TEXT,
  description TEXT NOT NULL,
  outcome TEXT,
  next_action TEXT,
  next_action_date TIMESTAMP WITH TIME ZONE,
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  duration_minutes INTEGER,
  participants TEXT[],
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Tabela de movimentação de estoque
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  movement_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  previous_stock NUMERIC NOT NULL,
  current_stock NUMERIC NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Habilitar RLS nas novas tabelas
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- 9. Políticas RLS para as novas tabelas
CREATE POLICY "Users can manage quote_items" ON public.quote_items FOR ALL USING (true);
CREATE POLICY "Users can manage leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Users can manage customer_interactions" ON public.customer_interactions FOR ALL USING (true);
CREATE POLICY "Users can manage stock_movements" ON public.stock_movements FOR ALL USING (true);

-- 10. Atualizar tabela de quotes com novos campos
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS carrier_id UUID REFERENCES public.carriers(id),
ADD COLUMN IF NOT EXISTS freight_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS insurance_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method_id UUID REFERENCES public.payment_methods(id),
ADD COLUMN IF NOT EXISTS delivery_time_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quote_template TEXT DEFAULT 'standard';

-- 11. Triggers para atualização automática
CREATE OR REPLACE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(code);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON public.quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_product ON public.quote_items(product_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_customer ON public.customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);