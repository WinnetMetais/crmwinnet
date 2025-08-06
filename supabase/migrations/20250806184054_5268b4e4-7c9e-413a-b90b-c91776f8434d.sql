-- Corrigir apenas as tabelas que estão com RLS habilitado mas SEM políticas
-- Verificar quais realmente precisam de políticas

-- 1. Analytics Data - Dados de analytics (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics_data') THEN
        EXECUTE 'CREATE POLICY "Users can view analytics data" ON public.analytics_data FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "System can insert analytics data" ON public.analytics_data FOR INSERT WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "System can update analytics data" ON public.analytics_data FOR UPDATE USING (true)';
    END IF;
END
$$;

-- 2. Analytics Reports (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics_reports') THEN
        EXECUTE 'CREATE POLICY "Users can view analytics reports" ON public.analytics_reports FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "System can manage analytics reports" ON public.analytics_reports FOR ALL USING (true)';
    END IF;
END
$$;

-- 3. Content Templates (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_templates') THEN
        EXECUTE 'CREATE POLICY "Users can manage content templates" ON public.content_templates FOR ALL USING (user_id = (select auth.uid()))';
    END IF;
END
$$;

-- 4. Custom Fields (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'custom_fields') THEN
        EXECUTE 'CREATE POLICY "Users can manage custom fields" ON public.custom_fields FOR ALL USING (user_id = (select auth.uid()))';
    END IF;
END
$$;

-- 5. Custom Reports (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'custom_reports') THEN
        EXECUTE 'CREATE POLICY "Users can manage custom reports" ON public.custom_reports FOR ALL USING (user_id = (select auth.uid()))';
    END IF;
END
$$;

-- 6. Marketing Campaigns (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'marketing_campaigns') THEN
        EXECUTE 'CREATE POLICY "Users can manage marketing campaigns" ON public.marketing_campaigns FOR ALL USING (user_id = (select auth.uid()))';
    END IF;
END
$$;

-- 7. Negotiations (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'negotiations') THEN
        EXECUTE 'CREATE POLICY "Users can manage negotiations" ON public.negotiations FOR ALL USING (user_id = (select auth.uid()))';
    END IF;
END
$$;

-- 8. Priorities (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'priorities') THEN
        EXECUTE 'CREATE POLICY "Users can view priorities" ON public.priorities FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "Admins can manage priorities" ON public.priorities FOR INSERT WITH CHECK (((select auth.jwt()) ->> ''role''::text) = ''admin''::text)';
        EXECUTE 'CREATE POLICY "Admins can update priorities" ON public.priorities FOR UPDATE USING (((select auth.jwt()) ->> ''role''::text) = ''admin''::text)';
        EXECUTE 'CREATE POLICY "Admins can delete priorities" ON public.priorities FOR DELETE USING (((select auth.jwt()) ->> ''role''::text) = ''admin''::text)';
    END IF;
END
$$;

-- 9. User Settings (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings') THEN
        EXECUTE 'CREATE POLICY "Users can manage their settings" ON public.user_settings FOR ALL USING (user_id = (select auth.uid()))';
    END IF;
END
$$;

-- 10. Qualification Statuses (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'qualification_statuses') THEN
        EXECUTE 'CREATE POLICY "Users can view qualification statuses" ON public.qualification_statuses FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "Admins can manage qualification statuses" ON public.qualification_statuses FOR INSERT WITH CHECK (((select auth.jwt()) ->> ''role''::text) = ''admin''::text)';
        EXECUTE 'CREATE POLICY "Admins can update qualification statuses" ON public.qualification_statuses FOR UPDATE USING (((select auth.jwt()) ->> ''role''::text) = ''admin''::text)';
        EXECUTE 'CREATE POLICY "Admins can delete qualification statuses" ON public.qualification_statuses FOR DELETE USING (((select auth.jwt()) ->> ''role''::text) = ''admin''::text)';
    END IF;
END
$$;