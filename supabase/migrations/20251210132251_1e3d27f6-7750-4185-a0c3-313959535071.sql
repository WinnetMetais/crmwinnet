-- Fix RLS performance warnings by using (select auth.uid()) instead of auth.uid()
-- This prevents re-evaluation for each row

-- ============================================
-- USER_ROLES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can insert roles" ON public.user_roles
FOR INSERT WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can delete customers" ON public.customers;

CREATE POLICY "Users can view customers" ON public.customers
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert customers" ON public.customers
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update customers" ON public.customers
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete customers" ON public.customers
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- OPPORTUNITIES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can insert opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Admins can delete opportunities" ON public.opportunities;

CREATE POLICY "Users can view opportunities" ON public.opportunities
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert opportunities" ON public.opportunities
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update opportunities" ON public.opportunities
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete opportunities" ON public.opportunities
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- DEALS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view deals" ON public.deals;
DROP POLICY IF EXISTS "Users can insert deals" ON public.deals;
DROP POLICY IF EXISTS "Users can update deals" ON public.deals;
DROP POLICY IF EXISTS "Admins can delete deals" ON public.deals;

CREATE POLICY "Users can view deals" ON public.deals
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert deals" ON public.deals
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update deals" ON public.deals
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete deals" ON public.deals
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- QUOTES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can insert quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can update quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can delete quotes" ON public.quotes;

CREATE POLICY "Users can view quotes" ON public.quotes
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert quotes" ON public.quotes
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update quotes" ON public.quotes
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete quotes" ON public.quotes
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- QUOTE_ITEMS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view quote items" ON public.quote_items;
DROP POLICY IF EXISTS "Users can insert quote items" ON public.quote_items;
DROP POLICY IF EXISTS "Users can update quote items" ON public.quote_items;
DROP POLICY IF EXISTS "Users can delete quote items" ON public.quote_items;

CREATE POLICY "Users can view quote items" ON public.quote_items
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert quote items" ON public.quote_items
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update quote items" ON public.quote_items
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can delete quote items" ON public.quote_items
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can soft delete transactions" ON public.transactions;

CREATE POLICY "Users can view transactions" ON public.transactions
FOR SELECT USING (((select auth.uid()) IS NOT NULL) AND (deleted_at IS NULL));

CREATE POLICY "Users can insert transactions" ON public.transactions
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update transactions" ON public.transactions
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can soft delete transactions" ON public.transactions
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

-- ============================================
-- COMMISSIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their commissions" ON public.commissions;
DROP POLICY IF EXISTS "Admins can manage commissions" ON public.commissions;

