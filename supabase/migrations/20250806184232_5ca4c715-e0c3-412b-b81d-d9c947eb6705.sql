-- Criar políticas apenas para tabelas que existem e não têm políticas

-- 1. Analytics Data
CREATE POLICY "Users can view analytics data" ON public.analytics_data
FOR SELECT USING (true);

CREATE POLICY "System can insert analytics data" ON public.analytics_data
FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update analytics data" ON public.analytics_data
FOR UPDATE USING (true);

-- 2. Analytics Reports
CREATE POLICY "Users can view analytics reports" ON public.analytics_reports
FOR SELECT USING (true);

CREATE POLICY "System can manage analytics reports" ON public.analytics_reports
FOR ALL USING (true);

-- 3. Content Templates
CREATE POLICY "Users can manage content templates" ON public.content_templates
FOR ALL USING (user_id = (select auth.uid()));

-- 4. Custom Fields
CREATE POLICY "Users can manage custom fields" ON public.custom_fields
FOR ALL USING (user_id = (select auth.uid()));

-- 5. Custom Reports
CREATE POLICY "Users can manage custom reports" ON public.custom_reports
FOR ALL USING (user_id = (select auth.uid()));

-- 6. Marketing Campaigns
CREATE POLICY "Users can manage marketing campaigns" ON public.marketing_campaigns
FOR ALL USING (user_id = (select auth.uid()));

-- 7. Negotiations
CREATE POLICY "Users can manage negotiations" ON public.negotiations
FOR ALL USING (user_id = (select auth.uid()));

-- 8. Priorities
CREATE POLICY "Users can view priorities" ON public.priorities
FOR SELECT USING (true);

CREATE POLICY "Admins can manage priorities" ON public.priorities
FOR INSERT WITH CHECK (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update priorities" ON public.priorities
FOR UPDATE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can delete priorities" ON public.priorities
FOR DELETE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- 9. User Settings
CREATE POLICY "Users can manage their settings" ON public.user_settings
FOR ALL USING (user_id = (select auth.uid()));