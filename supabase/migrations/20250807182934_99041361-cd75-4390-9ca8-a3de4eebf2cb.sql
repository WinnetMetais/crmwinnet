-- Fix all Performance Advisor issues with simple, optimized RLS policies
-- Remove existing policies and create single policies per table

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_comprehensive_access" ON public.profiles;

DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;
DROP POLICY IF EXISTS "customers_authenticated_access" ON public.customers;

DROP POLICY IF EXISTS "Authenticated users can manage opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_authenticated_access" ON public.opportunities;

DROP POLICY IF EXISTS "Authenticated users can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "tasks_authenticated_access" ON public.tasks;

DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications_user_access" ON public.notifications;

DROP POLICY IF EXISTS "Users can manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "transactions_user_access" ON public.transactions;

DROP POLICY IF EXISTS "Authenticated users can manage customer_types" ON public.customer_types;
DROP POLICY IF EXISTS "customer_types_authenticated_access" ON public.customer_types;

DROP POLICY IF EXISTS "Everyone can view customer_segments" ON public.customer_segments;
DROP POLICY IF EXISTS "customer_segments_read_access" ON public.customer_segments;

DROP POLICY IF EXISTS "Authenticated users can manage suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Admins can delete suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_authenticated_access" ON public.suppliers;

DROP POLICY IF EXISTS "Authenticated users can manage carriers" ON public.carriers;
DROP POLICY IF EXISTS "Admins can delete carriers" ON public.carriers;
DROP POLICY IF EXISTS "carriers_authenticated_access" ON public.carriers;

DROP POLICY IF EXISTS "Users can manage own whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "whatsapp_messages_user_access" ON public.whatsapp_messages;

DROP POLICY IF EXISTS "Everyone can view units" ON public.units;
DROP POLICY IF EXISTS "Admins can manage units" ON public.units;
DROP POLICY IF EXISTS "units_access" ON public.units;

DROP POLICY IF EXISTS "Everyone can view product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Admins can manage product categories" ON public.product_categories;
DROP POLICY IF EXISTS "product_categories_access" ON public.product_categories;

-- Create single optimized policies per table using (select auth.uid())

-- PROFILES - Allow admin access or own profile access
CREATE POLICY "profiles_access" ON public.profiles FOR ALL 
USING (
  (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = ANY(ARRAY['admin'::text, 'superadmin'::text]))) 
  OR user_id = (select auth.uid())
);

-- CUSTOMERS - Simple authenticated access
CREATE POLICY "customers_access" ON public.customers FOR ALL 
USING ((select auth.uid()) IS NOT NULL);

-- OPPORTUNITIES - Simple authenticated access
CREATE POLICY "opportunities_access" ON public.opportunities FOR ALL 
USING ((select auth.uid()) IS NOT NULL);

-- TASKS - Simple authenticated access
CREATE POLICY "tasks_access" ON public.tasks FOR ALL 
USING ((select auth.uid()) IS NOT NULL);

-- NOTIFICATIONS - User's own notifications only
CREATE POLICY "notifications_access" ON public.notifications FOR ALL 
USING (user_id = (select auth.uid()));

-- TRANSACTIONS - User's own transactions only
CREATE POLICY "transactions_access" ON public.transactions FOR ALL 
USING (user_id = (select auth.uid()));

-- CUSTOMER_TYPES - Simple authenticated access
CREATE POLICY "customer_types_access" ON public.customer_types FOR ALL 
USING ((select auth.uid()) IS NOT NULL);

-- CUSTOMER_SEGMENTS - Read access for everyone
CREATE POLICY "customer_segments_access" ON public.customer_segments FOR SELECT 
USING (true);

-- SUPPLIERS - Separate policies for read and admin delete
CREATE POLICY "suppliers_read_write" ON public.suppliers FOR SELECT, INSERT, UPDATE 
USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "suppliers_admin_delete" ON public.suppliers FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

-- CARRIERS - Separate policies for read and admin delete  
CREATE POLICY "carriers_read_write" ON public.carriers FOR SELECT, INSERT, UPDATE 
USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "carriers_admin_delete" ON public.carriers FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

-- WHATSAPP_MESSAGES - User's own messages only
CREATE POLICY "whatsapp_messages_access" ON public.whatsapp_messages FOR ALL 
USING (user_id = (select auth.uid()));

-- UNITS - Separate policies for read and admin management
CREATE POLICY "units_read" ON public.units FOR SELECT 
USING (true);

CREATE POLICY "units_admin_manage" ON public.units FOR INSERT, UPDATE, DELETE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

-- PRODUCT_CATEGORIES - Separate policies for read and admin management
CREATE POLICY "product_categories_read" ON public.product_categories FOR SELECT 
USING (true);

CREATE POLICY "product_categories_admin_manage" ON public.product_categories FOR INSERT, UPDATE, DELETE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

-- Fix function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;