-- Critical Security Fix: Enable RLS and add policies for unprotected tables

-- Enable RLS on all unprotected tables
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;

-- Units table policies (reference data - read-only for authenticated users)
CREATE POLICY "Authenticated users can view units"
ON public.units
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage units"
ON public.units
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (preferences->>'role')::text = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (preferences->>'role')::text = 'admin'
  )
);

-- Product Categories policies (reference data - read-only for authenticated users)
CREATE POLICY "Authenticated users can view product categories"
ON public.product_categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage product categories"
ON public.product_categories
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (preferences->>'role')::text = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (preferences->>'role')::text = 'admin'
  )
);

-- Suppliers table policies (business critical data)
CREATE POLICY "Authenticated users can view suppliers"
ON public.suppliers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage suppliers"
ON public.suppliers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update suppliers"
ON public.suppliers
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete suppliers"
ON public.suppliers
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (preferences->>'role')::text = 'admin'
  )
);

-- Carriers table policies (business critical data)
CREATE POLICY "Authenticated users can view carriers"
ON public.carriers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage carriers"
ON public.carriers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update carriers"
ON public.carriers
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete carriers"
ON public.carriers
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (preferences->>'role')::text = 'admin'
  )
);

-- Add audit logging for critical operations
CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD)
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data, new_data
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, new_data
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers for sensitive tables
CREATE TRIGGER audit_suppliers
  AFTER INSERT OR UPDATE OR DELETE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_operation();

CREATE TRIGGER audit_carriers
  AFTER INSERT OR UPDATE OR DELETE ON public.carriers
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_operation();

CREATE TRIGGER audit_product_categories
  AFTER INSERT OR UPDATE OR DELETE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_operation();

-- Create security monitoring function
CREATE OR REPLACE FUNCTION public.check_failed_auth_attempts()
RETURNS TABLE(
  user_email text,
  attempt_count bigint,
  last_attempt timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    raw_user_meta_data->>'email' as user_email,
    COUNT(*) as attempt_count,
    MAX(created_at) as last_attempt
  FROM auth.audit_log_entries
  WHERE event_name = 'user_signedin_failed'
    AND created_at > NOW() - INTERVAL '1 hour'
  GROUP BY raw_user_meta_data->>'email'
  HAVING COUNT(*) > 3
  ORDER BY attempt_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;