-- PHASE 2: Add RLS Policies and Triggers for Complete Automation

-- Enable RLS and add policies for main tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Customer policies
CREATE POLICY "Users can view all customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Users can insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update customers" ON customers FOR UPDATE USING (true);
CREATE POLICY "Users can delete customers" ON customers FOR DELETE USING (true);

-- Deal policies
CREATE POLICY "Users can view all deals" ON deals FOR SELECT USING (true);
CREATE POLICY "Users can insert deals" ON deals FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update deals" ON deals FOR UPDATE USING (true);
CREATE POLICY "Users can delete deals" ON deals FOR DELETE USING (true);

-- Opportunity policies
CREATE POLICY "Users can view all opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Users can insert opportunities" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update opportunities" ON opportunities FOR UPDATE USING (true);
CREATE POLICY "Users can delete opportunities" ON opportunities FOR DELETE USING (true);

-- Quote policies
CREATE POLICY "Users can view all quotes" ON quotes FOR SELECT USING (true);
CREATE POLICY "Users can insert quotes" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update quotes" ON quotes FOR UPDATE USING (true);
CREATE POLICY "Users can delete quotes" ON quotes FOR DELETE USING (true);

-- Transaction policies
CREATE POLICY "Users can view all transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Users can insert transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update transactions" ON transactions FOR UPDATE USING (true);
CREATE POLICY "Users can delete transactions" ON transactions FOR DELETE USING (true);

-- Add comprehensive automation triggers
-- 1. Auto-create opportunity when customer is created
CREATE OR REPLACE FUNCTION auto_create_opportunity()
RETURNS TRIGGER AS $$
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
    COALESCE(NEW.owner_id, auth.uid())
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_auto_create_opportunity
  AFTER INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_opportunity();

-- 2. Enhanced deal-to-finance sync
CREATE OR REPLACE FUNCTION enhanced_sync_sales_to_finance()
RETURNS TRIGGER AS $$
DECLARE
  v_customer_name text;
  v_deal_title text;
  v_deal_value numeric;
BEGIN
  -- Get customer and deal info
  SELECT d.title, COALESCE(d.actual_value, d.estimated_value, d.value), c.name
  INTO v_deal_title, v_deal_value, v_customer_name
  FROM deals d
  LEFT JOIN customers c ON c.id = d.customer_id
  WHERE d.id = NEW.id;

  -- Auto-progress opportunity when deal is won
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status = 'won' THEN
      -- Update related opportunity
      UPDATE opportunities SET 
        stage = 'won',
        actual_close_date = CURRENT_DATE,
        value = v_deal_value
      WHERE customer_id = NEW.customer_id AND stage != 'won';

      -- Create financial transaction
      IF NOT EXISTS (
        SELECT 1 FROM transactions WHERE deal_id = NEW.id
      ) THEN
        INSERT INTO transactions (
          id, type, title, amount, category, subcategory, channel,
          date, due_date, payment_method, status, recurring, recurring_period,
          description, tags, client_name, deal_id
        ) VALUES (
          gen_random_uuid(),
          'receita',
          COALESCE('Venda - ' || v_deal_title, 'Venda Comercial'),
          COALESCE(v_deal_value, 0),
          'Vendas',
          'Comercial',
          'comercial',
          COALESCE(NEW.close_date, CURRENT_DATE),
          COALESCE(NEW.close_date + INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days'),
          'boleto',
          'pendente',
          false,
          NULL,
          'Deal ID: ' || NEW.id::text || ' - Automaticamente sincronizado',
          ARRAY['venda','comercial','automatico'],
          COALESCE(v_customer_name, ''),
          NEW.id
        );

        -- Send notification
        INSERT INTO notifications (
          user_id, title, message, type, action_url, metadata
        ) VALUES (
          auth.uid(),
          'Nova Receita Automática',
          'Receita de R$ ' || COALESCE(v_deal_value, 0)::text || ' criada para deal: ' || COALESCE(v_customer_name, 'Cliente'),
          'success',
          '/financial',
          jsonb_build_object('deal_id', NEW.id, 'auto_generated', true)
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Replace existing trigger
DROP TRIGGER IF EXISTS sync_sales_to_finance_trigger ON deals;
CREATE TRIGGER sync_sales_to_finance_trigger
  AFTER INSERT OR UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION enhanced_sync_sales_to_finance();

-- 3. Quote-to-deal progression
CREATE OR REPLACE FUNCTION auto_progress_quote_to_deal()
RETURNS TRIGGER AS $$
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
        auth.uid()
      )
      ON CONFLICT (quote_id) DO UPDATE SET
        value = NEW.total,
        status = 'negotiation',
        updated_at = NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_auto_progress_quote_to_deal
  AFTER UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION auto_progress_quote_to_deal();

-- 4. Refresh materialized view automatically
CREATE OR REPLACE FUNCTION refresh_sales_analytics()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY sales_analytics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_refresh_analytics_deals
  AFTER INSERT OR UPDATE OR DELETE ON deals
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_sales_analytics();

CREATE TRIGGER trigger_refresh_analytics_transactions
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_sales_analytics();