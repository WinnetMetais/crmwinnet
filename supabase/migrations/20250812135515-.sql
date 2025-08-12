-- CRM Security and Flow hardening: RLS, FK cascade, and triggers

-- 1) Harden customers policies (restrict mutations, allow read)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='customers' AND policyname='Allow authenticated users full access to customers'
  ) THEN
    EXECUTE 'DROP POLICY "Allow authenticated users full access to customers" ON public.customers';
  END IF;
END $$;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Read for all authenticated users
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='customers' AND policyname='customers_select_all'
  ) THEN
    EXECUTE $$
      CREATE POLICY customers_select_all ON public.customers
      FOR SELECT
      USING ((SELECT auth.uid()) IS NOT NULL);
    $$;
  END IF;
END $$;

-- Insert only by owner/admin
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='customers' AND policyname='customers_insert_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY customers_insert_own ON public.customers
      FOR INSERT
      WITH CHECK ((created_by = auth.uid()::text) OR public.is_admin());
    $$;
  END IF;
END $$;

-- Update only by owner/admin
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='customers' AND policyname='customers_update_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY customers_update_own ON public.customers
      FOR UPDATE
      USING ((created_by = auth.uid()::text) OR public.is_admin())
      WITH CHECK ((created_by = auth.uid()::text) OR public.is_admin());
    $$;
  END IF;
END $$;

-- Delete only by owner/admin
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='customers' AND policyname='customers_delete_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY customers_delete_own ON public.customers
      FOR DELETE
      USING ((created_by = auth.uid()::text) OR public.is_admin());
    $$;
  END IF;
END $$;

-- Default created_by on insert if null
CREATE OR REPLACE FUNCTION public.set_created_by_default()
RETURNS trigger AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid()::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.customers'::regclass AND tgname = 'set_customers_created_by_default'
  ) THEN
    CREATE TRIGGER set_customers_created_by_default
    BEFORE INSERT ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_by_default();
  END IF;
END $$;

-- Update updated_at automatically
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.customers'::regclass AND tgname = 'customers_set_updated_at'
  ) THEN
    CREATE TRIGGER customers_set_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;


-- 2) Harden deals policies
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='deals' AND policyname='Allow authenticated users full access to deals'
  ) THEN
    EXECUTE 'DROP POLICY "Allow authenticated users full access to deals" ON public.deals';
  END IF;
END $$;

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Read for all authenticated users
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='deals' AND policyname='deals_select_all'
  ) THEN
    EXECUTE $$
      CREATE POLICY deals_select_all ON public.deals
      FOR SELECT
      USING ((SELECT auth.uid()) IS NOT NULL);
    $$;
  END IF;
END $$;

-- Insert by owner/admin (auto set created_by if null)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='deals' AND policyname='deals_insert_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY deals_insert_own ON public.deals
      FOR INSERT
      WITH CHECK ((created_by = auth.uid()::text) OR public.is_admin());
    $$;
  END IF;
END $$;

-- Update own/admin
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='deals' AND policyname='deals_update_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY deals_update_own ON public.deals
      FOR UPDATE
      USING ((created_by = auth.uid()::text) OR public.is_admin())
      WITH CHECK ((created_by = auth.uid()::text) OR public.is_admin());
    $$;
  END IF;
END $$;

-- Delete own/admin
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='deals' AND policyname='deals_delete_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY deals_delete_own ON public.deals
      FOR DELETE
      USING ((created_by = auth.uid()::text) OR public.is_admin());
    $$;
  END IF;
END $$;

-- Triggers for created_by and updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.deals'::regclass AND tgname = 'set_deals_created_by_default'
  ) THEN
    CREATE TRIGGER set_deals_created_by_default
    BEFORE INSERT ON public.deals
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_by_default();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.deals'::regclass AND tgname = 'deals_set_updated_at'
  ) THEN
    CREATE TRIGGER deals_set_updated_at
    BEFORE UPDATE ON public.deals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Ensure FK cascade on deals.customer_id
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid=c.conrelid
    WHERE t.relname='deals' AND c.contype='f' AND c.conname='deals_customer_id_fkey'
  ) THEN
    EXECUTE 'ALTER TABLE public.deals DROP CONSTRAINT deals_customer_id_fkey';
  END IF;
  -- Recreate with ON DELETE CASCADE
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='deals' AND column_name='customer_id') THEN
    EXECUTE 'ALTER TABLE public.deals
      ADD CONSTRAINT deals_customer_id_fkey
      FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE';
  END IF;
END $$;


