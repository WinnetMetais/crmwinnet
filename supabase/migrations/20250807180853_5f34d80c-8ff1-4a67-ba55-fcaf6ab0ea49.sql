-- Fix user management - Add missing role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Add status column for user activation/deactivation
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Update RLS policies for profiles to allow admins to manage users
DROP POLICY IF EXISTS "Users can manage profiles select" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage profiles update" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage profiles insert" ON public.profiles;

-- Allow admins to manage all profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (user_id = auth.uid());

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (user_id = auth.uid());

-- Create customer_types table if not exists
CREATE TABLE IF NOT EXISTS public.customer_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on customer_types
ALTER TABLE public.customer_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view customer_types" ON public.customer_types FOR SELECT USING (true);

-- Insert default customer types
INSERT INTO public.customer_types (name, description) VALUES
('Pessoa Física', 'Cliente pessoa física'),
('Pessoa Jurídica', 'Cliente pessoa jurídica'),
('Distribuidor', 'Cliente distribuidor'),
('Revendedor', 'Cliente revendedor'),
('Fabricante', 'Cliente fabricante')
ON CONFLICT DO NOTHING;

-- Fix customers table structure
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS customer_type_id uuid REFERENCES public.customer_types(id);
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS lead_source_id uuid REFERENCES public.lead_sources(id);
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS segment_id uuid REFERENCES public.customer_segments(id);
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS priority_id uuid REFERENCES public.priorities(id);

-- Update customers RLS policies to allow full CRUD operations
DROP POLICY IF EXISTS "Users can manage customers" ON public.customers;

CREATE POLICY "Authenticated users can manage customers" ON public.customers
FOR ALL USING (auth.uid() IS NOT NULL);

-- Fix opportunities table structure
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS priority_id uuid REFERENCES public.priorities(id);
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS qualification_status_id uuid REFERENCES public.qualification_status(id);
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.profiles(user_id);

-- Update opportunities RLS policies
DROP POLICY IF EXISTS "Users can create opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can view all opportunities" ON public.opportunities;

CREATE POLICY "Authenticated users can manage opportunities" ON public.opportunities
FOR ALL USING (auth.uid() IS NOT NULL);

-- Fix tasks RLS policies to allow full CRUD operations
DROP POLICY IF EXISTS "Users can manage tasks" ON public.tasks;

CREATE POLICY "Authenticated users can manage tasks" ON public.tasks
FOR ALL USING (auth.uid() IS NOT NULL);

-- Add notifications table for push notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info', -- info, success, warning, error
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  action_url text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Enable real-time for all relevant tables
ALTER TABLE public.customers REPLICA IDENTITY FULL;
ALTER TABLE public.opportunities REPLICA IDENTITY FULL;
ALTER TABLE public.deals REPLICA IDENTITY FULL;
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.quotes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, display_name, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'user',
    'active'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to send notifications
CREATE OR REPLACE FUNCTION public.send_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'info',
  p_action_url text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers where missing
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_deals_updated_at ON public.deals;
CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON public.deals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();