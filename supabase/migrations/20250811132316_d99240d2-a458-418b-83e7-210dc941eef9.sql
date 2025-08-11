-- 1) Criar índices para TODAS as chaves estrangeiras do schema public que ainda não possuem índice cobrindo as colunas
DO $$
DECLARE
  rec RECORD;
  colnames text[];
  idxname text;
  cols_sql text;
BEGIN
  FOR rec IN
    SELECT c.oid AS con_oid, c.conrelid, c.conname, c.conkey
    FROM pg_constraint c
    WHERE c.contype = 'f'
      AND c.connamespace = 'public'::regnamespace
  LOOP
    -- Se não existir um índice cujo prefixo de colunas seja exatamente as colunas do FK, criaremos
    IF NOT EXISTS (
      SELECT 1
      FROM pg_index i
      WHERE i.indrelid = rec.conrelid
        AND i.indisvalid
        AND (i.indkey::int[])[1:cardinality(rec.conkey)] = rec.conkey::int[]
    ) THEN
      -- Obter nomes das colunas do FK na ordem correta
      SELECT array_agg(a.attname ORDER BY ck.ord)
      INTO colnames
      FROM unnest(rec.conkey) WITH ORDINALITY AS ck(attnum, ord)
      JOIN pg_attribute a
        ON a.attrelid = rec.conrelid
       AND a.attnum = ck.attnum;

      IF colnames IS NOT NULL AND array_length(colnames, 1) > 0 THEN
        idxname := format('idx_%s_%s_fk',
                   (rec.conrelid::regclass)::text,
                   array_to_string(colnames, '_'));
        cols_sql := array_to_string(ARRAY(SELECT format('%I', c) FROM unnest(colnames) c), ', ');

        EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON %s (%s)', idxname, rec.conrelid::regclass, cols_sql);
      END IF;
    END IF;
  END LOOP;
END $$;

-- 2) Remover índices sinalizados como não utilizados (unused) pelo linter
DROP INDEX IF EXISTS public.idx_leads_owner;
DROP INDEX IF EXISTS public.idx_oport_pipeline;
DROP INDEX IF EXISTS public.idx_atividades_ref;
DROP INDEX IF EXISTS public.idx_pedidos_status;
DROP INDEX IF EXISTS public.idx_lanc_origem;
DROP INDEX IF EXISTS public.idx_lanc_categoria;
DROP INDEX IF EXISTS public.idx_cr_vencimento;
DROP INDEX IF EXISTS public.idx_cp_vencimento;
DROP INDEX IF EXISTS public.idx_saldos_mes;
DROP INDEX IF EXISTS public.idx_opportunities_status;
DROP INDEX IF EXISTS public.idx_opportunities_stage;
DROP INDEX IF EXISTS public.idx_opportunities_customer_id;
DROP INDEX IF EXISTS public.idx_audit_logs_user_id;
DROP INDEX IF EXISTS public.idx_commissions_deal_id;
DROP INDEX IF EXISTS public.idx_commissions_quote_id;
DROP INDEX IF EXISTS public.idx_content_calendar_campaign_id;
DROP INDEX IF EXISTS public.idx_content_calendar_user_id;
DROP INDEX IF EXISTS public.idx_content_templates_user_id;
DROP INDEX IF EXISTS public.idx_customers_customer_type_id;
DROP INDEX IF EXISTS public.idx_customers_lead_source_id;
DROP INDEX IF EXISTS public.idx_customers_priority_id;
DROP INDEX IF EXISTS public.idx_customers_qualification_status_id;
DROP INDEX IF EXISTS public.idx_customers_segment_id;
DROP INDEX IF EXISTS public.idx_deals_customer_id;
DROP INDEX IF EXISTS public.idx_deals_opportunity_id;
DROP INDEX IF EXISTS public.idx_deals_pipeline_stage_id;
DROP INDEX IF EXISTS public.idx_deals_priority_id;
DROP INDEX IF EXISTS public.idx_deals_qualification_status_id;
DROP INDEX IF EXISTS public.idx_negotiations_customer_id;
DROP INDEX IF EXISTS public.idx_negotiations_deal_id;
DROP INDEX IF EXISTS public.idx_negotiations_quote_id;
DROP INDEX IF EXISTS public.idx_negotiations_user_id;
DROP INDEX IF EXISTS public.idx_pipeline_activities_customer_id;
DROP INDEX IF EXISTS public.idx_pipeline_activities_deal_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_deal_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_from_stage_id;
DROP INDEX IF EXISTS public.idx_pipeline_history_to_stage_id;
DROP INDEX IF EXISTS public.idx_quote_items_quote_id;
DROP INDEX IF EXISTS public.idx_quote_items_user_id;
DROP INDEX IF EXISTS public.idx_quotes_deal_id;
DROP INDEX IF EXISTS public.idx_quotes_opportunity_id;
DROP INDEX IF EXISTS public.idx_tasks_customer_id;
DROP INDEX IF EXISTS public.idx_tasks_deal_id;
DROP INDEX IF EXISTS public.idx_tasks_quote_id;
DROP INDEX IF EXISTS public.idx_user_permissions_granted_by;
DROP INDEX IF EXISTS public.idx_opportunities_expected_close_date;
DROP INDEX IF EXISTS public.idx_pipeline_stages_order_position;
DROP INDEX IF EXISTS public.idx_pipeline_stages_active;
DROP INDEX IF EXISTS public.idx_pedidos_cliente_id;
