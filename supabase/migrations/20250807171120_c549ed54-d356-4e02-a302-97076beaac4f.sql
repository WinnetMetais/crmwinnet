-- Corrigir problemas identificados no linter e habilitar realtime para tabelas financeiras

-- 1. Corrigir search_path das funções para segurança
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  old_record JSONB;
  new_record JSONB;
  changed_fields TEXT[] := '{}';
  field_name TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    old_record := to_jsonb(OLD);
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, OLD.id, TG_OP, old_record
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    old_record := to_jsonb(OLD);
    new_record := to_jsonb(NEW);
    
    FOR field_name IN SELECT key FROM jsonb_each(new_record) LOOP
      IF old_record->>field_name IS DISTINCT FROM new_record->>field_name THEN
        changed_fields := array_append(changed_fields, field_name);
      END IF;
    END LOOP;
    
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data, new_data, changed_fields
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, old_record, new_record, changed_fields
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    new_record := to_jsonb(NEW);
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, new_data
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, new_record
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

-- 2. Habilitar Row Level Security nas tabelas que não têm
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. Habilitar realtime para tabelas financeiras essenciais
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.financial_reports REPLICA IDENTITY FULL;
ALTER TABLE public.deals REPLICA IDENTITY FULL;
ALTER TABLE public.opportunities REPLICA IDENTITY FULL;
ALTER TABLE public.customers REPLICA IDENTITY FULL;
ALTER TABLE public.quotes REPLICA IDENTITY FULL;

-- 4. Adicionar tabelas à publicação realtime
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- 5. Triggers para atualização automática de timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas relevantes
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_deals_updated_at ON public.deals;
CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON public.deals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_quotes_updated_at ON public.quotes;
CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Corrigir policies muito restritivas para permitir operações financeiras
DROP POLICY IF EXISTS "Users can manage transactions" ON public.transactions;
CREATE POLICY "Users can manage transactions"
ON public.transactions
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. Política para permitir leitura de dados de referência sem autenticação
DROP POLICY IF EXISTS "Anyone can view payment_methods" ON public.payment_methods;
CREATE POLICY "Anyone can view payment_methods"
ON public.payment_methods
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone can view customer_segments" ON public.customer_segments;
CREATE POLICY "Anyone can view customer_segments"
ON public.customer_segments
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone can view lead_sources" ON public.lead_sources;
CREATE POLICY "Anyone can view lead_sources"
ON public.lead_sources
FOR SELECT
USING (true);

-- 8. Habilitar policies mais permissivas para admins
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Policy para admins gerenciarem tudo
DROP POLICY IF EXISTS "Admins can manage everything" ON public.financial_reports;
CREATE POLICY "Admins can manage everything"
ON public.financial_reports
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());