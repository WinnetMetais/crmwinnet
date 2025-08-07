-- Fix Performance Advisor issues with correct RLS policy syntax
-- Create separate policies for each operation type

-- Drop existing policies completely
DROP POLICY IF EXISTS "profiles_access" ON public.profiles;
DROP POLICY IF EXISTS "customers_access" ON public.customers;
DROP POLICY IF EXISTS "opportunities_access" ON public.opportunities;
DROP POLICY IF EXISTS "tasks_access" ON public.tasks;
DROP POLICY IF EXISTS "notifications_access" ON public.notifications;
DROP POLICY IF EXISTS "transactions_access" ON public.transactions;
DROP POLICY IF EXISTS "customer_types_access" ON public.customer_types;
DROP POLICY IF EXISTS "customer_segments_access" ON public.customer_segments;
DROP POLICY IF EXISTS "suppliers_read_write" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_admin_delete" ON public.suppliers;
DROP POLICY IF EXISTS "carriers_read_write" ON public.carriers;
DROP POLICY IF EXISTS "carriers_admin_delete" ON public.carriers;
DROP POLICY IF EXISTS "whatsapp_messages_access" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "units_read" ON public.units;
DROP POLICY IF EXISTS "units_admin_manage" ON public.units;
DROP POLICY IF EXISTS "product_categories_read" ON public.product_categories;
DROP POLICY IF EXISTS "product_categories_admin_manage" ON public.product_categories;

-- PROFILES - Optimized single policy
CREATE POLICY "profiles_all" ON public.profiles FOR ALL 
USING (
  (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = ANY(ARRAY['admin'::text, 'superadmin'::text]))) 
  OR user_id = (select auth.uid())
);

-- CUSTOMERS - Single policy for all operations
CREATE POLICY "customers_all" ON public.customers FOR ALL 
USING ((select auth.uid()) IS NOT NULL);

-- OPPORTUNITIES - Single policy for all operations
CREATE POLICY "opportunities_all" ON public.opportunities FOR ALL 
USING ((select auth.uid()) IS NOT NULL);

-- TASKS - Single policy for all operations
CREATE POLICY "tasks_all" ON public.tasks FOR ALL 
USING ((select auth.uid()) IS NOT NULL);

-- NOTIFICATIONS - User's own notifications
CREATE POLICY "notifications_all" ON public.notifications FOR ALL 
USING (user_id = (select auth.uid()));

-- TRANSACTIONS - User's own transactions
CREATE POLICY "transactions_all" ON public.transactions FOR ALL 
USING (user_id = (select auth.uid()));

-- CUSTOMER_TYPES - Authenticated access
CREATE POLICY "customer_types_all" ON public.customer_types FOR ALL 
USING ((select auth.uid()) IS NOT NULL);

-- CUSTOMER_SEGMENTS - Read access only
CREATE POLICY "customer_segments_select" ON public.customer_segments FOR SELECT 
USING (true);

-- SUPPLIERS - Regular operations for authenticated users
CREATE POLICY "suppliers_select" ON public.suppliers FOR SELECT 
USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "suppliers_insert" ON public.suppliers FOR INSERT 
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "suppliers_update" ON public.suppliers FOR UPDATE 
USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "suppliers_delete" ON public.suppliers FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

-- CARRIERS - Regular operations for authenticated users
CREATE POLICY "carriers_select" ON public.carriers FOR SELECT 
USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "carriers_insert" ON public.carriers FOR INSERT 
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "carriers_update" ON public.carriers FOR UPDATE 
USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "carriers_delete" ON public.carriers FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

-- WHATSAPP_MESSAGES - User's own messages
CREATE POLICY "whatsapp_messages_all" ON public.whatsapp_messages FOR ALL 
USING (user_id = (select auth.uid()));

-- UNITS - Read for all, admin for modifications
CREATE POLICY "units_select" ON public.units FOR SELECT 
USING (true);

CREATE POLICY "units_insert" ON public.units FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

CREATE POLICY "units_update" ON public.units FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

CREATE POLICY "units_delete" ON public.units FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

-- PRODUCT_CATEGORIES - Read for all, admin for modifications
CREATE POLICY "product_categories_select" ON public.product_categories FOR SELECT 
USING (true);

CREATE POLICY "product_categories_insert" ON public.product_categories FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

CREATE POLICY "product_categories_update" ON public.product_categories FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));

CREATE POLICY "product_categories_delete" ON public.product_categories FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'));