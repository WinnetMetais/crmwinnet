-- Fix RLS policies for profiles table to secure user personal information
-- Drop existing policies that allow public access
DROP POLICY IF EXISTS "Allow authenticated users full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by users" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create secure RLS policies for profiles table
-- Users can only view their own profile data
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only update their own profile data
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only insert their own profile data
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Only allow profile deletion by the user themselves (optional safety)
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admin access for all operations (if is_admin function exists)
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());