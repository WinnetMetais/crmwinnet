-- High Performance RLS Optimization Migration
-- Fix all auth_rls_initplan performance warnings by optimizing auth function calls

-- notifications table
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (user_id = (select auth.uid()));

-- priorities table
DROP POLICY IF EXISTS "Authenticated users can view priorities" ON public.priorities;
CREATE POLICY "Authenticated users can view priorities" ON public.priorities
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- qualification_status table
DROP POLICY IF EXISTS "Authenticated users can view qualification status" ON public.qualification_status;
CREATE POLICY "Authenticated users can view qualification status" ON public.qualification_status
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- payment_terms table
DROP POLICY IF EXISTS "Authenticated users can view payment terms" ON public.payment_terms;
CREATE POLICY "Authenticated users can view payment terms" ON public.payment_terms
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- contas_financeiras table
DROP POLICY IF EXISTS "read_all_contas_financeiras" ON public.contas_financeiras;
CREATE POLICY "read_all_contas_financeiras" ON public.contas_financeiras
FOR SELECT USING ((select auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "write_contas_financeiras" ON public.contas_financeiras;
CREATE POLICY "write_contas_financeiras" ON public.contas_financeiras
FOR ALL USING (((select auth.uid()) = created_by) OR is_admin())
WITH CHECK (((select auth.uid()) = created_by) OR is_admin());

-- carriers table
DROP POLICY IF EXISTS "Authenticated users can manage carriers" ON public.carriers;
CREATE POLICY "Authenticated users can manage carriers" ON public.carriers
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update carriers" ON public.carriers;
CREATE POLICY "Authenticated users can update carriers" ON public.carriers
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can view carriers" ON public.carriers;
CREATE POLICY "Authenticated users can view carriers" ON public.carriers
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

-- lancamentos table
DROP POLICY IF EXISTS "read_all_lancamentos" ON public.lancamentos;
CREATE POLICY "read_all_lancamentos" ON public.lancamentos
FOR SELECT USING ((select auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "write_lancamentos" ON public.lancamentos;
CREATE POLICY "write_lancamentos" ON public.lancamentos
FOR ALL USING (((select auth.uid()) = created_by) OR is_admin())
WITH CHECK (((select auth.uid()) = created_by) OR is_admin());

-- customers table
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;
CREATE POLICY "Authenticated users can manage customers" ON public.customers
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
CREATE POLICY "Authenticated users can view customers" ON public.customers
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

-- suppliers table
DROP POLICY IF EXISTS "Authenticated users can manage suppliers" ON public.suppliers;
CREATE POLICY "Authenticated users can manage suppliers" ON public.suppliers
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update suppliers" ON public.suppliers;
CREATE POLICY "Authenticated users can update suppliers" ON public.suppliers
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

-- payment_methods table
DROP POLICY IF EXISTS "Authenticated users can view payment methods" ON public.payment_methods;
CREATE POLICY "Authenticated users can view payment methods" ON public.payment_methods
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- lead_sources table
DROP POLICY IF EXISTS "Authenticated users can view lead sources" ON public.lead_sources;
CREATE POLICY "Authenticated users can view lead sources" ON public.lead_sources
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- departments table
DROP POLICY IF EXISTS "Authenticated users can view departments" ON public.departments;
CREATE POLICY "Authenticated users can view departments" ON public.departments
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

-- pipeline_stages table
DROP POLICY IF EXISTS "Authenticated users can view pipeline stages" ON public.pipeline_stages;
CREATE POLICY "Authenticated users can view pipeline stages" ON public.pipeline_stages
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- customers_quotes table
DROP POLICY IF EXISTS "Users can manage customers_quotes" ON public.customers_quotes;
CREATE POLICY "Users can manage customers_quotes" ON public.customers_quotes
FOR ALL USING (((select auth.uid()) = created_by) OR is_admin())
WITH CHECK (((select auth.uid()) = created_by) OR is_admin());

DROP POLICY IF EXISTS "Users can view all customers_quotes" ON public.customers_quotes;
CREATE POLICY "Users can view all customers_quotes" ON public.customers_quotes
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- canais_venda table
DROP POLICY IF EXISTS "read_all_canais_venda" ON public.canais_venda;
CREATE POLICY "read_all_canais_venda" ON public.canais_venda
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- clientes table
DROP POLICY IF EXISTS "Authenticated users can manage clientes" ON public.clientes;
CREATE POLICY "Authenticated users can manage clientes" ON public.clientes
FOR ALL USING ((select auth.uid()) IS NOT NULL);

-- contatos table
DROP POLICY IF EXISTS "read_all_contatos" ON public.contatos;
CREATE POLICY "read_all_contatos" ON public.contatos
FOR SELECT USING ((select auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "write_contatos" ON public.contatos;
CREATE POLICY "write_contatos" ON public.contatos
FOR ALL USING (((select auth.uid()) = created_by) OR is_admin())
WITH CHECK (((select auth.uid()) = created_by) OR is_admin());

-- leads table
DROP POLICY IF EXISTS "Users can view their leads" ON public.leads;
CREATE POLICY "Users can view their leads" ON public.leads
FOR SELECT USING ((owner_id = (select auth.uid())) OR is_admin());

DROP POLICY IF EXISTS "write_leads" ON public.leads;
CREATE POLICY "write_leads" ON public.leads
FOR ALL USING (((select auth.uid()) = owner_id) OR is_admin())
WITH CHECK (((select auth.uid()) = owner_id) OR is_admin());

-- pipelines table
DROP POLICY IF EXISTS "read_all_pipelines" ON public.pipelines;
CREATE POLICY "read_all_pipelines" ON public.pipelines
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- oportunidades table
DROP POLICY IF EXISTS "read_all_oportunidades" ON public.oportunidades;
CREATE POLICY "read_all_oportunidades" ON public.oportunidades
FOR SELECT USING ((select auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "write_oportunidades" ON public.oportunidades;
CREATE POLICY "write_oportunidades" ON public.oportunidades
FOR ALL USING (((select auth.uid()) = owner_id) OR is_admin())
WITH CHECK (((select auth.uid()) = owner_id) OR is_admin());

-- atividades table
DROP POLICY IF EXISTS "read_all_atividades" ON public.atividades;
CREATE POLICY "read_all_atividades" ON public.atividades
FOR SELECT USING ((select auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "write_atividades" ON public.atividades;
CREATE POLICY "write_atividades" ON public.atividades
FOR ALL USING (((select auth.uid()) = created_by) OR is_admin())
WITH CHECK (((select auth.uid()) = created_by) OR is_admin());

-- produtos table
DROP POLICY IF EXISTS "read_all_produtos" ON public.produtos;
CREATE POLICY "read_all_produtos" ON public.produtos
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- pedidos table
DROP POLICY IF EXISTS "read_all_pedidos" ON public.pedidos;
CREATE POLICY "read_all_pedidos" ON public.pedidos
FOR SELECT USING ((select auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "write_pedidos" ON public.pedidos;
CREATE POLICY "write_pedidos" ON public.pedidos
FOR ALL USING (((select auth.role()) = 'authenticated') OR is_admin())
WITH CHECK (((select auth.role()) = 'authenticated') OR is_admin());

-- pedido_itens table
DROP POLICY IF EXISTS "read_all_pedido_itens" ON public.pedido_itens;
CREATE POLICY "read_all_pedido_itens" ON public.pedido_itens
FOR SELECT USING ((select auth.role()) = 'authenticated');

-- Performance optimization completed
SELECT 
    'HIGH PERFORMANCE RLS OPTIMIZATION COMPLETED ✅' as status,
    'All auth function calls optimized for scale' as result,
    'CRM now ready for enterprise-level performance' as impact;