-- Migração corrigida para o CRM Winnet
-- Corrige referências FK, adapta RLS e adiciona funcionalidades

-- 1. Adicionar campos faltantes nas tabelas existentes
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS team text;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS contact_person text;

ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS team text;

ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS team text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS owner_id uuid;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS team text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();

-- 2. Criar tabela shipping_quotes para cotações de frete (corrigida)
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

-- Index único para shipping_quotes
CREATE UNIQUE INDEX IF NOT EXISTS shipping_quotes_unique_idx 
ON public.shipping_quotes (quote_id, carrier, COALESCE(service_code, 'default'));

-- 3. Criar event_log para auditoria melhorada
CREATE TABLE IF NOT EXISTS public.event_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ts timestamptz NOT NULL DEFAULT now(),
  actor uuid DEFAULT auth.uid(),
  entity text NOT NULL,
  entity_id uuid,
  event text NOT NULL,
  meta jsonb
);

-- 4. Trigger para invoice_paid → criar transação financeira automaticamente
CREATE OR REPLACE FUNCTION public.on_invoice_paid()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Criar transação no sistema financeiro automaticamente
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

    -- Log do evento
    INSERT INTO public.event_log (entity, entity_id, event, meta)
    VALUES (
      'invoice', 
      NEW.id, 
      'payment_received',
      jsonb_build_object('amount', NEW.total, 'auto_generated', true)
    );
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_invoice_paid ON public.invoices;
CREATE TRIGGER trg_invoice_paid
  AFTER UPDATE ON public.invoices
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.on_invoice_paid();

-- 5. View helper para perfil do usuário atual
CREATE OR REPLACE VIEW public.me AS
SELECT 
  auth.uid() AS user_id,
  COALESCE(p.role, 'user') AS role,
  p.department AS team
FROM public.profiles p
WHERE p.user_id = auth.uid();

-- 6. Habilitar RLS nas novas tabelas
ALTER TABLE public.shipping_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_log ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS para shipping_quotes
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

-- 8. Políticas RLS para event_log
CREATE POLICY "event_log_read" ON public.event_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.me m WHERE m.role IN ('admin','manager'))
    OR actor = auth.uid()
  );

CREATE POLICY "event_log_write" ON public.event_log
  FOR INSERT WITH CHECK (true);

-- 9. Função para progresso automático Quote → Order
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
      
      -- Criar order automaticamente
      INSERT INTO public.orders (
        id, order_number, customer_id, 
        issue_date, gross_total, net_total, status, owner_id, user_id
      ) VALUES (
        gen_random_uuid(),
        'ORD-' || NEW.quote_number,
        NEW.customer_id,
        CURRENT_DATE,
        NEW.total,
        NEW.total,
        'OPEN',
        NEW.owner_id,
        auth.uid()
      ) RETURNING id INTO v_order_id;
      
      -- Copiar itens da quote para order
      INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
      SELECT v_order_id, qi.product_id, qi.quantity, qi.unit_price
      FROM public.quote_items qi
      WHERE qi.quote_id = NEW.id;
      
      -- Log do evento
      INSERT INTO public.event_log (entity, entity_id, event, meta)
      VALUES (
        'quote', 
        NEW.id, 
        'converted_to_order',
        jsonb_build_object('order_id', v_order_id, 'customer', v_customer_name)
      );
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_quote_to_order ON public.quotes;
CREATE TRIGGER trg_quote_to_order
  AFTER UPDATE ON public.quotes
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.auto_progress_quote_to_order();

-- 10. Realtime para as novas tabelas
ALTER TABLE public.shipping_quotes REPLICA IDENTITY FULL;
ALTER TABLE public.event_log REPLICA IDENTITY FULL;

-- 11. Adicionar às publicações do realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.shipping_quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_log;