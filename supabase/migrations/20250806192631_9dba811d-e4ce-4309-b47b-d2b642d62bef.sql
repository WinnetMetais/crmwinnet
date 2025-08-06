-- Criar sistema completo de gestão de usuários
-- 1. Tabela de perfis de usuários
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

-- 2. Enum para permissões
CREATE TYPE public.permission_type AS ENUM (
  'vendas', 'clientes', 'relatórios', 'estoque', 
  'financeiro', 'configurações', 'marketing', 'admin'
);

-- 3. Tabela de permissões de usuários
CREATE TABLE IF NOT EXISTS public.user_permissions_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission permission_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- 4. Tabela de departamentos
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Inserir departamentos padrão
INSERT INTO public.departments (name, description) VALUES 
  ('Comercial', 'Departamento de vendas e relacionamento com clientes'),
  ('Operações', 'Gestão operacional e logística'),
  ('Financeiro', 'Controle financeiro e contábil'),
  ('Marketing', 'Marketing digital e campanhas'),
  ('Administração', 'Gestão administrativa e recursos humanos')
ON CONFLICT (name) DO NOTHING;

-- 6. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS para profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_permissions_new 
    WHERE user_id = auth.uid() AND permission = 'admin'
  )
);

-- 8. Políticas para user_permissions_new
CREATE POLICY "Users can view all permissions" ON public.user_permissions_new FOR SELECT USING (true);
CREATE POLICY "Admins can manage permissions" ON public.user_permissions_new FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_permissions_new 
    WHERE user_id = auth.uid() AND permission = 'admin'
  )
);

-- 9. Políticas para departments
CREATE POLICY "Everyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_permissions_new 
    WHERE user_id = auth.uid() AND permission = 'admin'
  )
);

-- 10. Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Criar perfil básico
  INSERT INTO public.profiles (user_id, full_name, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  
  -- Dar permissões básicas para novos usuários
  INSERT INTO public.user_permissions_new (user_id, permission)
  VALUES (NEW.id, 'vendas'), (NEW.id, 'clientes');
  
  RETURN NEW;
END;
$$;

-- 11. Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Trigger para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_permissions_new 
    WHERE user_id = user_uuid AND permission = 'admin'
  );
$$;