-- 3) Opportunities policies and cascade
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='opportunities' AND policyname='opportunities_select_all'
  ) THEN
    EXECUTE $$
      CREATE POLICY opportunities_select_all ON public.opportunities
      FOR SELECT
      USING ((SELECT auth.uid()) IS NOT NULL);
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='opportunities' AND policyname='opportunities_insert_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY opportunities_insert_own ON public.opportunities
      FOR INSERT
      WITH CHECK ((created_by = auth.uid()::text) OR public.is_admin());
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='opportunities' AND policyname='opportunities_update_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY opportunities_update_own ON public.opportunities
      FOR UPDATE
      USING ((created_by = auth.uid()::text) OR public.is_admin())
      WITH CHECK ((created_by = auth.uid()::text) OR public.is_admin());
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='opportunities' AND policyname='opportunities_delete_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY opportunities_delete_own ON public.opportunities
      FOR DELETE
      USING ((created_by = auth.uid()::text) OR public.is_admin());
    $$;
  END IF;
END $$;

-- Triggers for created_by and updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.opportunities'::regclass AND tgname = 'set_opportunities_created_by_default'
  ) THEN
    CREATE TRIGGER set_opportunities_created_by_default
    BEFORE INSERT ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_by_default();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.opportunities'::regclass AND tgname = 'opportunities_set_updated_at'
  ) THEN
    CREATE TRIGGER opportunities_set_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Ensure FK cascade on opportunities.customer_id
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid=c.conrelid
    WHERE t.relname='opportunities' AND c.contype='f' AND c.conname='opportunities_customer_id_fkey'
  ) THEN
    EXECUTE 'ALTER TABLE public.opportunities DROP CONSTRAINT opportunities_customer_id_fkey';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='opportunities' AND column_name='customer_id') THEN
    EXECUTE 'ALTER TABLE public.opportunities
      ADD CONSTRAINT opportunities_customer_id_fkey
      FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE';
  END IF;
END $$;

-- Opportunity items policies (ownership via parent)
ALTER TABLE public.opportunity_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='opportunity_items' AND policyname='opportunity_items_select_parent_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY opportunity_items_select_parent_own ON public.opportunity_items
      FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = opportunity_id AND ((o.created_by = auth.uid()::text) OR public.is_admin())
      ));
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='opportunity_items' AND policyname='opportunity_items_insert_parent_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY opportunity_items_insert_parent_own ON public.opportunity_items
      FOR INSERT
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = opportunity_id AND ((o.created_by = auth.uid()::text) OR public.is_admin())
      ));
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='opportunity_items' AND policyname='opportunity_items_update_parent_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY opportunity_items_update_parent_own ON public.opportunity_items
      FOR UPDATE
      USING (EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = opportunity_id AND ((o.created_by = auth.uid()::text) OR public.is_admin())
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = opportunity_id AND ((o.created_by = auth.uid()::text) OR public.is_admin())
      ));
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='opportunity_items' AND policyname='opportunity_items_delete_parent_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY opportunity_items_delete_parent_own ON public.opportunity_items
      FOR DELETE
      USING (EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = opportunity_id AND ((o.created_by = auth.uid()::text) OR public.is_admin())
      ));
    $$;
  END IF;
END $$;

-- Ensure FK cascade on opportunity_items.opportunity_id
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid=c.conrelid
    WHERE t.relname='opportunity_items' AND c.contype='f' AND c.conname='opportunity_items_opportunity_id_fkey'
  ) THEN
    EXECUTE 'ALTER TABLE public.opportunity_items DROP CONSTRAINT opportunity_items_opportunity_id_fkey';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='opportunity_items' AND column_name='opportunity_id') THEN
    EXECUTE 'ALTER TABLE public.opportunity_items
      ADD CONSTRAINT opportunity_items_opportunity_id_fkey
      FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE';
  END IF;
END $$;


-- 4) Quotes and quote_items policies + trigger to sync to finance
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quotes' AND policyname='quotes_select_own_or_admin'
  ) THEN
    EXECUTE $$
      CREATE POLICY quotes_select_own_or_admin ON public.quotes
      FOR SELECT
      USING ((user_id = auth.uid()) OR public.is_admin());
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quotes' AND policyname='quotes_insert_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY quotes_insert_own ON public.quotes
      FOR INSERT
      WITH CHECK ((user_id = auth.uid()) OR public.is_admin());
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quotes' AND policyname='quotes_update_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY quotes_update_own ON public.quotes
      FOR UPDATE
      USING ((user_id = auth.uid()) OR public.is_admin())
      WITH CHECK ((user_id = auth.uid()) OR public.is_admin());
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quotes' AND policyname='quotes_delete_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY quotes_delete_own ON public.quotes
      FOR DELETE
      USING ((user_id = auth.uid()) OR public.is_admin());
    $$;
  END IF;
