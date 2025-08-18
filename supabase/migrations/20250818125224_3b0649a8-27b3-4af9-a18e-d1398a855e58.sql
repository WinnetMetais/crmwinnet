-- Fix security policies step by step

-- First, let's check and fix the customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text,
    phone text,
    cnpj text,
    address text,
    city text,
    state text,
    zip_code text,
    company text,
    segment_id uuid,
    status text DEFAULT 'active',
    lead_source text,
    last_contact_date timestamp with time zone,
    notes text,
    data_quality_score integer DEFAULT 0,
    last_validated_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create proper policies for customers table
DROP POLICY IF EXISTS "Users can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;

CREATE POLICY "Authenticated users can view customers" ON public.customers 
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage customers" ON public.customers 
FOR ALL USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);