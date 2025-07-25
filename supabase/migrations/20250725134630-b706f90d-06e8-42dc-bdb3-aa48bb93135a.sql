-- Corrigir avisos de segurança: adicionar search_path para todas as funções

-- 1. Atualizar função handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- 2. Atualizar função audit_trigger
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;

-- 3. Atualizar função get_advanced_statistics
CREATE OR REPLACE FUNCTION public.get_advanced_statistics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'customers', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM customers),
      'new_this_period', (SELECT COUNT(*) FROM customers WHERE created_at::date BETWEEN start_date AND end_date),
      'by_status', (SELECT jsonb_object_agg(status, count) FROM (
        SELECT status, COUNT(*) as count FROM customers GROUP BY status
      ) t)
    ),
    'deals', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM deals),
      'total_value', (SELECT COALESCE(SUM(value), 0) FROM deals),
      'won_this_period', (SELECT COUNT(*) FROM deals WHERE status = 'won' AND close_date BETWEEN start_date AND end_date),
      'by_stage', (SELECT jsonb_object_agg(s.name, COALESCE(d.count, 0)) FROM 
        pipeline_stages s LEFT JOIN (
          SELECT pipeline_stage_id, COUNT(*) as count FROM deals GROUP BY pipeline_stage_id
        ) d ON s.id = d.pipeline_stage_id)
    ),
    'revenue', jsonb_build_object(
      'total_period', (SELECT COALESCE(SUM(amount), 0) FROM transactions 
        WHERE type = 'receita' AND date BETWEEN start_date AND end_date),
      'expenses_period', (SELECT COALESCE(SUM(amount), 0) FROM transactions 
        WHERE type = 'despesa' AND date BETWEEN start_date AND end_date),
      'by_category', (SELECT jsonb_object_agg(category, amount) FROM (
        SELECT category, SUM(amount) as amount FROM transactions 
        WHERE date BETWEEN start_date AND end_date GROUP BY category
      ) t)
    ),
    'opportunities', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM opportunities),
      'total_value', (SELECT COALESCE(SUM(value), 0) FROM opportunities WHERE status = 'active'),
      'conversion_rate', (SELECT ROUND(
        CASE WHEN COUNT(*) > 0 THEN 
          (COUNT(*) FILTER (WHERE status = 'won') * 100.0 / COUNT(*))
        ELSE 0 END, 2
      ) FROM opportunities WHERE created_at::date >= start_date - INTERVAL '90 days')
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- 4. Atualizar função calculate_customer_data_quality
CREATE OR REPLACE FUNCTION public.calculate_customer_data_quality(customer_id uuid)
RETURNS INTEGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
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
$$;

-- 5. Atualizar função calculate_product_margins
CREATE OR REPLACE FUNCTION public.calculate_product_margins()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  IF NEW.cost_price IS NOT NULL AND NEW.cost_price > 0 THEN
    NEW.margin_50 = NEW.cost_price / (1 - 0.50);
    NEW.margin_55 = NEW.cost_price / (1 - 0.55);
    NEW.margin_60 = NEW.cost_price / (1 - 0.60);
    NEW.margin_65 = NEW.cost_price / (1 - 0.65);
    NEW.margin_70 = NEW.cost_price / (1 - 0.70);
    NEW.margin_75 = NEW.cost_price / (1 - 0.75);
  END IF;
  RETURN NEW;
END;
$$;

-- 6. Atualizar função update_customer_quality_score
CREATE OR REPLACE FUNCTION public.update_customer_quality_score()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  NEW.data_quality_score := public.calculate_customer_data_quality(NEW.id);
  NEW.last_validated_at := NOW();
  RETURN NEW;
END;
$$;

-- 7. Atualizar função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 8. Atualizar função validate_transaction_data
CREATE OR REPLACE FUNCTION public.validate_transaction_data(transaction_id uuid)
RETURNS JSONB 
LANGUAGE plpgsql 
SET search_path = public
AS $$
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
$$;

-- 9. Atualizar função validate_opportunity_data
CREATE OR REPLACE FUNCTION public.validate_opportunity_data(opportunity_id uuid)
RETURNS JSONB 
LANGUAGE plpgsql 
SET search_path = public
AS $$
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
$$;

-- 10. Atualizar função validate_deal_data
CREATE OR REPLACE FUNCTION public.validate_deal_data(deal_id uuid)
RETURNS JSONB 
LANGUAGE plpgsql 
SET search_path = public
AS $$
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
$$;