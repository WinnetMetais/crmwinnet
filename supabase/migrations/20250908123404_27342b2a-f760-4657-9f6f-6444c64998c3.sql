-- Migração simplificada para corrigir segurança

-- 1. Corrigir funções com search_path (já corrigidas na migração anterior)

-- 2. Adicionar políticas RLS básicas para tabelas críticas sem políticas
-- Verificando individualmente para evitar conflitos

-- Tabela ad_tokens
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ad_tokens') THEN
        CREATE POLICY "ad_tokens_auth" ON public.ad_tokens FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela analytics_data  
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'analytics_data') THEN
        CREATE POLICY "analytics_data_auth" ON public.analytics_data FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela atividades
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'atividades') THEN
        CREATE POLICY "atividades_auth" ON public.atividades FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela audit_logs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'audit_logs') THEN
        CREATE POLICY "audit_logs_auth" ON public.audit_logs FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela campaigns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'campaigns') THEN
        CREATE POLICY "campaigns_auth" ON public.campaigns FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela canais_venda
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'canais_venda') THEN
        CREATE POLICY "canais_venda_auth" ON public.canais_venda FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela categorias
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'categorias') THEN
        CREATE POLICY "categorias_auth" ON public.categorias FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela centros_custo
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'centros_custo') THEN
        CREATE POLICY "centros_custo_auth" ON public.centros_custo FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela clientes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clientes') THEN
        CREATE POLICY "clientes_auth" ON public.clientes FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela contas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contas') THEN
        CREATE POLICY "contas_auth" ON public.contas FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela contas_financeiras
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contas_financeiras') THEN
        CREATE POLICY "contas_financeiras_auth" ON public.contas_financeiras FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela contatos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contatos') THEN
        CREATE POLICY "contatos_auth" ON public.contatos FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela customer_segments
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'customer_segments') THEN
        CREATE POLICY "customer_segments_auth" ON public.customer_segments FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela departments
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'departments') THEN
        CREATE POLICY "departments_auth" ON public.departments FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela lead_sources
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'lead_sources') THEN
        CREATE POLICY "lead_sources_auth" ON public.lead_sources FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela produtos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'produtos') THEN
        CREATE POLICY "produtos_auth" ON public.produtos FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela profiles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE POLICY "profiles_auth" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela quote_items
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quote_items') THEN
        CREATE POLICY "quote_items_auth" ON public.quote_items FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela tasks
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tasks') THEN
        CREATE POLICY "tasks_auth" ON public.tasks FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Tabela user_roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles') THEN
        CREATE POLICY "user_roles_auth" ON public.user_roles FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;