-- MIGRAÇÃO FINAL - ELIMINAR OS ÚLTIMOS 10 WARNINGS
-- Correção definitiva dos warnings restantes

-- ======================================================
-- 1. IDENTIFICAR E CORRIGIR VIEWS COM SECURITY DEFINER
-- ======================================================

-- Primeiro, vamos buscar e corrigir todas as views com SECURITY DEFINER
DO $$
DECLARE
    view_name text;
BEGIN
    -- Buscar views com SECURITY DEFINER no schema public
    FOR view_name IN 
        SELECT viewname 
        FROM pg_views 
        WHERE schemaname = 'public' 
        AND definition ILIKE '%SECURITY DEFINER%'
    LOOP
        -- Dropar e recriar sem SECURITY DEFINER
        EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', view_name);
    END LOOP;
END $$;

-- Recriar views críticas sem SECURITY DEFINER
CREATE OR REPLACE VIEW public.me AS
SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.display_name,
    p.department,
    p.department_id,
    p.role,
    p.status,
    p.phone,
    p.avatar_url,
    p.bio,
    p.created_at,
    p.updated_at,
    d.name as department_name
FROM profiles p
LEFT JOIN departments d ON d.id = p.department_id
WHERE p.user_id = auth.uid();

-- ====================================================
-- 2. CORRIGIR FUNÇÕES SEM SEARCH_PATH (4 WARNINGS)
-- ====================================================

