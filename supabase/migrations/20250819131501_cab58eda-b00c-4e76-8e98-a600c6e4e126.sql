-- Fix remaining function with search path issue
CREATE OR REPLACE FUNCTION public.calculate_product_margins()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.cost_price IS NOT NULL AND NEW.cost_price > 0 THEN
    NEW.margin_50 = NEW.cost_price / (1 - 0.50);
    NEW.margin_55 = NEW.cost_price / (1 - 0.55);
    NEW.margin_60 = NEW.cost_price / (1 - 0.60);
    NEW.margin_65 = NEW.cost_price / (1 - 0.65);
    NEW.margin_70 = NEW.cost_price / (1 - 0.70);
    NEW.margin_75 = NEW.cost_price / (1 - 0.75);
  END IF;
  RETURN NEW;
END;
$function$;

-- Create missing tables that might not exist but have RLS enabled
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info',
    action_url text,
    metadata jsonb DEFAULT '{}',
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notifications 
FOR INSERT WITH CHECK (true);

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    roles text[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles 
FOR ALL USING (is_admin())
WITH CHECK (is_admin());