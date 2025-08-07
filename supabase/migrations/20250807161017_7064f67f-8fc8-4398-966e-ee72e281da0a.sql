-- Estrutura completa do banco de dados Winnet CRM/ERP

-- 1. Tabela de fornecedores
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT,
  cnpj TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  contact_person TEXT,
  website TEXT,
  payment_terms TEXT,
  credit_limit NUMERIC DEFAULT 0,
  rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabela de categorias de produtos
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela de unidades de medida
CREATE TABLE IF NOT EXISTS public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  type TEXT NOT NULL, -- 'weight', 'volume', 'length', 'area', 'unit'
  conversion_factor NUMERIC DEFAULT 1,
  base_unit_id UUID REFERENCES public.units(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabela de produtos completa
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.product_categories(id),
  supplier_id UUID REFERENCES public.suppliers(id),
  unit_id UUID REFERENCES public.units(id),
  cost_price NUMERIC DEFAULT 0,
  sale_price NUMERIC DEFAULT 0,
  margin_50 NUMERIC DEFAULT 0,
  margin_55 NUMERIC DEFAULT 0,
  margin_60 NUMERIC DEFAULT 0,
  margin_65 NUMERIC DEFAULT 0,
  margin_70 NUMERIC DEFAULT 0,
  margin_75 NUMERIC DEFAULT 0,
  weight NUMERIC DEFAULT 0,
  dimensions JSONB DEFAULT '{}',
  stock_min NUMERIC DEFAULT 0,
  stock_max NUMERIC DEFAULT 0,
  stock_current NUMERIC DEFAULT 0,
  image_url TEXT,
  specifications JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabela de transportadoras
CREATE TABLE IF NOT EXISTS public.carriers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT,
  email TEXT,
  phone TEXT,
  contact_person TEXT,
  delivery_time_days INTEGER DEFAULT 0,
  price_per_kg NUMERIC DEFAULT 0,
  min_weight NUMERIC DEFAULT 0,
  max_weight NUMERIC DEFAULT 0,
  coverage_areas TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Atualizar tabela de quotes com novos campos
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS carrier_id UUID REFERENCES public.carriers(id),
ADD COLUMN IF NOT EXISTS freight_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS insurance_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method_id UUID REFERENCES public.payment_methods(id),
ADD COLUMN IF NOT EXISTS delivery_time_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quote_template TEXT DEFAULT 'standard';

-- 7. Tabela de itens de cotação completa
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

-- 8. Tabela de vendedores/usuários de vendas
CREATE TABLE IF NOT EXISTS public.salespeople (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department_id UUID REFERENCES public.departments(id),
  commission_rate NUMERIC DEFAULT 0,
  sales_goal_monthly NUMERIC DEFAULT 0,
  sales_goal_annual NUMERIC DEFAULT 0,
  territory TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Tabela de histórico de preços
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  old_price NUMERIC NOT NULL,
  new_price NUMERIC NOT NULL,
  change_reason TEXT,
  changed_by TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Tabela de movimentação de estoque
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  movement_type TEXT NOT NULL, -- 'entry', 'exit', 'adjustment'
  quantity NUMERIC NOT NULL,
  previous_stock NUMERIC NOT NULL,
  current_stock NUMERIC NOT NULL,
  reference_id UUID, -- ID da venda, compra, etc.
  reference_type TEXT, -- 'sale', 'purchase', 'adjustment'
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Tabela de leads/prospects
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  position TEXT,
  lead_source_id UUID REFERENCES public.lead_sources(id),
  assigned_to UUID REFERENCES public.salespeople(id),
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

-- 12. Tabela de interações com clientes
CREATE TABLE IF NOT EXISTS public.customer_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'whatsapp', 'visit'
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

-- 13. Habilitar RLS em todas as tabelas
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salespeople ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_interactions ENABLE ROW LEVEL SECURITY;

-- 14. Políticas RLS básicas
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage suppliers" ON public.suppliers FOR ALL USING (true);

CREATE POLICY "Public read product_categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Public read units" ON public.units FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read carriers" ON public.carriers FOR SELECT USING (true);

CREATE POLICY "Users can manage quote_items" ON public.quote_items FOR ALL USING (true);
CREATE POLICY "Users can view salespeople" ON public.salespeople FOR SELECT USING (true);
CREATE POLICY "Users can view price_history" ON public.price_history FOR SELECT USING (true);
CREATE POLICY "Users can manage stock_movements" ON public.stock_movements FOR ALL USING (true);
CREATE POLICY "Users can manage leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Users can manage customer_interactions" ON public.customer_interactions FOR ALL USING (true);

-- 15. Triggers para atualização automática
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER calculate_product_margins_trigger
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_product_margins();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 16. Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(code);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON public.quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_product ON public.quote_items(product_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_customer ON public.customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);

-- 17. Inserir dados básicos
INSERT INTO public.units (name, abbreviation, type) VALUES 
('Quilograma', 'kg', 'weight'),
('Grama', 'g', 'weight'),
('Tonelada', 't', 'weight'),
('Metro', 'm', 'length'),
('Centímetro', 'cm', 'length'),
('Metro Quadrado', 'm²', 'area'),
('Unidade', 'un', 'unit'),
('Peça', 'pç', 'unit'),
('Metro Linear', 'ml', 'length'),
('Litro', 'l', 'volume')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_categories (name, description) VALUES 
('Metais Ferrosos', 'Aços, ferro fundido, etc.'),
('Metais Não Ferrosos', 'Alumínio, cobre, bronze, etc.'),
('Chapas', 'Chapas de diversos materiais'),
('Barras', 'Barras redondas, quadradas, etc.'),
('Tubos', 'Tubos de diversos diâmetros'),
('Perfis', 'Perfis estruturais'),
('Acessórios', 'Parafusos, porcas, arruelas, etc.')
ON CONFLICT DO NOTHING;