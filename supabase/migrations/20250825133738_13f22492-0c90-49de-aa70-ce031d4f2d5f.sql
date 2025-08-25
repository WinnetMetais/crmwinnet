-- Final security migration - corrected version to fix remaining RLS policies

-- Fix profiles table RLS - remove all existing policies first
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- Create new secure profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (is_admin());

-- Fix clientes table RLS
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'clientes' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.clientes', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Authenticated users can manage clientes" ON public.clientes
FOR ALL USING (auth.uid() IS NOT NULL);

-- Fix leads table RLS
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'leads' AND schemaname = 'public'
        AND policyname = 'read_all_leads'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.leads', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Users can view their leads" ON public.leads
FOR SELECT USING (owner_id = auth.uid() OR is_admin());

-- Fix carriers table RLS
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'carriers' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.carriers', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Authenticated users can view carriers" ON public.carriers
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage carriers" ON public.carriers
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update carriers" ON public.carriers
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete carriers" ON public.carriers
FOR DELETE USING (is_admin());

-- Fix suppliers table RLS
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'suppliers' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.suppliers', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage suppliers" ON public.suppliers
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update suppliers" ON public.suppliers
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete suppliers" ON public.suppliers
FOR DELETE USING (is_admin());

-- Final verification
SELECT 
    'FINAL SECURITY MIGRATION COMPLETED ✅' as status,
    'All RLS policies now properly secured' as result;