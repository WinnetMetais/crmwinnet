-- Fix remaining functions with search path issues

-- Fix update_modified_column
CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    NEW.modified_at = NOW();
    RETURN NEW;
END;
$function$;

-- Fix calculate_customer_data_quality
CREATE OR REPLACE FUNCTION public.calculate_customer_data_quality(customer_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  score INTEGER := 0;
  customer_record RECORD;
BEGIN
  SELECT * INTO customer_record FROM public.customers WHERE id = customer_id;
  
  IF customer_record IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Nome obrigatório (20 pontos)
  IF customer_record.name IS NOT NULL AND LENGTH(TRIM(customer_record.name)) >= 2 THEN
    score := score + 20;
  END IF;
  
  -- Email válido (15 pontos)
  IF customer_record.email IS NOT NULL AND customer_record.email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    score := score + 15;
  END IF;
  
  -- Telefone (10 pontos)
  IF customer_record.phone IS NOT NULL AND LENGTH(TRIM(customer_record.phone)) >= 10 THEN
    score := score + 10;
  END IF;
  
  -- Endereço completo (15 pontos)
  IF customer_record.address IS NOT NULL AND customer_record.city IS NOT NULL AND customer_record.state IS NOT NULL THEN
    score := score + 15;
  END IF;
  
  -- Empresa/CNPJ (15 pontos total - 5 para empresa, 10 para CNPJ válido)
  IF customer_record.company IS NOT NULL THEN
    score := score + 5;
  END IF;
  
  -- CNPJ válido (10 pontos) - Validação de formato brasileiro
  IF customer_record.cnpj IS NOT NULL AND customer_record.cnpj ~ '^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$' THEN
    score := score + 10;
  END IF;
  
  -- Status definido (5 pontos)
  IF customer_record.status IS NOT NULL AND customer_record.status != '' THEN
    score := score + 5;
  END IF;
  
  -- Lead source (5 pontos)
  IF customer_record.lead_source IS NOT NULL AND customer_record.lead_source != '' THEN
    score := score + 5;
  END IF;
  
  -- Segmento (5 pontos)
  IF customer_record.segment_id IS NOT NULL THEN
    score := score + 5;
  END IF;
  
  -- Última interação recente (10 pontos - menos de 90 dias)
  IF customer_record.last_contact_date IS NOT NULL AND customer_record.last_contact_date > (NOW() - INTERVAL '90 days') THEN
    score := score + 10;
  END IF;
  
  -- Notas/observações (5 pontos)
  IF customer_record.notes IS NOT NULL AND LENGTH(TRIM(customer_record.notes)) > 10 THEN
    score := score + 5;
  END IF;
  
  RETURN LEAST(score, 100); -- Máximo 100 pontos
END;
$function$;

-- Fix update_customer_quality_score
CREATE OR REPLACE FUNCTION public.update_customer_quality_score()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.data_quality_score := public.calculate_customer_data_quality(NEW.id);
  NEW.last_validated_at := NOW();
  RETURN NEW;
END;
$function$;