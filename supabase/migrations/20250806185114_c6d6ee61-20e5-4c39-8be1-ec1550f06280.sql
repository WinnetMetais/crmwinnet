-- Ativar tabelas inativas criando políticas RLS necessárias

-- 1. Tabela commissions (comissões de vendas)
CREATE POLICY "Users can view commissions" ON public.commissions
FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can manage commissions" ON public.commissions
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update commissions" ON public.commissions
FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete commissions" ON public.commissions
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- 2. Tabela content_calendar (calendário de conteúdo)
CREATE POLICY "Users can view content_calendar" ON public.content_calendar
FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can manage content_calendar" ON public.content_calendar
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update content_calendar" ON public.content_calendar
FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete content_calendar" ON public.content_calendar
FOR DELETE USING (user_id = (SELECT auth.uid()));