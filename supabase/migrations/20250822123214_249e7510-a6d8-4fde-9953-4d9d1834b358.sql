-- Fix the final remaining functions with search path issues

-- Fix log_sensitive_operation
CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix check_failed_auth_attempts
CREATE OR REPLACE FUNCTION public.check_failed_auth_attempts()
 RETURNS TABLE(user_email text, attempt_count bigint, last_attempt timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix sync_pedido_to_finance
CREATE OR REPLACE FUNCTION public.sync_pedido_to_finance()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE v_cliente_nome text;
BEGIN
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND (OLD.status IS DISTINCT FROM NEW.status)) THEN
    IF NEW.status IN ('APROVADO','FATURADO','CONCLUIDO') THEN
      -- Fetch client name if available
      SELECT c.nome_fantasia INTO v_cliente_nome FROM public.clientes c WHERE c.id = NEW.cliente_id;

      -- Create transaction if not exists
      IF NOT EXISTS (
        SELECT 1 FROM public.transactions t WHERE t.invoice_number = NEW.numero
      ) THEN
        INSERT INTO public.transactions (
          id, user_id, type, title, amount, category, subcategory, channel,
          date, due_date, payment_method, status, recurring, recurring_period,
          description, tags, client_name, invoice_number
        ) VALUES (
          gen_random_uuid(),
          auth.uid(),
          'receita',
          COALESCE('Venda - Pedido '||NEW.numero, 'Venda - Pedido'),
          COALESCE(NEW.total_liquido, 0),
          'Vendas',
          'Pedidos',
          'comercial',
          COALESCE(NEW.emissao, CURRENT_DATE),
          COALESCE(NEW.emissao, CURRENT_DATE),
          'boleto',
          'pendente',
          false,
          NULL,
          '',
          ARRAY['venda','pedido'],
          COALESCE(v_cliente_nome, ''),
          COALESCE(NEW.numero, NEW.id::text)
        );
      END IF;
    END IF;
  END IF;
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

-- Fix validate_opportunity_data
CREATE OR REPLACE FUNCTION public.validate_opportunity_data(opportunity_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  opportunity_record RECORD;
  errors JSONB := '[]'::jsonb;
  warnings JSONB := '[]'::jsonb;
BEGIN
  SELECT * INTO opportunity_record FROM public.opportunities WHERE id = opportunity_id;
  
  IF opportunity_record IS NULL THEN
    RETURN jsonb_build_object('errors', errors, 'warnings', warnings);
  END IF;
  
  -- Validar título
  IF opportunity_record.title IS NULL OR LENGTH(TRIM(opportunity_record.title)) < 3 THEN
    errors := errors || jsonb_build_array('Título muito curto ou não informado');
  END IF;
  
  -- Validar valor
  IF opportunity_record.value IS NULL OR opportunity_record.value <= 0 THEN
    warnings := warnings || jsonb_build_array('Valor da oportunidade não informado ou inválido');
  END IF;
  
  -- Validar probabilidade
  IF opportunity_record.probability IS NULL OR opportunity_record.probability < 0 OR opportunity_record.probability > 100 THEN
    warnings := warnings || jsonb_build_array('Probabilidade deve estar entre 0 e 100%');
  END IF;
  
  -- Validar data de fechamento esperada
  IF opportunity_record.expected_close_date IS NULL THEN
    warnings := warnings || jsonb_build_array('Data de fechamento esperada não informada');
  ELSIF opportunity_record.expected_close_date < CURRENT_DATE THEN
    warnings := warnings || jsonb_build_array('Data de fechamento no passado');
  END IF;
  
  -- Validar cliente
  IF opportunity_record.customer_id IS NULL THEN
    errors := errors || jsonb_build_array('Cliente não associado à oportunidade');
  END IF;
  
  -- Validar estágio
  IF opportunity_record.stage IS NULL OR TRIM(opportunity_record.stage) = '' THEN
    errors := errors || jsonb_build_array('Estágio da oportunidade não definido');
  END IF;
  
  -- Valores muito altos (suspeitos)
  IF opportunity_record.value > 1000000 THEN
    warnings := warnings || jsonb_build_array('Valor muito alto (>R$ 1.000.000)');
  END IF;
  
  RETURN jsonb_build_object('errors', errors, 'warnings', warnings);
END;
$function$;