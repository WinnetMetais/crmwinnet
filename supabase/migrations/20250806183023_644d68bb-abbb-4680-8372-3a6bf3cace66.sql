-- Corrigir tabelas com RLS habilitado mas sem políticas definidas
-- Isso resolve os warnings de segurança identificados pelo linter

-- 1. Analytics Data - Tabela para dados de analytics
CREATE POLICY "Users can view analytics data" ON public.analytics_data
FOR SELECT USING (true);

CREATE POLICY "System can insert analytics data" ON public.analytics_data
FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update analytics data" ON public.analytics_data
FOR UPDATE USING (true);

-- 2. Analytics Reports - Relatórios de analytics
CREATE POLICY "Users can view analytics reports" ON public.analytics_reports
FOR SELECT USING (true);

CREATE POLICY "System can manage analytics reports" ON public.analytics_reports
FOR ALL USING (true);

-- 3. Backup Jobs - Trabalhos de backup
CREATE POLICY "Admins can manage backup jobs" ON public.backup_jobs
FOR ALL USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- 4. Content Templates - Templates de conteúdo
CREATE POLICY "Users can manage content templates" ON public.content_templates
FOR ALL USING (user_id = (select auth.uid()));

-- 5. Custom Fields - Campos customizados
CREATE POLICY "Users can manage custom fields" ON public.custom_fields
FOR ALL USING (user_id = (select auth.uid()));

-- 6. Custom Reports - Relatórios customizados
CREATE POLICY "Users can manage custom reports" ON public.custom_reports
FOR ALL USING (user_id = (select auth.uid()));

-- 7. Marketing Campaigns - Campanhas de marketing
CREATE POLICY "Users can manage marketing campaigns" ON public.marketing_campaigns
FOR ALL USING (user_id = (select auth.uid()));

-- 8. Negotiations - Negociações
CREATE POLICY "Users can manage negotiations" ON public.negotiations
FOR ALL USING (user_id = (select auth.uid()));

-- 9. Priorities - Prioridades
CREATE POLICY "Users can view priorities" ON public.priorities
FOR SELECT USING (true);

CREATE POLICY "Admins can manage priorities" ON public.priorities
FOR INSERT WITH CHECK (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update priorities" ON public.priorities
FOR UPDATE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can delete priorities" ON public.priorities
FOR DELETE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- 10. User Settings - Configurações do usuário
CREATE POLICY "Users can manage their settings" ON public.user_settings
FOR ALL USING (user_id = (select auth.uid()));

-- 11. Qualification Statuses - Status de qualificação
CREATE POLICY "Users can view qualification statuses" ON public.qualification_statuses
FOR SELECT USING (true);

CREATE POLICY "Admins can manage qualification statuses" ON public.qualification_statuses
FOR INSERT WITH CHECK (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update qualification statuses" ON public.qualification_statuses
FOR UPDATE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can delete qualification statuses" ON public.qualification_statuses
FOR DELETE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);