END $$;

-- Default user_id on insert if null
CREATE OR REPLACE FUNCTION public.set_user_id_default()
RETURNS trigger AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.quotes'::regclass AND tgname = 'set_quotes_user_id_default'
  ) THEN
    CREATE TRIGGER set_quotes_user_id_default
    BEFORE INSERT ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_id_default();
  END IF;
END $$;

-- Ensure updated_at trigger
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.quotes'::regclass AND tgname = 'quotes_set_updated_at'
  ) THEN
    CREATE TRIGGER quotes_set_updated_at
    BEFORE UPDATE ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Trigger to sync approved quotes to finance
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.quotes'::regclass AND tgname = 'trg_quotes_sync_finance'
  ) THEN
    CREATE TRIGGER trg_quotes_sync_finance
    AFTER UPDATE ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_quote_to_finance();
  END IF;
END $$;

-- quote_items policies (ownership via parent quote)
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quote_items' AND policyname='quote_items_select_parent_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY quote_items_select_parent_own ON public.quote_items
      FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.quotes q
        WHERE q.id = quote_id AND ((q.user_id = auth.uid()) OR public.is_admin())
      ));
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quote_items' AND policyname='quote_items_insert_parent_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY quote_items_insert_parent_own ON public.quote_items
      FOR INSERT
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.quotes q
        WHERE q.id = quote_id AND ((q.user_id = auth.uid()) OR public.is_admin())
      ));
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quote_items' AND policyname='quote_items_update_parent_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY quote_items_update_parent_own ON public.quote_items
      FOR UPDATE
      USING (EXISTS (
        SELECT 1 FROM public.quotes q
        WHERE q.id = quote_id AND ((q.user_id = auth.uid()) OR public.is_admin())
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.quotes q
        WHERE q.id = quote_id AND ((q.user_id = auth.uid()) OR public.is_admin())
      ));
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quote_items' AND policyname='quote_items_delete_parent_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY quote_items_delete_parent_own ON public.quote_items
      FOR DELETE
      USING (EXISTS (
        SELECT 1 FROM public.quotes q
        WHERE q.id = quote_id AND ((q.user_id = auth.uid()) OR public.is_admin())
      ));
    $$;
  END IF;
END $$;

-- Ensure FK cascade quote_items.quote_id -> quotes.id
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid=c.conrelid
    WHERE t.relname='quote_items' AND c.contype='f' AND c.conname='quote_items_quote_id_fkey'
  ) THEN
    EXECUTE 'ALTER TABLE public.quote_items DROP CONSTRAINT quote_items_quote_id_fkey';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_items' AND column_name='quote_id') THEN
    EXECUTE 'ALTER TABLE public.quote_items
      ADD CONSTRAINT quote_items_quote_id_fkey
      FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE CASCADE';
  END IF;
END $$;


-- 5) Transactions policies (finance) with ownership
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='transactions_select_own_or_admin'
  ) THEN
    EXECUTE $$
      CREATE POLICY transactions_select_own_or_admin ON public.transactions
      FOR SELECT
      USING ((user_id = auth.uid()) OR public.is_admin());
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='transactions_insert_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY transactions_insert_own ON public.transactions
      FOR INSERT
      WITH CHECK ((user_id = auth.uid()) OR public.is_admin());
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='transactions_update_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY transactions_update_own ON public.transactions
      FOR UPDATE
      USING ((user_id = auth.uid()) OR public.is_admin())
      WITH CHECK ((user_id = auth.uid()) OR public.is_admin());
    $$;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='transactions_delete_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY transactions_delete_own ON public.transactions
      FOR DELETE
      USING ((user_id = auth.uid()) OR public.is_admin());
    $$;
  END IF;
END $$;

-- Default user_id on insert if null
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname='set_user_id_default'
  ) THEN
    -- function already created above for quotes; ensure exists
    CREATE OR REPLACE FUNCTION public.set_user_id_default()
    RETURNS trigger AS $$
    BEGIN
      IF NEW.user_id IS NULL THEN
        NEW.user_id := auth.uid();
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.transactions'::regclass AND tgname = 'set_transactions_user_id_default'
  ) THEN
    CREATE TRIGGER set_transactions_user_id_default
    BEFORE INSERT ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_id_default();
  END IF;
END $$;

-- Ensure updated_at trigger if column exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='updated_at') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.transactions'::regclass AND tgname = 'transactions_set_updated_at'
    ) THEN
      CREATE TRIGGER transactions_set_updated_at
      BEFORE UPDATE ON public.transactions
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
  END IF;
END $$;