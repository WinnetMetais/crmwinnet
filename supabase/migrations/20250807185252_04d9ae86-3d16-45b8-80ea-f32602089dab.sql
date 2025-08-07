-- Fix all RLS performance issues and duplicate policies

-- Drop duplicate and problematic policies
DROP POLICY IF EXISTS "Authenticated users can manage customer_types" ON public.customer_types;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can delete carriers" ON public.carriers;
DROP POLICY IF EXISTS "Authenticated users can manage carriers" ON public.carriers;
DROP POLICY IF EXISTS "Authenticated users can update carriers" ON public.carriers;
DROP POLICY IF EXISTS "carriers_delete" ON public.carriers;
DROP POLICY IF EXISTS "carriers_insert" ON public.carriers;
DROP POLICY IF EXISTS "carriers_select" ON public.carriers;
DROP POLICY IF EXISTS "carriers_update" ON public.carriers;
DROP POLICY IF EXISTS "Authenticated users can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can delete opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Authenticated users can insert opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Authenticated users can manage opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Authenticated users can update opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Authenticated users can view opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their WhatsApp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can insert their WhatsApp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can update their WhatsApp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can view their WhatsApp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Admins can delete suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can manage suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can update suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_delete" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_insert" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_select" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_update" ON public.suppliers;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage units" ON public.units;
DROP POLICY IF EXISTS "units_delete" ON public.units;
DROP POLICY IF EXISTS "units_insert" ON public.units;
DROP POLICY IF EXISTS "units_select" ON public.units;
DROP POLICY IF EXISTS "units_update" ON public.units;
DROP POLICY IF EXISTS "Admins can manage product categories" ON public.product_categories;
DROP POLICY IF EXISTS "product_categories_delete" ON public.product_categories;
DROP POLICY IF EXISTS "product_categories_insert" ON public.product_categories;
DROP POLICY IF EXISTS "Anyone can view customer_segments" ON public.customer_segments;
DROP POLICY IF EXISTS "Public read customer_segments" ON public.customer_segments;
DROP POLICY IF EXISTS "customer_segments_select" ON public.customer_segments;
DROP POLICY IF EXISTS "customer_types_all" ON public.customer_types;
DROP POLICY IF EXISTS "Anyone can view customer_types" ON public.customer_types;
DROP POLICY IF EXISTS "Everyone can view customer_types" ON public.customer_types;
DROP POLICY IF EXISTS "Public read customer_types" ON public.customer_types;

-- Create optimized RLS policies using (select auth.uid()) for better performance

-- Customer Types - Consolidated policies
CREATE POLICY "customer_types_select" ON public.customer_types
FOR SELECT USING (true);

CREATE POLICY "customer_types_manage" ON public.customer_types
FOR ALL USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Notifications - User-specific policies
CREATE POLICY "notifications_select" ON public.notifications
FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "notifications_insert" ON public.notifications
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "notifications_update" ON public.notifications
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "notifications_delete" ON public.notifications
FOR DELETE USING (user_id = (select auth.uid()));

-- Transactions - User-specific policies
CREATE POLICY "transactions_select" ON public.transactions
FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "transactions_insert" ON public.transactions
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "transactions_update" ON public.transactions
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "transactions_delete" ON public.transactions
FOR DELETE USING (user_id = (select auth.uid()));

-- Carriers - Consolidated policies
CREATE POLICY "carriers_select" ON public.carriers
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "carriers_insert" ON public.carriers
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "carriers_update" ON public.carriers
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "carriers_delete" ON public.carriers
FOR DELETE USING (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'
));

-- Tasks - Authenticated user policies
CREATE POLICY "tasks_select" ON public.tasks
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "tasks_insert" ON public.tasks
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "tasks_update" ON public.tasks
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "tasks_delete" ON public.tasks
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- Customers - Authenticated user policies
CREATE POLICY "customers_select" ON public.customers
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "customers_insert" ON public.customers
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "customers_update" ON public.customers
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "customers_delete" ON public.customers
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- Opportunities - Authenticated user policies
CREATE POLICY "opportunities_select" ON public.opportunities
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "opportunities_insert" ON public.opportunities
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "opportunities_update" ON public.opportunities
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "opportunities_delete" ON public.opportunities
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- WhatsApp Messages - User-specific policies
CREATE POLICY "whatsapp_messages_select" ON public.whatsapp_messages
FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "whatsapp_messages_insert" ON public.whatsapp_messages
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "whatsapp_messages_update" ON public.whatsapp_messages
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "whatsapp_messages_delete" ON public.whatsapp_messages
FOR DELETE USING (user_id = (select auth.uid()));

-- Suppliers - Consolidated policies
CREATE POLICY "suppliers_select" ON public.suppliers
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "suppliers_insert" ON public.suppliers
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "suppliers_update" ON public.suppliers
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "suppliers_delete" ON public.suppliers
FOR DELETE USING (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'
));

-- Profiles - User-specific policies (keep existing profile policies but optimize)
CREATE POLICY "profiles_insert" ON public.profiles
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "profiles_update" ON public.profiles
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT USING (user_id = (select auth.uid()));

-- Units - Admin-only policies
CREATE POLICY "units_select" ON public.units
FOR SELECT USING (true);

CREATE POLICY "units_manage" ON public.units
FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'
));

-- Product Categories - Admin-only policies
CREATE POLICY "product_categories_select" ON public.product_categories
FOR SELECT USING (true);

CREATE POLICY "product_categories_manage" ON public.product_categories
FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.user_id = (select auth.uid()) AND p.role = 'admin'
));

-- Customer Segments - Single policy for public read
CREATE POLICY "customer_segments_select" ON public.customer_segments
FOR SELECT USING (true);