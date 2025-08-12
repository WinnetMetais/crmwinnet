-- Secure CRM RLS and fix permissive policies for core modules
-- Customers, Deals, Transactions, Clientes (pt-BR)

-- 1) Helpers: created_by/user_id setters
create or replace function public.set_created_by_text()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is null or trim(new.created_by) = '' then
    new.created_by := auth.uid()::text;
  end if;
  return new;
end;
$$;

create or replace function public.set_user_id_uuid()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

-- 2) Harden Customers
do $$
begin
  if exists (select 1 from pg_tables where schemaname='public' and tablename='customers') then
    -- Ensure RLS is on
    execute 'alter table public.customers enable row level security';

    -- Drop overly-permissive policy if present
    if exists (
      select 1 from pg_policies where schemaname='public' and tablename='customers' 
      and policyname='Allow authenticated users full access to customers'
    ) then
      execute 'drop policy "Allow authenticated users full access to customers" on public.customers';
    end if;

    -- Create secure policies
    if not exists (select 1 from pg_policies where schemaname='public' and tablename='customers' and policyname='Customers are viewable by authenticated users') then
      execute 'create policy "Customers are viewable by authenticated users" on public.customers for select using (auth.uid() is not null)';
    end if;
    if not exists (select 1 from pg_policies where schemaname='public' and tablename='customers' and policyname='Users can insert their own customers') then
      execute 'create policy "Users can insert their own customers" on public.customers for insert with check ((coalesce(created_by, auth.uid()::text)) = auth.uid()::text or public.is_admin())';
    end if;
    if not exists (select 1 from pg_policies where schemaname='public' and tablename='customers' and policyname='Users can update their own customers') then
      execute 'create policy "Users can update their own customers" on public.customers for update using ((created_by = auth.uid()::text) or public.is_admin()) with check ((created_by = auth.uid()::text) or public.is_admin())';
    end if;
    if not exists (select 1 from pg_policies where schemaname='public' and tablename='customers' and policyname='Users can delete their own customers') then
      execute 'create policy "Users can delete their own customers" on public.customers for delete using ((created_by = auth.uid()::text) or public.is_admin())';
    end if;

    -- updated_at trigger
    execute 'drop trigger if exists update_customers_updated_at on public.customers';
    execute 'create trigger update_customers_updated_at before update on public.customers for each row execute function public.update_updated_at_column()';

    -- created_by setter on insert
    execute 'drop trigger if exists set_customers_created_by on public.customers';
    execute 'create trigger set_customers_created_by before insert on public.customers for each row execute function public.set_created_by_text()';
  end if;
end $$;

-- 3) Harden Deals
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='deals') THEN
    EXECUTE 'alter table public.deals enable row level security';

    IF EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='deals' 
      AND policyname='Allow authenticated users full access to deals'
    ) THEN
      EXECUTE 'drop policy "Allow authenticated users full access to deals" on public.deals';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''deals'' AND policyname=''Deals are viewable by authenticated users'') THEN
      EXECUTE 'create policy "Deals are viewable by authenticated users" on public.deals for select using (auth.uid() is not null)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''deals'' AND policyname=''Users can insert their own deals'') THEN
      EXECUTE 'create policy "Users can insert their own deals" on public.deals for insert with check ((coalesce(created_by, auth.uid()::text)) = auth.uid()::text or public.is_admin())';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''deals'' AND policyname=''Users can update their own deals'') THEN
      EXECUTE 'create policy "Users can update their own deals" on public.deals for update using ((created_by = auth.uid()::text) or public.is_admin()) with check ((created_by = auth.uid()::text) or public.is_admin())';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''deals'' AND policyname=''Users can delete their own deals'') THEN
      EXECUTE 'create policy "Users can delete their own deals" on public.deals for delete using ((created_by = auth.uid()::text) or public.is_admin())';
    END IF;

    -- updated_at trigger
    EXECUTE 'drop trigger if exists update_deals_updated_at on public.deals';
    EXECUTE 'create trigger update_deals_updated_at before update on public.deals for each row execute function public.update_updated_at_column()';

    -- created_by setter
    EXECUTE 'drop trigger if exists set_deals_created_by on public.deals';
    EXECUTE 'create trigger set_deals_created_by before insert on public.deals for each row execute function public.set_created_by_text()';
  END IF;
