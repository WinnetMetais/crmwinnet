-- Terceira parte: Corrigir foreign keys e completar estrutura

-- 1. Adicionar foreign keys sem IF NOT EXISTS
DO $$
BEGIN
    -- Tentar adicionar foreign key para category_id
    BEGIN
        ALTER TABLE public.products 
        ADD CONSTRAINT fk_products_category 
        FOREIGN KEY (category_id) REFERENCES public.product_categories(id);
    EXCEPTION
        WHEN duplicate_object THEN 
            NULL; -- Constraint já existe
    END;
    
    -- Tentar adicionar foreign key para supplier_id
    BEGIN
        ALTER TABLE public.products 
        ADD CONSTRAINT fk_products_supplier 
        FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);
    EXCEPTION
        WHEN duplicate_object THEN 
            NULL; -- Constraint já existe
    END;
    
    -- Tentar adicionar foreign key para unit_id
    BEGIN
        ALTER TABLE public.products 
        ADD CONSTRAINT fk_products_unit 
        FOREIGN KEY (unit_id) REFERENCES public.units(id);
    EXCEPTION
        WHEN duplicate_object THEN 
            NULL; -- Constraint já existe
    END;
END $$;

-- 2. Adicionar foreign key para parent categories
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.product_categories 
        ADD CONSTRAINT fk_product_categories_parent 
        FOREIGN KEY (parent_id) REFERENCES public.product_categories(id);
    EXCEPTION
        WHEN duplicate_object THEN 
            NULL; -- Constraint já existe
    END;
END $$;

-- 3. Adicionar foreign key para base units
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.units 
        ADD CONSTRAINT fk_units_base 
        FOREIGN KEY (base_unit_id) REFERENCES public.units(id);
    EXCEPTION
        WHEN duplicate_object THEN 
            NULL; -- Constraint já existe
    END;
END $$;

-- 4. Inserir dados básicos nos fornecedores (exemplos da Winnet)
INSERT INTO public.suppliers (name, company_name, cnpj, email, phone, active) VALUES 
('Usiminas', 'Usinas Siderúrgicas de Minas Gerais S.A.', '33.741.094/0001-19', 'vendas@usiminas.com', '(31) 3499-8000', true),
('CSN', 'Companhia Siderúrgica Nacional', '33.042.730/0001-04', 'comercial@csn.com.br', '(24) 3355-5000', true),
('Gerdau', 'Gerdau S.A.', '33.611.500/0001-19', 'vendas@gerdau.com.br', '(51) 3323-2000', true),
('ArcelorMittal', 'ArcelorMittal Brasil S.A.', '17.469.701/0001-77', 'vendas@arcelormittal.com.br', '(31) 3219-5000', true)
ON CONFLICT DO NOTHING;

-- 5. Inserir transportadoras (exemplos comuns no Brasil)
INSERT INTO public.carriers (name, cnpj, email, phone, delivery_time_days, active) VALUES 
('Jamef', '02.029.928/0001-09', 'atendimento@jamef.com.br', '0800-773-5263', 3, true),
('Total Express', '04.884.082/0001-35', 'atendimento@totalexpress.com.br', '0800-970-7000', 2, true),
('Braspress', '48.740.351/0002-76', 'atendimento@braspress.com.br', '0800-970-6446', 4, true),
('Mercúrio', '61.074.175/0001-11', 'atendimento@mercurio.com.br', '0800-727-2525', 5, true)
ON CONFLICT DO NOTHING;

-- 6. Inserir produtos de exemplo da Winnet Metais
INSERT INTO public.products (code, name, description, category_id, unit_id, cost_price, sale_price, active) 
SELECT 
    'WM-001', 
    'Chapa de Aço Carbono 1020', 
    'Chapa de aço carbono SAE 1020, espessura variável',
    cat.id,
    unit.id,
    15.50,
    25.80,
    true
FROM public.product_categories cat, public.units unit
WHERE cat.name = 'Chapas' AND unit.abbreviation = 'kg'
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.products (code, name, description, category_id, unit_id, cost_price, sale_price, active) 
SELECT 
    'WM-002', 
    'Barra Redonda Aço 1045', 
    'Barra redonda em aço SAE 1045, diâmetro 25mm',
    cat.id,
    unit.id,
    8.90,
    14.70,
    true
FROM public.product_categories cat, public.units unit
WHERE cat.name = 'Barras' AND unit.abbreviation = 'kg'
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.products (code, name, description, category_id, unit_id, cost_price, sale_price, active) 
SELECT 
    'WM-003', 
    'Tubo de Alumínio 6063', 
    'Tubo de alumínio liga 6063, diâmetro 50x3mm',
    cat.id,
    unit.id,
    22.40,
    35.60,
    true
FROM public.product_categories cat, public.units unit
WHERE cat.name = 'Tubos' AND unit.abbreviation = 'ml'
ON CONFLICT (code) DO NOTHING;

-- 7. Atualizar produtos com margens calculadas
UPDATE public.products SET
    margin_50 = cost_price / (1 - 0.50),
    margin_55 = cost_price / (1 - 0.55),
    margin_60 = cost_price / (1 - 0.60),
    margin_65 = cost_price / (1 - 0.65),
    margin_70 = cost_price / (1 - 0.70),
    margin_75 = cost_price / (1 - 0.75)
WHERE cost_price > 0;

-- 8. Inserir dados de exemplo nas condições de pagamento
INSERT INTO public.payment_methods (name, type, active) VALUES 
('À Vista', 'cash', true),
('30 dias', 'term', true),
('45 dias', 'term', true),
('60 dias', 'term', true),
('PIX', 'digital', true),
('Cartão de Crédito', 'card', true),
('Boleto', 'bank_slip', true)
ON CONFLICT DO NOTHING;