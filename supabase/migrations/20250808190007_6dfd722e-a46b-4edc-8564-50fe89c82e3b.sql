-- Ensure REPLICA IDENTITY FULL for realtime completeness
ALTER TABLE public.clientes REPLICA IDENTITY FULL;
ALTER TABLE public.contas_receber REPLICA IDENTITY FULL;
ALTER TABLE public.invoice_items REPLICA IDENTITY FULL;
ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER TABLE public.oportunidades REPLICA IDENTITY FULL;
ALTER TABLE public.pedidos REPLICA IDENTITY FULL;
-- Already FULL but keep for consistency (no-op if already 'f')
ALTER TABLE public.customers REPLICA IDENTITY FULL;
ALTER TABLE public.deals REPLICA IDENTITY FULL;
ALTER TABLE public.opportunities REPLICA IDENTITY FULL;
ALTER TABLE public.quotes REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;

-- Add helpful indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON public.pedidos (cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_oportunidade_id ON public.pedidos (oportunidade_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_cliente_id ON public.oportunidades (cliente_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions (user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_type_date ON public.transactions (type, date);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes (status);
CREATE INDEX IF NOT EXISTS idx_quotes_approved_at ON public.quotes (approved_at);
CREATE INDEX IF NOT EXISTS idx_pedidos_numero ON public.pedidos (numero);
CREATE INDEX IF NOT EXISTS idx_contas_receber_status ON public.contas_receber (status);

-- Customers: enable safe access for authenticated users (match deals policy style) if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='customers' AND policyname='Allow authenticated users full access to customers'
  ) THEN
    CREATE POLICY "Allow authenticated users full access to customers"
    ON public.customers
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Optional: add FKs if they don't exist
DO $$
BEGIN
  -- pedidos.cliente_id -> clientes.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='fk_pedidos_cliente'
  ) THEN
    ALTER TABLE public.pedidos
      ADD CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON UPDATE CASCADE ON DELETE SET NULL;
  END IF;
  -- pedidos.oportunidade_id -> oportunidades.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='fk_pedidos_oportunidade'
  ) THEN
    ALTER TABLE public.pedidos
      ADD CONSTRAINT fk_pedidos_oportunidade FOREIGN KEY (oportunidade_id) REFERENCES public.oportunidades(id) ON UPDATE CASCADE ON DELETE SET NULL;
  END IF;
  -- invoice_items.quote_id -> quotes.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='fk_invoice_items_quote'
  ) THEN
    ALTER TABLE public.invoice_items
      ADD CONSTRAINT fk_invoice_items_quote FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE;
  END IF;
END $$;

-- Finance sync: when a Quote is approved, create a revenue transaction (and contas_receber)
CREATE OR REPLACE FUNCTION public.sync_quote_to_finance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only act when approved
  IF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'aprovado' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
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
          auth.uid(),
          'receita',
          COALESCE('Venda - Orçamento '||NEW.quote_number, 'Venda - Orçamento'),
          COALESCE(NEW.total, 0),
          'Vendas',
          'Orçamentos aprovados',
          'comercial',
          COALESCE(NEW.approved_at::date, CURRENT_DATE),
          COALESCE(NEW.approved_at::date, CURRENT_DATE),
          'boleto',
          'pendente',
          false,
          NULL,
          COALESCE(NEW.notes, ''),
          ARRAY['venda','orcamento'],
          COALESCE(NEW.customer_name, ''),
          COALESCE(NEW.quote_number, NEW.id::text)
        );
      END IF;

      -- Also mirror to contas_receber if available and not yet created (by pedido)
      IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='contas_receber'
      ) THEN
        IF NOT EXISTS (
          SELECT 1 FROM public.contas_receber cr WHERE cr.pedido = NEW.quote_number
        ) THEN
          INSERT INTO public.contas_receber (
            id, created_by, valor, vencimento, emissao, pedido, status, meio_pagamento, canal
          ) VALUES (
            gen_random_uuid(),
            auth.uid(),
            COALESCE(NEW.total, 0),
            COALESCE(NEW.approved_at::date, CURRENT_DATE),
            COALESCE(NEW.date, CURRENT_DATE),
            COALESCE(NEW.quote_number, NEW.id::text),
            'ABERTA',
            'boleto',
            'comercial'
          );
        END IF;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_quotes_sync_finance ON public.quotes;
CREATE TRIGGER trg_quotes_sync_finance
AFTER UPDATE OF status ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.sync_quote_to_finance();

-- Finance sync: when an Order (pedido) is created or updated to approved/finalized, create a revenue transaction
CREATE OR REPLACE FUNCTION public.sync_pedido_to_finance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_cliente_nome text;
BEGIN
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND (OLD.status IS DISTINCT FROM NEW.status)) THEN
    IF NEW.status IN ('APROVADO','FATURADO','CONCLUIDO') THEN
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
          auth.uid(),
          'receita',
          COALESCE('Venda - Pedido '||NEW.numero, 'Venda - Pedido'),
          COALESCE(NEW.total_liquido, 0),
          'Vendas',
          'Pedidos',
          'comercial',
          COALESCE(NEW.emissao, CURRENT_DATE),
          COALESCE(NEW.emissao, CURRENT_DATE),
          'boleto',
          'pendente',
          false,
          NULL,
          '',
          ARRAY['venda','pedido'],
          COALESCE(v_cliente_nome, ''),
          COALESCE(NEW.numero, NEW.id::text)
        );
      END IF;

      -- Mirror contas_receber
      IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='contas_receber'
      ) THEN
        IF NOT EXISTS (
          SELECT 1 FROM public.contas_receber cr WHERE cr.pedido = NEW.numero
        ) THEN
          INSERT INTO public.contas_receber (
            id, created_by, valor, vencimento, emissao, pedido, status, meio_pagamento, canal
          ) VALUES (
            gen_random_uuid(),
            auth.uid(),
            COALESCE(NEW.total_liquido, 0),
            COALESCE(NEW.emissao, CURRENT_DATE),
            COALESCE(NEW.emissao, CURRENT_DATE),
            COALESCE(NEW.numero, NEW.id::text),
            'ABERTA',
            'boleto',
            'comercial'
          );
        END IF;
      END IF;
    END IF;
  END IF;
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_pedidos_sync_finance_insupd ON public.pedidos;
CREATE TRIGGER trg_pedidos_sync_finance_insupd
AFTER INSERT OR UPDATE OF status ON public.pedidos
FOR EACH ROW
EXECUTE FUNCTION public.sync_pedido_to_finance();