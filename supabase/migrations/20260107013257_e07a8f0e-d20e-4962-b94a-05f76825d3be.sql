-- Inserir departamentos iniciais
INSERT INTO departments (name, description, active) VALUES
  ('Comercial', 'Departamento de vendas e atendimento ao cliente', true),
  ('Financeiro', 'Departamento financeiro e contabilidade', true),
  ('Produção', 'Departamento de produção e manufatura', true),
  ('Logística', 'Departamento de logística e expedição', true),
  ('Administrativo', 'Departamento administrativo geral', true)
ON CONFLICT DO NOTHING;

-- Inserir segmentos de clientes
INSERT INTO customer_segments (name, description, criteria, active) VALUES
  ('Grandes Contas', 'Clientes com faturamento acima de R$ 50.000/ano', '{"min_revenue": 50000}', true),
  ('Contas Médias', 'Clientes com faturamento entre R$ 10.000 e R$ 50.000/ano', '{"min_revenue": 10000, "max_revenue": 50000}', true),
  ('Pequenas Contas', 'Clientes com faturamento abaixo de R$ 10.000/ano', '{"max_revenue": 10000}', true),
  ('Clientes Inativos', 'Clientes sem atividade nos últimos 6 meses', '{"inactive_months": 6}', true)
ON CONFLICT DO NOTHING;

-- Criar função para sincronizar perfil do usuário
CREATE OR REPLACE FUNCTION public.sync_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user',
    'active'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN NEW;
END;
$$;

-- Criar trigger para sincronizar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_profile();