-- Corrigir função restante sem search_path e criar dados de exemplo para CRM

-- 1. Corrigir última função sem search_path (deve ser a update_updated_at_column)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Criar clientes de exemplo para teste do CRM
INSERT INTO public.customers (
  name, email, phone, company, address, city, state, 
  status, lead_source, cnpj, contact_person, lifecycle_stage,
  lead_score, owner, created_by
) VALUES 
(
  'João Silva', 'joao.silva@metalurgica.com.br', '(11) 99999-1234', 
  'Metalúrgica Silva Ltda', 'Rua das Indústrias, 123', 'São Paulo', 'SP',
  'active', 'Website', '12.345.678/0001-90', 'João Silva', 'customer',
  85, 'Admin', 'Sistema'
),
(
  'Maria Santos', 'maria@construcaoabc.com.br', '(21) 88888-5678',
  'Construção ABC S.A.', 'Av. Industrial, 456', 'Rio de Janeiro', 'RJ', 
  'active', 'Indicação', '98.765.432/0001-10', 'Maria Santos', 'lead',
  72, 'Admin', 'Sistema'
),
(
  'Carlos Oliveira', 'carlos@ferragens.net', '(31) 77777-9012',
  'Ferragens Oliveira', 'Rua do Comércio, 789', 'Belo Horizonte', 'MG',
  'active', 'Google Ads', '11.222.333/0001-44', 'Carlos Oliveira', 'prospect',
  60, 'Admin', 'Sistema'
),
(
  'Ana Costa', 'ana.costa@siderurgia.com', '(41) 66666-3456', 
  'Siderúrgica Costa', 'Av. das Máquinas, 321', 'Curitiba', 'PR',
  'active', 'Evento', '55.666.777/0001-88', 'Ana Costa', 'opportunity',
  90, 'Admin', 'Sistema'
),
(
  'Roberto Lima', 'roberto@metalspro.com.br', '(51) 55555-7890',
  'Metals Pro Indústria', 'Rua da Produção, 654', 'Porto Alegre', 'RS',
  'active', 'Redes Sociais', '22.333.444/0001-22', 'Roberto Lima', 'lead',
  55, 'Admin', 'Sistema'
)
ON CONFLICT (email) DO NOTHING;

-- 3. Criar oportunidades de exemplo
INSERT INTO public.opportunities (
  customer_id, title, description, value, probability,
  expected_close_date, stage, status, assigned_to, created_by
) 
SELECT 
  c.id,
  'Fornecimento de Aço Inox - ' || c.company,
  'Oportunidade de fornecimento de materiais de aço inoxidável para ' || c.company,
  CASE 
    WHEN c.name = 'João Silva' THEN 150000.00
    WHEN c.name = 'Maria Santos' THEN 230000.00
    WHEN c.name = 'Carlos Oliveira' THEN 85000.00
    WHEN c.name = 'Ana Costa' THEN 320000.00
    WHEN c.name = 'Roberto Lima' THEN 180000.00
    ELSE 100000.00
  END,
  CASE 
    WHEN c.lifecycle_stage = 'customer' THEN 90
    WHEN c.lifecycle_stage = 'opportunity' THEN 75
    WHEN c.lifecycle_stage = 'lead' THEN 45
    ELSE 25
  END,
  CASE 
    WHEN c.lifecycle_stage = 'customer' THEN CURRENT_DATE + INTERVAL '15 days'
    WHEN c.lifecycle_stage = 'opportunity' THEN CURRENT_DATE + INTERVAL '30 days'
    WHEN c.lifecycle_stage = 'lead' THEN CURRENT_DATE + INTERVAL '60 days'
    ELSE CURRENT_DATE + INTERVAL '90 days'
  END,
  CASE 
    WHEN c.lifecycle_stage = 'customer' THEN 'Fechamento'
    WHEN c.lifecycle_stage = 'opportunity' THEN 'Proposta'
    WHEN c.lifecycle_stage = 'lead' THEN 'Qualificação'
    ELSE 'Prospecção'
  END,
  'active',
  'Admin',
  'Sistema'
