-- PHASE 1: Database Structure Consolidation and Optimization

-- 1. Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_close_date ON deals(close_date);
CREATE INDEX IF NOT EXISTS idx_opportunities_customer_id ON opportunities(customer_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- 2. Ensure proper foreign key relationships
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_customer_id_fkey;
ALTER TABLE deals ADD CONSTRAINT deals_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS opportunities_customer_id_fkey;
ALTER TABLE opportunities ADD CONSTRAINT opportunities_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- 3. Add missing columns for proper workflow
ALTER TABLE deals ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES quotes(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS deal_id UUID REFERENCES deals(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES quotes(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS opportunity_id UUID REFERENCES opportunities(id);

-- 4. Standardize status values
UPDATE deals SET status = 'lead' WHERE status IN ('prospecto', 'novo');
UPDATE deals SET status = 'qualified' WHERE status IN ('qualificado', 'interesse');
UPDATE deals SET status = 'proposal' WHERE status IN ('proposta', 'orcamento');
UPDATE deals SET status = 'negotiation' WHERE status IN ('negociacao', 'seguimento');
UPDATE deals SET status = 'won' WHERE status IN ('ganho', 'fechado', 'vendido');
UPDATE deals SET status = 'lost' WHERE status IN ('perdido', 'cancelado');

UPDATE opportunities SET stage = 'lead' WHERE stage IN ('prospecto', 'novo');
UPDATE opportunities SET stage = 'qualified' WHERE stage IN ('qualificado', 'interesse');
UPDATE opportunities SET stage = 'proposal' WHERE stage IN ('proposta', 'orcamento');
UPDATE opportunities SET stage = 'negotiation' WHERE stage IN ('negociacao', 'seguimento');
UPDATE opportunities SET stage = 'won' WHERE stage IN ('ganho', 'fechado', 'vendido');
UPDATE opportunities SET stage = 'lost' WHERE stage IN ('perdido', 'cancelado');

-- 5. Create materialized view for dashboard analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS sales_analytics AS
SELECT 
  DATE_TRUNC('month', d.created_at) as month,
  COUNT(DISTINCT d.id) as total_deals,
  COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as won_deals,
  SUM(CASE WHEN d.status = 'won' THEN COALESCE(d.actual_value, d.value, 0) END) as won_value,
  COUNT(DISTINCT o.id) as total_opportunities,
  COUNT(DISTINCT q.id) as total_quotes,
  SUM(CASE WHEN t.type = 'receita' THEN t.amount ELSE 0 END) as revenue,
  SUM(CASE WHEN t.type = 'despesa' THEN t.amount ELSE 0 END) as expenses
FROM deals d
LEFT JOIN opportunities o ON o.customer_id = d.customer_id
LEFT JOIN quotes q ON q.customer_id = d.customer_id
LEFT JOIN transactions t ON t.deal_id = d.id OR t.quote_id = q.id
GROUP BY DATE_TRUNC('month', d.created_at);

-- 6. Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS sales_analytics_month_idx ON sales_analytics(month);