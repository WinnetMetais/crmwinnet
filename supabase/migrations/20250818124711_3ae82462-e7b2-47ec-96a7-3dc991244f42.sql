-- Fix 1: Add proper RLS policies for publicly exposed tables

-- Fix profiles table security
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Fix customers table security 
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
CREATE POLICY "Authenticated users can view customers" ON public.customers 
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert customers" ON public.customers 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update customers" ON public.customers 
FOR UPDATE USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete customers" ON public.customers 
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix quotes table security
DROP POLICY IF EXISTS "Users can manage quotes" ON public.quotes;
CREATE POLICY "Users can view own quotes" ON public.quotes 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own quotes" ON public.quotes 
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own quotes" ON public.quotes 
FOR UPDATE USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own quotes" ON public.quotes 
FOR DELETE USING (user_id = auth.uid());

-- Fix whatsapp_messages table security
DROP POLICY IF EXISTS "Users can view whatsapp_messages" ON public.whatsapp_messages;
CREATE POLICY "Users can view own messages" ON public.whatsapp_messages 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own messages" ON public.whatsapp_messages 
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own messages" ON public.whatsapp_messages 
FOR UPDATE USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own messages" ON public.whatsapp_messages 
FOR DELETE USING (user_id = auth.uid());

-- Fix carriers table security
DROP POLICY IF EXISTS "carriers_select" ON public.carriers;
CREATE POLICY "Authenticated users can view carriers" ON public.carriers 
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Fix suppliers table security  
DROP POLICY IF EXISTS "suppliers_select" ON public.suppliers;
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers 
FOR SELECT USING (auth.uid() IS NOT NULL);