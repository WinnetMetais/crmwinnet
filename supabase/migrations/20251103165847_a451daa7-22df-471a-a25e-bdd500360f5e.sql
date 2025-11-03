-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'sales', 'user');

-- Create user_roles table (SECURITY: roles in separate table)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  website TEXT,
  contact_person TEXT,
  contact_role TEXT,
  whatsapp TEXT,
  notes TEXT,
  status TEXT DEFAULT 'prospecto' CHECK (status IN ('prospecto', 'qualificado', 'negociacao', 'cliente', 'inativo')),
  lead_source TEXT,
  priority TEXT DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baixa')),
  segment_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_contact_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  data_quality_score INTEGER,
  last_validated_at TIMESTAMPTZ,
  validation_errors TEXT[],
  data_completeness_percentage INTEGER
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  stage TEXT DEFAULT 'qualificacao' CHECK (stage IN ('qualificacao', 'proposta', 'negociacao', 'fechamento', 'ganho', 'perdido')),
  value DECIMAL(15,2),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  closed_at TIMESTAMPTZ,
  lost_reason TEXT
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Create deals table
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'ganho', 'perdido', 'cancelado')),
  stage TEXT DEFAULT 'negociacao' CHECK (stage IN ('negociacao', 'contrato', 'fechamento')),
  assigned_to UUID REFERENCES auth.users(id),
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  closed_at TIMESTAMPTZ,
  expected_revenue DECIMAL(15,2),
  actual_revenue DECIMAL(15,2)
);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  quote_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_cnpj TEXT,
  contact_person TEXT,
  subtotal DECIMAL(15,2) DEFAULT 0,
  discount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'rejeitado', 'expirado')),
  valid_until DATE,
  payment_terms TEXT,
  delivery_time TEXT,
  warranty TEXT,
  notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create quote_items table
CREATE TABLE public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
  product_code TEXT,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT 'un',
  unit_price DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  amount DECIMAL(15,2) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  due_date DATE,
  category TEXT NOT NULL,
  subcategory TEXT,
  channel TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado')),
  recurring BOOLEAN DEFAULT false,
  recurring_period TEXT,
  tags TEXT[],
  client_name TEXT,
  invoice_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create commissions table
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  percentage DECIMAL(5,2),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'pago')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Create commission_rules table
CREATE TABLE public.commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  min_value DECIMAL(15,2),
  max_value DECIMAL(15,2),
  product_category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;

-- Create pipeline_activities table
CREATE TABLE public.pipeline_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('nota', 'ligacao', 'reuniao', 'email', 'proposta', 'mudanca_fase')),
  description TEXT NOT NULL,
  previous_stage TEXT,
  new_stage TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pipeline_activities ENABLE ROW LEVEL SECURITY;

-- Create sales_goals table
CREATE TABLE public.sales_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salesperson UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT CHECK (period_type IN ('mensal', 'trimestral', 'anual')),
  goal_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.sales_goals ENABLE ROW LEVEL SECURITY;

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baixa')),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for customers
CREATE POLICY "Users can view customers" ON public.customers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert customers" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update customers" ON public.customers
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete customers" ON public.customers
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for opportunities
CREATE POLICY "Users can view opportunities" ON public.opportunities
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert opportunities" ON public.opportunities
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update opportunities" ON public.opportunities
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete opportunities" ON public.opportunities
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for deals
CREATE POLICY "Users can view deals" ON public.deals
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert deals" ON public.deals
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update deals" ON public.deals
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete deals" ON public.deals
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for quotes
CREATE POLICY "Users can view quotes" ON public.quotes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert quotes" ON public.quotes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update quotes" ON public.quotes
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete quotes" ON public.quotes
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for quote_items
CREATE POLICY "Users can view quote items" ON public.quote_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert quote items" ON public.quote_items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update quote items" ON public.quote_items
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete quote items" ON public.quote_items
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for transactions
CREATE POLICY "Users can view transactions" ON public.transactions
  FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

CREATE POLICY "Users can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can soft delete transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for commissions
CREATE POLICY "Users can view their commissions" ON public.commissions
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage commissions" ON public.commissions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for commission_rules
CREATE POLICY "Users can view their rules" ON public.commission_rules
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage rules" ON public.commission_rules
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pipeline_activities
CREATE POLICY "Users can view activities" ON public.pipeline_activities
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert activities" ON public.pipeline_activities
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for sales_goals
CREATE POLICY "Users can view their goals" ON public.sales_goals
  FOR SELECT USING (auth.uid() = salesperson OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage goals" ON public.sales_goals
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for tasks
CREATE POLICY "Users can view their tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = assigned_to OR auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = assigned_to OR auth.uid() = created_by);

CREATE POLICY "Users can delete their tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply update triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commission_rules_updated_at BEFORE UPDATE ON public.commission_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_goals_updated_at BEFORE UPDATE ON public.sales_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create opportunity when customer is created
CREATE OR REPLACE FUNCTION public.auto_create_opportunity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'qualificado' THEN
    INSERT INTO public.opportunities (customer_id, title, stage, owner_id)
    VALUES (NEW.id, 'Oportunidade - ' || NEW.name, 'qualificacao', NEW.created_by);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_create_opportunity
  AFTER INSERT ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_opportunity();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;