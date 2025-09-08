-- Corrigir segurança removendo dependências primeiro

-- 1. Remover políticas que dependem da view 'me'
DROP POLICY IF EXISTS "shipping_quotes_read" ON public.shipping_quotes;
DROP POLICY IF EXISTS "shipping_quotes_write" ON public.shipping_quotes;

-- 2. Recriar a view 'me' sem SECURITY DEFINER
DROP VIEW IF EXISTS public.me CASCADE;
CREATE VIEW public.me AS
SELECT 
  auth.uid() AS user_id,
  COALESCE(p.role, 'user') AS role,
  p.department AS team
FROM public.profiles p
WHERE p.user_id = auth.uid();

-- 3. Recriar políticas para shipping_quotes de forma mais simples
CREATE POLICY "shipping_quotes_authenticated" ON public.shipping_quotes
  FOR ALL USING (auth.role() = 'authenticated');

-- 4. Corrigir funções com search_path
CREATE OR REPLACE FUNCTION public.on_invoice_paid()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.transactions (
      id, user_id, type, title, amount, category, subcategory, channel,
      date, due_date, payment_method, status, recurring, recurring_period,
      description, tags, client_name, invoice_number
    ) VALUES (
      gen_random_uuid(),
      auth.uid(),
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
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.auto_progress_quote_to_order()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status IN ('aprovado', 'aceito') THEN
      IF NOT EXISTS (SELECT 1 FROM public.orders WHERE quote_id = NEW.id) THEN
        INSERT INTO public.orders (
          id, order_number, customer_id, quote_id,
          issue_date, gross_total, net_total, status, owner_id, user_id
        ) VALUES (
          gen_random_uuid(),
          'ORD-' || NEW.quote_number,
          NEW.customer_id,
          NEW.id,
          CURRENT_DATE,
          NEW.total,
          NEW.total,
          'OPEN',
          NEW.owner_id,
          auth.uid()
        ) RETURNING id INTO v_order_id;
        
        INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
        SELECT v_order_id, qi.product_id, qi.quantity, qi.unit_price
        FROM public.quote_items qi
        WHERE qi.quote_id = NEW.id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;

-- 5. Adicionar políticas RLS básicas para tabelas sem políticas (apenas algumas críticas)
DO $$
DECLARE
    table_name text;
    tables_without_policies text[] := ARRAY[
        'ad_tokens', 'analytics_data', 'atividades', 'audit_logs', 
        'campaigns', 'canais_venda', 'categorias', 'centros_custo',
        'clientes', 'contas', 'contas_financeiras', 'contatos',
        'customer_segments', 'customer_types', 'departments',
        'lead_sources', 'metas_vendas', 'produtos', 'profiles',
        'quote_items', 'tasks', 'user_roles'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables_without_policies
    LOOP
        -- Verificar se a tabela existe e não tem políticas
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = table_name
        ) AND NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' AND tablename = table_name
        ) THEN
            EXECUTE format('CREATE POLICY "authenticated_select" ON public.%I FOR SELECT USING (auth.role() = ''authenticated'')', table_name);
            EXECUTE format('CREATE POLICY "authenticated_insert" ON public.%I FOR INSERT WITH CHECK (auth.role() = ''authenticated'')', table_name);
            EXECUTE format('CREATE POLICY "authenticated_update" ON public.%I FOR UPDATE USING (auth.role() = ''authenticated'')', table_name);
            EXECUTE format('CREATE POLICY "authenticated_delete" ON public.%I FOR DELETE USING (auth.role() = ''authenticated'')', table_name);
        END IF;
    END LOOP;
END $$;