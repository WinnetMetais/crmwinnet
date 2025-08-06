-- Otimização de RLS: corrigir performance e políticas duplicadas

-- 1. OTIMIZAR POLÍTICAS RLS DA TABELA whatsapp_messages
-- Remover políticas existentes
DROP POLICY IF EXISTS "Authenticated users can view whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Authenticated users can insert whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can update their whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can delete their whatsapp messages" ON public.whatsapp_messages;

-- Criar políticas otimizadas com SELECT para auth.uid()
CREATE POLICY "Authenticated users can view whatsapp messages" ON public.whatsapp_messages
FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can insert whatsapp messages" ON public.whatsapp_messages
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update their whatsapp messages" ON public.whatsapp_messages
FOR UPDATE USING (user_id = (SELECT auth.uid()) OR (SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can delete their whatsapp messages" ON public.whatsapp_messages
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- 2. CONSOLIDAR POLÍTICAS DUPLICADAS NA TABELA analytics_reports
-- Remover políticas duplicadas
DROP POLICY IF EXISTS "System can manage analytics reports" ON public.analytics_reports;
DROP POLICY IF EXISTS "Users can create analytics_reports" ON public.analytics_reports;
DROP POLICY IF EXISTS "Users can view analytics reports" ON public.analytics_reports;
DROP POLICY IF EXISTS "Users can view analytics_reports" ON public.analytics_reports;

-- Criar políticas consolidadas e otimizadas
CREATE POLICY "Authenticated users can manage analytics_reports" ON public.analytics_reports
FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);

-- 3. CONSOLIDAR POLÍTICAS DUPLICADAS NA TABELA priorities
-- Remover políticas duplicadas
DROP POLICY IF EXISTS "Public read priorities" ON public.priorities;
DROP POLICY IF EXISTS "Users can view priorities" ON public.priorities;

-- Criar política consolidada
CREATE POLICY "Anyone can view priorities" ON public.priorities
FOR SELECT USING (true);

-- 4. VERIFICAR E OTIMIZAR OUTRAS POLÍTICAS COMUNS
-- Política para user_settings usando SELECT otimizado
DROP POLICY IF EXISTS "Users can manage their settings" ON public.user_settings;
CREATE POLICY "Users can manage their settings" ON public.user_settings
FOR ALL USING (user_id = (SELECT auth.uid()));

-- Política para tasks usando SELECT otimizado  
DROP POLICY IF EXISTS "Users can manage tasks" ON public.tasks;
CREATE POLICY "Users can manage tasks" ON public.tasks
FOR ALL USING (user_id = (SELECT auth.uid()));

-- Política para quotes usando SELECT otimizado
DROP POLICY IF EXISTS "Users can manage quotes" ON public.quotes;
CREATE POLICY "Users can manage quotes" ON public.quotes
FOR ALL USING (user_id = (SELECT auth.uid()));

-- Política para notifications usando SELECT otimizado
DROP POLICY IF EXISTS "Users can manage notifications" ON public.notifications;
CREATE POLICY "Users can manage notifications" ON public.notifications
FOR ALL USING (user_id = (SELECT auth.uid()));

-- Política para marketing_campaigns usando SELECT otimizado
DROP POLICY IF EXISTS "Users can manage marketing campaigns" ON public.marketing_campaigns;
CREATE POLICY "Users can manage marketing campaigns" ON public.marketing_campaigns
FOR ALL USING (user_id = (SELECT auth.uid()));

-- Política para custom_reports usando SELECT otimizado
DROP POLICY IF EXISTS "Users can manage custom reports" ON public.custom_reports;
CREATE POLICY "Users can manage custom reports" ON public.custom_reports
FOR ALL USING (user_id = (SELECT auth.uid()));

-- Política para custom_fields usando SELECT otimizado
DROP POLICY IF EXISTS "Users can manage custom fields" ON public.custom_fields;
CREATE POLICY "Users can manage custom fields" ON public.custom_fields
FOR ALL USING (user_id = (SELECT auth.uid()));