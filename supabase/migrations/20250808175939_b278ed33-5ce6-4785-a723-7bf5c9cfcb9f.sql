-- Ensure pipeline_stages has required columns before upsert
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS probability integer NOT NULL DEFAULT 0;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS is_won boolean NOT NULL DEFAULT false;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS is_lost boolean NOT NULL DEFAULT false;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Now retry seeding/upserting defaults
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