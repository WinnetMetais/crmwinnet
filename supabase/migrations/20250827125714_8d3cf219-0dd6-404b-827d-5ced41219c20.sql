-- Fix remaining RLS policy performance issues (corrected)

-- Fix auth function calls for saldos_mensais
DROP POLICY IF EXISTS "read_all_saldos_mensais" ON public.saldos_mensais;
DROP POLICY IF EXISTS "write_saldos_mensais" ON public.saldos_mensais;
CREATE POLICY "read_all_saldos_mensais" ON public.saldos_mensais
FOR SELECT USING ((SELECT auth.role()) = 'authenticated'::text);
CREATE POLICY "write_saldos_mensais" ON public.saldos_mensais
FOR ALL USING (((SELECT auth.uid()) = user_id) OR is_admin())
WITH CHECK (((SELECT auth.uid()) = user_id) OR is_admin());

-- Fix auth function calls for metas_vendas  
DROP POLICY IF EXISTS "read_all_metas_vendas" ON public.metas_vendas;
DROP POLICY IF EXISTS "write_metas_vendas" ON public.metas_vendas;
CREATE POLICY "read_all_metas_vendas" ON public.metas_vendas
FOR SELECT USING ((SELECT auth.role()) = 'authenticated'::text);
CREATE POLICY "write_metas_vendas" ON public.metas_vendas
FOR ALL USING (((SELECT auth.uid()) = user_id) OR is_admin())
WITH CHECK (((SELECT auth.uid()) = user_id) OR is_admin());

-- Remove duplicate policies for canais_venda
DROP POLICY IF EXISTS "canais_venda_delete" ON public.canais_venda;
DROP POLICY IF EXISTS "canais_venda_insert" ON public.canais_venda;
DROP POLICY IF EXISTS "canais_venda_update" ON public.canais_venda;
DROP POLICY IF EXISTS "read_all_canais_venda" ON public.canais_venda;
-- Keep only the consolidated write_canais_venda policy
CREATE POLICY "read_all_canais_venda" ON public.canais_venda
FOR SELECT USING ((SELECT auth.role()) = 'authenticated'::text);

-- Remove duplicate policies for contas_financeiras
DROP POLICY IF EXISTS "contas_financeiras_delete" ON public.contas_financeiras;
DROP POLICY IF EXISTS "contas_financeiras_insert" ON public.contas_financeiras;
DROP POLICY IF EXISTS "contas_financeiras_update" ON public.contas_financeiras;
DROP POLICY IF EXISTS "read_all_contas_financeiras" ON public.contas_financeiras;
-- Keep only the consolidated write_contas_financeiras policy
CREATE POLICY "read_all_contas_financeiras" ON public.contas_financeiras
FOR SELECT USING ((SELECT auth.role()) = 'authenticated'::text);

-- Remove duplicate policies for customers
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
-- Keep only the "Allow authenticated users full access to customers" policy

-- Remove duplicate policies for customers_quotes
DROP POLICY IF EXISTS "Users can view all customers_quotes" ON public.customers_quotes;
-- Keep only the "Users can manage customers_quotes" policy which already handles SELECT