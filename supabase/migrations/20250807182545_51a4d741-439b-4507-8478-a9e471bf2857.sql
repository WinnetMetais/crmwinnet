-- Fix RLS performance issues by optimizing auth function calls
-- Replace auth.uid() with (select auth.uid()) to prevent re-evaluation per row

-- Drop existing problematic policies and recreate optimized versions

-- PROFILES TABLE
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate optimized profiles policies
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = (select auth.uid()) 
    AND p.role = ANY(ARRAY['admin'::text, 'superadmin'::text])
  )
);

CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can manage own profile" ON public.profiles
FOR ALL USING (user_id = (select auth.uid()));

-- CUSTOMERS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON public.customers;

-- Single optimized policy for customers
CREATE POLICY "Authenticated users can manage customers" ON public.customers
FOR ALL USING ((select auth.uid()) IS NOT NULL);

-- OPPORTUNITIES TABLE
DROP POLICY IF EXISTS "Authenticated users can manage opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Authenticated users can view opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Authenticated users can insert opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Authenticated users can update opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Authenticated users can delete opportunities" ON public.opportunities;

-- Single optimized policy for opportunities
CREATE POLICY "Authenticated users can manage opportunities" ON public.opportunities
FOR ALL USING ((select auth.uid()) IS NOT NULL);

-- TASKS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage tasks" ON public.tasks;

-- Optimized tasks policy
CREATE POLICY "Authenticated users can manage tasks" ON public.tasks
FOR ALL USING ((select auth.uid()) IS NOT NULL);

-- NOTIFICATIONS TABLE
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- Optimized notifications policies
CREATE POLICY "Users can manage own notifications" ON public.notifications
FOR ALL USING (user_id = (select auth.uid()));

-- TRANSACTIONS TABLE
DROP POLICY IF EXISTS "Users can manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view transactions" ON public.transactions;

-- Single optimized policy for transactions
CREATE POLICY "Users can manage transactions" ON public.transactions
FOR ALL USING (user_id = (select auth.uid()));

-- CUSTOMER_TYPES TABLE - Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view customer_types" ON public.customer_types;
DROP POLICY IF EXISTS "Public read customer_types" ON public.customer_types;
DROP POLICY IF EXISTS "Everyone can view customer_types" ON public.customer_types;
DROP POLICY IF EXISTS "Authenticated users can manage customer_types" ON public.customer_types;

-- Single optimized policy for customer_types
CREATE POLICY "Authenticated users can manage customer_types" ON public.customer_types
FOR ALL USING ((select auth.uid()) IS NOT NULL);

-- CUSTOMER_SEGMENTS TABLE - Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view customer_segments" ON public.customer_segments;
DROP POLICY IF EXISTS "Public read customer_segments" ON public.customer_segments;

-- Single policy for customer_segments
CREATE POLICY "Everyone can view customer_segments" ON public.customer_segments
FOR SELECT USING (true);

-- SUPPLIERS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can update suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Admins can delete suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;

-- Optimized suppliers policies
CREATE POLICY "Authenticated users can manage suppliers" ON public.suppliers
FOR ALL USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete suppliers" ON public.suppliers
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = (select auth.uid()) 
    AND p.role = 'admin'
  )
);

-- CARRIERS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage carriers" ON public.carriers;
DROP POLICY IF EXISTS "Authenticated users can update carriers" ON public.carriers;
DROP POLICY IF EXISTS "Admins can delete carriers" ON public.carriers;
DROP POLICY IF EXISTS "Authenticated users can view carriers" ON public.carriers;

-- Optimized carriers policies
CREATE POLICY "Authenticated users can manage carriers" ON public.carriers
FOR ALL USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete carriers" ON public.carriers
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = (select auth.uid()) 
    AND p.role = 'admin'
  )
);

-- WHATSAPP_MESSAGES TABLE
DROP POLICY IF EXISTS "Users can view their WhatsApp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can insert their WhatsApp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can update their WhatsApp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can delete their WhatsApp messages" ON public.whatsapp_messages;

-- Optimized whatsapp_messages policy
CREATE POLICY "Users can manage own whatsapp messages" ON public.whatsapp_messages
FOR ALL USING (user_id = (select auth.uid()));

-- UNITS TABLE
DROP POLICY IF EXISTS "Admins can manage units" ON public.units;
DROP POLICY IF EXISTS "Authenticated users can view units" ON public.units;

-- Optimized units policies
CREATE POLICY "Everyone can view units" ON public.units
FOR SELECT USING (true);

CREATE POLICY "Admins can manage units" ON public.units
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = (select auth.uid()) 
    AND p.role = 'admin'
  )
);

-- PRODUCT_CATEGORIES TABLE
DROP POLICY IF EXISTS "Admins can manage product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Authenticated users can view product categories" ON public.product_categories;

-- Optimized product_categories policies
CREATE POLICY "Everyone can view product categories" ON public.product_categories
FOR SELECT USING (true);

CREATE POLICY "Admins can manage product categories" ON public.product_categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = (select auth.uid()) 
    AND p.role = 'admin'
  )
);