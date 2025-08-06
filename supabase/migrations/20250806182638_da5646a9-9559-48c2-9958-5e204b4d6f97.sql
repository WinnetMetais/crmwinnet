-- Otimizar políticas RLS para melhor performance
-- Trocar auth.uid() por (select auth.uid()) para evitar re-avaliação a cada linha

-- 1. Audit Logs
DROP POLICY IF EXISTS "Users can view audit logs" ON public.audit_logs;
CREATE POLICY "Users can view audit logs" ON public.audit_logs
FOR SELECT USING (
  user_id = (select auth.uid()) OR 
  ((select auth.jwt()) ->> 'role'::text) = 'admin'::text
);

-- 2. Notifications
DROP POLICY IF EXISTS "Users can manage notifications" ON public.notifications;
CREATE POLICY "Users can manage notifications" ON public.notifications
FOR ALL USING (user_id = (select auth.uid()));

-- 3. Sales Goals
DROP POLICY IF EXISTS "Users can manage sales goals" ON public.sales_goals;
CREATE POLICY "Users can manage sales goals" ON public.sales_goals
FOR ALL USING (user_id = (select auth.uid()));

-- 4. System Config - Consolidar políticas múltiplas
DROP POLICY IF EXISTS "Admins can manage all configs" ON public.system_config;
DROP POLICY IF EXISTS "Users can view public configs" ON public.system_config;

CREATE POLICY "Users can view public configs" ON public.system_config
FOR SELECT USING (
  is_public = true OR 
  ((select auth.jwt()) ->> 'role'::text) = 'admin'::text
);

CREATE POLICY "Admins can manage configs" ON public.system_config
FOR INSERT WITH CHECK (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update configs" ON public.system_config
FOR UPDATE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can delete configs" ON public.system_config
FOR DELETE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- 5. System Settings - Otimizar auth calls
DROP POLICY IF EXISTS "Admins can manage system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can update system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can delete system_settings" ON public.system_settings;

CREATE POLICY "Admins can manage system_settings" ON public.system_settings
FOR INSERT WITH CHECK (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update system_settings" ON public.system_settings
FOR UPDATE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can delete system_settings" ON public.system_settings
FOR DELETE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- 6. Tasks
DROP POLICY IF EXISTS "Users can manage tasks" ON public.tasks;
CREATE POLICY "Users can manage tasks" ON public.tasks
FOR ALL USING (user_id = (select auth.uid()));

-- 7. Transactions
DROP POLICY IF EXISTS "Users can view transactions" ON public.transactions;
CREATE POLICY "Users can view transactions" ON public.transactions
FOR SELECT USING (user_id = (select auth.uid()));

-- 8. WhatsApp Messages
DROP POLICY IF EXISTS "Users can manage whatsapp messages" ON public.whatsapp_messages;
CREATE POLICY "Users can manage whatsapp messages" ON public.whatsapp_messages
FOR ALL USING (user_id = (select auth.uid()));

-- 9. Quotes
DROP POLICY IF EXISTS "Users can manage quotes" ON public.quotes;
CREATE POLICY "Users can manage quotes" ON public.quotes
FOR ALL USING (user_id = (select auth.uid()));

-- 10. Quote Items
DROP POLICY IF EXISTS "Users can view quote items" ON public.quote_items;
CREATE POLICY "Users can view quote items" ON public.quote_items
FOR SELECT USING (user_id = (select auth.uid()));

-- 11. Profiles - Corrigir para usar apenas user_id
DROP POLICY IF EXISTS "Users can manage profiles authenticated select" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage profiles authenticated insert" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage profiles authenticated update" ON public.profiles;

CREATE POLICY "Users can manage profiles select" ON public.profiles
FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can manage profiles insert" ON public.profiles
FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can manage profiles update" ON public.profiles
FOR UPDATE USING ((select auth.uid()) = user_id);

-- 12. User Permissions - Consolidar políticas múltiplas
DROP POLICY IF EXISTS "Admins can manage all permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.user_permissions;

CREATE POLICY "Users can view permissions" ON public.user_permissions
FOR SELECT USING (
  (select auth.uid()) = user_id OR 
  ((select auth.jwt()) ->> 'role'::text) = 'admin'::text
);

CREATE POLICY "Admins can manage permissions" ON public.user_permissions
FOR INSERT WITH CHECK (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update permissions" ON public.user_permissions
FOR UPDATE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can delete permissions" ON public.user_permissions
FOR DELETE USING (((select auth.jwt()) ->> 'role'::text) = 'admin'::text);