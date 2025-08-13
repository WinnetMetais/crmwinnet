-- Fix security issues by implementing proper RLS policies

-- 1. Fix profiles table RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated users full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;

-- Create secure policies for profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

-- Users can insert their own profile (for new user creation)
CREATE POLICY "Users can create own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- System can create profiles (for user registration)
CREATE POLICY "System can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (is_admin());

-- 2. Fix customers table RLS (override previous migration)
DROP POLICY IF EXISTS "Allow authenticated users full access to customers" ON public.customers;

-- Customers: Authenticated users can view all (for business operations)
CREATE POLICY "Authenticated users can view customers" 
ON public.customers 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Customers: Users manage their own data
CREATE POLICY "Users can manage own customers" 
ON public.customers 
FOR ALL 
USING (created_by::uuid = auth.uid() OR is_admin())
WITH CHECK (created_by::uuid = auth.uid() OR is_admin());

-- 3. Fix financial_reports table RLS
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view financial_reports" ON public.financial_reports;

-- Only admins and finance team can view financial reports
CREATE POLICY "Authorized users can view financial reports" 
ON public.financial_reports 
FOR SELECT 
USING (is_admin() OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.user_id = auth.uid() 
  AND (p.department = 'Finance' OR p.role = 'admin' OR p.role = 'finance_manager')
));

-- Only admins can insert/update/delete financial reports
CREATE POLICY "Admins can manage financial reports" 
ON public.financial_reports 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- 4. Fix integration_logs table RLS
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view integration_logs" ON public.integration_logs;
DROP POLICY IF EXISTS "Users can create integration_logs" ON public.integration_logs;

-- Only admins can view integration logs
CREATE POLICY "Admins can view integration logs" 
ON public.integration_logs 
FOR SELECT 
USING (is_admin());

-- System can create integration logs
CREATE POLICY "System can create integration logs" 
ON public.integration_logs 
FOR INSERT 
WITH CHECK (true);

-- Only admins can update/delete integration logs
CREATE POLICY "Admins can manage integration logs" 
ON public.integration_logs 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete integration logs" 
ON public.integration_logs 
FOR DELETE 
USING (is_admin());

-- 5. Create sales_performance table policies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='sales_performance') THEN
    EXECUTE 'ALTER TABLE public.sales_performance ENABLE ROW LEVEL SECURITY';
    
    -- Only sales managers and admins can view sales performance
    EXECUTE 'CREATE POLICY "Sales managers can view performance" ON public.sales_performance FOR SELECT USING (is_admin() OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND (p.role = ''admin'' OR p.role = ''sales_manager'' OR p.department = ''Sales'')))';
    
    -- Only admins can manage sales performance data
    EXECUTE 'CREATE POLICY "Admins can manage sales performance" ON public.sales_performance FOR ALL USING (is_admin()) WITH CHECK (is_admin())';
  END IF;
END $$;

-- 6. Create suppliers table policies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='suppliers') THEN
    EXECUTE 'ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY';
    
    -- Authenticated users can view suppliers (for business operations)
    EXECUTE 'CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers FOR SELECT USING (auth.uid() IS NOT NULL)';
    
    -- Users can manage suppliers they created or admins can manage all
    EXECUTE 'CREATE POLICY "Users can manage own suppliers" ON public.suppliers FOR ALL USING (created_by = auth.uid() OR is_admin()) WITH CHECK (created_by = auth.uid() OR is_admin())';
  END IF;
END $$;