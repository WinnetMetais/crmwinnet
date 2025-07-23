-- Melhorar função de qualidade de dados para incluir validação de CNPJ
CREATE OR REPLACE FUNCTION public.calculate_customer_data_quality(customer_id uuid)
RETURNS integer
LANGUAGE plpgsql
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

-- Criar função de validação para oportunidades
CREATE OR REPLACE FUNCTION public.validate_opportunity_data(opportunity_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
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

-- Criar função de validação para deals
CREATE OR REPLACE FUNCTION public.validate_deal_data(deal_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
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

-- Habilitar real-time para tabelas importantes
ALTER TABLE public.analytics_reports REPLICA IDENTITY FULL;
ALTER TABLE public.customers REPLICA IDENTITY FULL;
ALTER TABLE public.opportunities REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.deals REPLICA IDENTITY FULL;

-- Adicionar tabelas à publicação do realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deals;