END $$;

-- 4) Harden Transactions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='transactions') THEN
    EXECUTE 'alter table public.transactions enable row level security';

    -- Try to drop common permissive policy name if present
    IF EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' 
      AND policyname='Allow authenticated users full access to transactions'
    ) THEN
      EXECUTE 'drop policy "Allow authenticated users full access to transactions" on public.transactions';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''transactions'' AND policyname=''Transactions are viewable by owner or admin'') THEN
      EXECUTE 'create policy "Transactions are viewable by owner or admin" on public.transactions for select using ((user_id = auth.uid()) or public.is_admin())';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''transactions'' AND policyname=''Users can insert their own transactions'') THEN
      EXECUTE 'create policy "Users can insert their own transactions" on public.transactions for insert with check ((coalesce(user_id, auth.uid())) = auth.uid() or public.is_admin())';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''transactions'' AND policyname=''Users can update their own transactions'') THEN
      EXECUTE 'create policy "Users can update their own transactions" on public.transactions for update using ((user_id = auth.uid()) or public.is_admin()) with check ((user_id = auth.uid()) or public.is_admin())';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''transactions'' AND policyname=''Users can delete their own transactions'') THEN
      EXECUTE 'create policy "Users can delete their own transactions" on public.transactions for delete using ((user_id = auth.uid()) or public.is_admin())';
    END IF;

    -- updated_at trigger
    EXECUTE 'drop trigger if exists update_transactions_updated_at on public.transactions';
    EXECUTE 'create trigger update_transactions_updated_at before update on public.transactions for each row execute function public.update_updated_at_column()';

    -- user_id setter on insert
    EXECUTE 'drop trigger if exists set_transactions_user_id on public.transactions';
    EXECUTE 'create trigger set_transactions_user_id before insert on public.transactions for each row execute function public.set_user_id_uuid()';
  END IF;
END $$;

-- 5) Keep Clientes (pt-BR) as-is but ensure updated_at/created_by behavior aligns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='clientes') THEN
    -- Add updated_at if column exists (defensive)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='clientes' AND column_name='updated_at'
    ) THEN
      EXECUTE 'drop trigger if exists update_clientes_updated_at on public.clientes';
      EXECUTE 'create trigger update_clientes_updated_at before update on public.clientes for each row execute function public.update_updated_at_column()';
    END IF;
  END IF;
END $$;

-- 6) Opportunities/Quotes (apply only if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='opportunities') THEN
    EXECUTE 'alter table public.opportunities enable row level security';
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''opportunities'' AND policyname=''Opportunities are viewable by authenticated users'') THEN
      EXECUTE 'create policy "Opportunities are viewable by authenticated users" on public.opportunities for select using (auth.uid() is not null)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''opportunities'' AND policyname=''Users can manage their own opportunities'') THEN
      EXECUTE 'create policy "Users can manage their own opportunities" on public.opportunities for all using ((created_by = auth.uid()::text) or public.is_admin()) with check ((created_by = auth.uid()::text) or public.is_admin())';
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='quotes') THEN
    EXECUTE 'alter table public.quotes enable row level security';
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''quotes'' AND policyname=''Quotes are viewable by authenticated users'') THEN
      EXECUTE 'create policy "Quotes are viewable by authenticated users" on public.quotes for select using (auth.uid() is not null)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname=''public'' AND tablename=''quotes'' AND policyname=''Users can manage their own quotes'') THEN
      EXECUTE 'create policy "Users can manage their own quotes" on public.quotes for all using ((created_by = auth.uid()::text) or public.is_admin()) with check ((created_by = auth.uid()::text) or public.is_admin())';
    END IF;
    -- Ensure finance sync trigger exists (already created function in project)
    IF EXISTS (
      SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid 
      JOIN pg_namespace n ON n.oid=c.relnamespace 
      WHERE n.nspname='public' AND c.relname='quotes' AND t.tgname='sync_quotes_to_finance_after_update'
    ) THEN
      -- do nothing
    ELSE
      EXECUTE 'create trigger sync_quotes_to_finance_after_update after update on public.quotes for each row execute function public.sync_quote_to_finance()';
    END IF;
  END IF;
END $$;
