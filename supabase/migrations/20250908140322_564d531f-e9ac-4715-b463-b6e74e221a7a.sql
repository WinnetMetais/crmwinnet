-- Adicionar políticas de RLS para sales_goals
CREATE POLICY "Users can view their own sales goals" ON public.sales_goals
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own sales goals" ON public.sales_goals
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sales goals" ON public.sales_goals
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own sales goals" ON public.sales_goals
FOR DELETE USING (user_id = auth.uid());