-- Melhorar triggers de sincronização entre comercial e financeiro

-- Trigger para orçamentos (quotes) aprovados/pagos
CREATE OR REPLACE FUNCTION public.sync_quote_to_finance()
RETURNS TRIGGER
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
          auth.uid(),
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
          auth.uid(),
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

-- Trigger para pedidos fechados/pagos
CREATE OR REPLACE FUNCTION public.sync_pedido_to_finance()
RETURNS TRIGGER
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
          auth.uid(),
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
          auth.uid(),
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

-- Melhorar trigger de deals para incluir mais status de fechamento
CREATE OR REPLACE FUNCTION public.sync_sales_to_finance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_customer_name text;
  v_deal_title text;
  v_deal_value numeric;
BEGIN
  -- Buscar dados do deal e cliente
  SELECT 
    d.title,
    COALESCE(d.actual_value, d.estimated_value, d.value),
    c.name
  INTO v_deal_title, v_deal_value, v_customer_name
  FROM public.deals d
  LEFT JOIN public.customers c ON c.id = d.customer_id
  WHERE d.id = NEW.id;

  -- Se o status mudou para "fechado/ganho" ou similar
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Verificar se é um status de fechamento de venda
    IF NEW.status IN ('won', 'fechado', 'ganho', 'vendido', 'pago', 'concluido') THEN
      -- Inserir receita automaticamente no financeiro se não existir
      IF NOT EXISTS (
        SELECT 1 FROM public.transactions t WHERE t.description LIKE '%Deal ID: ' || NEW.id::text || '%'
      ) THEN
        INSERT INTO public.transactions (
          id, user_id, type, title, amount, category, subcategory, channel,
          date, due_date, payment_method, status, recurring, recurring_period,
          description, tags, client_name, invoice_number
        ) VALUES (
          gen_random_uuid(),
          auth.uid(),
          'receita',
          COALESCE('Venda - ' || v_deal_title, 'Venda Comercial'),
          COALESCE(v_deal_value, 0),
          'Vendas',
          'Comercial',
          'comercial',
          COALESCE(NEW.close_date::date, CURRENT_DATE),
          COALESCE(NEW.close_date::date + INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days'),
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
          COALESCE('Deal ID: ' || NEW.id::text || ' - Status: ' || NEW.status, ''),
          ARRAY['venda','comercial','automatico'],
          COALESCE(v_customer_name, ''),
          COALESCE('DEAL-' || NEW.id::text, gen_random_uuid()::text)
        );

        -- Inserir notificação
        INSERT INTO public.notifications (
          user_id, title, message, type, action_url, metadata
        ) VALUES (
          auth.uid(),
          'Nova Receita - Deal',
          'Receita de R$ ' || COALESCE(v_deal_value, 0)::text || ' criada automaticamente para deal: ' || COALESCE(v_customer_name, 'Cliente'),
          'success',
          '/financial',
          jsonb_build_object('deal_id', NEW.id, 'auto_generated', true)
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Criar triggers se não existirem
DROP TRIGGER IF EXISTS sync_quote_to_finance_trigger ON quotes;
CREATE TRIGGER sync_quote_to_finance_trigger
  AFTER UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION sync_quote_to_finance();

DROP TRIGGER IF EXISTS sync_pedido_to_finance_trigger ON pedidos;
CREATE TRIGGER sync_pedido_to_finance_trigger
  AFTER INSERT OR UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION sync_pedido_to_finance();

DROP TRIGGER IF EXISTS sync_sales_to_finance_trigger ON deals;
CREATE TRIGGER sync_sales_to_finance_trigger
  AFTER UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION sync_sales_to_finance();