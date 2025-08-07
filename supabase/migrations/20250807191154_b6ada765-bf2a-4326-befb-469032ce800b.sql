-- Final cleanup of all remaining duplicate and problematic RLS policies

-- Fix the remaining auth performance issue for product_categories
DROP POLICY IF EXISTS "Admins can manage product categories" ON public.product_categories;

-- Remove all remaining duplicate policies

-- Customer Types - Remove all old policies
DROP POLICY IF EXISTS "customer_types_all" ON public.customer_types;
DROP POLICY IF EXISTS "Anyone can view customer_types" ON public.customer_types;
DROP POLICY IF EXISTS "Everyone can view customer_types" ON public.customer_types;
DROP POLICY IF EXISTS "Public read customer_types" ON public.customer_types;

-- Customers - Remove all old policies
DROP POLICY IF EXISTS "customers_all" ON public.customers;
DROP POLICY IF EXISTS "customers_select" ON public.customers;
DROP POLICY IF EXISTS "customers_insert" ON public.customers;
DROP POLICY IF EXISTS "customers_update" ON public.customers;
DROP POLICY IF EXISTS "customers_delete" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users full access to customers" ON public.customers;

-- Carriers - Remove remaining duplicate
DROP POLICY IF EXISTS "Authenticated users can view carriers" ON public.carriers;

-- Financial Reports - Remove duplicates
DROP POLICY IF EXISTS "Admins can manage everything" ON public.financial_reports;

-- Lead Sources - Remove duplicates
DROP POLICY IF EXISTS "Anyone can view lead_sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Public read lead_sources" ON public.lead_sources;
CREATE POLICY "lead_sources_select" ON public.lead_sources
FOR SELECT USING (true);

-- Notifications - Remove all old policies
DROP POLICY IF EXISTS "Users can manage notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications_all" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Opportunities - Remove all old policies
DROP POLICY IF EXISTS "opportunities_all" ON public.opportunities;

-- Tasks - Remove all old policies
DROP POLICY IF EXISTS "tasks_all" ON public.tasks;

-- Transactions - Remove all old policies
DROP POLICY IF EXISTS "transactions_all" ON public.transactions;

-- WhatsApp Messages - Remove all old policies
DROP POLICY IF EXISTS "whatsapp_messages_all" ON public.whatsapp_messages;

-- Profiles - Remove remaining old policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_all" ON public.profiles;