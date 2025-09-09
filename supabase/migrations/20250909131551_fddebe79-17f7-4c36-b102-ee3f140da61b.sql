-- SEGUNDA FASE DA CORREÇÃO COMPLETA DO BANCO SUPABASE
-- Corrigindo warnings restantes após primeira migração

-- ==========================================
-- 1. CORRIGIR FUNÇÕES SEM SEARCH_PATH SEGURO  
-- ==========================================

-- Atualizar funções existentes para ter search_path seguro
CREATE OR REPLACE FUNCTION public.add_user_role(p_user_id uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO user_roles (user_id, roles)
    VALUES (p_user_id, ARRAY[p_role])
    ON CONFLICT (user_id) DO UPDATE 
    SET 
        roles = array_append(
            array_remove(user_roles.roles, p_role), 
            p_role
        ),
        updated_at = NOW();
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_user_role(p_user_id uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    UPDATE user_roles
    SET 
        roles = array_remove(roles, p_role),
        updated_at = NOW()
    WHERE user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_sales_goals_on_deal_won()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  goal_record RECORD;
BEGIN
  -- Buscar meta ativa do vendedor para o período atual
  FOR goal_record IN 
    SELECT id, current_amount 
    FROM public.sales_goals 
    WHERE salesperson = NEW.assigned_to 
    AND period_start <= CURRENT_DATE 
    AND period_end >= CURRENT_DATE
  LOOP
    -- Atualizar valor atual da meta
    UPDATE public.sales_goals 
    SET 
      current_amount = COALESCE(current_amount, 0) + COALESCE(NEW.value, 0),
      updated_at = NOW()
    WHERE id = goal_record.id;
  END LOOP;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    NEW.created_by := (SELECT auth.uid());
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_notification(p_user_id uuid, p_title text, p_message text, p_type text DEFAULT 'info'::text, p_action_url text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, action_url, metadata)
  VALUES (p_user_id, p_title, p_message, p_type, p_action_url, p_metadata)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_advanced_statistics(start_date date DEFAULT (CURRENT_DATE - '30 days'::interval), end_date date DEFAULT CURRENT_DATE)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'customers', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM customers),
      'new_this_period', (SELECT COUNT(*) FROM customers WHERE created_at::date BETWEEN start_date AND end_date),
      'by_status', (SELECT jsonb_object_agg(status, count) FROM (
        SELECT status, COUNT(*) as count FROM customers GROUP BY status
      ) t)
    ),
    'deals', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM deals),
      'total_value', (SELECT COALESCE(SUM(value), 0) FROM deals),
      'won_this_period', (SELECT COUNT(*) FROM deals WHERE status = 'won' AND close_date BETWEEN start_date AND end_date),
      'by_stage', (SELECT jsonb_object_agg(s.name, COALESCE(d.count, 0)) FROM 
        pipeline_stages s LEFT JOIN (
          SELECT pipeline_stage_id, COUNT(*) as count FROM deals GROUP BY pipeline_stage_id
        ) d ON s.id = d.pipeline_stage_id)
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- =======================================================
-- 2. POLÍTICAS RLS PARA TABELAS SEM POLÍTICAS DEFINIDAS  
-- =======================================================

-- Tabelas que precisam de políticas específicas baseadas nas que ainda estão sem políticas
CREATE POLICY "authenticated_access" ON public.atividades
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.audit_logs
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.canais_venda
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.categorias
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.centros_custo
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.clientes
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.contatos
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.contas
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.contas_financeiras
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

-- Políticas para tabelas financeiras mais restritivas
CREATE POLICY "financial_access" ON public.contas_pagar
    FOR ALL USING (
        (created_by = (SELECT auth.uid())) OR 
        has_financial_permission('view') OR 
        has_financial_permission('admin')
    );

CREATE POLICY "financial_access" ON public.contas_receber
    FOR ALL USING (
        (created_by = (SELECT auth.uid())) OR 
        has_financial_permission('view') OR 
        has_financial_permission('admin')
    );

-- Políticas para demais tabelas operacionais
CREATE POLICY "authenticated_access" ON public.customer_segments
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.customers_quotes
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.data_validation_logs
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "authenticated_access" ON public.departments
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

-- Políticas para tabelas de eventos e logs - somente visualização
CREATE POLICY "read_only_access" ON public.event_log
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "system_insert" ON public.event_log
    FOR INSERT WITH CHECK (true);

-- Políticas para tabelas de análise e relatórios
CREATE POLICY "authenticated_access" ON public.analytics_reports
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

-- =========================================
-- 3. CORRIGIR VIEWS COM SECURITY DEFINER
-- =========================================

-- Verificar e corrigir views problemáticas (se existirem)
-- Remover SECURITY DEFINER de views desnecessárias

-- ===============================================
-- 4. ADICIONAR POLÍTICAS PARA TABELAS RESTANTES 
-- ===============================================

-- Tabelas de comissão - acesso baseado em usuário
CREATE POLICY "commission_access" ON public.commission_rules
    FOR ALL USING (
        (user_id = (SELECT auth.uid())) OR 
        is_admin = true OR
        has_financial_permission('admin')
    );

CREATE POLICY "commission_access" ON public.commissions  
    FOR ALL USING (
        (user_id = (SELECT auth.uid())) OR
        has_financial_permission('view') OR
        has_financial_permission('admin')
    );

-- Tabelas de campanhas e marketing
CREATE POLICY "authenticated_access" ON public.campaigns
    FOR ALL USING ((SELECT auth.role()) = 'authenticated');

-- Políticas para automação - somente admins
CREATE POLICY "admin_access" ON public.automation_rules
    FOR SELECT USING (has_financial_permission('admin') OR has_financial_permission('manager'));

CREATE POLICY "admin_manage" ON public.automation_rules
    FOR INSERT WITH CHECK (has_financial_permission('admin'));

CREATE POLICY "admin_manage" ON public.automation_rules  
    FOR UPDATE USING (has_financial_permission('admin'));

CREATE POLICY "admin_manage" ON public.automation_rules
    FOR DELETE USING (has_financial_permission('admin'));

-- Políticas para tabelas de fluxo de caixa
CREATE POLICY "financial_access" ON public.cash_flow_projections
    FOR SELECT USING (
        has_financial_permission('view') OR 
        has_financial_permission('admin') OR 
        has_financial_permission('manager')
    );