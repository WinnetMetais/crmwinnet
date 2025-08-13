-- Fix remaining security issues from security scan

-- 1. Fix profiles table (still showing as publicly readable)
-- Ensure RLS is enabled and policies are properly restrictive
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any overly permissive policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 2. Fix publicly readable business structure tables
-- These tables should only be accessible to authenticated users

-- Customer segments
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "customer_segments_select" ON public.customer_segments;
CREATE POLICY "Authenticated users can view customer segments" 
ON public.customer_segments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Customer types
DROP POLICY IF EXISTS "customer_types_select" ON public.customer_types;
CREATE POLICY "Authenticated users can view customer types" 
ON public.customer_types 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Lead sources
DROP POLICY IF EXISTS "lead_sources_select" ON public.lead_sources;
CREATE POLICY "Authenticated users can view lead sources" 
ON public.lead_sources 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Departments
DROP POLICY IF EXISTS "Everyone can view departments" ON public.departments;
CREATE POLICY "Authenticated users can view departments" 
ON public.departments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. Fix index usage snapshots (database performance data)
DROP POLICY IF EXISTS "allow_all_index_usage_snapshots" ON public.index_usage_snapshots;
CREATE POLICY "Admins can view index usage snapshots" 
ON public.index_usage_snapshots 
FOR SELECT 
USING (is_admin());

CREATE POLICY "System can insert index usage snapshots" 
ON public.index_usage_snapshots 
FOR INSERT 
WITH CHECK (true);

-- 4. Create policies for system configuration tables if they exist
DO $$
BEGIN
  -- System settings table
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='system_settings') THEN
    EXECUTE 'ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY';
    EXECUTE 'CREATE POLICY "Admins can manage system settings" ON public.system_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin())';
  END IF;

  -- System config table
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='system_config') THEN
    EXECUTE 'ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY';
    EXECUTE 'CREATE POLICY "Admins can manage system config" ON public.system_config FOR ALL USING (is_admin()) WITH CHECK (is_admin())';
  END IF;

  -- Pipeline stages
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='pipeline_stages') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view pipeline stages" ON public.pipeline_stages FOR SELECT USING (auth.uid() IS NOT NULL)';
  END IF;

  -- Payment methods
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='payment_methods') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view payment methods" ON public.payment_methods FOR SELECT USING (auth.uid() IS NOT NULL)';
  END IF;

  -- Payment terms
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='payment_terms') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view payment terms" ON public.payment_terms FOR SELECT USING (auth.uid() IS NOT NULL)';
  END IF;

  -- Priorities
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='priorities') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view priorities" ON public.priorities FOR SELECT USING (auth.uid() IS NOT NULL)';
  END IF;

  -- Qualification status
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='qualification_status') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view qualification status" ON public.qualification_status FOR SELECT USING (auth.uid() IS NOT NULL)';
  END IF;
END $$;