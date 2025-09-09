-- CORREÇÃO FINAL DO BANCO DE DADOS SUPABASE
-- Focando apenas em tabelas existentes

-- ============================================
-- 1. VERIFICAR E CORRIGIR FUNÇÕES RESTANTES  
-- ============================================

-- Corrigir funções que ainda precisam de search_path
CREATE OR REPLACE FUNCTION public.auto_create_revenue_on_sale()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  customer_name TEXT;
BEGIN
  -- Buscar nome do cliente
  SELECT name INTO customer_name 
  FROM public.customers 
  WHERE id = NEW.customer_id;
  
  -- Se mudou para status que gera receita
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status IN ('won', 'fechado', 'faturado', 'pago') THEN
      -- Criar transação automaticamente
      INSERT INTO public.transactions (
        id, user_id, type, title, amount, category, subcategory, channel,
        date, due_date, payment_method, status, recurring, recurring_period,
        description, tags, client_name, deal_id
      ) VALUES (
        gen_random_uuid(),
        (SELECT auth.uid()),
        'receita',
        COALESCE('Venda - ' || NEW.title, 'Venda Comercial'),
        COALESCE(NEW.value, 0),
        'Vendas',
        'Comercial',
        'comercial',
        CURRENT_DATE,
        CASE 
          WHEN NEW.status = 'pago' THEN CURRENT_DATE
          ELSE CURRENT_DATE + INTERVAL '30 days'
        END,
        CASE 
          WHEN NEW.status = 'pago' THEN 'dinheiro'
          ELSE 'boleto'
        END,
        CASE 
          WHEN NEW.status = 'pago' THEN 'pago'
          ELSE 'pendente'
        END,
        false,
        NULL,
        'Deal ID: ' || NEW.id::text || ' - Auto-criado',
        ARRAY['venda','comercial','automatico'],
        COALESCE(customer_name, ''),
        NEW.id
      );

      -- Criar notificação
      INSERT INTO public.notifications (
        user_id, title, message, type, action_url, metadata
      ) VALUES (
        (SELECT auth.uid()),
        'Nova Receita Automática',
        'Receita de R$ ' || COALESCE(NEW.value, 0)::text || ' criada para: ' || COALESCE(customer_name, 'Cliente'),
        'success',
        '/financial',
        jsonb_build_object('deal_id', NEW.id, 'auto_generated', true)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_product_margins()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.cost_price IS NOT NULL AND NEW.cost_price > 0 THEN
    NEW.margin_50 = NEW.cost_price / (1 - 0.50);
    NEW.margin_55 = NEW.cost_price / (1 - 0.55);
    NEW.margin_60 = NEW.cost_price / (1 - 0.60);
    NEW.margin_65 = NEW.cost_price / (1 - 0.65);
    NEW.margin_70 = NEW.cost_price / (1 - 0.70);
    NEW.margin_75 = NEW.cost_price / (1 - 0.75);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.tg_opportunity_to_sale()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
    -- function body
    RETURN NEW;
END;
$$;

-- ==================================================================
-- 2. POLÍTICAS APENAS PARA TABELAS QUE SABEMOS QUE EXISTEM
-- ==================================================================

DO $$ 
BEGIN
    -- Políticas para budgets se não existir
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'budgets' AND table_schema = 'public') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'budgets' 
            AND policyname = 'budgets_owner_access'
        ) THEN
            ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "budgets_owner_access" ON public.budgets
                FOR ALL USING (owner_id = (SELECT auth.uid()));
        END IF;
    END IF;

    -- Políticas para commission_rules/commissions se existirem
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'commission_rules' AND table_schema = 'public') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'commission_rules'
        ) THEN
            ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "commission_rules_access" ON public.commission_rules
                FOR ALL USING (
                    (user_id = (SELECT auth.uid())) OR 
                    ((SELECT auth.role()) = 'authenticated')
                );
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'commissions' AND table_schema = 'public') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'commissions'
        ) THEN
            ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "commissions_access" ON public.commissions
                FOR ALL USING (
                    (user_id = (SELECT auth.uid())) OR
                    ((SELECT auth.role()) = 'authenticated')
                );
        END IF;
    END IF;

END $$;

-- =============================================
-- 3. CRIAR ÍNDICES PARA MELHORAR PERFORMANCE 
-- =============================================

-- Índices para otimizar consultas com auth.uid()
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON public.deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_owner_id ON public.opportunities(owner_id) WHERE owner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_financial_permissions_user_id ON public.financial_permissions(user_id);

-- Índices compostos para consultas comuns
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_deals_status_customer ON public.deals(status, customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_status_created ON public.customers(status, created_at);

-- ========================================
-- 4. COMENTÁRIOS E DOCUMENTAÇÃO
-- ========================================

COMMENT ON FUNCTION public.has_financial_permission(text, text) IS 
'Função otimizada para verificar permissões financeiras. Evita recursão em políticas RLS.';

COMMENT ON FUNCTION public.current_user_id() IS 
'Função otimizada que retorna auth.uid() de forma segura para uso em políticas RLS.';

COMMENT ON FUNCTION public.current_user_role() IS 
'Função otimizada que retorna auth.role() de forma segura para uso em políticas RLS.';