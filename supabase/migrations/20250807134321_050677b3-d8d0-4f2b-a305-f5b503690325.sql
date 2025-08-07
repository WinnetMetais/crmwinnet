-- Limpar todos os dados fictícios/mockups do sistema
-- Manter apenas configurações essenciais do sistema

-- Limpar dados de transações
DELETE FROM transactions;

-- Limpar dados de clientes
DELETE FROM customers;

-- Limpar dados de produtos
DELETE FROM products;

-- Limpar dados de cotações e itens relacionados
DELETE FROM invoice_items;
DELETE FROM quotes;

-- Limpar dados de negócios/deals
DELETE FROM deals;

-- Limpar dados de oportunidades e itens relacionados
DELETE FROM opportunity_items;
DELETE FROM opportunities;

-- Limpar dados de comissões
DELETE FROM commissions;

-- Limpar dados de performance de vendas
DELETE FROM sales_performance;

-- Limpar dados de tarefas
DELETE FROM tasks;

-- Limpar dados de campanhas de marketing
DELETE FROM marketing_campaigns;
DELETE FROM content_calendar;

-- Limpar dados de negociações
DELETE FROM negotiations;

-- Limpar logs de validação antigos
DELETE FROM data_validation_logs;

-- Limpar histórico de pipeline
DELETE FROM pipeline_history;

-- Limpar mensagens do WhatsApp
DELETE FROM whatsapp_messages;

-- Limpar relatórios analíticos
DELETE FROM analytics_reports;
DELETE FROM analytics_data;

-- Limpar campanhas
DELETE FROM campaigns;

-- Limpar campos customizados
DELETE FROM custom_fields;

-- Limpar relatórios financeiros
DELETE FROM financial_reports;

-- Resetar sequências/contadores se necessário
-- As configurações essenciais permanecem:
-- - pipeline_stages
-- - payment_methods  
-- - payment_terms
-- - customer_segments
-- - lead_sources
-- - customer_types
-- - departments

-- Confirmar limpeza
SELECT 
  'customers' as tabela, COUNT(*) as registros FROM customers
UNION ALL
SELECT 'products' as tabela, COUNT(*) as registros FROM products
UNION ALL  
SELECT 'transactions' as tabela, COUNT(*) as registros FROM transactions
UNION ALL
SELECT 'deals' as tabela, COUNT(*) as registros FROM deals
UNION ALL
SELECT 'opportunities' as tabela, COUNT(*) as registros FROM opportunities
UNION ALL
SELECT 'quotes' as tabela, COUNT(*) as registros FROM quotes;