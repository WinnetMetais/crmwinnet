-- CORREÇÃO COMPLETA DO BANCO DE DADOS SUPABASE
-- Corrigindo todos os warnings de performance e segurança

-- =========================================
-- 1. OTIMIZAÇÃO DE POLÍTICAS RLS EXISTENTES
-- =========================================

-- Remover e recriar políticas otimizadas para tabela customers
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.customers;
CREATE POLICY "Enable all access for authenticated users" ON public.customers
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

-- Remover e recriar políticas otimizadas para tabela deals  
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.deals;
CREATE POLICY "Enable all access for authenticated users" ON public.deals
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

-- Otimizar políticas da tabela transactions
DROP POLICY IF EXISTS "financial_select_policy" ON public.transactions;
DROP POLICY IF EXISTS "financial_insert_policy" ON public.transactions;  
DROP POLICY IF EXISTS "financial_update_policy" ON public.transactions;
DROP POLICY IF EXISTS "financial_delete_policy" ON public.transactions;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.transactions;
DROP POLICY IF EXISTS "users can see own transactions" ON public.transactions;

CREATE POLICY "transactions_select_optimized" ON public.transactions
    FOR SELECT USING (
        (user_id = (SELECT auth.uid())) OR 
        has_financial_permission('view') OR 
        has_financial_permission('admin')
    );

CREATE POLICY "transactions_insert_optimized" ON public.transactions
    FOR INSERT WITH CHECK (
        (user_id = (SELECT auth.uid())) OR 
        has_financial_permission('create') OR 
        has_financial_permission('admin')
    );

CREATE POLICY "transactions_update_optimized" ON public.transactions
    FOR UPDATE USING (
        (user_id = (SELECT auth.uid())) OR 
        has_financial_permission('update') OR 
        has_financial_permission('admin')
    );

CREATE POLICY "transactions_delete_optimized" ON public.transactions
    FOR DELETE USING (
        (user_id = (SELECT auth.uid())) OR 
        has_financial_permission('delete') OR 
        has_financial_permission('admin')
    );

-- Otimizar políticas da tabela profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "profiles_select_optimized" ON public.profiles
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "profiles_update_optimized" ON public.profiles  
    FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "profiles_insert_optimized" ON public.profiles
    FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

-- Otimizar políticas da tabela opportunities
DROP POLICY IF EXISTS "p_opps_select" ON public.opportunities;
DROP POLICY IF EXISTS "p_opps_insert" ON public.opportunities;
DROP POLICY IF EXISTS "p_opps_update" ON public.opportunities;
DROP POLICY IF EXISTS "p_opps_delete" ON public.opportunities;

CREATE POLICY "opportunities_select_optimized" ON public.opportunities
    FOR SELECT USING (owner_id = (SELECT auth.uid()));

CREATE POLICY "opportunities_insert_optimized" ON public.opportunities
    FOR INSERT WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "opportunities_update_optimized" ON public.opportunities
    FOR UPDATE USING (owner_id = (SELECT auth.uid()));

CREATE POLICY "opportunities_delete_optimized" ON public.opportunities
    FOR DELETE USING (owner_id = (SELECT auth.uid()));

-- Otimizar políticas da tabela financial_permissions
DROP POLICY IF EXISTS "financial_permissions_select" ON public.financial_permissions;
DROP POLICY IF EXISTS "financial_permissions_manage" ON public.financial_permissions;

CREATE POLICY "financial_permissions_select_optimized" ON public.financial_permissions
    FOR SELECT USING (
        (user_id = (SELECT auth.uid())) OR 
        has_financial_permission('admin')
    );

CREATE POLICY "financial_permissions_manage_optimized" ON public.financial_permissions
    FOR ALL USING (has_financial_permission('admin'))
    WITH CHECK (has_financial_permission('admin'));

