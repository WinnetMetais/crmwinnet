-- Fix RLS performance issues by optimizing auth function calls and removing duplicate policies

-- Fix user_roles table
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix customer_segments table  
DROP POLICY IF EXISTS "Authenticated users can view customer segments" ON public.customer_segments;
CREATE POLICY "Authenticated users can view customer segments" ON public.customer_segments
FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

-- Fix profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- Fix atividades table - remove duplicate policies and optimize
DROP POLICY IF EXISTS "read_all_atividades" ON public.atividades;
DROP POLICY IF EXISTS "write_atividades" ON public.atividades;
DROP POLICY IF EXISTS "atividades_delete" ON public.atividades;
DROP POLICY IF EXISTS "atividades_insert" ON public.atividades;
DROP POLICY IF EXISTS "atividades_update" ON public.atividades;

CREATE POLICY "atividades_select" ON public.atividades
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "atividades_insert" ON public.atividades
FOR INSERT WITH CHECK ((owner_id = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "atividades_update" ON public.atividades
FOR UPDATE USING ((owner_id = (SELECT auth.uid())) OR is_admin())
WITH CHECK ((owner_id = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "atividades_delete" ON public.atividades
FOR DELETE USING ((owner_id = (SELECT auth.uid())) OR is_admin());

-- Fix centros_custo table
DROP POLICY IF EXISTS "read_all_centros_custo" ON public.centros_custo;
DROP POLICY IF EXISTS "write_centros_custo" ON public.centros_custo;
DROP POLICY IF EXISTS "centros_custo_delete" ON public.centros_custo;
DROP POLICY IF EXISTS "centros_custo_insert" ON public.centros_custo;
DROP POLICY IF EXISTS "centros_custo_update" ON public.centros_custo;

CREATE POLICY "centros_custo_select" ON public.centros_custo
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "centros_custo_insert" ON public.centros_custo
FOR INSERT WITH CHECK ((created_by = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "centros_custo_update" ON public.centros_custo
FOR UPDATE USING ((created_by = (SELECT auth.uid())) OR is_admin())
WITH CHECK ((created_by = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "centros_custo_delete" ON public.centros_custo
FOR DELETE USING ((created_by = (SELECT auth.uid())) OR is_admin());

-- Fix categorias table
DROP POLICY IF EXISTS "read_all_categorias" ON public.categorias;
DROP POLICY IF EXISTS "write_categorias" ON public.categorias;
DROP POLICY IF EXISTS "categorias_delete" ON public.categorias;
DROP POLICY IF EXISTS "categorias_insert" ON public.categorias;
DROP POLICY IF EXISTS "categorias_update" ON public.categorias;

CREATE POLICY "categorias_select" ON public.categorias
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "categorias_insert" ON public.categorias
FOR INSERT WITH CHECK ((created_by = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "categorias_update" ON public.categorias
FOR UPDATE USING ((created_by = (SELECT auth.uid())) OR is_admin())
WITH CHECK ((created_by = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "categorias_delete" ON public.categorias
FOR DELETE USING ((created_by = (SELECT auth.uid())) OR is_admin());

-- Fix saldos_mensais table
DROP POLICY IF EXISTS "read_all_saldos_mensais" ON public.saldos_mensais;
DROP POLICY IF EXISTS "write_saldos_mensais" ON public.saldos_mensais;

CREATE POLICY "saldos_mensais_select" ON public.saldos_mensais
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "saldos_mensais_all" ON public.saldos_mensais
FOR ALL USING (((SELECT auth.uid()) = created_by) OR is_admin())
WITH CHECK (((SELECT auth.uid()) = created_by) OR is_admin());

-- Fix contas table
DROP POLICY IF EXISTS "read_all_contas" ON public.contas;
DROP POLICY IF EXISTS "write_contas" ON public.contas;
DROP POLICY IF EXISTS "contas_delete" ON public.contas;
DROP POLICY IF EXISTS "contas_insert" ON public.contas;
DROP POLICY IF EXISTS "contas_update" ON public.contas;

CREATE POLICY "contas_select" ON public.contas
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "contas_insert" ON public.contas
FOR INSERT WITH CHECK (((SELECT auth.uid()) IS NOT NULL) OR is_admin());

CREATE POLICY "contas_update" ON public.contas
FOR UPDATE USING (((SELECT auth.uid()) IS NOT NULL) OR is_admin())
WITH CHECK (((SELECT auth.uid()) IS NOT NULL) OR is_admin());

CREATE POLICY "contas_delete" ON public.contas
FOR DELETE USING (((SELECT auth.uid()) IS NOT NULL) OR is_admin());

-- Fix contas_receber table
DROP POLICY IF EXISTS "read_all_contas_receber" ON public.contas_receber;
DROP POLICY IF EXISTS "write_contas_receber" ON public.contas_receber;
DROP POLICY IF EXISTS "contas_receber_delete" ON public.contas_receber;
DROP POLICY IF EXISTS "contas_receber_insert" ON public.contas_receber;
DROP POLICY IF EXISTS "contas_receber_update" ON public.contas_receber;

CREATE POLICY "contas_receber_select" ON public.contas_receber
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "contas_receber_insert" ON public.contas_receber
FOR INSERT WITH CHECK ((created_by = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "contas_receber_update" ON public.contas_receber
FOR UPDATE USING ((created_by = (SELECT auth.uid())) OR is_admin())
WITH CHECK ((created_by = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "contas_receber_delete" ON public.contas_receber
FOR DELETE USING ((created_by = (SELECT auth.uid())) OR is_admin());

-- Fix contas_pagar table
DROP POLICY IF EXISTS "read_all_contas_pagar" ON public.contas_pagar;
DROP POLICY IF EXISTS "write_contas_pagar" ON public.contas_pagar;
DROP POLICY IF EXISTS "contas_pagar_delete" ON public.contas_pagar;
DROP POLICY IF EXISTS "contas_pagar_insert" ON public.contas_pagar;
DROP POLICY IF EXISTS "contas_pagar_update" ON public.contas_pagar;

CREATE POLICY "contas_pagar_select" ON public.contas_pagar
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "contas_pagar_insert" ON public.contas_pagar
FOR INSERT WITH CHECK ((created_by = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "contas_pagar_update" ON public.contas_pagar
FOR UPDATE USING ((created_by = (SELECT auth.uid())) OR is_admin())
WITH CHECK ((created_by = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "contas_pagar_delete" ON public.contas_pagar
FOR DELETE USING ((created_by = (SELECT auth.uid())) OR is_admin());

-- Fix metas_vendas table
DROP POLICY IF EXISTS "read_all_metas_vendas" ON public.metas_vendas;
DROP POLICY IF EXISTS "write_metas_vendas" ON public.metas_vendas;

CREATE POLICY "metas_vendas_select" ON public.metas_vendas
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "metas_vendas_all" ON public.metas_vendas
FOR ALL USING (((SELECT auth.uid()) = created_by) OR is_admin())
WITH CHECK (((SELECT auth.uid()) = created_by) OR is_admin());

-- Fix contatos table
DROP POLICY IF EXISTS "write_contatos" ON public.contatos;
DROP POLICY IF EXISTS "read_all_contatos" ON public.contatos;
DROP POLICY IF EXISTS "contatos_delete" ON public.contatos;
DROP POLICY IF EXISTS "contatos_insert" ON public.contatos;
DROP POLICY IF EXISTS "contatos_update" ON public.contatos;

CREATE POLICY "contatos_select" ON public.contatos
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "contatos_insert" ON public.contatos
FOR INSERT WITH CHECK ((criado_por = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "contatos_update" ON public.contatos
FOR UPDATE USING ((criado_por = (SELECT auth.uid())) OR is_admin())
WITH CHECK ((criado_por = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "contatos_delete" ON public.contatos
FOR DELETE USING ((criado_por = (SELECT auth.uid())) OR is_admin());

-- Fix pedido_itens table
DROP POLICY IF EXISTS "write_pedido_itens" ON public.pedido_itens;

CREATE POLICY "pedido_itens_all" ON public.pedido_itens
FOR ALL USING (((SELECT auth.uid()) = created_by) OR is_admin())
WITH CHECK (((SELECT auth.uid()) = created_by) OR is_admin());