FROM public.customers c
WHERE c.email IN (
  'joao.silva@metalurgica.com.br',
  'maria@construcaoabc.com.br', 
  'carlos@ferragens.net',
  'ana.costa@siderurgia.com',
  'roberto@metalspro.com.br'
)
ON CONFLICT DO NOTHING;

-- 4. Criar deals relacionados aos clientes
INSERT INTO public.deals (
  customer_id, title, value, status, description, assigned_to, created_by
)
SELECT 
  c.id,
  'Negociação ' || c.company,
  CASE 
    WHEN c.name = 'João Silva' THEN 150000.00
    WHEN c.name = 'Maria Santos' THEN 230000.00
    WHEN c.name = 'Ana Costa' THEN 320000.00
    ELSE 100000.00
  END,
  CASE 
    WHEN c.lifecycle_stage = 'customer' THEN 'won'
    WHEN c.lifecycle_stage = 'opportunity' THEN 'in_progress'
    ELSE 'lead'
  END,
  'Deal para fornecimento de produtos metálicos para ' || c.company,
  'Admin',
  'Sistema'
FROM public.customers c
WHERE c.lifecycle_stage IN ('customer', 'opportunity', 'lead')
ON CONFLICT DO NOTHING;

-- 5. Criar tarefas relacionadas ao CRM
INSERT INTO public.tasks (
  user_id, title, description, due_date, status, priority_level, 
  customer_id, type, assigned_to
)
SELECT 
  gen_random_uuid(), -- user_id temporário
  'Follow-up com ' || c.name,
  'Entrar em contato com ' || c.name || ' da empresa ' || c.company || ' para acompanhar o interesse nos produtos.',
  CASE 
    WHEN c.lifecycle_stage = 'lead' THEN CURRENT_DATE + INTERVAL '3 days'
    WHEN c.lifecycle_stage = 'prospect' THEN CURRENT_DATE + INTERVAL '7 days'
    WHEN c.lifecycle_stage = 'opportunity' THEN CURRENT_DATE + INTERVAL '2 days'
    ELSE CURRENT_DATE + INTERVAL '14 days'
  END,
  'pendente',
  CASE 
    WHEN c.lifecycle_stage = 'opportunity' THEN 'alta'
    WHEN c.lifecycle_stage = 'lead' THEN 'media'
    ELSE 'baixa'
  END,
  c.id,
  'follow_up',
  'Admin'
FROM public.customers c
LIMIT 5
ON CONFLICT DO NOTHING;

-- 6. Atualizar relacionamentos das tabelas de referência nos clientes
UPDATE public.customers SET 
  lead_source_id = ls.id,
  segment_id = cs.id,
  customer_type_id = ct.id,
  priority_id = p.id,
  qualification_status_id = qs.id
FROM 
  public.lead_sources ls,
  public.customer_segments cs,
  public.customer_types ct,
  public.priorities p,
  public.qualification_status qs
WHERE 
  customers.lead_source = ls.name AND
  cs.name = CASE 
    WHEN customers.company LIKE '%S.A.%' OR customers.company LIKE '%Ltda%' THEN 'SMB'
    WHEN customers.company LIKE '%Indústria%' THEN 'Enterprise'
    ELSE 'SMB'
  END AND
  ct.name = 'Pessoa Jurídica' AND
  p.name = CASE 
    WHEN customers.lifecycle_stage = 'customer' THEN 'Alta'
    WHEN customers.lifecycle_stage = 'opportunity' THEN 'Média'
    ELSE 'Baixa'
  END AND
  qs.name = CASE 
    WHEN customers.lifecycle_stage IN ('customer', 'opportunity') THEN 'Qualificado'
    WHEN customers.lifecycle_stage = 'lead' THEN 'Em Qualificação'
    ELSE 'Não Qualificado'
  END;

-- 7. Corrigir função que estava faltando search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;