-- Otimizar políticas da tabela system_users
DROP POLICY IF EXISTS "system_users_select" ON public.system_users;
DROP POLICY IF EXISTS "Users can view their own record" ON public.system_users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.system_users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.system_users;
DROP POLICY IF EXISTS "Admins can update users" ON public.system_users;

CREATE POLICY "system_users_select_optimized" ON public.system_users
    FOR SELECT USING (
        (user_id = (SELECT auth.uid())) OR 
        has_financial_permission('admin')
    );

CREATE POLICY "system_users_manage_optimized" ON public.system_users
    FOR ALL USING (has_financial_permission('admin'))
    WITH CHECK (has_financial_permission('admin'));

-- Otimizar políticas da tabela approval_hierarchy
DROP POLICY IF EXISTS "approval_hierarchy_select" ON public.approval_hierarchy;
DROP POLICY IF EXISTS "approval_hierarchy_manage" ON public.approval_hierarchy;
DROP POLICY IF EXISTS "Users can view hierarchy where they are involved" ON public.approval_hierarchy;
DROP POLICY IF EXISTS "Admins can manage approval hierarchy" ON public.approval_hierarchy;

CREATE POLICY "approval_hierarchy_select_optimized" ON public.approval_hierarchy
    FOR SELECT USING (
        (user_id = (SELECT auth.uid())) OR 
        (approver_id = (SELECT auth.uid())) OR 
        has_financial_permission('admin')
    );

CREATE POLICY "approval_hierarchy_manage_optimized" ON public.approval_hierarchy
    FOR ALL USING (has_financial_permission('admin'))
    WITH CHECK (has_financial_permission('admin'));

-- Otimizar políticas da tabela approval_requests
DROP POLICY IF EXISTS "approval_requests_select" ON public.approval_requests;
DROP POLICY IF EXISTS "approval_requests_insert" ON public.approval_requests;
DROP POLICY IF EXISTS "approval_requests_update" ON public.approval_requests;

CREATE POLICY "approval_requests_select_optimized" ON public.approval_requests
    FOR SELECT USING (
        (requester_id = (SELECT auth.uid())) OR 
        (approver_id = (SELECT auth.uid())) OR 
        has_financial_permission('admin')
    );

CREATE POLICY "approval_requests_insert_optimized" ON public.approval_requests
    FOR INSERT WITH CHECK (requester_id = (SELECT auth.uid()));

CREATE POLICY "approval_requests_update_optimized" ON public.approval_requests
    FOR UPDATE USING (
        (approver_id = (SELECT auth.uid())) OR 
        has_financial_permission('admin')
    );

-- =============================================
-- 2. POLÍTICAS PARA TABELAS SEM RLS DEFINIDA
-- =============================================

-- Habilitar RLS e criar políticas para tabelas que precisam
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.index_usage_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de autenticação para tabelas operacionais
CREATE POLICY "authenticated_access" ON public.analytics_data
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.content_calendar  
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.content_templates
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.custom_fields
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.custom_reports
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.customer_interactions
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.customer_types
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

-- Políticas específicas para tabelas financeiras e administrativas
CREATE POLICY "admin_only_access" ON public.backup_jobs
    FOR ALL USING (has_financial_permission('admin'));

CREATE POLICY "admin_only_access" ON public.financial_reports
    FOR ALL USING (has_financial_permission('admin') OR has_financial_permission('manager'));

CREATE POLICY "admin_only_access" ON public.index_usage_snapshots
    FOR ALL USING (has_financial_permission('admin'));

CREATE POLICY "admin_only_access" ON public.integration_logs
    FOR ALL USING (has_financial_permission('admin') OR has_financial_permission('manager'));

-- Política para carriers (logística)
CREATE POLICY "authenticated_access" ON public.carriers
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

-- ========================================
-- 3. CRIAR FUNÇÃO OTIMIZADA PARA AUTH 
-- ========================================

-- Função otimizada para verificar se o usuário está autenticado
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid();
$$;

-- Função para verificar role atual
CREATE OR REPLACE FUNCTION public.current_user_role()  
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.role();
$$;