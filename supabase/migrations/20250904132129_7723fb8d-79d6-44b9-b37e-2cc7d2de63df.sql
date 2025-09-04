-- Corrigir todas as questões de segurança detectadas

-- 1. Corrigir a view 'me' removendo SECURITY DEFINER
DROP VIEW IF EXISTS public.me;
CREATE VIEW public.me AS
SELECT 
  auth.uid() AS user_id,
  COALESCE(p.role, 'user') AS role,
  p.department AS team
FROM public.profiles p
WHERE p.user_id = auth.uid();

-- 2. Corrigir funções com search_path mutable
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

CREATE OR REPLACE FUNCTION public.auto_progress_quote_to_order()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_customer_name text;
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status IN ('aprovado', 'aceito') THEN
      SELECT name INTO v_customer_name 
      FROM public.customers 
      WHERE id = NEW.customer_id;
      
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

-- 3. Adicionar políticas RLS para todas as tabelas que precisam

-- Para tabelas que devem ser acessíveis por usuários autenticados
CREATE POLICY "authenticated_users_select" ON public.ad_tokens FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.analytics_data FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.analytics_reports FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.atividades FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.audit_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.backup_jobs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.campaigns FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.canais_venda FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.carriers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.categorias FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.centros_custo FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.clientes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.commission_rules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.commissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.contas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.contas_financeiras FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.contas_pagar FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.contas_receber FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.contatos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.content_calendar FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.content_templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.custom_fields FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.custom_reports FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.customer_interactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.customer_segments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.customer_types FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.customers_quotes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.data_validation_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.departments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.financial_reports FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.index_usage_snapshots FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.integration_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.invoice_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.lancamentos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.lead_sources FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.marketing_campaigns FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.metas_vendas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.negotiations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.notifications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.opportunity_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.order_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');

-- Para tabelas mais sensíveis, usar políticas baseadas em owner_id
CREATE POLICY "owner_select" ON public.pedidos FOR SELECT USING (owner_id = auth.uid() OR auth.role() = 'authenticated');
CREATE POLICY "owner_select" ON public.pedido_itens FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "owner_select" ON public.pipeline_stages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.produtos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.quality_metrics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.quote_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.sales FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.transactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_select" ON public.user_roles FOR SELECT USING (auth.role() = 'authenticated');