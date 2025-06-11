
-- Adicionar colunas de validação e metadados para melhor controle de qualidade dos dados
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS data_quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS data_completeness_percentage DECIMAL(5,2) DEFAULT 0.00;

ALTER TABLE public.deals
ADD COLUMN IF NOT EXISTS data_quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS data_quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.quotes
ADD COLUMN IF NOT EXISTS data_quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS data_quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT '[]'::jsonb;

-- Criar tabela para logs de validação do sistema
CREATE TABLE IF NOT EXISTS public.data_validation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  validation_type TEXT NOT NULL,
  validation_status TEXT NOT NULL CHECK (validation_status IN ('passed', 'failed', 'warning')),
  errors JSONB DEFAULT '[]'::jsonb,
  suggestions JSONB DEFAULT '[]'::jsonb,
  validated_by TEXT,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_customers_data_quality ON public.customers(data_quality_score);
CREATE INDEX IF NOT EXISTS idx_customers_last_validated ON public.customers(last_validated_at);
CREATE INDEX IF NOT EXISTS idx_validation_logs_module ON public.data_validation_logs(module_name, table_name);
CREATE INDEX IF NOT EXISTS idx_validation_logs_status ON public.data_validation_logs(validation_status);

-- Função para calcular score de qualidade dos dados de clientes
CREATE OR REPLACE FUNCTION public.calculate_customer_data_quality(customer_id UUID)
RETURNS INTEGER AS $$
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
  
  -- Empresa/CNPJ (10 pontos)
  IF customer_record.company IS NOT NULL OR customer_record.cnpj IS NOT NULL THEN
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
$$ LANGUAGE plpgsql;

-- Função para validar dados de transações
CREATE OR REPLACE FUNCTION public.validate_transaction_data(transaction_id UUID)
RETURNS JSONB AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente o score de qualidade dos clientes
CREATE OR REPLACE FUNCTION public.update_customer_quality_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_quality_score := public.calculate_customer_data_quality(NEW.id);
  NEW.last_validated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger na tabela de clientes
DROP TRIGGER IF EXISTS trigger_update_customer_quality ON public.customers;
CREATE TRIGGER trigger_update_customer_quality
  BEFORE INSERT OR UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_customer_quality_score();
