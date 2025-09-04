-- Migração simplificada - apenas o essencial para o CRM

-- 1. Adicionar campos faltantes nas tabelas existentes
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS team text;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS team text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS owner_id uuid;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS team text;

-- 2. Criar tabela shipping_quotes se não existir
CREATE TABLE IF NOT EXISTS public.shipping_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE,
  carrier text NOT NULL,
  service_code text DEFAULT 'default',
  price numeric NOT NULL,
  estimated_days integer,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- 3. View helper para perfil do usuário atual
CREATE OR REPLACE VIEW public.me AS
SELECT 
  auth.uid() AS user_id,
  COALESCE(p.role, 'user') AS role,
  p.department AS team
FROM public.profiles p
WHERE p.user_id = auth.uid();

-- 4. Trigger aprimorado para invoice_paid → transação financeira
CREATE OR REPLACE FUNCTION public.on_invoice_paid()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Criar transação automaticamente
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

    -- Notificação
    INSERT INTO public.notifications (
      user_id, title, message, type, action_url, metadata
    ) VALUES (
      auth.uid(),
      'Pagamento Recebido',
      'Invoice ' || COALESCE(NEW.number, NEW.id::text) || ' foi paga - R$ ' || NEW.total::text,
      'success',
      '/financial',
      jsonb_build_object('invoice_id', NEW.id, 'amount', NEW.total)
    );
  END IF;
  RETURN NEW;
END $$;

-- 5. Função para progresso automático Quote → Order
CREATE OR REPLACE FUNCTION public.auto_progress_quote_to_order()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order_id uuid;
  v_customer_name text;
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status IN ('aprovado', 'aceito') THEN
      -- Buscar nome do cliente
      SELECT name INTO v_customer_name 
      FROM public.customers 
      WHERE id = NEW.customer_id;
      
      -- Criar order automaticamente apenas se não existir
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
        
        -- Copiar itens da quote para order se houver
        INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
        SELECT v_order_id, qi.product_id, qi.quantity, qi.unit_price
        FROM public.quote_items qi
        WHERE qi.quote_id = NEW.id;
        
        -- Notificação
        INSERT INTO public.notifications (
          user_id, title, message, type, action_url, metadata
        ) VALUES (
          auth.uid(),
          'Pedido Criado Automaticamente',
          'Orçamento ' || NEW.quote_number || ' aprovado → Pedido ' || 'ORD-' || NEW.quote_number || ' criado',
          'success',
          '/sales',
          jsonb_build_object('order_id', v_order_id, 'quote_id', NEW.id)
        );
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;

-- 6. Aplicar triggers
DROP TRIGGER IF EXISTS trg_invoice_paid ON public.invoices;
CREATE TRIGGER trg_invoice_paid
  AFTER UPDATE ON public.invoices
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.on_invoice_paid();

DROP TRIGGER IF EXISTS trg_quote_to_order ON public.quotes;
CREATE TRIGGER trg_quote_to_order
  AFTER UPDATE ON public.quotes
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.auto_progress_quote_to_order();

-- 7. RLS para shipping_quotes se a tabela for nova
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shipping_quotes' AND policyname = 'shipping_quotes_read'
  ) THEN
    ALTER TABLE public.shipping_quotes ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "shipping_quotes_read" ON public.shipping_quotes
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.me m WHERE m.role IN ('admin','manager'))
        OR EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = shipping_quotes.quote_id AND q.owner_id = auth.uid())
      );

    CREATE POLICY "shipping_quotes_write" ON public.shipping_quotes
      FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.me m WHERE m.role IN ('admin','manager'))
        OR EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = shipping_quotes.quote_id AND q.owner_id = auth.uid())
      );
  END IF;
END $$;