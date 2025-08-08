-- FIX & COMPLETE: pipeline stages standardization + realtime + indices (idempotent)

-- 0) Ensure table exists and required columns are present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pipeline_stages'
  ) THEN
    CREATE TABLE public.pipeline_stages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      stage_key text,
      "order" integer NOT NULL DEFAULT 0,
      probability integer NOT NULL DEFAULT 0,
      is_won boolean NOT NULL DEFAULT false,
      is_lost boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  END IF;
END $$;

ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS stage_key text;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS probability integer NOT NULL DEFAULT 0;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS is_won boolean NOT NULL DEFAULT false;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS is_lost boolean NOT NULL DEFAULT false;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- RLS
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pipeline_stages' AND policyname='pipeline_stages_select'
  ) THEN
    CREATE POLICY "pipeline_stages_select" ON public.pipeline_stages FOR SELECT USING ((SELECT auth.uid() IS NOT NULL));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pipeline_stages' AND policyname='pipeline_stages_insert'
  ) THEN
    CREATE POLICY "pipeline_stages_insert" ON public.pipeline_stages FOR INSERT WITH CHECK ((SELECT auth.uid() IS NOT NULL));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pipeline_stages' AND policyname='pipeline_stages_update'
  ) THEN
    CREATE POLICY "pipeline_stages_update" ON public.pipeline_stages FOR UPDATE USING ((SELECT auth.uid() IS NOT NULL));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pipeline_stages' AND policyname='pipeline_stages_delete'
  ) THEN
    CREATE POLICY "pipeline_stages_delete" ON public.pipeline_stages FOR DELETE USING ((SELECT auth.uid() IS NOT NULL));
  END IF;
END $$;

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_pipeline_stages_updated_at ON public.pipeline_stages;
CREATE TRIGGER trg_pipeline_stages_updated_at
BEFORE UPDATE ON public.pipeline_stages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Constraints & indexes (safe wrappers)
DO $$ BEGIN
  BEGIN
    ALTER TABLE public.pipeline_stages ALTER COLUMN stage_key SET NOT NULL;
  EXCEPTION WHEN others THEN NULL; END;
  BEGIN
    ALTER TABLE public.pipeline_stages ADD CONSTRAINT pipeline_stages_stage_key_key UNIQUE(stage_key);
  EXCEPTION WHEN others THEN NULL; END;
END $$;

CREATE INDEX IF NOT EXISTS idx_pipeline_stages_order ON public.pipeline_stages ("order");
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_stage_key ON public.pipeline_stages (stage_key);

-- Seed canonical stages (upsert by stage_key)
INSERT INTO public.pipeline_stages (name, stage_key, "order", probability, is_won, is_lost)
VALUES
  ('Prospecção', 'prospecting', 1, 10, false, false),
  ('Qualificação', 'qualification', 2, 25, false, false),
  ('Proposta', 'proposal', 3, 50, false, false),
  ('Negociação', 'negotiation', 4, 75, false, false),
  ('Fechado - Ganhou', 'won', 5, 100, true, false),
  ('Fechado - Perdido', 'lost', 6, 0, false, true)
ON CONFLICT (stage_key) DO UPDATE SET
  name = EXCLUDED.name,
  "order" = EXCLUDED."order",
  probability = EXCLUDED.probability,
  is_won = EXCLUDED.is_won,
  is_lost = EXCLUDED.is_lost;

-- Standardize opportunities.stage values
UPDATE public.opportunities SET stage = 'prospecting' WHERE LOWER(TRIM(stage)) IN ('prospecting','prospect','prospecto','prospecção','prospeccao') AND stage <> 'prospecting';
UPDATE public.opportunities SET stage = 'qualification' WHERE LOWER(TRIM(stage)) IN ('qualification','qualificacao','qualificação') AND stage <> 'qualification';
UPDATE public.opportunities SET stage = 'proposal' WHERE LOWER(TRIM(stage)) IN ('proposal','proposta') AND stage <> 'proposal';
UPDATE public.opportunities SET stage = 'negotiation' WHERE LOWER(TRIM(stage)) IN ('negotiation','negociacao','negociação') AND stage <> 'negotiation';
UPDATE public.opportunities SET stage = 'won' WHERE LOWER(TRIM(stage)) IN ('won','ganho','fechado ganho','fechado-ganho') AND stage <> 'won';
UPDATE public.opportunities SET stage = 'lost' WHERE LOWER(TRIM(stage)) IN ('lost','perdido','fechado perdido','fechado-perdido') AND stage <> 'lost';

-- Validate stage trigger
CREATE OR REPLACE FUNCTION public.validate_opportunity_stage()
RETURNS trigger AS $$
DECLARE v_exists boolean; BEGIN
  IF NEW.stage IS NULL OR TRIM(NEW.stage) = '' THEN NEW.stage := 'prospecting'; END IF;
  NEW.stage := LOWER(TRIM(NEW.stage));
  SELECT EXISTS(SELECT 1 FROM public.pipeline_stages WHERE stage_key = NEW.stage) INTO v_exists;
  IF NOT v_exists THEN RAISE EXCEPTION 'Invalid stage: %', NEW.stage; END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_opportunities_validate_stage ON public.opportunities;
CREATE TRIGGER trg_opportunities_validate_stage
BEFORE INSERT OR UPDATE OF stage ON public.opportunities
FOR EACH ROW EXECUTE FUNCTION public.validate_opportunity_stage();

-- Ensure opportunities indices and updated_at trigger
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities (stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_customer_id ON public.opportunities (customer_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_expected_close_date ON public.opportunities (expected_close_date);
DROP TRIGGER IF EXISTS trg_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER trg_opportunities_updated_at
BEFORE UPDATE ON public.opportunities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Deals: FK to pipeline_stages and helpful indexes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_schema='public' AND table_name='deals' AND constraint_type='FOREIGN KEY' AND constraint_name='deals_pipeline_stage_id_fkey'
  ) THEN
    ALTER TABLE public.deals
    ADD CONSTRAINT deals_pipeline_stage_id_fkey FOREIGN KEY (pipeline_stage_id) REFERENCES public.pipeline_stages(id) ON UPDATE CASCADE ON DELETE SET NULL;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_deals_pipeline_stage_id ON public.deals (pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals (status);
CREATE INDEX IF NOT EXISTS idx_deals_updated_at ON public.deals (updated_at);
CREATE INDEX IF NOT EXISTS idx_deals_close_date ON public.deals (close_date);
DROP TRIGGER IF EXISTS trg_deals_updated_at ON public.deals;
CREATE TRIGGER trg_deals_updated_at
BEFORE UPDATE ON public.deals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime: replica identity + publication
ALTER TABLE public.opportunities REPLICA IDENTITY FULL;
ALTER TABLE public.deals REPLICA IDENTITY FULL;
ALTER TABLE public.pipeline_stages REPLICA IDENTITY FULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='opportunities'
  ) THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunities'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='deals'
  ) THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.deals'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='pipeline_stages'
  ) THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.pipeline_stages'; END IF;
END $$;