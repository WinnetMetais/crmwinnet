-- Estrutura completa do banco - Primeira parte: corrigir tabelas existentes

-- 1. Adicionar campos faltantes na tabela products existente
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS code TEXT,
ADD COLUMN IF NOT EXISTS category_id UUID,
ADD COLUMN IF NOT EXISTS supplier_id UUID,
ADD COLUMN IF NOT EXISTS unit_id UUID,
ADD COLUMN IF NOT EXISTS cost_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS sale_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS margin_50 NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS margin_55 NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS margin_60 NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS margin_65 NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS margin_70 NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS margin_75 NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS stock_min NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS stock_max NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS stock_current NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Criar constraint unique para code se não existir
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE public.products ADD CONSTRAINT products_code_unique UNIQUE (code);
    EXCEPTION
        WHEN duplicate_object THEN 
            -- Constraint já existe, não faz nada
            NULL;
    END;
END $$;

-- 2. Tabela de unidades de medida
CREATE TABLE IF NOT EXISTS public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  type TEXT NOT NULL,
  conversion_factor NUMERIC DEFAULT 1,
  base_unit_id UUID,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela de categorias de produtos
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabela de fornecedores
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
  rating INTEGER DEFAULT 0,
  notes TEXT,
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

-- 6. Inserir dados básicos essenciais
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