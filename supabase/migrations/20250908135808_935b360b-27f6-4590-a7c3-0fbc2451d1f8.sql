-- Trigger para auto-atualizar metas quando uma venda for efetuada
CREATE OR REPLACE FUNCTION public.update_sales_goals_on_deal_won()
RETURNS TRIGGER AS $$
DECLARE
  goal_record RECORD;
BEGIN
  -- Buscar meta ativa do vendedor para o período atual
  FOR goal_record IN 
    SELECT id, current_amount 
    FROM public.sales_goals 
    WHERE salesperson = NEW.assigned_to 
    AND period_start <= CURRENT_DATE 
    AND period_end >= CURRENT_DATE
  LOOP
    -- Atualizar valor atual da meta
    UPDATE public.sales_goals 
    SET 
      current_amount = COALESCE(current_amount, 0) + COALESCE(NEW.value, 0),
      updated_at = NOW()
    WHERE id = goal_record.id;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizações em deals
CREATE OR REPLACE TRIGGER update_goals_on_deal_won
  AFTER UPDATE ON public.deals
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'won')
  EXECUTE FUNCTION public.update_sales_goals_on_deal_won();

-- Trigger para auto-criação de receita quando venda for fechada/faturada
CREATE OR REPLACE FUNCTION public.auto_create_revenue_on_sale()
RETURNS TRIGGER AS $$
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
        auth.uid(),
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
        auth.uid(),
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger
CREATE OR REPLACE TRIGGER auto_revenue_on_deal_status
  AFTER UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_revenue_on_sale();