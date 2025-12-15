-- =====================================================
-- CORREÇÃO COMPLETA DE BANCO DE DADOS - CRM WINNET
-- =====================================================

-- 1. Adicionar coluna deleted_by na tabela transactions
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- 2. Criar view active_transactions para transações não deletadas
CREATE OR REPLACE VIEW public.active_transactions AS
SELECT * FROM public.transactions
WHERE deleted_at IS NULL;

-- 3. Criar tabela orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  quote_id UUID REFERENCES public.quotes(id),
  issue_date DATE DEFAULT CURRENT_DATE,
  gross_total DECIMAL(15,2) DEFAULT 0,
  net_total DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'pendente',
  owner_id UUID,
  user_id UUID,
  delivery_address TEXT,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Criar tabela order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  description TEXT,
  quantity DECIMAL(15,4) DEFAULT 1,
  unit_price DECIMAL(15,2) DEFAULT 0,
  subtotal DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Adicionar colunas faltantes em opportunities
ALTER TABLE public.opportunities 
ADD COLUMN IF NOT EXISTS actual_close_date DATE,
ADD COLUMN IF NOT EXISTS lead_source TEXT,
ADD COLUMN IF NOT EXISTS assigned_to UUID,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'aberta';

-- 6. Adicionar colunas faltantes em customer_interactions
ALTER TABLE public.customer_interactions 
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS outcome TEXT,
ADD COLUMN IF NOT EXISTS next_action TEXT,
ADD COLUMN IF NOT EXISTS next_action_date DATE;

-- 7. Criar função has_financial_permission
CREATE OR REPLACE FUNCTION public.has_financial_permission(
  _permission_type TEXT,
  _module TEXT DEFAULT 'all'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
  has_permission BOOLEAN;
BEGIN
  user_id := (SELECT auth.uid());
  
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se usuário é admin (tem todas as permissões)
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = has_financial_permission.user_id 
    AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Verificar permissão específica
  SELECT EXISTS (
    SELECT 1 FROM public.financial_permissions fp
    WHERE fp.user_id = has_financial_permission.user_id
    AND fp.active = true
    AND fp.permission_type = _permission_type
    AND (fp.module = _module OR fp.module = 'all' OR _module = 'all')
  ) INTO has_permission;
  
  RETURN COALESCE(has_permission, FALSE);
END;
$$;

-- 8. Habilitar RLS nas novas tabelas
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 9. Criar políticas RLS para orders
CREATE POLICY "Users can view orders" ON public.orders
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert orders" ON public.orders
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update orders" ON public.orders
  FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- 10. Criar políticas RLS para order_items
CREATE POLICY "Users can view order_items" ON public.order_items
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert order_items" ON public.order_items
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update order_items" ON public.order_items
  FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can delete order_items" ON public.order_items
  FOR DELETE USING ((SELECT auth.uid()) IS NOT NULL);

-- 11. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_assigned_to ON public.opportunities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);

-- 12. Trigger para atualizar updated_at em orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Habilitar realtime para novas tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;