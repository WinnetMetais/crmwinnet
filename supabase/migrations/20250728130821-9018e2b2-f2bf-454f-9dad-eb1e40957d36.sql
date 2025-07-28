-- Corrigir problemas de relacionamento e navegação

-- 1. Verificar e corrigir relacionamentos duplicados
-- Primeiro, vamos verificar se existe customer_id duplicado nos deals
DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Verificar se há múltiplas colunas apontando para customers
    FOR rec IN (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'deals' 
        AND column_name LIKE '%customer%'
    ) LOOP
        RAISE NOTICE 'Coluna relacionada a customer encontrada: %', rec.column_name;
    END LOOP;
END $$;

-- 2. Limpar dados inconsistentes que podem estar causando o problema
-- Atualizar deals órfãos (sem customer_id válido)
UPDATE deals 
SET customer_id = NULL 
WHERE customer_id IS NOT NULL 
AND customer_id NOT IN (SELECT id FROM customers);

-- 3. Criar índices para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_customer_id ON opportunities(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_customer_id ON tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON tasks(deal_id);

-- 4. Atualizar configurações para melhorar navegação
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES 
  ('navigation_cache_enabled', '"true"', 'Habilita cache de navegação'),
  ('query_timeout', '30000', 'Timeout para consultas em ms'),
  ('enable_query_optimization', '"true"', 'Habilita otimização de consultas')
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 5. Configurar realtime para melhor responsividade
ALTER TABLE customers REPLICA IDENTITY FULL;
ALTER TABLE deals REPLICA IDENTITY FULL;
ALTER TABLE opportunities REPLICA IDENTITY FULL;
ALTER TABLE tasks REPLICA IDENTITY FULL;

-- 6. Adicionar publicação para realtime
DO $$
BEGIN
    -- Verificar se a publicação já existe
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
    
    -- Adicionar tabelas à publicação se não estiverem
    ALTER PUBLICATION supabase_realtime ADD TABLE customers;
    ALTER PUBLICATION supabase_realtime ADD TABLE deals;
    ALTER PUBLICATION supabase_realtime ADD TABLE opportunities;
    ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
    ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
    
EXCEPTION
    WHEN duplicate_object THEN
        -- Tabela já existe na publicação, ignorar
        NULL;
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao configurar realtime: %', SQLERRM;
END $$;

-- 7. Atualizar estatísticas das tabelas para otimizar planos de consulta
ANALYZE customers;
ANALYZE deals;
ANALYZE opportunities;
ANALYZE tasks;
ANALYZE transactions;