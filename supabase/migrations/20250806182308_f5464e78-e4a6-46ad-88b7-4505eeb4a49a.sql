-- Corrigir múltiplas políticas permissivas para otimizar performance

-- 1. Audit Logs - Consolidar políticas SELECT
DROP POLICY IF EXISTS "Optimized: Users can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;

CREATE POLICY "Users can view audit logs" ON public.audit_logs
FOR SELECT USING (
  user_id = auth.uid() OR 
  (auth.jwt() ->> 'role'::text) = 'admin'::text
);

-- 2. Notifications - Consolidar políticas
DROP POLICY IF EXISTS "Optimized: Users can manage notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

CREATE POLICY "Users can manage notifications" ON public.notifications
FOR ALL USING (user_id = auth.uid());

-- 3. Product Configurations - Consolidar políticas SELECT
DROP POLICY IF EXISTS "Public read product_configurations" ON public.product_configurations;
DROP POLICY IF EXISTS "Users can manage product_configurations" ON public.product_configurations;

CREATE POLICY "Users can view product_configurations" ON public.product_configurations
FOR SELECT USING (true);

CREATE POLICY "Users can manage product_configurations" ON public.product_configurations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update product_configurations" ON public.product_configurations
FOR UPDATE USING (true);

CREATE POLICY "Users can delete product_configurations" ON public.product_configurations
FOR DELETE USING (true);

-- 4. Sales Goals - Consolidar políticas
DROP POLICY IF EXISTS "Optimized: Users can manage sales goals" ON public.sales_goals;
DROP POLICY IF EXISTS "Users can view their own sales goals" ON public.sales_goals;

CREATE POLICY "Users can manage sales goals" ON public.sales_goals
FOR ALL USING (user_id = auth.uid());

-- 5. System Config - Consolidar políticas SELECT
DROP POLICY IF EXISTS "Admins can manage all configs" ON public.system_config;
DROP POLICY IF EXISTS "Users can view public configs" ON public.system_config;

CREATE POLICY "Users can view public configs" ON public.system_config
FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all configs" ON public.system_config
FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- 6. System Settings - Consolidar políticas SELECT
DROP POLICY IF EXISTS "Admins can manage system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "Public read system_settings" ON public.system_settings;

CREATE POLICY "Public read system_settings" ON public.system_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage system_settings" ON public.system_settings
FOR INSERT WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update system_settings" ON public.system_settings
FOR UPDATE USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can delete system_settings" ON public.system_settings
FOR DELETE USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- 7. Tasks - Consolidar todas as políticas duplicadas
DROP POLICY IF EXISTS "Optimized: Users can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;

CREATE POLICY "Users can manage tasks" ON public.tasks
FOR ALL USING (user_id = auth.uid());

-- 8. Transactions - Consolidar políticas SELECT duplicadas
DROP POLICY IF EXISTS "Optimized: Users can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;

CREATE POLICY "Users can view transactions" ON public.transactions
FOR SELECT USING (user_id = auth.uid());

-- 9. WhatsApp Messages - Consolidar políticas duplicadas
DROP POLICY IF EXISTS "Optimized: Users can manage whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can create their own whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can delete their own whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can update their own whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can view their own whatsapp messages" ON public.whatsapp_messages;

CREATE POLICY "Users can manage whatsapp messages" ON public.whatsapp_messages
FOR ALL USING (user_id = auth.uid());