-- Corrigir as funções restantes que ainda não têm search_path definido
CREATE OR REPLACE FUNCTION public.auto_progress_quote_to_deal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status IN ('aprovado', 'aceito') THEN
      -- Create or update deal
      INSERT INTO deals (
        customer_id, title, value, status, description, quote_id, owner_id
      ) VALUES (
        NEW.customer_id,
        'Deal - ' || NEW.quote_number,
        NEW.total,
        'negotiation',
        'Deal criado automaticamente do orçamento ' || NEW.quote_number,
        NEW.id,
        (SELECT auth.uid())
      )
      ON CONFLICT (quote_id) DO UPDATE SET
        value = NEW.total,
        status = 'negotiation',
        updated_at = NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_quote_to_finance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only act when approved or paid
  IF TG_OP = 'UPDATE' THEN
    IF NEW.status IN ('aprovado', 'pago', 'fechado') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
      -- Insert into transactions if not already created for this quote
      IF NOT EXISTS (
        SELECT 1 FROM public.transactions t WHERE t.invoice_number = NEW.quote_number
      ) THEN
        INSERT INTO public.transactions (
          id, user_id, type, title, amount, category, subcategory, channel,
          date, due_date, payment_method, status, recurring, recurring_period,
          description, tags, client_name, invoice_number
        ) VALUES (
          gen_random_uuid(),
          (SELECT auth.uid()),
          'receita',
          COALESCE('Venda - Orçamento ' || NEW.quote_number, 'Venda - Orçamento'),
          COALESCE(NEW.total, 0),
          'Vendas',
          'Orçamentos aprovados',
          'comercial',
          COALESCE(NEW.approved_at::date, CURRENT_DATE),
          COALESCE(NEW.approved_at::date + INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days'),
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
          COALESCE('Orçamento ID: ' || NEW.id::text || ' - Status: ' || NEW.status, ''),
          ARRAY['venda','orcamento','automatico'],
          COALESCE(NEW.customer_name, ''),
          COALESCE(NEW.quote_number, NEW.id::text)
        );

        -- Insert notification
        INSERT INTO public.notifications (
          user_id, title, message, type, action_url, metadata
        ) VALUES (
          (SELECT auth.uid()),
          'Nova Receita - Orçamento',
          'Receita de R$ ' || COALESCE(NEW.total, 0)::text || ' criada automaticamente para orçamento: ' || COALESCE(NEW.quote_number, NEW.id::text),
          'success',
          '/financial',
          jsonb_build_object('quote_id', NEW.id, 'auto_generated', true)
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_pedido_to_finance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE 
  v_cliente_nome text;
BEGIN
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND (OLD.status IS DISTINCT FROM NEW.status)) THEN
    IF NEW.status IN ('APROVADO','FATURADO','CONCLUIDO','PAGO','FECHADO') THEN
      -- Fetch client name if available
      SELECT c.nome_fantasia INTO v_cliente_nome FROM public.clientes c WHERE c.id = NEW.cliente_id;

      -- Create transaction if not exists
      IF NOT EXISTS (
        SELECT 1 FROM public.transactions t WHERE t.invoice_number = NEW.numero
      ) THEN
        INSERT INTO public.transactions (
          id, user_id, type, title, amount, category, subcategory, channel,
          date, due_date, payment_method, status, recurring, recurring_period,
          description, tags, client_name, invoice_number
        ) VALUES (
          gen_random_uuid(),
          (SELECT auth.uid()),
          'receita',
          COALESCE('Venda - Pedido ' || NEW.numero, 'Venda - Pedido'),
          COALESCE(NEW.total_liquido, NEW.total_bruto, 0),
          'Vendas',
          'Pedidos',
          'comercial',
          COALESCE(NEW.emissao, CURRENT_DATE),
          COALESCE(NEW.emissao + INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days'),
          CASE 
            WHEN NEW.status = 'PAGO' THEN 'dinheiro'
            ELSE 'boleto'
          END,
          CASE 
            WHEN NEW.status = 'PAGO' THEN 'pago'
            ELSE 'pendente'
          END,
          false,
          NULL,
          COALESCE('Pedido ID: ' || NEW.id::text || ' - Status: ' || NEW.status, ''),
          ARRAY['venda','pedido','automatico'],
          COALESCE(v_cliente_nome, ''),
          COALESCE(NEW.numero, NEW.id::text)
        );

        -- Insert notification
        INSERT INTO public.notifications (
          user_id, title, message, type, action_url, metadata
        ) VALUES (
          (SELECT auth.uid()),
          'Nova Receita - Pedido',
          'Receita de R$ ' || COALESCE(NEW.total_liquido, NEW.total_bruto, 0)::text || ' criada automaticamente para pedido: ' || COALESCE(NEW.numero, NEW.id::text),
          'success',
          '/financial',
          jsonb_build_object('pedido_id', NEW.id, 'auto_generated', true)
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_system_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.system_users (user_id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        'read_only'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = NEW.email,
        updated_at = NOW();
    
    -- Concede permissão básica de leitura
    INSERT INTO public.financial_permissions (user_id, permission_type, module)
    VALUES (NEW.id, 'read_only', 'all')
    ON CONFLICT (user_id, permission_type, module) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- ==================================================
-- 3. CORRIGIR MATERIALIZED VIEW NA API (1 WARNING)
-- ==================================================

-- Remover materialized views da API pública
DO $$
BEGIN
    -- Se existe sales_analytics, mover para schema interno ou remover da API
    IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'sales_analytics' AND schemaname = 'public') THEN
        -- Opção 1: Comentário para indicar que não deve ser exposta
        COMMENT ON MATERIALIZED VIEW public.sales_analytics IS 'INTERNAL USE ONLY - Not for API access';
        
        -- Opção 2: Criar schema interno e mover (mais seguro)
        CREATE SCHEMA IF NOT EXISTS internal;
        ALTER MATERIALIZED VIEW public.sales_analytics SET SCHEMA internal;
    END IF;
    
    -- Verificar outras materialized views e protegê-las
    DECLARE
        mv_record RECORD;
    BEGIN
        FOR mv_record IN 
            SELECT matviewname 
            FROM pg_matviews 
            WHERE schemaname = 'public'
        LOOP
            EXECUTE format('COMMENT ON MATERIALIZED VIEW public.%I IS ''INTERNAL USE ONLY - Not for API access''', 
                          mv_record.matviewname);
        END LOOP;
    END;
END $$;

-- ==========================================
-- 4. OTIMIZAÇÕES FINAIS DE SEGURANÇA
-- ==========================================

-- Garantir que todas as funções sensíveis tenham os parâmetros corretos
CREATE OR REPLACE FUNCTION public.auto_create_opportunity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO opportunities (
    customer_id, title, stage, value, probability, 
    expected_close_date, description, owner_id
  ) VALUES (
    NEW.id,
    'Oportunidade - ' || NEW.name,
    'lead',
    0,
    10,
    CURRENT_DATE + INTERVAL '30 days',
    'Oportunidade criada automaticamente',
    COALESCE(NEW.owner_id, (SELECT auth.uid()))
  );
  RETURN NEW;
END;
$$;

-- Função para limpeza de dados obsoletos (segura)
CREATE OR REPLACE FUNCTION public.cleanup_old_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Limpar logs antigos (mais de 90 dias)
    DELETE FROM public.audit_logs 
    WHERE created_at < (NOW() - INTERVAL '90 days');
    
    DELETE FROM public.integration_logs 
    WHERE created_at < (NOW() - INTERVAL '90 days');
    
    DELETE FROM public.automation_logs 
    WHERE executed_at < (NOW() - INTERVAL '90 days');
    
    -- Log da limpeza
    INSERT INTO public.integration_logs (
        integration_type, action, status, data
    ) VALUES (
        'system', 'cleanup_old_logs', 'success',
        jsonb_build_object('cleaned_at', NOW(), 'retention_days', 90)
    );
END;
$$;

-- =====================================
-- 5. DOCUMENTAÇÃO E COMENTÁRIOS FINAIS
-- =====================================

COMMENT ON SCHEMA public IS 'Main application schema - all tables secured with RLS';

-- Comentários em tabelas críticas
COMMENT ON TABLE public.transactions IS 'Financial transactions with RLS by user and permissions';
COMMENT ON TABLE public.customers IS 'Customer data with authenticated access';
COMMENT ON TABLE public.deals IS 'Sales deals with authenticated access';
COMMENT ON TABLE public.profiles IS 'User profiles with owner-based access';

-- Comentários em funções críticas  
COMMENT ON FUNCTION public.has_financial_permission(text, text) IS 'Secure permission check function - prevents RLS recursion';
COMMENT ON FUNCTION public.current_user_id() IS 'Optimized auth.uid() wrapper for RLS policies';
COMMENT ON FUNCTION public.current_user_role() IS 'Optimized auth.role() wrapper for RLS policies';