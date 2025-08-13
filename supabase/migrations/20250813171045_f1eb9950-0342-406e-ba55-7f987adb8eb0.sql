-- Fix critical security issue: profiles table publicly readable
-- and other remaining security vulnerabilities

-- 1. CRITICAL FIX: Secure profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove any existing overly permissive policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view profiles" ON public.profiles;

-- Create secure RLS policies for profiles
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND (p.role = 'admin' OR p.role = 'superadmin')
  )
);

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
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND (p.role = 'admin' OR p.role = 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND (p.role = 'admin' OR p.role = 'superadmin')
  )
);

-- Users can create their own profile (for registration)
CREATE POLICY "Users can create own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- System can create profiles (for user registration triggers)
CREATE POLICY "System can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Only admins can delete profiles
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND (p.role = 'admin' OR p.role = 'superadmin')
  )
);

-- 2. Fix system_settings table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='system_settings') THEN
    -- Enable RLS
    EXECUTE 'ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY';
    
    -- Drop any overly permissive policies
    EXECUTE 'DROP POLICY IF EXISTS "system_settings_select" ON public.system_settings';
    EXECUTE 'DROP POLICY IF EXISTS "Everyone can view system_settings" ON public.system_settings';
    
    -- Only admins can access system settings
    EXECUTE 'CREATE POLICY "Admins can manage system settings" ON public.system_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin())';
  END IF;
END $$;

-- 3. Fix system_config table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='system_config') THEN
    -- Enable RLS
    EXECUTE 'ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY';
    
    -- Drop any overly permissive policies
    EXECUTE 'DROP POLICY IF EXISTS "system_config_select" ON public.system_config';
    EXECUTE 'DROP POLICY IF EXISTS "Everyone can view system_config" ON public.system_config';
    
    -- Only admins can access system config
    EXECUTE 'CREATE POLICY "Admins can manage system config" ON public.system_config FOR ALL USING (is_admin()) WITH CHECK (is_admin())';
  END IF;
END $$;

-- 4. Fix integration_logs table (already addressed but double-check)
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

-- Drop any overly permissive policies
DROP POLICY IF EXISTS "Users can view integration_logs" ON public.integration_logs;
DROP POLICY IF EXISTS "Everyone can view integration_logs" ON public.integration_logs;

-- Ensure only secure policies exist
DROP POLICY IF EXISTS "Admins can view integration logs" ON public.integration_logs;
DROP POLICY IF EXISTS "System can create integration logs" ON public.integration_logs;

-- Recreate secure policies
CREATE POLICY "Admins can view integration logs" 
ON public.integration_logs 
FOR SELECT 
USING (is_admin());

CREATE POLICY "System can create integration logs" 
ON public.integration_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage integration logs" 
ON public.integration_logs 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete integration logs" 
ON public.integration_logs 
FOR DELETE 
USING (is_admin());