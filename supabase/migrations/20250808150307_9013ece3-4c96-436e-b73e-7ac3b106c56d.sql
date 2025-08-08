-- Fix policies: drop-if-exists then create

-- Enable RLS already handled if needed

-- Read policies
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'canais_venda','clientes','contatos','leads','pipelines','oportunidades','atividades','produtos','pedidos','pedido_itens',
    'centros_custo','categorias','contas_financeiras','lancamentos','saldos_mensais','contas','contas_receber','contas_pagar','metas_vendas'
  ]
  LOOP
    EXECUTE format('alter table public.%I enable row level security;', t);
    EXECUTE format('drop policy if exists %I on public.%I;', 'read_all_'||t, t);
    EXECUTE format('create policy %I on public.%I for select using ((select auth.uid()) is not null);', 'read_all_'||t, t);
  END LOOP;
END$$;

-- Admin-only tables
DROP POLICY IF EXISTS write_canais ON public.canais_venda;
CREATE POLICY write_canais ON public.canais_venda FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS write_pipelines ON public.pipelines;
CREATE POLICY write_pipelines ON public.pipelines FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS write_produtos ON public.produtos;
CREATE POLICY write_produtos ON public.produtos FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Owner/admin tables
DROP POLICY IF EXISTS write_clientes ON public.clientes;
CREATE POLICY write_clientes ON public.clientes FOR ALL USING ((criado_por = (select auth.uid())) or public.is_admin()) WITH CHECK ((criado_por = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_contatos ON public.contatos;
CREATE POLICY write_contatos ON public.contatos FOR ALL USING ((criado_por = (select auth.uid())) or public.is_admin()) WITH CHECK ((criado_por = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_leads ON public.leads;
CREATE POLICY write_leads ON public.leads FOR ALL USING ((owner_id = (select auth.uid())) or public.is_admin()) WITH CHECK ((owner_id = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_oportunidades ON public.oportunidades;
CREATE POLICY write_oportunidades ON public.oportunidades FOR ALL USING ((owner_id = (select auth.uid())) or public.is_admin()) WITH CHECK ((owner_id = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_atividades ON public.atividades;
CREATE POLICY write_atividades ON public.atividades FOR ALL USING ((owner_id = (select auth.uid())) or public.is_admin()) WITH CHECK ((owner_id = (select auth.uid())) or public.is_admin());

-- Authenticated write tables
DROP POLICY IF EXISTS write_pedidos ON public.pedidos;
CREATE POLICY write_pedidos ON public.pedidos FOR ALL USING ((select auth.uid()) is not null or public.is_admin()) WITH CHECK ((select auth.uid()) is not null or public.is_admin());

DROP POLICY IF EXISTS write_pedido_itens ON public.pedido_itens;
CREATE POLICY write_pedido_itens ON public.pedido_itens FOR ALL USING ((select auth.uid()) is not null or public.is_admin()) WITH CHECK ((select auth.uid()) is not null or public.is_admin());

DROP POLICY IF EXISTS write_centros ON public.centros_custo;
CREATE POLICY write_centros ON public.centros_custo FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_categorias ON public.categorias;
CREATE POLICY write_categorias ON public.categorias FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_contas_fin ON public.contas_financeiras;
CREATE POLICY write_contas_fin ON public.contas_financeiras FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_lanc ON public.lancamentos;
CREATE POLICY write_lanc ON public.lancamentos FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_saldos ON public.saldos_mensais;
CREATE POLICY write_saldos ON public.saldos_mensais FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_contas ON public.contas;
CREATE POLICY write_contas ON public.contas FOR ALL USING ((select auth.uid()) is not null or public.is_admin()) WITH CHECK ((select auth.uid()) is not null or public.is_admin());

DROP POLICY IF EXISTS write_cr ON public.contas_receber;
CREATE POLICY write_cr ON public.contas_receber FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_cp ON public.contas_pagar;
CREATE POLICY write_cp ON public.contas_pagar FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_metas ON public.metas_vendas;
CREATE POLICY write_metas ON public.metas_vendas FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());