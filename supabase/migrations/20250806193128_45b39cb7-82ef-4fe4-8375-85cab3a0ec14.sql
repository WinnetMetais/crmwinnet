-- Corrigir sistema de gestão de usuários (remover trigger existente primeiro)

-- 1. Remover trigger se existir
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- 2. Criar tabela de perfis se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  display_name TEXT,
  department TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 3. Criar enum para permissões se não existir
DO $$ BEGIN
  CREATE TYPE public.permission_type AS ENUM (
    'vendas', 'clientes', 'relatórios', 'estoque', 
    'financeiro', 'configurações', 'marketing', 'admin'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. Criar tabela de permissões
CREATE TABLE IF NOT EXISTS public.user_permissions_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission permission_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- 5. Criar tabela de departamentos
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Inserir departamentos padrão
INSERT INTO public.departments (name, description) VALUES 
  ('Comercial', 'Departamento de vendas e relacionamento com clientes'),
  ('Operações', 'Gestão operacional e logística'),
  ('Financeiro', 'Controle financeiro e contábil'),
  ('Marketing', 'Marketing digital e campanhas'),
  ('Administração', 'Gestão administrativa e recursos humanos')
ON CONFLICT (name) DO NOTHING;

-- 7. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 8. Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 9. Criar políticas para profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- 10. Remover políticas existentes para permissões
DROP POLICY IF EXISTS "Users can view all permissions" ON public.user_permissions_new;
DROP POLICY IF EXISTS "Admins can manage permissions" ON public.user_permissions_new;

-- 11. Criar políticas para permissões
CREATE POLICY "Users can view all permissions" ON public.user_permissions_new FOR SELECT USING (true);

-- 12. Criar políticas para departments
DROP POLICY IF EXISTS "Everyone can view departments" ON public.departments;
CREATE POLICY "Everyone can view departments" ON public.departments FOR SELECT USING (true);

-- 13. Recriar trigger para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();