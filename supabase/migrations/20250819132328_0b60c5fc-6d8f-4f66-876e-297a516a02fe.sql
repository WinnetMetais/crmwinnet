-- Fix ALL remaining functions with search path issues

-- Fix validate_transaction_data
CREATE OR REPLACE FUNCTION public.validate_transaction_data(transaction_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  transaction_record RECORD;
  errors JSONB := '[]'::jsonb;
  warnings JSONB := '[]'::jsonb;
BEGIN
  SELECT * INTO transaction_record FROM public.transactions WHERE id = transaction_id;
  
  IF transaction_record IS NULL THEN
    RETURN jsonb_build_object('errors', errors, 'warnings', warnings);
  END IF;
  
  -- Validar valor
  IF transaction_record.amount IS NULL OR transaction_record.amount <= 0 THEN
    errors := errors || jsonb_build_array('Valor inválido ou zero');
  END IF;
  
  -- Validar data
  IF transaction_record.date IS NULL THEN
    errors := errors || jsonb_build_array('Data não informada');
  ELSIF transaction_record.date > CURRENT_DATE THEN
    warnings := warnings || jsonb_build_array('Data futura detectada');
  END IF;
  
  -- Validar descrição
  IF transaction_record.title IS NULL OR LENGTH(TRIM(transaction_record.title)) < 3 THEN
    errors := errors || jsonb_build_array('Descrição muito curta');
  END IF;
  
  -- Validar categoria
  IF transaction_record.category IS NULL OR TRIM(transaction_record.category) = '' THEN
    errors := errors || jsonb_build_array('Categoria não informada');
  END IF;
  
  -- Validar tipo
  IF transaction_record.type NOT IN ('receita', 'despesa') THEN
    errors := errors || jsonb_build_array('Tipo de transação inválido');
  END IF;
  
  -- Valores suspeitos
  IF transaction_record.amount > 500000 THEN
    warnings := warnings || jsonb_build_array('Valor muito alto (>R$ 500.000)');
  END IF;
  
  RETURN jsonb_build_object('errors', errors, 'warnings', warnings);
END;
$function$;

-- Fix validate_deal_data
CREATE OR REPLACE FUNCTION public.validate_deal_data(deal_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  deal_record RECORD;
  errors JSONB := '[]'::jsonb;
  warnings JSONB := '[]'::jsonb;
BEGIN
  SELECT * INTO deal_record FROM public.deals WHERE id = deal_id;
  
  IF deal_record IS NULL THEN
    RETURN jsonb_build_object('errors', errors, 'warnings', warnings);
  END IF;
  
  -- Validar título
  IF deal_record.title IS NULL OR LENGTH(TRIM(deal_record.title)) < 3 THEN
    errors := errors || jsonb_build_array('Título muito curto ou não informado');
  END IF;
  
  -- Validar valor
  IF deal_record.value IS NULL OR deal_record.value <= 0 THEN
    warnings := warnings || jsonb_build_array('Valor do deal não informado');
  END IF;
  
  -- Validar cliente
  IF deal_record.customer_id IS NULL THEN
    errors := errors || jsonb_build_array('Cliente não associado ao deal');
  END IF;
  
  -- Validar status
  IF deal_record.status IS NULL OR TRIM(deal_record.status) = '' THEN
    errors := errors || jsonb_build_array('Status do deal não definido');
  END IF;
  
  -- Validar data de fechamento
  IF deal_record.close_date IS NOT NULL AND deal_record.close_date < deal_record.created_at THEN
    errors := errors || jsonb_build_array('Data de fechamento anterior à criação');
  END IF;
  
  -- Inconsistência entre valores estimado e real
  IF deal_record.estimated_value IS NOT NULL AND deal_record.actual_value IS NOT NULL THEN
    IF ABS(deal_record.estimated_value - deal_record.actual_value) > deal_record.estimated_value * 0.5 THEN
      warnings := warnings || jsonb_build_array('Grande diferença entre valor estimado e real (>50%)');
    END IF;
  END IF;
  
  RETURN jsonb_build_object('errors', errors, 'warnings', warnings);
END;
$function$;