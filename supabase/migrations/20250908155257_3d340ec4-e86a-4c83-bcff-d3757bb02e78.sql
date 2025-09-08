-- FASE 1: Corrigir Sistema de Exclusão de Transações

-- Remover trigger problemático de soft delete
DROP TRIGGER IF EXISTS soft_delete_transaction_trigger ON public.transactions;
DROP FUNCTION IF EXISTS public.soft_delete_transaction();

-- Corrigir view active_transactions para filtrar corretamente
DROP VIEW IF EXISTS public.active_transactions;
CREATE VIEW public.active_transactions AS
SELECT * FROM public.transactions 
WHERE deleted_at IS NULL;

-- FASE 2: Criar tabela profiles para gestão de usuários (simples)

-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  display_name text,
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

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());