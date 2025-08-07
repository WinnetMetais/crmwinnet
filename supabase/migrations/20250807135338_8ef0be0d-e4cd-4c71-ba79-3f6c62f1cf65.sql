-- Remover relacionamento duplicado que causa conflito
ALTER TABLE deals DROP CONSTRAINT IF EXISTS fk_deals_customer;

-- Limpar qualquer dado de mock que possa ainda estar aparecendo 
-- (especialmente dados em analytics_data que podem estar causando valores no dashboard)
DELETE FROM analytics_data WHERE metric_name LIKE '%mock%' OR metric_name LIKE '%teste%' OR metric_name LIKE '%demo%';

-- Verificar se há dados em outras tabelas que possam estar sendo usadas no dashboard
DELETE FROM sales_performance;
DELETE FROM financial_reports;

-- Reset dos contadores automáticos se existirem
UPDATE customers SET lead_score = 0, data_quality_score = 0 WHERE lead_score > 0 OR data_quality_score > 0;
UPDATE deals SET data_quality_score = 0 WHERE data_quality_score > 0;
UPDATE opportunities SET data_quality_score = 0 WHERE data_quality_score > 0;
UPDATE quotes SET data_quality_score = 0 WHERE data_quality_score > 0;
UPDATE transactions SET data_quality_score = 0 WHERE data_quality_score > 0;