CREATE POLICY "Users can view their commissions" ON public.commissions
FOR SELECT USING (((select auth.uid()) = user_id) OR has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can manage commissions" ON public.commissions
FOR ALL USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- COMMISSION_RULES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Admins can manage rules" ON public.commission_rules;

CREATE POLICY "Users can view their rules" ON public.commission_rules
FOR SELECT USING (((select auth.uid()) = user_id) OR has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can manage rules" ON public.commission_rules
FOR ALL USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- PIPELINE_ACTIVITIES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view activities" ON public.pipeline_activities;
DROP POLICY IF EXISTS "Users can insert activities" ON public.pipeline_activities;

CREATE POLICY "Users can view activities" ON public.pipeline_activities
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert activities" ON public.pipeline_activities
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

-- ============================================
-- SALES_GOALS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their goals" ON public.sales_goals;
DROP POLICY IF EXISTS "Admins can manage goals" ON public.sales_goals;

CREATE POLICY "Users can view their goals" ON public.sales_goals
FOR SELECT USING (((select auth.uid()) = salesperson) OR has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can manage goals" ON public.sales_goals
FOR ALL USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- TASKS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their tasks" ON public.tasks;

CREATE POLICY "Users can view their tasks" ON public.tasks
FOR SELECT USING (((select auth.uid()) = assigned_to) OR ((select auth.uid()) = created_by) OR has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "Users can insert tasks" ON public.tasks
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update their tasks" ON public.tasks
FOR UPDATE USING (((select auth.uid()) = assigned_to) OR ((select auth.uid()) = created_by));

CREATE POLICY "Users can delete their tasks" ON public.tasks
FOR DELETE USING (((select auth.uid()) = created_by) OR has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- CUSTOMER_SEGMENTS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view segments" ON public.customer_segments;
DROP POLICY IF EXISTS "Users can insert segments" ON public.customer_segments;
DROP POLICY IF EXISTS "Users can update segments" ON public.customer_segments;
DROP POLICY IF EXISTS "Admins can delete segments" ON public.customer_segments;

CREATE POLICY "Users can view segments" ON public.customer_segments
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert segments" ON public.customer_segments
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update segments" ON public.customer_segments
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete segments" ON public.customer_segments
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- PIPELINE_STAGES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view stages" ON public.pipeline_stages;
DROP POLICY IF EXISTS "Admins can manage stages" ON public.pipeline_stages;

CREATE POLICY "Users can view stages" ON public.pipeline_stages
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can manage stages" ON public.pipeline_stages
FOR ALL USING (has_role((select auth.uid()), 'admin'::app_role));

-- ============================================
-- OTHER TABLES (also need optimization)
-- ============================================

-- PROFILES
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can insert profiles" ON public.profiles
FOR INSERT WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- DEPARTMENTS
DROP POLICY IF EXISTS "Users can view departments" ON public.departments;
DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;

CREATE POLICY "Users can view departments" ON public.departments
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can manage departments" ON public.departments
FOR ALL USING (has_role((select auth.uid()), 'admin'::app_role));

-- FINANCIAL_PERMISSIONS
DROP POLICY IF EXISTS "Users can view their permissions" ON public.financial_permissions;
DROP POLICY IF EXISTS "Admins can manage permissions" ON public.financial_permissions;

CREATE POLICY "Users can view their permissions" ON public.financial_permissions
FOR SELECT USING (((select auth.uid()) = user_id) OR has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can manage permissions" ON public.financial_permissions
FOR ALL USING (has_role((select auth.uid()), 'admin'::app_role));

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their notifications" ON public.notifications;

CREATE POLICY "Users can view their notifications" ON public.notifications
FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their notifications" ON public.notifications
FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their notifications" ON public.notifications
FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their notifications" ON public.notifications
FOR DELETE USING ((select auth.uid()) = user_id);

-- PRODUCTS
DROP POLICY IF EXISTS "Users can view products" ON public.products;
DROP POLICY IF EXISTS "Users can insert products" ON public.products;
DROP POLICY IF EXISTS "Users can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Users can view products" ON public.products
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert products" ON public.products
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update products" ON public.products
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- CAMPAIGNS
DROP POLICY IF EXISTS "Users can view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can insert campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can delete campaigns" ON public.campaigns;

CREATE POLICY "Users can view campaigns" ON public.campaigns
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert campaigns" ON public.campaigns
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update campaigns" ON public.campaigns
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete campaigns" ON public.campaigns
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- ANALYTICS_DATA
DROP POLICY IF EXISTS "Users can view analytics" ON public.analytics_data;
DROP POLICY IF EXISTS "Users can insert analytics" ON public.analytics_data;
DROP POLICY IF EXISTS "Admins can manage analytics" ON public.analytics_data;

CREATE POLICY "Users can view analytics" ON public.analytics_data
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert analytics" ON public.analytics_data
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can manage analytics" ON public.analytics_data
FOR ALL USING (has_role((select auth.uid()), 'admin'::app_role));

-- ANALYTICS_REPORTS
DROP POLICY IF EXISTS "Users can view reports" ON public.analytics_reports;
DROP POLICY IF EXISTS "Users can create reports" ON public.analytics_reports;
DROP POLICY IF EXISTS "Admins can delete reports" ON public.analytics_reports;

CREATE POLICY "Users can view reports" ON public.analytics_reports
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can create reports" ON public.analytics_reports
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete reports" ON public.analytics_reports
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- CUSTOM_FIELDS
DROP POLICY IF EXISTS "Users can view custom fields" ON public.custom_fields;
DROP POLICY IF EXISTS "Admins can manage custom fields" ON public.custom_fields;

CREATE POLICY "Users can view custom fields" ON public.custom_fields
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can manage custom fields" ON public.custom_fields
FOR ALL USING (has_role((select auth.uid()), 'admin'::app_role));

-- CUSTOMER_INTERACTIONS
DROP POLICY IF EXISTS "Users can view interactions" ON public.customer_interactions;
DROP POLICY IF EXISTS "Users can insert interactions" ON public.customer_interactions;
DROP POLICY IF EXISTS "Users can update interactions" ON public.customer_interactions;
DROP POLICY IF EXISTS "Admins can delete interactions" ON public.customer_interactions;

CREATE POLICY "Users can view interactions" ON public.customer_interactions
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert interactions" ON public.customer_interactions
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update interactions" ON public.customer_interactions
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete interactions" ON public.customer_interactions
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- CUSTOMERS_QUOTES
DROP POLICY IF EXISTS "Users can view customers_quotes" ON public.customers_quotes;
DROP POLICY IF EXISTS "Users can insert customers_quotes" ON public.customers_quotes;
DROP POLICY IF EXISTS "Users can update customers_quotes" ON public.customers_quotes;
DROP POLICY IF EXISTS "Admins can delete customers_quotes" ON public.customers_quotes;

CREATE POLICY "Users can view customers_quotes" ON public.customers_quotes
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert customers_quotes" ON public.customers_quotes
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update customers_quotes" ON public.customers_quotes
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can delete customers_quotes" ON public.customers_quotes
FOR DELETE USING (has_role((select auth.uid()), 'admin'::app_role));

-- DATA_VALIDATION_LOGS
DROP POLICY IF EXISTS "Users can view validation logs" ON public.data_validation_logs;
DROP POLICY IF EXISTS "Users can insert validation logs" ON public.data_validation_logs;

CREATE POLICY "Users can view validation logs" ON public.data_validation_logs
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert validation logs" ON public.data_validation_logs
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

-- OPPORTUNITY_ITEMS
DROP POLICY IF EXISTS "Users can view opportunity items" ON public.opportunity_items;
DROP POLICY IF EXISTS "Users can insert opportunity items" ON public.opportunity_items;
DROP POLICY IF EXISTS "Users can update opportunity items" ON public.opportunity_items;
DROP POLICY IF EXISTS "Users can delete opportunity items" ON public.opportunity_items;

CREATE POLICY "Users can view opportunity items" ON public.opportunity_items
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert opportunity items" ON public.opportunity_items
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update opportunity items" ON public.opportunity_items
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can delete opportunity items" ON public.opportunity_items
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- SYSTEM_SETTINGS
DROP POLICY IF EXISTS "Users can view settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;

CREATE POLICY "Users can view settings" ON public.system_settings
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can manage settings" ON public.system_settings
FOR ALL USING (has_role((select auth.uid()), 'admin'::app_role));

-- WHATSAPP_MESSAGES
DROP POLICY IF EXISTS "Users can view messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Users can update messages" ON public.whatsapp_messages;

CREATE POLICY "Users can view messages" ON public.whatsapp_messages
FOR SELECT USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert messages" ON public.whatsapp_messages
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update messages" ON public.whatsapp_messages
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);