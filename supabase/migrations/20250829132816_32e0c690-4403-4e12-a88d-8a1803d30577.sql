-- Criar trigger para sincronização automática de vendas para financeiro

-- Criar ou atualizar função que sincroniza vendas fechadas com financeiro
CREATE OR REPLACE FUNCTION public.sync_sales_to_finance()
RETURNS TRIGGER AS $$
DECLARE
  v_customer_name text;
  v_deal_title text;
  v_deal_value numeric;
BEGIN
  -- Buscar dados do deal e cliente
  SELECT 
    d.title,
    d.estimated_value,
    c.name
  INTO v_deal_title, v_deal_value, v_customer_name
  FROM public.deals d
  LEFT JOIN public.customers c ON c.id = d.customer_id
  WHERE d.id = NEW.id;

  -- Se o status mudou para "fechado/ganho" ou similar
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Verificar se é um status de fechamento de venda
    IF NEW.status IN ('won', 'fechado', 'ganho', 'vendido') THEN
      -- Inserir receita automaticamente no financeiro
      INSERT INTO public.transactions (
        id, user_id, type, title, amount, category, subcategory, channel,
        date, due_date, payment_method, status, recurring, recurring_period,
        description, tags, client_name, invoice_number
      ) VALUES (
        gen_random_uuid(),
        auth.uid(),
        'receita',
        COALESCE('Venda - ' || v_deal_title, 'Venda Comercial'),
        COALESCE(v_deal_value, NEW.estimated_value, NEW.actual_value, 0),
        'Vendas',
        'Comercial',
        'comercial',
        COALESCE(NEW.close_date::date, CURRENT_DATE),
        COALESCE(NEW.close_date::date, CURRENT_DATE + INTERVAL '30 days'),
        'a_definir',
        'pendente',
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
        'Nova Receita Automática',
        'Receita de R$ ' || COALESCE(v_deal_value, NEW.estimated_value, NEW.actual_value, 0)::text || ' foi criada automaticamente para: ' || COALESCE(v_customer_name, 'Cliente'),
        'info',
        '/financial',
        jsonb_build_object('deal_id', NEW.id, 'auto_generated', true)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;