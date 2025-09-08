-- Corrigir políticas RLS usando coluna 'active' ao invés de 'granted'

-- Políticas para system_users
CREATE POLICY "Users can view their own record" 
ON public.system_users 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all users" 
ON public.system_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND permission_type = 'admin' 
    AND active = true
  )
);

CREATE POLICY "Admins can insert users" 
ON public.system_users 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND permission_type = 'admin' 
    AND active = true
  )
);

CREATE POLICY "Admins can update users" 
ON public.system_users 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND permission_type = 'admin' 
    AND active = true
  )
);

-- Políticas para approval_hierarchy (já existem mas vou atualizar)
DROP POLICY IF EXISTS "Users can view hierarchy where they are involved" ON public.approval_hierarchy;
DROP POLICY IF EXISTS "Admins can manage approval hierarchy" ON public.approval_hierarchy;

CREATE POLICY "Users can view hierarchy where they are involved" 
ON public.approval_hierarchy 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  approver_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND permission_type = 'admin' 
    AND active = true
  )
);

CREATE POLICY "Admins can manage approval hierarchy" 
ON public.approval_hierarchy 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND permission_type = 'admin' 
    AND active = true
  )
);

-- Políticas para approval_requests (já existem mas vou atualizar)
DROP POLICY IF EXISTS "Users can view requests they created or need to approve" ON public.approval_requests;
DROP POLICY IF EXISTS "Approvers can update requests" ON public.approval_requests;

CREATE POLICY "Users can view requests they created or need to approve" 
ON public.approval_requests 
FOR SELECT 
USING (
  requester_id = auth.uid() OR 
  approver_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND permission_type = 'admin' 
    AND active = true
  )
);

CREATE POLICY "Approvers can update requests" 
ON public.approval_requests 
FOR UPDATE 
USING (
  approver_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND permission_type = 'admin' 
    AND active = true
  )
);

-- Políticas para automation_rules
CREATE POLICY "Users can view automation rules" 
ON public.automation_rules 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND (permission_type = 'admin' OR permission_type = 'manager')
    AND active = true
  )
);

CREATE POLICY "Admins can manage automation rules" 
ON public.automation_rules 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND permission_type = 'admin' 
    AND active = true
  )
);

-- Políticas para automation_logs
CREATE POLICY "Users can view automation logs" 
ON public.automation_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND (permission_type = 'admin' OR permission_type = 'manager')
    AND active = true
  )
);

CREATE POLICY "System can insert automation logs" 
ON public.automation_logs 
FOR INSERT 
WITH CHECK (true);

-- Políticas para cash_flow_projections
CREATE POLICY "Users can view cash flow projections" 
ON public.cash_flow_projections 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND (permission_type = 'admin' OR permission_type = 'manager' OR permission_type = 'view')
    AND active = true
  )
);

CREATE POLICY "System can manage cash flow projections" 
ON public.cash_flow_projections 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.financial_permissions 
    WHERE user_id = auth.uid() 
    AND (permission_type = 'admin' OR permission_type = 'manager')
    AND active = true
  )
);