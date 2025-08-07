-- Fix remaining Supabase Performance Advisor issues
-- 1. Remove all existing problematic RLS policies completely
-- 2. Create single optimized policies per table
-- 3. Fix function search_path issues

-- Drop ALL existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;

DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;

DROP POLICY IF EXISTS "Authenticated users can manage opportunities" ON public.opportunities;

DROP POLICY IF EXISTS "Authenticated users can manage tasks" ON public.tasks;

DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can manage transactions" ON public.transactions;

DROP POLICY IF EXISTS "Authenticated users can manage customer_types" ON public.customer_types;

DROP POLICY IF EXISTS "Everyone can view customer_segments" ON public.customer_segments;

DROP POLICY IF EXISTS "Authenticated users can manage suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Admins can delete suppliers" ON public.suppliers;

DROP POLICY IF EXISTS "Authenticated users can manage carriers" ON public.carriers;
DROP POLICY IF EXISTS "Admins can delete carriers" ON public.carriers;

DROP POLICY IF EXISTS "Users can manage own whatsapp messages" ON public.whatsapp_messages;

DROP POLICY IF EXISTS "Everyone can view units" ON public.units;
DROP POLICY IF EXISTS "Admins can manage units" ON public.units;

DROP POLICY IF EXISTS "Everyone can view product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Admins can manage product categories" ON public.product_categories;

-- Now create SINGLE optimized policies for each table

-- PROFILES - Single comprehensive policy
CREATE POLICY "profiles_comprehensive_access" ON public.profiles FOR ALL 
USING (
  CASE 
    WHEN (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (SELECT auth.uid()) AND p.role = ANY(ARRAY['admin'::text, 'superadmin'::text]))) THEN true
    ELSE user_id = (SELECT auth.uid())
  END
);

-- CUSTOMERS - Single policy for authenticated users
CREATE POLICY "customers_authenticated_access" ON public.customers FOR ALL 
USING ((SELECT auth.uid()) IS NOT NULL);

-- OPPORTUNITIES - Single policy for authenticated users  
CREATE POLICY "opportunities_authenticated_access" ON public.opportunities FOR ALL 
USING ((SELECT auth.uid()) IS NOT NULL);

-- TASKS - Single policy for authenticated users
CREATE POLICY "tasks_authenticated_access" ON public.tasks FOR ALL 
USING ((SELECT auth.uid()) IS NOT NULL);

-- NOTIFICATIONS - Single policy for user's own notifications
CREATE POLICY "notifications_user_access" ON public.notifications FOR ALL 
USING (user_id = (SELECT auth.uid()));

-- TRANSACTIONS - Single policy for user's own transactions
CREATE POLICY "transactions_user_access" ON public.transactions FOR ALL 
USING (user_id = (SELECT auth.uid()));

-- CUSTOMER_TYPES - Single policy for authenticated users
CREATE POLICY "customer_types_authenticated_access" ON public.customer_types FOR ALL 
USING ((SELECT auth.uid()) IS NOT NULL);

-- CUSTOMER_SEGMENTS - Single read-only policy
CREATE POLICY "customer_segments_read_access" ON public.customer_segments FOR SELECT 
USING (true);

-- SUPPLIERS - Single policy with admin delete
CREATE POLICY "suppliers_authenticated_access" ON public.suppliers 
FOR ALL USING (
  CASE 
    WHEN TG_OP = 'DELETE' THEN (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (SELECT auth.uid()) AND p.role = 'admin'))
    ELSE (SELECT auth.uid()) IS NOT NULL
  END
);

-- CARRIERS - Single policy with admin delete
CREATE POLICY "carriers_authenticated_access" ON public.carriers 
FOR ALL USING (
  CASE 
    WHEN TG_OP = 'DELETE' THEN (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (SELECT auth.uid()) AND p.role = 'admin'))
    ELSE (SELECT auth.uid()) IS NOT NULL
  END
);

-- WHATSAPP_MESSAGES - Single policy for user's own messages
CREATE POLICY "whatsapp_messages_user_access" ON public.whatsapp_messages FOR ALL 
USING (user_id = (SELECT auth.uid()));

-- UNITS - Single policy with admin management
CREATE POLICY "units_access" ON public.units FOR ALL 
USING (
  CASE 
    WHEN TG_OP IN ('INSERT', 'UPDATE', 'DELETE') THEN (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (SELECT auth.uid()) AND p.role = 'admin'))
    ELSE true
  END
);

-- PRODUCT_CATEGORIES - Single policy with admin management
CREATE POLICY "product_categories_access" ON public.product_categories FOR ALL 
USING (
  CASE 
    WHEN TG_OP IN ('INSERT', 'UPDATE', 'DELETE') THEN (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (SELECT auth.uid()) AND p.role = 'admin'))
    ELSE true
  END
);

-- Fix the search_path issue for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Fixed search_path
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;