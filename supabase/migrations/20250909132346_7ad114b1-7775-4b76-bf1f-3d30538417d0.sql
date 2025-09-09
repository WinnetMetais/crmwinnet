-- TERCEIRA FASE DA CORREÇÃO COMPLETA DO BANCO SUPABASE  
-- Corrigindo policies duplicadas e completando warnings

-- ============================================
-- 1. CORRIGIR POLÍTICAS DUPLICADAS PRIMEIRO
-- ============================================

-- Remover políticas existentes com conflito e recriar com nomes únicos
DROP POLICY IF EXISTS "admin_manage" ON public.automation_rules;
DROP POLICY IF EXISTS "admin_access" ON public.automation_rules; 
DROP POLICY IF EXISTS "Users can view automation rules" ON public.automation_rules;
DROP POLICY IF EXISTS "Admins can manage automation rules" ON public.automation_rules;

-- Recriar políticas para automation_rules com nomes únicos
CREATE POLICY "automation_rules_view" ON public.automation_rules
    FOR SELECT USING (
        has_financial_permission('admin') OR 
        has_financial_permission('manager')
    );

CREATE POLICY "automation_rules_create" ON public.automation_rules
    FOR INSERT WITH CHECK (has_financial_permission('admin'));

CREATE POLICY "automation_rules_modify" ON public.automation_rules  
    FOR UPDATE USING (has_financial_permission('admin'));

CREATE POLICY "automation_rules_remove" ON public.automation_rules
    FOR DELETE USING (has_financial_permission('admin'));

-- =======================================
-- 2. POLÍTICAS PARA TABELAS RESTANTES
-- =======================================

-- Verificar se já existem políticas antes de criar
DO $$ 
BEGIN
    -- Política para inventory se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'inventory' 
        AND policyname = 'authenticated_inventory_access'
    ) THEN
        ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "authenticated_inventory_access" ON public.inventory
            FOR ALL USING ((SELECT auth.role()) = 'authenticated');
    END IF;

    -- Política para leads se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'leads' 
        AND policyname = 'authenticated_leads_access'
    ) THEN
        ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "authenticated_leads_access" ON public.leads
            FOR ALL USING ((SELECT auth.role()) = 'authenticated');
    END IF;

    -- Política para notifications se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'notifications' 
        AND policyname = 'notifications_user_access'
    ) THEN
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "notifications_user_access" ON public.notifications
            FOR SELECT USING (user_id = (SELECT auth.uid()));
        CREATE POLICY "notifications_system_insert" ON public.notifications
            FOR INSERT WITH CHECK (true);
    END IF;

    -- Política para orders se não existir  
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'orders' 
        AND policyname = 'orders_user_access'
    ) THEN
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "orders_user_access" ON public.orders
            FOR ALL USING (
                (owner_id = (SELECT auth.uid())) OR 
                (user_id = (SELECT auth.uid())) OR
                ((SELECT auth.role()) = 'authenticated')
            );
    END IF;

    -- Política para products se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'products' 
        AND policyname = 'products_authenticated_access'
    ) THEN
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "products_authenticated_access" ON public.products
            FOR ALL USING ((SELECT auth.role()) = 'authenticated');
    END IF;

    -- Política para quotes se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'quotes' 
        AND policyname = 'quotes_user_access'
    ) THEN
        ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "quotes_user_access" ON public.quotes
            FOR ALL USING (
                (owner_id = (SELECT auth.uid())) OR
                ((SELECT auth.role()) = 'authenticated')
            );
    END IF;

    -- Política para tasks se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'tasks' 
        AND policyname = 'tasks_user_access'
    ) THEN
        ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "tasks_user_access" ON public.tasks
            FOR ALL USING (
                (assigned_to = (SELECT auth.uid())) OR
                (created_by = (SELECT auth.uid())) OR
                ((SELECT auth.role()) = 'authenticated')
            );
    END IF;

    -- Política para user_roles se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_roles' 
        AND policyname = 'user_roles_access'
    ) THEN
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "user_roles_access" ON public.user_roles
            FOR SELECT USING (
                (user_id = (SELECT auth.uid())) OR
                has_financial_permission('admin')
            );
        CREATE POLICY "user_roles_manage" ON public.user_roles
            FOR ALL USING (has_financial_permission('admin'))
            WITH CHECK (has_financial_permission('admin'));
    END IF;

END $$;

-- ====================================================
-- 3. DESABILITAR RLS EM TABELAS QUE NÃO PRECISAM
-- ====================================================

-- Algumas tabelas podem não precisar de RLS se são puramente operacionais
-- Vamos manter RLS mas com políticas mais abertas

-- =======================================
-- 4. OTIMIZAR FUNÇÕES RESTANTES
-- =======================================

-- Atualizar funções que ainda não foram corrigidas
CREATE OR REPLACE FUNCTION public.inventory_touch()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Update the timestamp on the row being modified
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    NEW.modified_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.on_invoice_paid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Criar transação automaticamente
    INSERT INTO public.transactions (
      id, user_id, type, title, amount, category, subcategory, channel,
      date, due_date, payment_method, status, recurring, recurring_period,
      description, tags, client_name, invoice_number
    ) VALUES (
      gen_random_uuid(),
      (SELECT auth.uid()),
      'receita',
      'Faturamento - Invoice ' || COALESCE(NEW.number, NEW.id::text),
      NEW.total,
      'Vendas',
      'Faturamento',
      'faturamento',
      NEW.issue_date,
      NEW.due_date,
      'transferencia',
      'pago',
      false,
      NULL,
      'Invoice ID: ' || NEW.id::text || ' - Pago automaticamente',
      ARRAY['venda','faturamento','automatico'],
      '',
      COALESCE(NEW.number, NEW.id::text)
    );

    -- Notificação
    INSERT INTO public.notifications (
      user_id, title, message, type, action_url, metadata
    ) VALUES (
      (SELECT auth.uid()),
      'Pagamento Recebido',
      'Invoice ' || COALESCE(NEW.number, NEW.id::text) || ' foi paga - R$ ' || NEW.total::text,
      'success',
      '/financial',
      jsonb_build_object('invoice_id', NEW.id, 'amount', NEW.total)
    );
  END IF;
  RETURN NEW;
END;
$$;