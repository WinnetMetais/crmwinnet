-- FASE 1: Corrigir Sistema de Exclusão de Transações

-- Remover trigger problemático de soft delete
DROP TRIGGER IF EXISTS soft_delete_transaction_trigger ON public.transactions;
DROP FUNCTION IF EXISTS public.soft_delete_transaction();

-- Corrigir view active_transactions para filtrar corretamente
DROP VIEW IF EXISTS public.active_transactions;
CREATE VIEW public.active_transactions AS
SELECT * FROM public.transactions 
WHERE deleted_at IS NULL;

-- FASE 2: Criar tabela profiles para gestão de usuários

-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  display_name text,
  email text,
  role text DEFAULT 'user',
  status text DEFAULT 'active',
  permissions text[] DEFAULT '{}',
  department_id uuid REFERENCES public.departments(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar perfil automaticamente quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FASE 3: Limpar e corrigir políticas RLS duplicadas

-- Remover todas as políticas duplicadas das tabelas principais
DROP POLICY IF EXISTS "Users can view all customers" ON public.customers;
DROP POLICY IF EXISTS "Users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete customers" ON public.customers;

DROP POLICY IF EXISTS "Users can view all deals" ON public.deals;
DROP POLICY IF EXISTS "Users can insert deals" ON public.deals;
DROP POLICY IF EXISTS "Users can update deals" ON public.deals;
DROP POLICY IF EXISTS "Users can delete deals" ON public.deals;

-- Recriar políticas simples e funcionais
CREATE POLICY "Enable all access for authenticated users" ON public.customers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON public.deals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON public.transactions
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Corrigir sistema_users se existir dados lá
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'system_users') THEN
    -- Migrar dados de system_users para profiles se houver
    INSERT INTO public.profiles (user_id, full_name, email, role, status, created_at, updated_at)
    SELECT 
      su.user_id,
      su.full_name,
      su.email,
      su.role,
      su.status,
      su.created_at,
      su.updated_at
    FROM public.system_users su
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.user_id = su.user_id
    );
  END IF;
END $$;