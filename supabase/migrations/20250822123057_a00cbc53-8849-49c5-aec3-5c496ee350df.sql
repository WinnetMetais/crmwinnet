-- Fix all remaining functions that still have search path issues

-- Fix sync_quote_to_finance
CREATE OR REPLACE FUNCTION public.sync_quote_to_finance()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Only act when approved
  IF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'aprovado' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
      -- Insert into transactions if not already created for this quote
      IF NOT EXISTS (
        SELECT 1 FROM public.transactions t WHERE t.invoice_number = NEW.quote_number
      ) THEN
        INSERT INTO public.transactions (
          id, user_id, type, title, amount, category, subcategory, channel,
          date, due_date, payment_method, status, recurring, recurring_period,
          description, tags, client_name, invoice_number
        ) VALUES (
          gen_random_uuid(),
          auth.uid(),
          'receita',
          COALESCE('Venda - Orçamento '||NEW.quote_number, 'Venda - Orçamento'),
          COALESCE(NEW.total, 0),
          'Vendas',
          'Orçamentos aprovados',
          'comercial',
          COALESCE(NEW.approved_at::date, CURRENT_DATE),
          COALESCE(NEW.approved_at::date, CURRENT_DATE),
          'boleto',
          'pendente',
          false,
          NULL,
          COALESCE(NEW.notes, ''),
          ARRAY['venda','orcamento'],
          COALESCE(NEW.customer_name, ''),
          COALESCE(NEW.quote_number, NEW.id::text)
        );
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, display_name, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'user',
    'active'
  );
  RETURN NEW;
END;
$function$;

-- Fix audit_trigger
CREATE OR REPLACE FUNCTION public.audit_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  old_record JSONB;
  new_record JSONB;
  changed_fields TEXT[] := '{}';
  field_name TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    old_record := to_jsonb(OLD);
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, OLD.id, TG_OP, old_record
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    old_record := to_jsonb(OLD);
    new_record := to_jsonb(NEW);
    
    FOR field_name IN SELECT key FROM jsonb_each(new_record) LOOP
      IF old_record->>field_name IS DISTINCT FROM new_record->>field_name THEN
        changed_fields := array_append(changed_fields, field_name);
      END IF;
    END LOOP;
    
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data, new_data, changed_fields
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, old_record, new_record, changed_fields
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    new_record := to_jsonb(NEW);
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, new_data
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, new_record
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;