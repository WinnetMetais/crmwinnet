-- Patch existing pipeline_stages to include stage_key when table already exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pipeline_stages'
  ) THEN
    -- Add column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='pipeline_stages' AND column_name='stage_key'
    ) THEN
      ALTER TABLE public.pipeline_stages ADD COLUMN stage_key text;
    END IF;
  ELSE
    -- If table truly doesn't exist (rare due to prior error), create it
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

-- Populate stage_key based on name when null
UPDATE public.pipeline_stages SET stage_key = 'prospecting' WHERE stage_key IS NULL AND LOWER(name) LIKE 'prospec%';
UPDATE public.pipeline_stages SET stage_key = 'qualification' WHERE stage_key IS NULL AND LOWER(name) LIKE 'qualifica%';
UPDATE public.pipeline_stages SET stage_key = 'proposal' WHERE stage_key IS NULL AND LOWER(name) LIKE 'propost%';
UPDATE public.pipeline_stages SET stage_key = 'negotiation' WHERE stage_key IS NULL AND LOWER(name) LIKE 'negocia%';
UPDATE public.pipeline_stages SET stage_key = 'won' WHERE stage_key IS NULL AND (LOWER(name) LIKE '%ganh%' OR LOWER(name) LIKE '%ganho%' OR LOWER(name) LIKE '%fechado%ganho%');
UPDATE public.pipeline_stages SET stage_key = 'lost' WHERE stage_key IS NULL AND (LOWER(name) LIKE '%perd%' OR LOWER(name) LIKE '%fechado%perdido%');

-- For any remaining nulls, default to prospecting
UPDATE public.pipeline_stages SET stage_key = 'prospecting' WHERE stage_key IS NULL;

-- Add constraints/indexes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='pipeline_stages' AND indexname='idx_pipeline_stages_stage_key'
  ) THEN
    CREATE INDEX idx_pipeline_stages_stage_key ON public.pipeline_stages (stage_key);
  END IF;
  -- Add NOT NULL and UNIQUE constraints if not present
  BEGIN
    ALTER TABLE public.pipeline_stages ALTER COLUMN stage_key SET NOT NULL;
  EXCEPTION WHEN others THEN NULL; END;
  BEGIN
    ALTER TABLE public.pipeline_stages ADD CONSTRAINT pipeline_stages_stage_key_key UNIQUE(stage_key);
  EXCEPTION WHEN others THEN NULL; END;
END $$;

-- Seed/Upsert defaults now that stage_key exists
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